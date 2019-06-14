using System.Collections.Generic;

namespace Transfers.Models
{
	public class TransferGroupResult<T>
	{
		public int Persons { get; set; }

		public IEnumerable<Transfer> Transfers { get; set; }
		public IEnumerable<TotalPersonsPerCustomer> PersonsPerCustomer { get; set; }
		public IEnumerable<TotalPersonsPerDestination> PersonsPerDestination { get; set; }
		public IEnumerable<TotalPersonsPerRoute> PersonsPerRoute { get; set; }
	}
}