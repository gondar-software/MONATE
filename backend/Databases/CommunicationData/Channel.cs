using Databases.UserData;

namespace Databases.CommunicationData
{
    public class Channel
    {
        public int Id { get; set; }
        public string Name { get; set; } = "";
        public string? Description { get; set; }
        public string? ImagePath { get; set; }

        public ICollection<User>? Users { get; set; }
        public ICollection<Chat>? Chats { get; set; }
    }
}