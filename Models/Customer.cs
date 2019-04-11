using System.ComponentModel.DataAnnotations;

namespace Transfers.Models
{
	public class Customer
	{
		public int CustomerId { get; set; }
		[Required]
		[StringLength(255)]
		public string Description { get; set; }
		public string Profession { get; set; }
		public string Address { get; set; }
		public string Phones { get; set; }
		public string PersonInCharge { get; set; }
		public string Email { get; set; }
		public string TaxNo { get; set; }
		[Required]
		public int TaxOfficeId { get; set; }
		[Required]
		public int VATStateId { get; set; }
		public string AccountCode { get; set; }
		public string User { get; set; }

		public TaxOffice TaxOffice { get; set; }
		public VATState VATState { get; set; }
	}
}
