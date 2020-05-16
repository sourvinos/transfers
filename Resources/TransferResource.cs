using System;

namespace Transfers {
    public class TransferResource {
        public int Id { get; set; }
        public DateTime dateIn { get; set; }
        public int Adults { get; set; }
        public int Kids { get; set; }
        public int Free { get; set; }
        public int TotalPersons { get; set; }
        public string Remarks { get; set; }
        public string UserId { get; set; }
        public CustomerResource Customer { get; set; }
        public DestinationResource Destination { get; set; }
        public PickupPointResource PickupPoint { get; set; }
        public DriverResource Driver { get; set; }
    }
}