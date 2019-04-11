using System.ComponentModel.DataAnnotations;

namespace Transfers.Models
{
	public class TaxOffice
	{
		public int TaxOfficeId { get; set; }
		[Required]
		public string Description { get; set; }
	}
}
