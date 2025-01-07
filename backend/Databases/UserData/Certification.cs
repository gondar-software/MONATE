using Databases.EndpointData;

namespace Databases.UserData
{
    public class Certification
    {
        public int Id { get; set; }
        public int ProfileId { get; set; }
        public int EducationId { get; set; }
        public string Name { get; set; } = "";
        public string Url { get; set; } = "";
        public string? Description { get; set; }
        public string? ImagePath { get; set; }

        public Profile? Profile { get; set; }
        public Education? Education { get; set; }
        public ICollection<Category>? Categories { get; set; }
    }
}