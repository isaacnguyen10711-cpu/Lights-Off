using MailKit;
using MailKit.Security;
using MimeKit;
using Microsoft.AspNetCore.Identity;
using Lights_Off.Models;

namespace Lights_Off.Services.EmailService
{
    public class Mailer : IEmailSender<User>
    {
        private readonly SmtpSettings _smtpSettings;
        private readonly IConfiguration _configuration;
        private readonly ILogger<Mailer> _logger;

        public Mailer(SmtpSettings smtpSettings, IConfiguration configuration, ILogger<Mailer> logger)
        {
            _smtpSettings = smtpSettings;
            _configuration = configuration;
            _logger = logger;

        }

        public async Task SendConfirmationLinkAsync(User user, string email, string confirmationLink)
        {
            var subject = "Confirm your email";
            var body = $"<p>Hi {System.Net.WebUtility.HtmlEncode(user.DisplayName ?? "there")},</p><p>Please confirm your email by clicking the link below:</p><p><a href='{confirmationLink}'>Confirm Email</a></p>";
            await SendEmailAsync(email, subject, body);
        }

        public async Task SendPasswordResetCodeAsync(User user, string email, string resetCode)
        {
            var subject = "Password Reset";

            var link = $"{_configuration["Frontend:Url"]}/reset-password"
                + $"?email={Uri.EscapeDataString(email)}&code={Uri.EscapeDataString(resetCode)}";

            var body = $"<p><a href=\"{link}\">Reset your password</a></p>"
                + "<p>If you didn't ask for this, you can ignore this email.</p>";

            await SendEmailAsync(email, subject, body);
        }

        // Required by the interface, but not used in this implementation
        public async Task SendPasswordResetLinkAsync(User user, string email, string resetLink)
        {
            var subject = "Reset your password";
            var body = $"<p>Hi {System.Net.WebUtility.HtmlEncode(user.DisplayName ?? "there")},</p><p>You can reset your password by clicking the link below:</p><p><a href='{resetLink}'>Reset Password</a></p>";
            await SendEmailAsync(email, subject, body);
        }

        private async Task SendEmailAsync(string email, string subject, string body)
        {
            try
            {
                var message = new MimeMessage();
                message.From.Add(new MailboxAddress(_smtpSettings.SenderName, _smtpSettings.SenderEmail));
                message.To.Add(MailboxAddress.Parse(email));
                message.Subject = subject;
                message.Body = new TextPart("html")
                {
                    Text = body
                };

                using (var client = new MailKit.Net.Smtp.SmtpClient())
                {

                    await client.ConnectAsync(_smtpSettings.Server, _smtpSettings.Port, SecureSocketOptions.StartTls);

                    await client.AuthenticateAsync(_smtpSettings.Username, _smtpSettings.Password);
                    await client.SendAsync(message);
                    await client.DisconnectAsync(true);
                }
            }
            catch (Exception ex)
            {
                // Log the exception or handle it as needed
                _logger.LogError(ex, $"Error sending email to {email}");
            }

        }
    }
}
