using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace Transfers {

    public class Repository<T> : IRepository<T> where T : class {

        protected readonly AppDbContext context;
        public Repository(AppDbContext context) {
            this.context = context;
        }

        public IEnumerable<T> GetAll() {
            return context.Set<T>();
        }

        IEnumerable<T> IRepository<T>.Find(Func<T, bool> predicate) {
            return context.Set<T>().Where(predicate);
        }

        public T GetById(int id) {
            return context.Set<T>().Find(id);
        }

        public void Create(T entity) {
            context.Add(entity);
            Save();
        }

        public void Update(T entity) {
            context.Entry(entity).State = EntityState.Modified;
            Save();
        }

        public void Delete(T entity) {
            context.Remove(entity);
            Save();
        }

        private void Save() {
            context.SaveChanges();
        }

    }

}