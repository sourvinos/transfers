using System.ComponentModel.DataAnnotations;

namespace Transfers.Models
{
	public class VATState
	{
		public int VATStateId { get; set; }
		[Required]
		public string Description { get; set; }
	}
}