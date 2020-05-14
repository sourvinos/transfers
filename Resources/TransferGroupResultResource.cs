using System.Collections.Generic;

namespace Transfers {
    public class TransferGroupResultResource<T> {
        public int Persons { get; set; }
        public IEnumerable<TransferResource> Transfers { get; set; }
        public IEnumerable<TotalPersonsPerCustomer> PersonsPerCustomer { get; set; }
        public IEnumerable<TotalPersonsPerDestination> PersonsPerDestination { get; set; }
        public IEnumerable<TotalPersonsPerRoute> PersonsPerRoute { get; set; }
        public IEnumerable<TotalPersonsPerDriver> PersonsPerDriver { get; set; }
        public IEnumerable<TotalPersonsPerPort> PersonsPerPort { get; set; }
    }
}