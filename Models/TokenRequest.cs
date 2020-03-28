namespace Transfers.Models {

    public class TokenRequest {

        public string UserName { get; set; }
        public string Password { get; set; }
        public string GrantType { get; set; }
        public string RefreshToken { get; set; }

    }

}