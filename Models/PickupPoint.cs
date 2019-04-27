using System.ComponentModel.DataAnnotations;

namespace Transfers.Models
{
	public class PickupPoint
	{
		public int PickupPointId { get; set; }
		public int RouteId { get; set; }
		[Required]
		[StringLength(255)]
		public string Description { get; set; }
		public string ExactPoint { get; set; }
		public string Time { get; set; }
		public string User { get; set; }
	}
}
