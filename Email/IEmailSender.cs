namespace Transfers {

    public interface IEmailSender {
        SendEmailResponse SendRegistrationEmail(string userEmail, string username, string callbackUrl);
        SendEmailResponse SendResetPasswordEmail(string displayName, string userEmail, string callbackUrl);
    }

}