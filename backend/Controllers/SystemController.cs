using Databases;
using Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Controllers
{
    public class SystemSettings
    {
        public string OPENAI_API_KEY { get; set; } = "";
        public string GOOGLE_API_KEY { set; get; } = "";
        public string GOOGLE_CSE_ID { set; get; } = "";
        public string QWEN_URL { set; get; } = "";
        public string COMFYUI_SERVER_URL { set; get; } = "";
        public string COMFYUI_WS_URL { get; set; } = "";
    }

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
                    OPENAI_API_KEY = Environment.GetEnvironmentVariable("OPENAI_API_KEY") ?? "",
                    GOOGLE_API_KEY = Environment.GetEnvironmentVariable("GOOGLE_API_KEY") ?? "",
                    GOOGLE_CSE_ID = Environment.GetEnvironmentVariable("GOOGLE_CSE_ID") ?? "",
                    QWEN_URL = Environment.GetEnvironmentVariable("QWEN_URL") ?? "",
                    COMFYUI_SERVER_URL = Environment.GetEnvironmentVariable("COMFYUI_SERVER_URL") ?? "",
                    COMFYUI_WS_URL = Environment.GetEnvironmentVariable("COMFYUI_WS_URL") ?? "",
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
        public IActionResult Set([FromBody] SystemSettings settings)
        {
            try
            {
                Environment.SetEnvironmentVariable("OPENAI_API_KEY", settings.OPENAI_API_KEY);
                Environment.SetEnvironmentVariable("GOOGLE_API_KEY", settings.GOOGLE_API_KEY);
                Environment.SetEnvironmentVariable("GOOGLE_CSE_ID", settings.GOOGLE_CSE_ID);
                Environment.SetEnvironmentVariable("QWEN_URL", settings.QWEN_URL);
                Environment.SetEnvironmentVariable("COMFYUI_SERVER_URL", settings.COMFYUI_SERVER_URL);
                Environment.SetEnvironmentVariable("COMFYUI_WS_URL", settings.COMFYUI_WS_URL);

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
