using Databases.EndpointData;

namespace Databases.UserData
{
    public class Experience
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string CompanyName { get; set; } = "";
        public string Location { get; set; } = "";
        public string? Description { get; set; }
        
        public User? User { get; set; }
        public ICollection<Category>? Categories { get; set; }
    }
}