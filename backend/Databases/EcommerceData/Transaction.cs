using Databases.UserData;
using Enums;

namespace Databases.EcommerceData
{
    public class Transaction
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int EthAddressId { get; set; }
        public decimal Amount { get; set; }
        public TransactionType Type { get; set; }
        public string Description { get; set; } = "";
        public DateTime Time { get; set; }

        public EthAddress? EthAddress { get; set; }
        public User? User { get; set; }
    }
}