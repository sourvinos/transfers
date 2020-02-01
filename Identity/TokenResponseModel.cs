using System;

namespace Transfers.Identity
{
    public class TokenResponseModel
    {
        public string token { get; set; }
        public DateTime expiration { get; set; }
        public string refresh_token { get; set; }
        public string roles { get; set; }
        public string userName { get; set; }
        public string displayName { get; set; }
    }
}