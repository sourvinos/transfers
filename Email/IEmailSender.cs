namespace Transfers.Email {

    public interface IEmailSender {

        SendEmailResponse SendRegistrationEmail(string userEmail, string username, string callbackUrl);
        SendEmailResponse SendResetPasswordEmail(string userEmail, string displayName, string callbackUrl);

    }

}