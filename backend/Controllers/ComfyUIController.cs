using Databases;
using Databases.ComfyUIData;
using Enums;
using Helpers.ComfyUI;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Models;
using Packets.ComfyUI;
using Temp;

namespace Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ComfyUIController : ControllerBase
    {
        private readonly DatabaseContext _context;
        private readonly ILogger<ChatbotController> _logger;
        private readonly HttpClient _httpClient;

        public ComfyUIController(DatabaseContext context, ILogger<ChatbotController> logger, IHttpClientFactory httpClientFactory)
        {
            _context = context;
            _logger = logger;
            _httpClient = httpClientFactory.CreateClient();
        }

        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetWorks(ComfyUIModelTypes type = ComfyUIModelTypes.Mimicmotion)
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

                var works = user.ComfyUIWorks?
                    .Where(c => c.Type == type)
                    .Select(c => new 
                    {
                        Inputs = c.Inputs?.Select(i => new
                        {
                            Type = i.Type,
                            Value = i.Value,
                        }),
                        Output = new
                        {
                            Type = c.Output?.Type,
                            Value = c.Output?.Value,
                        }
                    })
                    .ToList() ?? [];

                return Ok(works);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting comfyui works");
                return StatusCode((int)ErrorType.Unknown, ErrorType.Unknown.ToString());
            }
        }

        [Authorize]
        [HttpPost("prompt")]
        public async Task<IActionResult> Prompt([FromBody] ComfyUIPrompt query)
        {
            try
            {
                var userEmail = User.Claims.FirstOrDefault(c => c.Type.EndsWith("emailaddress"))?.Value;
                if (string.IsNullOrEmpty(userEmail))
                    return StatusCode((int)ErrorType.Unauthorized, ErrorType.Unauthorized.ToString());

                var user = await _context.Users
                    .AsNoTracking()
                    .FirstOrDefaultAsync(u => u.EmailAddr == userEmail);

                if (user == null)
                    return StatusCode((int)ErrorType.UserNotFound, ErrorType.UserNotFound.ToString());

                var id = $"{Guid.NewGuid()}";
                ComfyUITemp.ClearMessages(id);
                ComfyUITemp.SetMessage(id, new ComfyUIMessage
                {
                    Type = ComfyUIMessageType.Progress,
                    Message = "0%"
                });

                var promptId = "";
                switch (query.Type)
                {
                    case ComfyUIModelTypes.Mimicmotion:
                        promptId = await MimicmotionHelper.Prompt(id, query.Inputs?.ToArray() ?? []);
                        break;
                    case ComfyUIModelTypes.LivePortrait:
                        break;
                    case ComfyUIModelTypes.Flux:
                        break;
                    case ComfyUIModelTypes.SDXL:
                        break;
                    default:
                        break;
                }

                return Ok(new { ClientId = id, PromptId = promptId });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error prompting");
                return StatusCode((int)ErrorType.Unknown, ErrorType.Unknown.ToString());
            }
        }

        [Authorize]
        [HttpGet("output")]
        public async Task<IActionResult> GetOutput(string clientId, string promptId)
        {
            try
            {
                var userEmail = User.Claims.FirstOrDefault(c => c.Type.EndsWith("emailaddress"))?.Value;
                if (string.IsNullOrEmpty(userEmail))
                    return StatusCode((int)ErrorType.Unauthorized, ErrorType.Unauthorized.ToString());

                var user = await _context.Users
                    .AsNoTracking()
                    .FirstOrDefaultAsync(u => u.EmailAddr == userEmail);

                if (user == null)
                    return StatusCode((int)ErrorType.UserNotFound, ErrorType.UserNotFound.ToString());

                var output = await MimicmotionHelper.GetOutput(clientId, promptId);

                var work = new ComfyUIWork
                {
                    User = user,
                    Type = output?.Type ?? ComfyUIModelTypes.Mimicmotion,
                    Inputs = output?.Inputs?.Select(input => new ComfyUIInputData
                    {
                        Type = input.Type,
                        Value = input.Value,
                    }).ToArray(),
                    Output = new ComfyUIOutputData
                    {
                        Type = output?.Output?.Type ?? ComfyUIDataTypes.Image,
                        Value = output?.Output?.Value ?? "",
                    }
                };
                _context.ComfyUIWorks.Add(work);

                return Ok(output);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error prompting");
                return StatusCode((int)ErrorType.Unknown, ErrorType.Unknown.ToString());
            }
        }
    }
}
