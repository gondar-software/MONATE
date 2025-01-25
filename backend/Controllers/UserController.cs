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
        public async Task<IActionResult> Register([FromBody] LoginData data)
        {
            try
            {
                if (await _context.Users.AnyAsync(u => u.EmailAddr == data.EmailAddr))
                    return StatusCode((int)ErrorType.UserAlreadyExists, ErrorType.UserAlreadyExists.ToString());
                
                var error = VerifyEmailHelper.SendVerificationCode(data.EmailAddr, _logger);

                if (error == null)
                    return Ok();
                else
                    return StatusCode((int)error, error.ToString());
            }
            catch (Exception ex) 
            {
                _logger.LogError(ex, "Error registering user");
                return StatusCode((int)ErrorType.Unknown, ErrorType.Unknown.ToString());
            }
        }

        [HttpPost("verify")]
        public async Task<IActionResult> Verify([FromBody] VerifyData data)
        {   
            try
            {
                var error = VerifyEmailHelper.VerifyEmail(data.EmailAddr, data.Code);
                if (error == null)
                {
                    if (await _context.Users.AnyAsync(u => u.EmailAddr == data.EmailAddr))
                        return StatusCode((int)ErrorType.UserAlreadyExists, ErrorType.UserAlreadyExists.ToString());

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
                    return StatusCode((int)error, error.ToString());
                }
            }
            catch (Exception ex) 
            {
                _logger.LogError(ex, "Error registering user");
                return StatusCode((int)ErrorType.Unknown, ErrorType.Unknown.ToString());
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
                    return StatusCode((int)ErrorType.UserNotFound, ErrorType.UserNotFound.ToString());
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
                return StatusCode((int)ErrorType.Unknown, ErrorType.Unknown.ToString());
            }
        }
    }
}