using Databases;
using Databases.FollowerData;
using Enums;
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

        [HttpGet]
        public async Task<IActionResult> Get([FromQuery] bool all = false)
        {
            try
            {
                var followers = await _context.Followers
                    .AsNoTracking()
                    .ToListAsync();

                if (all)
                    return Ok(new
                    {
                        Rate = followers.Count == 0 ? 0 : Math.Round((followers.Sum(f => f.Rate) + 4.8 * 2572) / (followers.Count + 2572f), 2),
                        Count = followers.Count + 2572,
                        Followers = followers,
                    });
                else
                    return Ok(new
                    {
                        Rate = followers.Count == 0 ? 0 : Math.Round((followers.Sum(f => f.Rate) + 4.8 * 2572) / (followers.Count + 2572f), 2),
                        Count = followers.Count + 2572,
                        Followers = followers.Where(f => f.TopRanked),
                    });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting followers");
                return StatusCode((int)ErrorType.Unknown, ErrorType.Unknown.ToString());
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("rank")]
        public async Task<IActionResult> RankFollower([FromBody] FollowerRankingData data)
        {
            try
            {
                var follower = await _context.Followers.FirstOrDefaultAsync(b => b.Id == data.Id);
                
                if (follower == null)
                    return StatusCode((int)ErrorType.FollowerNotFound, ErrorType.FollowerNotFound.ToString());
                    
                follower.TopRanked = data.TopRanked;
                await _context.SaveChangesAsync();

                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error top ranking follower");
                return StatusCode((int)ErrorType.Unknown, ErrorType.Unknown.ToString());
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("bookers")]
        public async Task<IActionResult> GetBookers([FromQuery] bool all = false)
        {
            try
            {
                var bookers = await _context.Bookers
                    .AsNoTracking()
                    .ToListAsync();

                if (all)
                    return Ok(bookers);
                else
                    return Ok(bookers.Where(b => !b.Checked));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting bookers");
                return StatusCode((int)ErrorType.Unknown, ErrorType.Unknown.ToString());
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("check")]
        public async Task<IActionResult> CheckBooker([FromBody] BookerCheckingData data)
        {
            try
            {
                var booker = await _context.Bookers.FirstOrDefaultAsync(b => b.Id == data.Id);
                
                if (booker == null)
                    return StatusCode((int)ErrorType.BookerNotFound, ErrorType.BookerNotFound.ToString());

                booker.Checked = data.Checked;
                await _context.SaveChangesAsync();

                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error checking booker");
                return StatusCode((int)ErrorType.Unknown, ErrorType.Unknown.ToString());
            }
        }

        [HttpPost("book")]
        public async Task<IActionResult> Book([FromBody] BookerData data)
        {
            try
            {
                Console.WriteLine($"{data.Email}{data.Name}");

                var booker = await _context.Bookers
                    .AsNoTracking()
                    .FirstOrDefaultAsync(b => b.Email == data.Email);

                if (booker != null)
                    return StatusCode((int)ErrorType.BookerAlreadyExists, ErrorType.BookerAlreadyExists.ToString());

                await _context.Bookers
                    .AddAsync(new Booker
                    {
                        Name = data.Name,
                        Email = data.Email,
                        Message = data.Message,
                        Checked = false,
                    });
                await _context.SaveChangesAsync();

                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error booking");
                return StatusCode((int)ErrorType.Unknown, ErrorType.Unknown.ToString());
            }
        }

        [HttpPost("follow")]
        public async Task<IActionResult> Follow([FromBody] FollowerData data)
        {
            try
            {
                var follower = await _context.Followers
                    .AsNoTracking()
                    .FirstOrDefaultAsync(b => b.Email == data.Email);

                if (follower != null)
                    return StatusCode((int)ErrorType.FollowerAlreadyExists, ErrorType.FollowerAlreadyExists.ToString());

                await _context.Followers
                    .AddAsync(new Follower
                    {
                        Rate = data.Rate,
                        Email = data.Email,
                        Name = data.Name,
                        Feedback = data.Feedback,
                        AvatarPath = data.AvatarPath,
                    });
                await _context.SaveChangesAsync();

                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error following");
                return StatusCode((int)ErrorType.Unknown, ErrorType.Unknown.ToString());
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("del-booker")]
        public async Task<IActionResult> DeleteBooker([FromBody] int id)
        {
            try
            {
                var booker = await _context.Bookers.FirstOrDefaultAsync(b => b.Id == id);

                if (booker == null)
                    return StatusCode((int)ErrorType.BookerNotFound, ErrorType.BookerNotFound.ToString());

                _context.Bookers.Remove(booker);
                await _context.SaveChangesAsync();

                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting booker");
                return StatusCode((int)ErrorType.Unknown, ErrorType.Unknown.ToString());
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("del-follower")]
        public async Task<IActionResult> DeleteFollower([FromBody] int id)
        {
            try
            {
                var follower = await _context.Followers.FirstOrDefaultAsync(b => b.Id == id);

                if (follower == null)
                    return StatusCode((int)ErrorType.FollowerNotFound, ErrorType.FollowerNotFound.ToString());

                _context.Followers.Remove(follower);
                await _context.SaveChangesAsync();

                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting follower");
                return StatusCode((int)ErrorType.Unknown, ErrorType.Unknown.ToString());
            }
        }
    }
}
