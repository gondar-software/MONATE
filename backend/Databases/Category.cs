namespace Databases
{
    public class Category
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int CertificationId { get; set; }
        public int EducationId { get; set; }
        public int EndpointId { get; set; }
        public int WorkflowId { get; set; }
        public string Name { get; set; } = "";
        public string? Description { get; set; }

        public User.User? User { get; set; }
        public User.Certification? Certification { get; set; }
        public User.Education? Education { get; set; }
    }
}