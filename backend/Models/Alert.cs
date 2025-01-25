using Enums;

namespace Models
{
    public class Alert
    {
        public AlertType Type { get; set; } = AlertType.Info;
        public Exception Exception { get; set; } = null!;
        public string Message { get; set; } = "";
        public DateTime AlertTime { get; } = DateTime.Now;
    }
}