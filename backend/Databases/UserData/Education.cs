using Databases.EndpointData;
using Enums;

namespace Databases.UserData
{
    public class Education
    {
        public int Id { get; set; }
        public int ProfileId { get; set; }
        public string UniversityName { get; set; } = "";
        public string Location { get; set; } = "";
        public DegreeType Degree { get; set; }
        public string FieldOfEducation { get; set; } = "";
        public DateTime AttendedDate { get; set; }
        public DateTime GraduatedDate { get; set; }
        public string? Description { get; set; }

        public Profile? Profile { get; set; }
        public ICollection<Certification>? Certifications { get; set; }
        public ICollection<Category>? Categories { get; set; }
    }
}