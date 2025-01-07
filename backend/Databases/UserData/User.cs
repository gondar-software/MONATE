using Databases.CommunicationData;
using Databases.EcommerceData;
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
        public ICollection<API>? APIs { get; set; }
        public ICollection<Certification>? Certifications { get; set; }
        public ICollection<Education>? Educations { get; set; }
        public ICollection<Experience>? Experiences { get; set; }
        public ICollection<EthAddress>? EthAddresses { get; set; }
        public ICollection<Transaction>? Transactions { get; set; }
        public ICollection<Channel>? Channels { get; set; }
        public ICollection<Chat>? SentChats { get; set; }
        public ICollection<Chat>? ReceivedChats { get; set; }
        public ICollection<Mail>? SentMails { get; set; }
        public ICollection<Mail>? ReceivedMails { get; set; }
        public ICollection<EndpointData.Endpoint>? Endpoints { get; set; }
    }
}