using Enums;

namespace Packets.ComfyUI
{
    public class ComfyUIOutput
    {
        public ComfyUIModelTypes Type { get; set; }
        public List<ComfyUIData>? Inputs { get; set; }
        public ComfyUIData? Output { get; set; }
    }
}
