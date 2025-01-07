namespace Databases.User
{
    using Enums;

    public class API
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public APIType Type { get; set; }

        public User? User { get; set; }
    }
}