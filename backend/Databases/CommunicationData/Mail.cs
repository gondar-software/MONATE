using Databases.UserData;
using Enums;

namespace Databases.CommunicationData
{
    public class Mail
    {
        public int Id { get; set; }
        public int SenderUserId { get; set; }
        public int ReceiverUserId { get; set; }
        public MailType Type { get; set; }
        public string Message { get; set; } = "";

        public User? SenderUser { get; set; }
        public User? ReceiverUser { get; set; }
    }
}