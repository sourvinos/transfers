using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace Transfers {

    public class Transfer {
        public int Id { get; set; }
        public DateTime DateIn { get; set; }
        public int Adults { get; set; }
        public int Kids { get; set; }
        public int Free { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public int TotalPersons { get; set; }
        public string Remarks { get; set; }
        public string UserId { get; set; }
        public int CustomerId { get; set; }
        public int PickupPointId { get; set; }
        public int DestinationId { get; set; }
        public int DriverId { get; set; }
        public Customer Customer { get; set; }
        public Destination Destination { get; set; }
        public PickupPoint PickupPoint { get; set; }
        public Driver Driver { get; set; }
    }

}