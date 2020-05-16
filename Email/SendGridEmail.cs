using System;
using Microsoft.Extensions.Options;
using SendGrid;
using SendGrid.Helpers.Mail;

namespace Transfers {

    public class SendGridEmail : IEmailSender {

        private readonly AppSettings _appSettings;

        public SendGridEmail(IOptions<AppSettings> appSettings) =>
            _appSettings = appSettings.Value;

        public SendEmailResponse SendRegistrationEmail(string userEmail, string displayName, string callbackUrl) {
            var apiKey = _appSettings.SendGridKey;
            var client = new SendGridClient(apiKey);
            var from = new EmailAddress("no-reply@peoplemovers.com", "People Movers");
            var subject = "Complete your account setup";
            var to = new EmailAddress(userEmail, "People Movers");
            var htmlContent = "<h1 style='color: #FE9F36; font-family: Roboto Condensed;'>Hello, " + displayName + "!" + "</h1>";
            htmlContent += "<h2 style='color: #2e6c80;'>Welcome to People Movers.</h2>";
            htmlContent += "<p>Click the following button to confirm your email account</p>";
            htmlContent += "<div id='button' style='padding: 1rem;'>";
            htmlContent += "<a style='background-color: #57617B; color: #ffffff; border-radius: 5px; padding: 1rem 2rem; text-decoration: none;' href=" + callbackUrl + ">Confirm</a>";
            htmlContent += "</div>";
            htmlContent += "<p>If clicking doesn't work, copy and paste this link:</p>";
            htmlContent += "<p>" + callbackUrl + "</p>";
            htmlContent += "<p style='font-size: 11px; margin: 2rem 0;'>&copy; People Movers " + DateTime.Now.ToString("yyyy") + "</p>";
            var msg = MailHelper.CreateSingleEmail(from, to, subject, "", htmlContent);
            var response = client.SendEmailAsync(msg);
            return new SendEmailResponse();
        }

        public SendEmailResponse SendResetPasswordEmail(string displayName, string userEmail, string callbackUrl) {
            var apiKey = _appSettings.SendGridKey;
            var client = new SendGridClient(apiKey);
            var from = new EmailAddress("no-reply@peoplemovers.com", "People Movers");
            var subject = "Password reset";
            var to = new EmailAddress(userEmail, "People Movers");
            var htmlContent = "<h1 style='color: #FE9F36; font-family: Roboto Condensed;'>Hello, " + displayName + "!" + "</h1>";
            htmlContent += "<h2 style='color: #2e6c80;'>You have requested a password reset</h2>";
            htmlContent += "<p>Click the following button to reset your password</p>";
            htmlContent += "<div id='button' style='padding: 1rem;'>";
            htmlContent += "<a style='background-color: #57617B; color: #ffffff; border-radius: 5px; padding: 1rem 2rem; text-decoration: none;' href=" + callbackUrl + ">Reset password</a>";
            htmlContent += "</div>";
            htmlContent += "<p>If clicking doesn't work, copy and paste this link:</p>";
            htmlContent += "<p>" + callbackUrl + "</p>";
            htmlContent += "<p style='font-size: 11px; margin: 2rem 0;'>&copy; People Movers " + DateTime.Now.ToString("yyyy") + "</p>";
            var msg = MailHelper.CreateSingleEmail(from, to, subject, "", htmlContent);
            var response = client.SendEmailAsync(msg);
            return new SendEmailResponse();
        }
    }

}