namespace Databases.EndpointData
{
    public class Workflow
    {
        public int Id { get; set; }
        public int EndpointId { get; set; }
        public decimal Price { get; set; }
        public decimal InitPrice { get; set; }
        public float GpuUsage { get; set; }
        public string Version { get; set; } = "";
        public string? Description { get; set; }
        public string? ImagePath { get; set; }

        public Endpoint? Endpoint { get; set; }
        public ICollection<Input>? Inputs { get; set; }
    }
}