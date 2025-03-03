using Enums;

namespace Packets.Chatbot
{
    public class PromptRequest
    {
        public string Query { get; set; } = "";
        public ChatbotType ChatbotType { get; set; }
        public string? Id { get; set; } = "";
        public bool? Rag { get; set; }
    }
}
