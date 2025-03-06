using Databases;
using Databases.FollowerData;
using Enums;
using Helpers.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Packets.Following;

namespace Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FollowingController : ControllerBase
    {
        private readonly DatabaseContext _context;
        private readonly ILogger<FollowingController> _logger;

        public FollowingController(DatabaseContext context, ILogger<FollowingController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            try
            {
                var followers = await _context.Followers
                    .AsNoTracking()
                    .ToListAsync();

                return Ok(new
                {
                    Rate = followers.Sum(f => f.Rate) / followers.Count,
                    Count = followers.Count,
                    Followers = followers,
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return StatusCode((int)ErrorType.ImageDownloadError, ErrorType.ImageDownloadError.ToString());
            }
        }

        [HttpGet("bookers")]
        public async Task<IActionResult> GetBookers()
        {
            try
            {
                var bookers = await _context.Bookers
                    .AsNoTracking()
                    .ToListAsync();

                return Ok(bookers);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return StatusCode((int)ErrorType.ImageDownloadError, ErrorType.ImageDownloadError.ToString());
            }
        }

        [HttpPost("check")]
        public async Task<IActionResult> CheckBooker([FromBody] int id)
        {
            try
            {
                var booker = await _context.Bookers.FirstOrDefaultAsync(b => b.Id == id);
                if (booker != null)
                    booker.Checked = true;

                await _context.SaveChangesAsync();

                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return StatusCode((int)ErrorType.ImageDownloadError, ErrorType.ImageDownloadError.ToString());
            }
        }

        [HttpPost("book")]
        public async Task<IActionResult> Book([FromBody] BookerData data)
        {
            try
            {
                var booker = _context.Bookers
                    .AsNoTracking()
                    .FirstOrDefaultAsync(b => b.Email == data.Email);

                if (booker != null)
                    return StatusCode((int)ErrorType.BookerAlreadyExists, ErrorType.BookerAlreadyExists.ToString());

                await _context.Bookers
                    .AddAsync(new Booker
                    {
                        Email = data.Email,
                        Message = data.Message,
                    });
                await _context.SaveChangesAsync();

                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return StatusCode((int)ErrorType.ImageDownloadError, ErrorType.ImageDownloadError.ToString());
            }
        }

        [HttpPost("follow")]
        public async Task<IActionResult> Follow([FromBody] FollowerData data)
        {
            try
            {
                var booker = _context.Bookers
                    .AsNoTracking()
                    .FirstOrDefaultAsync(b => b.Email == data.Email);

                if (booker != null)
                    return StatusCode((int)ErrorType.FollowerAlreadyExists, ErrorType.FollowerAlreadyExists.ToString());

                await _context.Followers
                    .AddAsync(new Follower
                    {
                        Rate = data.Rate,
                        Email = data.Email,
                        Name = data.Name,
                        Feedback = data.Feedback,
                    });
                await _context.SaveChangesAsync();

                return Ok();
            }
            catch
            {
                return StatusCode((int)ErrorType.VideoDownloadError, ErrorType.VideoDownloadError.ToString());
            }
        }
    }
}
