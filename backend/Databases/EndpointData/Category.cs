using Databases.UserData;

namespace Databases.EndpointData
{
    public class Category
    {
        public int Id { get; set; }
        public string Name { get; set; } = "";
        public string? Description { get; set; }

        public ICollection<User>? Users { get; set; }
        public ICollection<Certification>? Certifications { get; set; }
        public ICollection<Education>? Educations { get; set; }
        public ICollection<Endpoint>? Endpoints { get; set; }
        public ICollection<Experience>? Experiences { get; set; }
    }
}