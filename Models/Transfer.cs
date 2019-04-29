using System;
using Transfers.Models;

namespace Transfers
{
	public class Transfer
	{
		public int Id { get; set; }
		public DateTime Date { get; set; }
		public int Adults { get; set; }
		public int kids { get; set; }
		public int Free { get; set; }
		public string Remarks { get; set; }
		public string User { get; set; }

		public int CustomerId { get; set; }
		public int TransferTypeId { get; set; }
		public int PickupPointId { get; set; }
		public int DestinationId { get; set; }

		public Customer Customer { get; set; }
		public TransferType TransferType { get; set; }
		public PickupPoint PickupPoint { get; set; }
		public Destination Destination { get; set; }
	}
}