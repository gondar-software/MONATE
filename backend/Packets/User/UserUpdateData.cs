using Enums;

namespace Packets.User
{
    public class UserUpdateData
    {
        public int Id { get; set; }
        public UserType Type { get; set; }
        public PermitionType Permition { get; set; }
    }
}
