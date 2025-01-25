using MailKit.Net.Smtp;
using MailKit;
using MimeKit;
using Temp;

namespace Helpers
{
    public class SMTPHelper
    {
        public static void SendEmail(string to, string subject, string body, ILogger logger)
        {
            string myEmail = Environment.GetEnvironmentVariable("EMAIL_ADDRESS") ?? string.Empty;
            string myEmailPassword = Environment.GetEnvironmentVariable("EMAIL_PASSWORD") ?? string.Empty;
            string mySmtpHost = Environment.GetEnvironmentVariable("SMTP_HOST") ?? string.Empty;
            int mySmtpPort = int.Parse(Environment.GetEnvironmentVariable("SMTP_PORT") ?? string.Empty);

            var message = new MimeMessage();
            message.From.Add(new MailboxAddress("MONATE", myEmail));
            message.To.Add(new MailboxAddress("", to));
            message.Subject = subject;

            message.Body = new TextPart("plain")
            {
                Text = body,
            };

            using (var client = new SmtpClient(new ProtocolLogger("smtp.log")))
            {
                try
                {
                    client.Connect(mySmtpHost, mySmtpPort, MailKit.Security.SecureSocketOptions.StartTls);
                    client.Authenticate(myEmail, myEmailPassword);
                    client.Send(message);
                }
                catch (Exception ex)
                {
                    logger.LogError(ex, "Error sending email");
                    Alerts.EnQueueAlert(Enums.AlertType.Error, ex, "Error sending email");
                }
                finally
                {
                    client.Disconnect(true);
                }
            }
        }
    }
}