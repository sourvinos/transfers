namespace Transfers {
    public class RouteResource {
        public int Id { get; set; }
        public string Description { get; set; }
        public string FullDescription { get; set; }
        public PortResource Port { get; set; }
    }
}