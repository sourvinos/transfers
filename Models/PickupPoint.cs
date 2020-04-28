namespace Transfers {

    public class PickupPoint {

        public int Id { get; set; }
        public string PickupPointDescription { get; set; }
        public string ExactPoint { get; set; }
        public string Time { get; set; }
        public string UserName { get; set; }

        public int RouteId { get; set; }

        public Route Route { get; set; }
    }

}