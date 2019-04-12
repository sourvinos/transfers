using System.ComponentModel.DataAnnotations;

namespace Transfers.Models
{
	public class Route
	{
		public int RouteId { get; set; }
		[Required]
		[StringLength(255)]
		public string ShortDescription { get; set; }
		[Required]
		[StringLength(255)]
		public string Description { get; set; }
		public string User { get; set; }
	}
}