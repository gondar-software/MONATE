namespace Packets.User
{
    public class VerifyData
    {
        public string EmailAddr { get; set; } = "";
        public string Password { get; set; } = "";
        public string Code { get; set; } = "";
    }
}