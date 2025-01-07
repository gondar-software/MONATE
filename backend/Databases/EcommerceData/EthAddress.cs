using Databases.UserData;

namespace Databases.EcommerceData
{
    public class EthAddress
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Address { get; set; } = "";

        public User? User { get; set; }
        public ICollection<Transaction>? Transactions { get; set; }
    }
}