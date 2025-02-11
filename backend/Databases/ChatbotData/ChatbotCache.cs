using Databases.UserData;

namespace Databases.ChatbotData
{
    public class ChatbotCache
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string LastId { get; set; } = "";

        public User? User { get; set; }
    }
}
