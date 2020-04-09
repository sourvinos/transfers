namespace Transfers {
    public class PickupPointResource {
        public int Id { get; set; }
        public string Description { get; set; }
        public string ExactPoint { get; set; }
        public string Time { get; set; }
        public RouteResource Route { get; set; }
    }
}