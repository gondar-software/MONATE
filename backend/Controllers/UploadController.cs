using Databases;
using Enums;
using Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Packets.Upload;

namespace Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UploadController : ControllerBase
    {
        private readonly DatabaseContext _context;
        private readonly ILogger<UserController> _logger;

        public UploadController(DatabaseContext context, ILogger<UserController> logger)
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
    }
}