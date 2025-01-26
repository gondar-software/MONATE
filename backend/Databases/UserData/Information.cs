using Enums;

namespace Databases.UserData
{
    public class Information
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string FirstName { get; set; } = "";
        public string? MiddleName { get; set; }
        public string LastName { get; set; } = "";
        public GenderType Gender { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string Address1 { get; set; } = "";
        public string? Address2 { get; set; } = "";
        public string City { get; set; } = "";
        public string State { get; set; } = "";
        public int ZipCode { get; set; }
        public string Country { get; set; } = "";
        public string? AvatarPath { get; set; }
        public string GithubUrl { get; set; } = "";
        public string PhoneNumber { get; set; } = "";

        public User? User { get; set; }
    }
}