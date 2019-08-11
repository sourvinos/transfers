namespace Transfers.Models
{
	public class Route
	{
		public int Id { get; set; }
		public string ShortDescription { get; set; }
		public string Description { get; set; }
		public string UserName { get; set; }

		public int PortId { get; set; }

		public Port Port { get; set; }
	}
}