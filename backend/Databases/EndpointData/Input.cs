using Enums;

namespace Databases.EndpointData
{
    public class Input
    {
        public int Id { get; set; }
        public int WorkflowId { get; set; }
        public string Name { get; set; } = "";
        public string? Description { get; set; }
        public string ValuePath { get; set; } = "";
        public InputType Type { get; set; }

        public Workflow? Workflow { get; set; }
    }
}