using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Enums;
using Databases;
using Newtonsoft.Json;
using Packets.Chatbot;
using Databases.ChatbotData;
using Helpers;

namespace Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ChatbotController : ControllerBase
    {
        private readonly DatabaseContext _context;
        private readonly ILogger<ChatbotController> _logger;
        private readonly HttpClient _httpClient;

        public ChatbotController(DatabaseContext context, ILogger<ChatbotController> logger, IHttpClientFactory httpClientFactory)
        {
            _context = context;
            _logger = logger;
            _httpClient = httpClientFactory.CreateClient();
        }

        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetChatbotHistories(ChatbotType type = ChatbotType.OpenAI)
        {
            try
            {
                var userEmail = User.Claims.FirstOrDefault(c => c.Type.EndsWith("emailaddress"))?.Value;
                if (string.IsNullOrEmpty(userEmail))
                    return StatusCode((int)ErrorType.Unauthorized, ErrorType.Unauthorized.ToString());

                var user = await _context.Users
                    .AsNoTracking()
                    .Include(u => u.ChatbotHistories)
                    .FirstOrDefaultAsync(u => u.EmailAddr == userEmail);

                if (user == null)
                    return StatusCode((int)ErrorType.UserNotFound, ErrorType.UserNotFound.ToString());

                var histories = user.ChatbotHistories?
                    .Where(c => c.ChatbotType == type)
                    .Select(c => new { ChatId = c.ChatId, Title = c.Title })
                    .ToList() ?? [];

                return Ok(histories);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting chatbot histories");
                return StatusCode((int)ErrorType.Unknown, ErrorType.Unknown.ToString());
            }
        }

        [Authorize]
        [HttpGet("history")]
        public async Task<IActionResult> GetChatbotHistory(string id)
        {
            try
            {
                var userEmail = User.Claims.FirstOrDefault(c => c.Type.EndsWith("emailaddress"))?.Value;
                if (string.IsNullOrEmpty(userEmail))
                    return StatusCode((int)ErrorType.Unauthorized, ErrorType.Unauthorized.ToString());

                var user = await _context.Users
                    .AsNoTracking()
                    .Include(u => u.ChatbotHistories)
                    .FirstOrDefaultAsync(u => u.EmailAddr == userEmail);

                if (user == null)
                    return StatusCode((int)ErrorType.UserNotFound, ErrorType.UserNotFound.ToString());

                var history = user.ChatbotHistories?
                    .FirstOrDefault(c => c.ChatId == id);

                if (history == null)
                    return StatusCode((int)ErrorType.ChatbotHistoryNotFound, ErrorType.ChatbotHistoryNotFound.ToString());

                if (string.IsNullOrEmpty(history.HistoryFilePath))
                    return Ok();

                var str = System.IO.File.ReadAllText(history.HistoryFilePath);
                var his = DeserialiseHistory(str);

                return Ok(his);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting chatbot histories");
                return StatusCode((int)ErrorType.Unknown, ErrorType.Unknown.ToString());
            }
        }

        [Authorize]
        [HttpPost("prompt")]
        public async Task<IActionResult> Prompt([FromBody] PromptRequest request)
        {
            var response = Response;
            response.Headers.Append("Content-Type", "text/event-stream");
            response.Headers.Append("Cache-Control", "no-cache");
            response.Headers.Append("Connection", "keep-alive");

            try
            {
                var userEmail = User.Claims.FirstOrDefault(c => c.Type.EndsWith("emailaddress"))?.Value;
                if (string.IsNullOrEmpty(userEmail))
                {
                    return StatusCode((int)ErrorType.Unknown, ErrorType.Unknown.ToString());
                }

                var user = await _context.Users
                    .Include(u => u.ChatbotHistories)
                    .Include(u => u.ChatbotCache)
                    .FirstOrDefaultAsync(u => u.EmailAddr == userEmail);

                if (user == null)
                {
                    return StatusCode((int)ErrorType.UserNotFound, ErrorType.UserNotFound.ToString());
                }

                var history = user.ChatbotHistories?.FirstOrDefault(c => c.ChatId == request.Id);
                List<List<string>> his = history?.HistoryFilePath == null || user.ChatbotCache?.LastId == request.Id
                    ? [] : DeserialiseHistory(System.IO.File.ReadAllText(history.HistoryFilePath)) ?? [];
                var hisTemp = history?.HistoryFilePath == null ?
                    [] : DeserialiseHistory(System.IO.File.ReadAllText(history.HistoryFilePath)) ?? [];

                var id = string.IsNullOrEmpty(request.Id) ? $"{Guid.NewGuid()}" : request.Id;

                if (user.ChatbotCache != null && user.ChatbotCache.LastId != request.Id)
                {
                    try
                    {
                        if (request.ChatbotType == ChatbotType.OpenAI) OpenAIHelper.DeleteHistory(id);
                        else if (request.ChatbotType == ChatbotType.Qwen) await QwenHelper.DeleteHistory(id);
                    }
                    catch
                    {
                        return StatusCode((int)ErrorType.CouldNotFoundChatbotServer, ErrorType.CouldNotFoundChatbotServer.ToString());
                    }
                }

                var path = $"Chatbot/{id}.txt";
                var writer = response.BodyWriter;

                await using var streamWriter = new StreamWriter(response.Body);
                response.StatusCode = 200;

                await streamWriter.FlushAsync();

                IAsyncEnumerable<string> messages;
                if (request.ChatbotType == ChatbotType.OpenAI)
                {
                    messages = OpenAIHelper.Prompt(id, request.Query, request.Rag, his);
                }
                else if (request.ChatbotType == ChatbotType.Qwen)
                {
                    messages = QwenHelper.Prompt(id, request.Query, request.Rag, his);
                }
                else
                {
                    return StatusCode((int)ErrorType.UnsupportedChatbotType, ErrorType.UnsupportedChatbotType.ToString());
                }

                await streamWriter.WriteAsync($"{id},");
                await streamWriter.FlushAsync();

                var generatedText = "";
                await foreach (var message in messages)
                {
                    generatedText += message;
                    await streamWriter.WriteAsync(message);
                    await streamWriter.FlushAsync();

                    Console.Write(message);
                }

                hisTemp.Add([request.Query, generatedText]);
                Directory.CreateDirectory(Path.GetDirectoryName(path) ?? "Chatbot");
                System.IO.File.WriteAllText(path, JsonConvert.SerializeObject(hisTemp));

                if (user.ChatbotCache == null)
                {
                    await _context.ChatbotCaches.AddAsync(new ChatbotCache { User = user, LastId = id });
                }
                else
                {
                    user.ChatbotCache.LastId = id;
                }

                if (history == null)
                {
                    await _context.ChatbotHistories.AddAsync(new ChatbotHistory
                    {
                        User = user,
                        ChatId = id,
                        Title = request.Query.Substring(0, Math.Min(30, request.Query.Length)),
                        ChatbotType = request.ChatbotType,
                        HistoryFilePath = path
                    });
                }

                await _context.SaveChangesAsync();
                return new EmptyResult();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting chatbot response");
                return StatusCode((int)ErrorType.Unknown, ErrorType.Unknown.ToString());
            }
        }

        [Authorize]
        [HttpPost("delete")]
        public async Task<IActionResult> DeleteHistory([FromBody] string id)
        {
            try
            {
                var userEmail = User.Claims.FirstOrDefault(c => c.Type.EndsWith("emailaddress"))?.Value;
                if (string.IsNullOrEmpty(userEmail))
                {
                    return StatusCode((int)ErrorType.Unknown, ErrorType.Unknown.ToString());
                }

                var user = await _context.Users
                    .AsNoTracking()
                    .Include(u => u.ChatbotHistories)
                    .Include(u => u.ChatbotCache)
                    .FirstOrDefaultAsync(u => u.EmailAddr == userEmail);

                if (user == null)
                {
                    return StatusCode((int)ErrorType.UserNotFound, ErrorType.UserNotFound.ToString());
                }

                var history = user.ChatbotHistories?
                    .FirstOrDefault(c => c.ChatId == id);

                if (history == null)
                    return StatusCode((int)ErrorType.ChatbotHistoryNotFound, ErrorType.ChatbotHistoryNotFound.ToString());

                _context.ChatbotHistories?.Remove(history);
                await _context.SaveChangesAsync();

                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting chatbot history");
                return StatusCode((int)ErrorType.Unknown, ErrorType.Unknown.ToString());
            }
        }

        private static List<List<string>>? DeserialiseHistory(string str)
        {
            var deserialized = JsonConvert.DeserializeObject<List<List<string>>>(str);
            return deserialized;
        }
    }
}