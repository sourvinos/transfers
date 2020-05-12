namespace Transfers {

    public static class ApiMessages {

        public static string RecordCreated() { return "Record created."; }
        public static string RecordUpdated() { return "Record updated."; }
        public static string RecordDeleted() { return "Record deleted."; }
        public static string RecordNotFound() { return "Record does not exist."; }
        public static string InvalidId() { return "Given Id and actual Id do not match."; }
        public static string RecordInUse() { return "Record is in use and can not be deleted."; }
        public static string EmailInstructions(string email) { return $"An email was sent to { email } with instructions."; }
        public static string AccountNotConfirmed() { return "This account is pending email confirmation."; }
        public static string EmailNotFound(string email) { return $"Email { email } does not exist."; }
        public static string EmailReset() { return "Password was reset successfully."; }
        public static string PasswordChanged() { return "Password was changed successfully."; }
        public static string AuthenticationFailed() { return "Authentication failed."; }
        public static string UserNotFound() { return "User not found."; }
        public static string DefaultDriverAlreadyExists(string defaultDriver) { return $"Driver {defaultDriver} is already the default driver."; }

    }

}