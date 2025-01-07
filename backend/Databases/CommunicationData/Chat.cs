using Databases.UserData;

namespace Databases.CommunicationData
{
    public class Chat
    {
        public int Id { get; set; }
        public int SenderUserId { get; set; }
        public int ReceiverUserId { get; set; }
        public int ChannelId { get; set; }
        public string Message { get; set; } = "";

        public User? SenderUser { get; set; }
        public User? ReceiverUser { get; set; }
        public Channel? Channel { get; set; }
    }
}