namespace Transfers {

    public interface IEmailSender {
        SendEmailResponse SendRegistrationEmail(string userEmail, string displayName, string callbackUrl);
        SendEmailResponse SendResetPasswordEmail(string displayName, string userEmail, string callbackUrl);
    }

}