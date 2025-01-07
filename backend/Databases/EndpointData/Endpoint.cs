using Databases.UserData;

namespace Databases.EndpointData
{
    public class Endpoint
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public decimal Price { get; set; }
        public decimal InitPrice { get; set; }
        public string Name { get; set; } = "";
        public string? Description { get; set; }
        public string? ImagePath { get; set; }

        public User? User { get; set; }
    }
}