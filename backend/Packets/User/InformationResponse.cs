using Enums;

namespace Packets.User
{
    public class InformationResponse
    {
        public string EmailAddr { get; set; } = "";
        public UserType UserType { get; set; }
        public string FirstName { get; set; } = "";
        public string? MiddleName { get; set; }
        public string LastName { get; set; } = "";
        public GenderType Gender { get; set; }
        public string Dob { get; set; } = "";
        public string Address1 { get; set; } = "";
        public string? Address2 { get; set; } = "";
        public string City { get; set; } = "";
        public string State { get; set; } = "";
        public int ZipCode { get; set; }
        public string Country { get; set; } = "";
        public string? Avatar { get; set; }
        public string GithubUrl { get; set; } = "";
        public string PhoneNumber { get; set; } = "";
    }
}