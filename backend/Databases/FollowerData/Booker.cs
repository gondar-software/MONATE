namespace Databases.FollowerData
{
    public class Booker
    {
        public int Id { get; set; }
        public string Email { get; set; } = "";
        public string Message { get; set; } = "";
        public bool Checked { get; set; } = false;
    }
}
