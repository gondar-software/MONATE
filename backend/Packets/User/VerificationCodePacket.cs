namespace Packets.User
{
    public class VerificationCodePacket
    {
        public string EmailAddr { get; set; } = "";
        public string Password { get; set; } = "";
        public int Code { get; set; }
    }
}