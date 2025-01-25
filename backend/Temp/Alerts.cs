using Enums;
using Models;

namespace Temp
{
    public static class Alerts
    {
        private static readonly Queue<Alert> alerts = new Queue<Alert>();
        private static readonly object lockObject = new object();

        public static void EnQueueAlert(Alert alert)
        {
            lock (lockObject)
            {
                alerts.Enqueue(alert);   
            }
        }

        public static void EnQueueAlert(AlertType type, Exception ex, string message)
        {
            lock (lockObject)
            {
                alerts.Enqueue(new Alert
                {
                    Type = type,
                    Exception = ex,
                    Message = message,
                });
            }
        }

        public static Alert DeQueueAlert()
        {
            lock (lockObject)
            {
                return alerts.Dequeue();
            }
        }
    }
}