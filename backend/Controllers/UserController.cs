using System.Threading.Tasks;
using Databases;
using Databases.UserData;
using Enums;
using Helpers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Packets.User;
using Services;
using Temp;

namespace Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly DatabaseContext _context;
        private readonly ILogger<UserController> _logger;
        private readonly JwtService _jwtService;

        public UserController(DatabaseContext context, ILogger<UserController> logger, JwtService jwtService)
        {
            _context = context;
            _logger = logger;
            _jwtService = jwtService;
        }

        [HttpPost("register")]
        public IActionResult Register([FromBody] LoginData data)
        {
            try
            {
                VerifyEmailHelper.SendVerificationCode(data.EmailAddr, _logger);
                return Ok();
            }
            catch (Exception ex) 
            {
                _logger.LogError(ex, "Error registering user");
                Alerts.EnQueueAlert(AlertType.Error, ex, "Error registering user");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPost("verify")]
        public async Task<IActionResult> Verify([FromBody] VerifyData data)
        {   
            try
            {
                if (VerifyEmailHelper.VerifyEmail(data.EmailAddr, data.Code))
                {
                    var user = new User
                    {
                        EmailAddr = data.EmailAddr,
                        Password = data.Password,
                        Type = UserType.Client,
                        Permition = PermitionType.Pending,
                    };

                    await _context.Users.AddAsync(user);
                    await _context.SaveChangesAsync();

                    var token = _jwtService.GenerateToken(user);
                    return Ok(new { Token = token });
                }
                else
                {
                    return BadRequest("Invalid verification code");
                }
            }
            catch (Exception ex) 
            {
                _logger.LogError(ex, "Error registering user");
                Alerts.EnQueueAlert(AlertType.Error, ex, "Error registering user");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginData data)
        {
            try
            {
                var user = await _context.Users
                    .AsNoTracking()
                    .FirstOrDefaultAsync(u => u.EmailAddr == data.EmailAddr && u.Password == data.Password);
                
                if (user == null)
                {
                    return BadRequest(new { Message = "Invalid email or password" });
                }
                else
                {
                    var token = _jwtService.GenerateToken(user);
                    return Ok(new { Token = token });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error logging in user");
                Alerts.EnQueueAlert(AlertType.Error, ex, "Error logging in user");
                return StatusCode(500, "Internal server error");
            }
        }
    }
}