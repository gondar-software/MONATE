using Databases.EndpointData;
using Databases.UserData;
using Enums;

namespace Databases.CommunicationData
{
    public class Feedback
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int EndpointId { get; set; }
        public int WorkflowId { get; set; }
        public int Rate { get; set; }
        public FeedbackType Type { get; set; }

        public User? User { get; set; }
        public EndpointData.Endpoint? Endpoint { get; set; }
        public Workflow? Workflow { get; set; }
    }
}