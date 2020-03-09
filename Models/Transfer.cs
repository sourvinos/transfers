using System;
using System.ComponentModel.DataAnnotations.Schema;
using Transfers.Models;

namespace Transfers {

    public class Transfer {
        public int Id { get; set; }
        public DateTime DateIn { get; set; }
        public int Adults { get; set; }
        public int kids { get; set; }
        public int Free { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public int TotalPersons { get; set; }
        public string Remarks { get; set; }
        public string UserName { get; set; }
        public int CustomerId { get; set; }
        public int PickupPointId { get; set; }
        public int DestinationId { get; set; }
        public int DriverId { get; set; }
        public int PortId { get; set; }
        public Customer Customer { get; set; }
        public Destination Destination { get; set; }
        public PickupPoint PickupPoint { get; set; }
        public Driver Driver { get; set; }
    }

}