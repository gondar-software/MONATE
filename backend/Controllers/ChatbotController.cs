using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Enums;
using Databases;
using Newtonsoft.Json;
using Packets.Chatbot;
using System.Text;
using Databases.ChatbotData;

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
        public async Task<IActionResult> GetChatbotHistories()
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
                var his = JsonConvert.DeserializeObject(str);

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
        public async Task Prompt(PromptRequest request)
        {
            Response.ContentType = "text/plain";
            Response.StatusCode = 200; 

            try
            {
                var userEmail = User.Claims.FirstOrDefault(c => c.Type.EndsWith("emailaddress"))?.Value;
                if (string.IsNullOrEmpty(userEmail))
                {
                    Response.StatusCode = (int)ErrorType.Unknown;
                    await Response.WriteAsync(ErrorType.Unknown.ToString());
                    return;
                }

                var user = await _context.Users
                    .Include(u => u.ChatbotHistories)
                    .Include(u => u.ChatbotCache)
                    .FirstOrDefaultAsync(u => u.EmailAddr == userEmail);

                if (user == null)
                {
                    Response.StatusCode = (int)ErrorType.UserNotFound;
                    await Response.WriteAsync(ErrorType.UserNotFound.ToString());
                    return;
                }

                var history = user.ChatbotHistories?.FirstOrDefault(c => c.ChatId == request.Id);
                List<(string, string)> his = history?.HistoryFilePath == null || user.ChatbotCache?.LastId == request.Id
                    ? new List<(string, string)>()
                    : (List<(string, string)>)(JsonConvert.DeserializeObject(
                        System.IO.File.ReadAllText(history.HistoryFilePath)
                    ) ?? new List<(string, string)>());

                var qwenAPI = await _context.EnvValues.AsNoTracking()
                    .FirstOrDefaultAsync(e => e.Type == EnvType.QWEN_API_URL);
                var url = qwenAPI?.Value ?? "";

                if (user.ChatbotCache != null && user.ChatbotCache.LastId != request.Id)
                {
                    try { await _httpClient.GetAsync($"{url}/del-history?id={user.ChatbotCache.LastId}"); }
                    catch { }
                }

                var id = string.IsNullOrEmpty(request.Id) ? $"{Guid.NewGuid()}" : request.Id;

                if (user.ChatbotCache == null)
                {
                    await _context.ChatbotCaches.AddAsync(new ChatbotCache { User = user, LastId = id });
                }
                else
                {
                    user.ChatbotCache.LastId = id;
                }

                await _context.SaveChangesAsync();

                using var requestMessage = new HttpRequestMessage(HttpMethod.Post, url)
                {
                    Content = new StringContent(JsonConvert.SerializeObject(new
                    {
                        Id = id,
                        Query = request.Query,
                        History = his,
                        Rag = request.Rag ?? false,
                    }), Encoding.UTF8, "application/json")
                };

                using var response = await _httpClient.SendAsync(requestMessage, HttpCompletionOption.ResponseHeadersRead);

                if (!response.IsSuccessStatusCode)
                {
                    Response.StatusCode = (int)ErrorType.QwenServerError;
                    await Response.WriteAsync(ErrorType.QwenServerError.ToString());
                    return;
                }

                var stream = await response.Content.ReadAsStreamAsync();
                using var reader = new StreamReader(stream, Encoding.UTF8);
                using var writer = new StreamWriter(Response.BodyWriter.AsStream(), Encoding.UTF8, leaveOpen: true);

                string generatedText = "";
                Console.WriteLine("Success");

                await Response.StartAsync();

                char[] buffer = new char[1024];
                while (!reader.EndOfStream)
                {
                    int readCount = await reader.ReadAsync(buffer, 0, buffer.Length);
                    if (readCount > 0)
                    {
                        var chunk = new string(buffer, 0, readCount);
                        generatedText += chunk;
                        await writer.WriteAsync(chunk);
                        await writer.FlushAsync();
                        await Response.BodyWriter.FlushAsync();

                        Console.Write(chunk);
                    }
                }

                his.Add((request.Query, generatedText));

                var path = $"Chatbot/{id}.txt";
                Directory.CreateDirectory(Path.GetDirectoryName(path) ?? "Chatbot");
                System.IO.File.WriteAllText(path, JsonConvert.SerializeObject(his));

                if (history == null)
                {
                    await _context.ChatbotHistories.AddAsync(new ChatbotHistory
                    {
                        User = user,
                        ChatId = id,
                        Title = request.Query,
                        HistoryFilePath = path
                    });
                }

                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error prompting");
                Response.StatusCode = (int)ErrorType.Unknown;
                await Response.WriteAsync(ErrorType.Unknown.ToString());
            }
        }
    }
}