using Enums;

namespace Databases.EcommerceData
{
    public class Transaction
    {
        public int Id { get; set; }
        public int EthAddressId { get; set; }
        public decimal Amount { get; set; }
        public TransactionType Type { get; set; }

        public EthAddress? EthAddress { get; set; }
    }
}