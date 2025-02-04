using Databases;
using Enums;
using Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Packets.File;

namespace Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UploadController : ControllerBase
    {
        private readonly DatabaseContext _context;
        private readonly ILogger<UploadController> _logger;

        public UploadController(DatabaseContext context, ILogger<UploadController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [Authorize]
        [HttpPost("image")]
        public async Task<IActionResult> UploadImage([FromForm] ImageData file)
        {
            try
            {
                var filePath = await FirebaseHelper.SaveFileAndGetPath(file.Image, FileType.Image);
                return Ok(new { FilePath = filePath });
            }
            catch
            {
                return StatusCode((int)ErrorType.ImageUploadError, ErrorType.ImageUploadError.ToString());
            }
        }

        [Authorize]
        [HttpPost("video")]
        public async Task<IActionResult> UploadVideo([FromForm] VideoData file)
        {
            try
            {
                var filePath = await FirebaseHelper.SaveFileAndGetPath(file.Video, FileType.Video);
                return Ok(new { FilePath = filePath });
            }
            catch
            {
                return StatusCode((int)ErrorType.ImageUploadError, ErrorType.ImageUploadError.ToString());
            }
        }
    }
}