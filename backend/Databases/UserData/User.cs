using Databases.ChatbotData;
using Databases.ComfyUIData;
using Enums;

namespace Databases.UserData
{
    public class User
    {
        public int Id { get; set; }
        public string EmailAddr { get; set; } = "";
        public string Password { get; set; } = "";
        public UserType Type { get; set; }
        public PermitionType Permition { get; set; }

        public Information? Information { get; set; }
        public ChatbotCache? ChatbotCache { get; set; }
        public ICollection<ChatbotHistory>? ChatbotHistories { get; set; }
        public ICollection<ComfyUIWork>? ComfyUIWorks { get; set; }
    }
}