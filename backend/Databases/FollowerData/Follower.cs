namespace Databases.FollowerData
{
    public class Follower
    {
        public int Id { get; set; }
        public int Rate { get; set; }
        public string Email { get; set; } = "";
        public string Name { get; set; } = "";
        public string? Feedback { get; set; }
    }
}
