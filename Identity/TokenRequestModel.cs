namespace Transfers
{
    public class TokenRequestModel
    {
        public string GrantType { get; set; }
        public string ClientId { get; set; }
        public string UserName { get; set; }
        public string RefreshToken { get; set; }
        public string Password { get; set; }
    }
}