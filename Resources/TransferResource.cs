namespace Transfers.Resources
{
	public class TransferResource
	{
		public int Id { get; set; }
		public int Adults { get; set; }
		public int Kids { get; set; }
		public int Free { get; set; }

		public CustomerResource Customer { get; set; }
		public DestinationResource Destination { get; set; }
		public PickupPointResource PickupPoint { get; set; }
	}
}