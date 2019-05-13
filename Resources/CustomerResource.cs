using Transfers.Models;

namespace Transfers.Resources
{
	public class CustomerResource
	{
		public int Id { get; set; }
		public string Description { get; set; }
		public string Profession { get; set; }
		public string Address { get; set; }
		public string Phones { get; set; }
		public string PersonInCharge { get; set; }
		public string Email { get; set; }
		public string TaxNo { get; set; }
		public string AccountCode { get; set; }

		public TaxOffice TaxOffice { get; set; }
		public VATState VatState { get; set; }
	}
}