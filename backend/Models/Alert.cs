using Enums;

namespace Models
{
    public class Alert
    {
        private AlertType type = AlertType.Info;
        private string message = "";
        private DateTime alertTime = DateTime.Now;

        public AlertType Type
        {
            get => type;
            set => type = value;
        }

        public string Message
        {
            get => message;
            set => message = value;
        }
        
        public DateTime AlertTime
        {
            get => alertTime;
        }
    }
}