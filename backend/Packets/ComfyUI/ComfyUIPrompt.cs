using Enums;

namespace Packets.ComfyUI
{
    public class ComfyUIPrompt
    {
        public ComfyUIModelTypes Type { get; set; }
        public List<ComfyUIData>? Inputs { get; set; }
    }
}
