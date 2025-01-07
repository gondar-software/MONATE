namespace Databases.User
{
    using Enums;

    public class Education
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string UniversityName { get; set; } = "";
        public Degree Degree { get; set; }
        public string FieldOfEducation { get; set; } = "";
        public DateTime AttendedDate { get; set; }
        public DateTime GraduatedDate { get; set; }
        public string? Description { get; set; }

        public User? User { get; set; }
    }
}