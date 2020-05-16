using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace Transfers {

    public class Repository<T> : IRepository<T> where T : class {

        protected readonly AppDbContext context;

        public Repository(AppDbContext context) =>
            this.context = context;

        public async Task<IEnumerable<T>> Get() =>
            await context.Set<T>().ToListAsync();

        public async Task<IEnumerable<T>> GetActive(Expression<Func<T, bool>> expression) =>
            await context.Set<T>().Where(expression).ToListAsync();

        public async Task<T> GetById(int id) =>
            await context.Set<T>().FindAsync(id);

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