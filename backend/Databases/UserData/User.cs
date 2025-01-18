using Databases.CommunicationData;
using Databases.EcommerceData;
using Databases.EndpointData;
using Enums;

namespace Databases.UserData
{
    public class User
    {
        public int Id { get; set; }
        public string EmailAddr { get; set; } = "";
        public string Token { get; set; } = "";
        public string Password { get; set; } = "";
        public UserType Type { get; set; }
        public PermitionType Permition { get; set; }
        public DateTime ExpireDate { get; set; }

        public Information? Information { get; set; }
        public Profile? Profile { get; set; }
        public PaymentProfile? PaymentProfile { get; set; }
        public ICollection<API>? APIs { get; set; }
        public ICollection<EthAddress>? EthAddresses { get; set; }
        public ICollection<Transaction>? Transactions { get; set; }
        public ICollection<Channel>? Channels { get; set; }
        public ICollection<Chat>? SentChats { get; set; }
        public ICollection<Chat>? ReceivedChats { get; set; }
        public ICollection<Mail>? SentMails { get; set; }
        public ICollection<Mail>? ReceivedMails { get; set; }
        public ICollection<Relation>? OwningRelations { get; set; }
        public ICollection<Relation>? OwnedRelations { get; set; }
        public ICollection<Feedback>? Feedbacks { get; set; }
        public ICollection<Commit>? Commits { get; set; }
        public ICollection<KnowUser>? KnownUsers { get; set; }
        public ICollection<KnowUser>? KnewUsers { get; set; }
    }
}