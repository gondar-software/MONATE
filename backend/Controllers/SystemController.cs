using Databases;
using Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Controllers
{
    public class SystemSettings
    {
        public string OpenAIApiKey { get; set; } = "";
        public string GoogleApiKey { set; get; } = "";
        public string GoogleCseId { set; get; } = "";
        public string QwenUrl { set; get; } = "";
        public string ComfyUIServerUrl { set; get; } = "";
        public string ComfyUIWSUrl { get; set; } = "";
    }

    [ApiController]
    [Route("api/[controller]")]
    public class SystemController : ControllerBase
    {
        private readonly DatabaseContext _context;
        private readonly ILogger<SystemController> _logger;

        public SystemController(DatabaseContext context, ILogger<SystemController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [Authorize(Roles = "Admin")]
        [HttpGet]
        public IActionResult Get()
        {
            try
            {
                return Ok(new SystemSettings
                {
                    OpenAIApiKey = Environment.GetEnvironmentVariable("OPENAI_API_KEY") ?? "",
                    GoogleApiKey = Environment.GetEnvironmentVariable("GOOGLE_API_KEY") ?? "",
                    GoogleCseId = Environment.GetEnvironmentVariable("GOOGLE_CSE_ID") ?? "",
                    QwenUrl = Environment.GetEnvironmentVariable("QWEN_URL") ?? "",
                    ComfyUIServerUrl = Environment.GetEnvironmentVariable("COMFYUI_SERVER_URL") ?? "",
                    ComfyUIWSUrl = Environment.GetEnvironmentVariable("COMFYUI_WS_URL") ?? "",
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting system settings");
                return StatusCode((int)ErrorType.Unknown, ErrorType.Unknown.ToString());
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public IActionResult Post([FromBody] SystemSettings settings)
        {
            try
            {
                Environment.SetEnvironmentVariable("OPENAI_API_KEY", settings.OpenAIApiKey);
                Environment.SetEnvironmentVariable("GOOGLE_API_KEY", settings.GoogleApiKey);
                Environment.SetEnvironmentVariable("GOOGLE_CSE_ID", settings.GoogleCseId);
                Environment.SetEnvironmentVariable("QWEN_URL", settings.QwenUrl);
                Environment.SetEnvironmentVariable("COMFYUI_SERVER_URL", settings.ComfyUIServerUrl);
                Environment.SetEnvironmentVariable("COMFYUI_WS_URL", settings.ComfyUIWSUrl);

                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting system settings");
                return StatusCode((int)ErrorType.Unknown, ErrorType.Unknown.ToString());
            }
        }
    }
}
