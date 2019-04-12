using System.ComponentModel.DataAnnotations;

namespace Transfers.Models
{
	public class TransferType
	{
		public int TransferTypeId { get; set; }
		[Required]
		public string Description { get; set; }
	}
}
