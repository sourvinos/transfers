using System.Collections.Generic;
using Transfers.Models;

namespace Transfers.Resources
{
	public class TransferGroupResultResource<T>
	{
		public int Persons { get; set; }

		public IEnumerable<Transfer> Transfers { get; set; }
		public IEnumerable<TotalPersonsPerCustomer> PersonsPerCustomer { get; set; }
		public IEnumerable<TotalPersonsPerDestination> PersonsPerDestination { get; set; }
		public IEnumerable<TotalPersonsPerRoute> PersonsPerRoute { get; set; }
	}
}