using Transfers.Models;

namespace Transfers.Resources
{
	public class PickupPointResource
	{
		public string Description { get; set; }
		public string ExactPoint { get; set; }
		public RouteResource Route { get; set; }
		public string Time { get; set; }
	}
}