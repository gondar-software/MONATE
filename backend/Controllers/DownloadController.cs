using Databases;
using Enums;
using Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DownloadController : ControllerBase
    {
        private readonly DatabaseContext _context;
        private readonly ILogger<UserController> _logger;

        public DownloadController(DatabaseContext context, ILogger<UserController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [Authorize]
        [HttpGet("image")]
        public async Task<IActionResult> DownloadImage([FromQuery] string filePath)
        {
            try
            {
                var fileData = await FirebaseHelper.LoadAndCreateFormFile(filePath);
                if (fileData == null)
                    return StatusCode((int)ErrorType.FileNotFound, ErrorType.FileNotFound.ToString());
                else
                    return File(fileData, "application/octet-stream", filePath.Substring(filePath.IndexOf('/')));
            }
            catch
            {
                return StatusCode((int)ErrorType.ImageDownloadError, ErrorType.ImageDownloadError.ToString());
            }
        }
    }
}