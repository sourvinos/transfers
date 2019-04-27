using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel.DataAnnotations;

namespace Transfers.Models
{
	public class Route
	{
		public int Id { get; set; }
		public string ShortDescription { get; set; }
		public string Description { get; set; }
		public string User { get; set; }

		public ICollection<PickupPoint> PickupPoints { get; set; }

		public Route()
		{
			PickupPoints = new Collection<PickupPoint>();
		}
	}
}