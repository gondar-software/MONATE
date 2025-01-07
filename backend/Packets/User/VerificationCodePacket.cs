namespace Packets.User
{
    public class VerificationCodePacket : IUserPacket
    {
        public string EmailAddr { get; set; } = "";
        public string Password { get; set; } = "";
        public int Code { get; set; }
    }
}