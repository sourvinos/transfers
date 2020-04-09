namespace Transfers {

    public class SendEmailResponse {

        public bool Successful => ErrorMsg == null;
        public string ErrorMsg;

    }

}