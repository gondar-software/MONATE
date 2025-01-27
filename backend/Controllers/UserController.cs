using Databases;
using Databases.UserData;
using Enums;
using Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Packets.User;
using Services;

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

        [Authorize]
        [HttpPost("info")]
        public async Task<IActionResult> SaveInfo([FromBody] InformationData data)
        {
            try
            {
                var userEmail = User.Claims.FirstOrDefault(c => c.Type.EndsWith("emailaddress"))?.Value;
                if (string.IsNullOrEmpty(userEmail))
                    return StatusCode((int)ErrorType.Unauthorized, ErrorType.Unauthorized.ToString());
                
                var user = await _context.Users
                    .Include(u => u.Information)
                    .FirstOrDefaultAsync(u => u.EmailAddr == userEmail);
                if (user == null)
                    return StatusCode((int)ErrorType.UserNotFound, ErrorType.UserNotFound.ToString());

                if (user.Information != null)
                {
                    user.Information.FirstName = data.FirstName;
                    user.Information.MiddleName = data.MiddleName;
                    user.Information.LastName = data.LastName;
                    user.Information.Gender = data.Gender;
                    user.Information.DateOfBirth = data.Dob;
                    user.Information.Address1 = data.Address1;
                    user.Information.Address2 = data.Address2;
                    user.Information.City = data.City;
                    user.Information.State = data.State;
                    user.Information.ZipCode = data.ZipCode;
                    user.Information.Country = data.Country;
                    user.Information.AvatarPath = data.Avatar;
                    user.Information.GithubUrl = data.GithubUrl;
                    user.Information.PhoneNumber = data.PhoneNumber;
                }
                else
                {
                    _context.Informations.Add(new Information
                    {
                        FirstName = data.FirstName,
                        MiddleName = data.MiddleName,
                        LastName = data.LastName,
                        Gender = data.Gender,
                        DateOfBirth = data.Dob,
                        Address1 = data.Address1,
                        Address2 = data.Address2,
                        City = data.City,
                        State = data.State,
                        ZipCode = data.ZipCode,
                        Country = data.Country,
                        AvatarPath = data.Avatar,
                        GithubUrl = data.GithubUrl,
                        PhoneNumber = data.PhoneNumber,
                        User = user,
                    });
                }
                await _context.SaveChangesAsync();

                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error saving user information");
                return StatusCode((int)ErrorType.Unknown, ErrorType.Unknown.ToString());
            }
        }
    }
}