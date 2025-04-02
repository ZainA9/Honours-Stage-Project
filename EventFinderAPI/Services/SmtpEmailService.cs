using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Configuration;
using System.Threading.Tasks;

public class SmtpEmailService
{
    private readonly IConfiguration _config;

    public SmtpEmailService(IConfiguration config)
    {
        _config = config;
    }

    public async Task SendEmailAsync(string toEmail, string subject, string body)
    {
        var smtpSettings = _config.GetSection("MailjetSMTP");
        string host = smtpSettings["Host"];
        int port = int.Parse(smtpSettings["Port"]);
        string username = smtpSettings["Username"];
        string password = smtpSettings["Password"];
        string fromEmail = smtpSettings["FromEmail"];
        string fromName = smtpSettings["FromName"];

        MailMessage message = new MailMessage //builds the email
        {
            From = new MailAddress(fromEmail, fromName),
            Subject = subject,
            Body = body,
            IsBodyHtml = false
        };
        message.To.Add(toEmail);

        SmtpClient client = new SmtpClient(host, port) // creates the smtp client and configures it
        {
            Credentials = new NetworkCredential(username, password),
            EnableSsl = true
        };

        await client.SendMailAsync(message);
        Console.WriteLine($"[SMTP] Email sent to {toEmail}"); //sends email and logs to console.
    }
}
