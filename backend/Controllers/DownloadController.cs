using Databases;
using Enums;
using Helpers.Utils;
using Microsoft.AspNetCore.Mvc;

namespace Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DownloadController : ControllerBase
    {
        private readonly DatabaseContext _context;
        private readonly ILogger<DownloadController> _logger;

        public DownloadController(DatabaseContext context, ILogger<DownloadController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet("image")]
        public async Task<IActionResult> DownloadImage([FromQuery] string filePath)
        {
            try
            {
                var fileData = await FirebaseHelper.DownloadFile(filePath);
                if (fileData == null)
                    return StatusCode((int)ErrorType.FileNotFound, ErrorType.FileNotFound.ToString());
                else
                    return File(fileData, "application/octet-stream", filePath.Substring(filePath.IndexOf('/')));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return StatusCode((int)ErrorType.ImageDownloadError, ErrorType.ImageDownloadError.ToString());
            }
        }

        [HttpGet("video")]
        public async Task<IActionResult> DownloadVideo([FromQuery] string filePath)
        {
            try
            {
                var fileData = await FirebaseHelper.DownloadFile(filePath);
                if (fileData == null)
                    return StatusCode((int)ErrorType.FileNotFound, ErrorType.FileNotFound.ToString());
                else
                    return File(fileData, "application/octet-stream", filePath.Substring(filePath.IndexOf('/')));
            }
            catch
            {
                return StatusCode((int)ErrorType.VideoDownloadError, ErrorType.VideoDownloadError.ToString());
            }
        }
    }
}