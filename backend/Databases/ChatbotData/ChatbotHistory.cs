using Databases.UserData;

namespace Databases.ChatbotData
{
    public class ChatbotHistory
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string ChatId { get; set; } = "";
        public string Title { get; set; } = "";
        public string? HistoryFilePath { get; set; }

        public User? User { get; set; }
    }
}