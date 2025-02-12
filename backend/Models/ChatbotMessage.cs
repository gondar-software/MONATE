using Enums;

namespace Models
{
    public class ChatbotMessage
    {
        public ChatbotMessageType Type { get; set; }
        public string Message { get; set; } = "";
    }
}
