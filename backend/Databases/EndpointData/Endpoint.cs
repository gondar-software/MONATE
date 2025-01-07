using Databases.CommunicationData;
using Databases.UserData;

namespace Databases.EndpointData
{
    public class Endpoint
    {
        public int Id { get; set; }
        public int ProfileId { get; set; }
        public decimal Price { get; set; }
        public decimal InitPrice { get; set; }
        public string Name { get; set; } = "";
        public string? Description { get; set; }
        public string? ImagePath { get; set; }

        public Profile? Profile { get; set; }
        public ICollection<Feedback>? Feedbacks { get; set; }
        public ICollection<Category>? Categories { get; set; }
        public ICollection<Workflow>? Workflows { get; set; }
    }
}