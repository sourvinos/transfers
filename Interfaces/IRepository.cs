using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Transfers {

    public interface IRepository<T> where T : class {

        Task<IEnumerable<T>> Get();
        Task<T> GetById(int id);
        void Create(T entity);
        void Update(T entity);
        void Delete(T entity);

    }

}