using Databases.EndpointData;

namespace Databases.UserData
{
    public class Profile
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Role { get; set; } = "";
        public string Description { get; set; } = "";
        
        public User? User { get; set; }
        public ICollection<Certification>? Certifications { get; set; }
        public ICollection<Education>? Educations { get; set; }
        public ICollection<Experience>? Experiences { get; set; }
        public ICollection<EndpointData.Endpoint>? Endpoints { get; set; }
        public ICollection<Category>? Skills { get; set; }
    }
}