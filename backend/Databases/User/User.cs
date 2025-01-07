namespace Databases.User
{
    public class User
    {
        public int Id { get; set; }
        public string EmailAddr { get; set; } = "";
        public string Token { get; set; } = "";
        public string Password { get; set; } = "";
    }
}