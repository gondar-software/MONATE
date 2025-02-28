using Databases.UserData;

namespace Databases.AutomationData
{
    public class Diagram
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Name { get; set; } = "";
        public string Path { get; set; } = "";

        public User? User { get; set; }
    }
}
