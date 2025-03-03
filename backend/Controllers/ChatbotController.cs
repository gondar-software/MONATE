using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Enums;
using Databases;
using Newtonsoft.Json;
using Packets.Chatbot;
using System.Text;
using Databases.ChatbotData;
using Temp;
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
                    ? [] : DeserialiseHistory(
                        System.IO.File.ReadAllText(history.HistoryFilePath)
                    ) ?? [];
                var hisTemp = history?.HistoryFilePath == null ?
                    [] : DeserialiseHistory(System.IO.File.ReadAllText(history.HistoryFilePath)) ?? [];

                var qwenAPI = await _context.EnvValues.AsNoTracking()
                    .FirstOrDefaultAsync(e => e.Type == EnvType.QWEN_API_URL);

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
                        return StatusCode((int)ErrorType.CouldNotFoundAIServer, ErrorType.CouldNotFoundAIServer.ToString());
                    }
                }

                var path = $"Chatbot/{id}.txt";

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
                        Title = request.Query,
                        HistoryFilePath = path
                    });
                }

                await _context.SaveChangesAsync();

                return Ok(new { Id = id });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting chatbot histories");
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