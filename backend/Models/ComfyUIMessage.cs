using Enums;

namespace Models
{
    public class ComfyUIMessage
    {
        public ComfyUIMessageType Type { get; set; }
        public string Data { get; set; } = "";
    }
}
