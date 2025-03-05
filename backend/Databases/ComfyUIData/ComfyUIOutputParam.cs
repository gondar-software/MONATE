using Enums;

namespace Databases.ComfyUIData
{
    public class ComfyUIOutputParam
    {
        public int Id { get; set; }
        public ComfyUIDataTypes Type { get; set; }
        public string Value { get; set; } = "";
        public int? WorkId { get; set; }

        public ComfyUIWork? Work { get; set; }
    }
}
