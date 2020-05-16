using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Transfers {

    [Route("api/[controller]")]
    [Authorize(Policy = "RequireLoggedIn")]
    public class RoutesController : ControllerBase {

        private readonly IRouteRepository repo;

        public RoutesController(IRouteRepository repo) =>
            (this.repo) = (repo);

        [HttpGet]
        public async Task<IEnumerable<Route>> Get() =>
            await repo.Get();

        [HttpGet("[action]")]
        public async Task<IEnumerable<Route>> GetActive() =>
            await repo.GetActive(x => x.IsActive);

        [HttpGet("{id}")]
        public async Task<IActionResult> GetRoute(int id) {
            Route route = await repo.GetById(id);
            if (route == null) return NotFound(new { response = ApiMessages.RecordNotFound() });
            return Ok(route);
        }

        [HttpPost]
        public IActionResult PostRoute([FromBody] Route route) {
            if (!ModelState.IsValid) return BadRequest(new { response = ModelState.Values.SelectMany(x => x.Errors).Select(x => x.ErrorMessage) });
            repo.Create(route);
            return Ok(new { response = ApiMessages.RecordCreated() });
        }

        [HttpPut("{id}")]
        public IActionResult PutRoute([FromRoute] int id, [FromBody] Route route) {
            if (id != route.Id) return BadRequest(new { response = ApiMessages.InvalidId() });
            if (!ModelState.IsValid) return BadRequest(new { response = ModelState.Values.SelectMany(x => x.Errors).Select(x => x.ErrorMessage) });
            try {
                repo.Update(route);
            } catch (System.Exception) {
                return NotFound(new { response = ApiMessages.RecordNotFound() });
            }
            return Ok(new { response = ApiMessages.RecordUpdated() });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRoute([FromRoute] int id) {
            Route route = await repo.GetById(id);
            if (route == null) return NotFound(new { response = ApiMessages.RecordNotFound() });
            try {
                repo.Delete(route);
                return Ok(new { response = ApiMessages.RecordDeleted() });
            } catch (DbUpdateException) {
                return BadRequest(new { response = ApiMessages.RecordInUse() });
            }
        }

    }

}