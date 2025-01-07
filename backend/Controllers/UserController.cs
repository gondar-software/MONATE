using Databases.UserData;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Packets.User;

namespace Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserController : ControllerBase
    {
        private readonly DbContext _context;

        public UserController(DbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] IUserPacket user)
        {
            

            return Ok();
        }

        private async Task<User> GetUserByEmailAsync(string emailAddr)
        {
            return await _context.Users.
        }
    }
}