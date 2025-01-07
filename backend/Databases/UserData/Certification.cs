namespace Databases.UserData
{
    using Databases.EndpointData;

    public class Certification
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int EducationId { get; set; }
        public string Name { get; set; } = "";
        public string Url { get; set; } = "";
        public string? Description { get; set; }
        public string? ImagePath { get; set; }

        public User? User { get; set; }
        public Education? Education { get; set; }
        public ICollection<Category>? Categories { get; set; }
    }
}