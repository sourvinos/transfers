using System;
using System.Collections.Generic;

namespace Transfers {

    public interface IRepository<T> where T : class {

        IEnumerable<T> GetAll();
        IEnumerable<T> Find(Func<T, bool> predicate);
        T GetById(int id);
        void Create(T entity);
        void Update(T entity);
        void Delete(T entity);

    }

}