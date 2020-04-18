using System.ComponentModel.DataAnnotations;

namespace Transfers {

	public class Port {

		public int Id { get; set; }

		[Required(ErrorMessage = "Description is required")]
		[MaxLength(128, ErrorMessage = "Description can not be longer than 128 characters")]
		public string Description { get; set; }

		[Required(ErrorMessage = "Username is required")]
		[MaxLength(128, ErrorMessage = "Username can not be longer than 128 characters")]
		public string UserName { get; set; }

	}

}