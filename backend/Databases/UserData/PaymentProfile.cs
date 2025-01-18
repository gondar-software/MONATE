using Enums;

namespace Databases.UserData
{
    public class PaymentProfile
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public PaymentProfileType Type { get; set; }
        public decimal Credit { get; set; }

        public User? User { get; set; }
    }
}