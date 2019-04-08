namespace Transfers.Models
{
	public class Customer
	{
		public int Id { get; set; }
		public string Description { get; set; }
		public string Profession { get; set; }
		public string Address { get; set; }
		public string Phones { get; set; }
		public string PersonInCharge { get; set; }
		public string Email { get; set; }
		public string TaxNo { get; set; }
		public int TaxOfficeId { get; set; }
		public int VATStateId { get; set; }
		public string AccountCode { get; set; }
		public string User { get; set; }
	}
}
