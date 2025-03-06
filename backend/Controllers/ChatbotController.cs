using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Enums;
using Databases;
using Newtonsoft.Json;
using Packets.Chatbot;
using Databases.ChatbotData;
using Temp;
using Models;
using Helpers.Chatbot;
using static Helpers.Chatbot.RAGHelper;

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
                if (user.Permition == PermitionType.Pending)
                    return StatusCode((int)ErrorType.UserPending, ErrorType.UserPending.ToString());
                if (user.Permition == PermitionType.Suspended)
                    return StatusCode((int)ErrorType.UserSuspended, ErrorType.UserSuspended.ToString());

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
                if (user.Permition == PermitionType.Pending)
                    return StatusCode((int)ErrorType.UserPending, ErrorType.UserPending.ToString());
                if (user.Permition == PermitionType.Suspended)
                    return StatusCode((int)ErrorType.UserSuspended, ErrorType.UserSuspended.ToString());

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
                if (user.Permition == PermitionType.Pending)
                    return StatusCode((int)ErrorType.UserPending, ErrorType.UserPending.ToString());
                if (user.Permition == PermitionType.Suspended)
                    return StatusCode((int)ErrorType.UserSuspended, ErrorType.UserSuspended.ToString());

                var history = user.ChatbotHistories?.FirstOrDefault(c => c.ChatId == request.Id);
                List<List<string>> his = history?.HistoryFilePath == null || user.ChatbotCache?.LastId == request.Id
                    ? [] : DeserialiseHistory(System.IO.File.ReadAllText(history.HistoryFilePath)) ?? [];
                var hisTemp = history?.HistoryFilePath == null ?
                    [] : DeserialiseHistory(System.IO.File.ReadAllText(history.HistoryFilePath)) ?? [];

                var id = string.IsNullOrEmpty(request.Id) ? $"{Guid.NewGuid()}" : request.Id;

                if (user.ChatbotCache != null && user.ChatbotCache.LastId != request.Id)
                {
                    if (request.ChatbotType == ChatbotType.OpenAI) OpenAIHelper.DeleteHistory(id);
                    else if (request.ChatbotType == ChatbotType.Qwen) await QwenHelper.DeleteHistory(id);
                }

                var path = $"Chatbot/{id}.txt";
                ChatbotTemp.ClearMessages(id);
                Thread thread = new Thread(async () =>
                {
                    try
                    {
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
                            ChatbotTemp.SetMessage(id, new ChatbotMessage
                            {
                                Type = ChatbotMessageType.Error,
                                Message = "This chatbot type is not valid"
                            });
                            return;
                        }

                        var generatedText = "";
                        await foreach (var message in messages)
                        {
                            generatedText += message;
                            ChatbotTemp.SetMessage(id, new ChatbotMessage
                            {
                                Type = ChatbotMessageType.Data,
                                Message = message,
                            });
                        }

                        if (request.Rag == true)
                        {
                            Document[] ragDocs;
                            if (request.ChatbotType == ChatbotType.OpenAI)
                            {
                                ragDocs = OpenAIHelper.GetRagDocuments(id);
                            }
                            else if (request.ChatbotType == ChatbotType.Qwen)
                            {
                                ragDocs = await QwenHelper.GetRagDocuments(id);
                            }
                            else
                            {
                                ChatbotTemp.SetMessage(id, new ChatbotMessage
                                {
                                    Type = ChatbotMessageType.Error,
                                    Message = "This chatbot type is not valid"
                                });
                                return;
                            }

                            Console.WriteLine(ragDocs.Length);
                            ChatbotTemp.SetMessage(id, new ChatbotMessage
                            {
                                Type = ChatbotMessageType.RAGDoc,
                                Message = JsonConvert.SerializeObject(ragDocs.Select(doc => new
                                {
                                    Link = doc.Link,
                                    Title = doc.Title,
                                    Snippet = doc.Snippet,
                                }))
                            });
                        }

                        ChatbotTemp.SetMessage(id, new ChatbotMessage
                        {
                            Type = ChatbotMessageType.End,
                            Message = ""
                        });

                        hisTemp.Add([request.Query, generatedText]);
                        Directory.CreateDirectory(Path.GetDirectoryName(path) ?? "Chatbot");
                        System.IO.File.WriteAllText(path, JsonConvert.SerializeObject(hisTemp));
                    }
                    catch
                    {
                        ChatbotTemp.SetMessage(id, new ChatbotMessage
                        {
                            Type = ChatbotMessageType.Error,
                            Message = "Unknown error occurred"
                        });
                    }
                });
                thread.Start();

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
                        Title = request.Query[0..Math.Min(30, request.Query.Length)],
                        ChatbotType = request.ChatbotType,
                        HistoryFilePath = path
                    });
                }
                await _context.SaveChangesAsync();

                return Ok(new { Id = id });
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
                if (user.Permition == PermitionType.Pending)
                    return StatusCode((int)ErrorType.UserPending, ErrorType.UserPending.ToString());
                if (user.Permition == PermitionType.Suspended)
                    return StatusCode((int)ErrorType.UserSuspended, ErrorType.UserSuspended.ToString());

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