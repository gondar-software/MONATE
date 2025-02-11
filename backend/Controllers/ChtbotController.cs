using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Enums;
using Databases;
using Newtonsoft.Json;
using Packets.Chatbot;
using Microsoft.AspNetCore.SignalR;
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
        [HttpGet]
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
            try
            {
                Response.ContentType = "text/plain";
                Response.StatusCode = 200;

                var userEmail = User.Claims.FirstOrDefault(c => c.Type.EndsWith("emailaddress"))?.Value;
                if (string.IsNullOrEmpty(userEmail))
                {
                    Response.StatusCode = (int)ErrorType.Unauthorized;
                    await Response.Body.WriteAsync(Encoding.UTF8.GetBytes(ErrorType.Unauthorized.ToString()));
                    return;
                }

                var user = await _context.Users
                    .Include(u => u.ChatbotHistories)
                    .Include(u => u.ChatbotCache)
                    .FirstOrDefaultAsync(u => u.EmailAddr == userEmail);

                if (user == null)
                {
                    Response.StatusCode = (int)ErrorType.UserNotFound;
                    await Response.Body.WriteAsync(Encoding.UTF8.GetBytes(ErrorType.UserNotFound.ToString()));
                    return;
                }

                var history = user.ChatbotHistories?
                    .FirstOrDefault(c => c.ChatId == request.Id);

                List<(string, string)> his = history?.HistoryFilePath == null || user.ChatbotCache?.LastId == request.Id ? 
                    new List<(string, string)>() : 
                    (List<(string, string)>)(JsonConvert.DeserializeObject(
                        System.IO.File.ReadAllText(history.HistoryFilePath)
                    ) ?? new List<(string, string)>());

                var qwenAPI = await _context.EnvValues
                    .AsNoTracking()
                    .FirstOrDefaultAsync(e => e.Type == EnvType.QWEN_API_URL);
                var url = qwenAPI?.Value ?? "";

                if (user.ChatbotCache != null && user.ChatbotCache.LastId != request.Id)
                {
                    try
                    {
                        using var res = await _httpClient.GetAsync($"{url}/del-history?id={user.ChatbotCache.LastId}");
                    }
                    catch { }
                }

                var id = request.Id ?? $"{Guid.NewGuid()}";

                if (user.ChatbotCache == null)
                {
                    await _context.ChatbotCaches.AddAsync(new ChatbotCache
                    {
                        User = user,
                        LastId = id,
                    });
                }
                else
                    user.ChatbotCache.LastId = id;

                await _context.SaveChangesAsync();

                using var response = await _httpClient.PostAsync(url,
                    new StringContent(JsonConvert.SerializeObject(new { 
                        Id = id,
                        Query = request.Query,
                        History = his,
                        Rag = request.Rag,
                    }), System.Text.Encoding.UTF8, "application/json"));

                if (!response.IsSuccessStatusCode)
                {
                    Response.StatusCode = (int)ErrorType.QwenServerError;
                    await Response.Body.WriteAsync(Encoding.UTF8.GetBytes(ErrorType.QwenServerError.ToString()));
                    return;
                }

                var stream = await response.Content.ReadAsStreamAsync();
                using var reader = new StreamReader(stream);

                string generatedText = "";
                while (!reader.EndOfStream)
                {
                    var chunk = await reader.ReadLineAsync();
                    if (chunk != null)
                    {
                        generatedText += chunk;

                        await Response.Body.WriteAsync(Encoding.UTF8.GetBytes(chunk));
                        await Response.Body.FlushAsync();
                    }
                }

                his.Add((request.Query, generatedText));

                var path = $"Chatbot/{id}.txt";
                if (!Directory.Exists(Path.GetDirectoryName(path)))
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
                await Response.Body.WriteAsync(Encoding.UTF8.GetBytes(ErrorType.Unknown.ToString()));
                return;
            }
        }
    }
}