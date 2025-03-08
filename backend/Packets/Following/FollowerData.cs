namespace Packets.Following
{
    public class FollowerData
    {
        public int Rate { get; set; }
        public string Email { get; set; } = "";
        public string Name { get; set; } = "";
        public string? Feedback { get; set; }
        public string? AvatarPath { get; set; }
    }
}
