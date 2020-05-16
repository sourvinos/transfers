using System;

namespace Transfers {
    public class SaveTransferResource {
        public int Id { get; set; }
        public DateTime dateIn { get; set; }
        public int Adults { get; set; }
        public int Kids { get; set; }
        public int Free { get; set; }
        public string Remarks { get; set; }
        public string UserId { get; set; }
        public int CustomerId { get; set; }
        public int PickupPointId { get; set; }
        public int DestinationId { get; set; }
        public int DriverId { get; set; }
    }
}