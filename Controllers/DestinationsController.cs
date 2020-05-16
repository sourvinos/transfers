using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Transfers {

    [Route("api/[controller]")]
    [Authorize(Policy = "RequireLoggedIn")]
    public class DestinationsController : ControllerBase {

        private readonly IDestinationRepository repo;

        public DestinationsController(IDestinationRepository repo) =>
            (this.repo) = (repo);

        [HttpGet]
        public async Task<IEnumerable<Destination>> Get() =>
            await repo.Get();

        [HttpGet("[action]")]
        public async Task<IEnumerable<Destination>> GetActive() =>
            await repo.GetActive(x => x.IsActive);

        [HttpGet("{id}")]
        public async Task<IActionResult> GetDestination(int id) {
            Destination Destination = await repo.GetById(id);
            if (Destination == null) return NotFound(new { response = ApiMessages.RecordNotFound() });
            return Ok(Destination);
        }

        [HttpPost]
        public IActionResult PostDestination([FromBody] Destination Destination) {
            if (!ModelState.IsValid) return BadRequest(new { response = ModelState.Values.SelectMany(x => x.Errors).Select(x => x.ErrorMessage) });
            repo.Create(Destination);
            return Ok(new { response = ApiMessages.RecordCreated() });
        }

        [HttpPut("{id}")]
        public IActionResult PutDestination([FromRoute] int id, [FromBody] Destination Destination) {
            if (id != Destination.Id) return BadRequest(new { response = ApiMessages.InvalidId() });
            if (!ModelState.IsValid) return BadRequest(new { response = ModelState.Values.SelectMany(x => x.Errors).Select(x => x.ErrorMessage) });
            try {
                repo.Update(Destination);
            } catch (System.Exception) {
                return NotFound(new { response = ApiMessages.RecordNotFound() });
            }
            return Ok(new { response = ApiMessages.RecordUpdated() });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDestination([FromRoute] int id) {
            Destination Destination = await repo.GetById(id);
            if (Destination == null) return NotFound(new { response = ApiMessages.RecordNotFound() });
            try {
                repo.Delete(Destination);
                return Ok(new { response = ApiMessages.RecordDeleted() });
            } catch (DbUpdateException) {
                return BadRequest(new { response = ApiMessages.RecordInUse() });
            }
        }

    }

}