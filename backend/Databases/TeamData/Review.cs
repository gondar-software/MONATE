namespace Databases.TeamData
{
    public class Review
    {
        public int Id { get; set; }
        public int Rating { get; set; }
        public string EmailAddr { get; set; } = "";
        public string Name { get; set; } = "";
        public string Description { get; set; } = "";
    }
}