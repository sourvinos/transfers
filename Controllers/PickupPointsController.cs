using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Transfers {

    [Route("api/[controller]")]
    [Authorize(Policy = "RequireLoggedIn")]
    public class PickupPointsController : ControllerBase {

        private readonly IPickupPointRepository repo;

        public PickupPointsController(IPickupPointRepository repo) =>
            (this.repo) = (repo);

        [HttpGet]
        public async Task<IEnumerable<PickupPoint>> Get() {
            return await repo.Get();
        }

        [HttpGet("[action]")]
        public async Task<IEnumerable<PickupPoint>> GetActive() {
            return await repo.GetActive(x => x.IsActive);
        }

        [HttpGet("routeId/{routeId}")]
        public async Task<IEnumerable<PickupPoint>> Get(int routeId) {
            return await repo.GetForRoute(routeId);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetPickupPoint(int id) {
            PickupPoint pickupPoint = await repo.GetById(id);
            if (pickupPoint == null) return NotFound(new { response = ApiMessages.RecordNotFound() });
            return Ok(pickupPoint);
        }

        [HttpPost]
        public IActionResult PostPickupPoint([FromBody] PickupPoint pickupPoint) {
            if (!ModelState.IsValid) return BadRequest(new { response = ModelState.Values.SelectMany(x => x.Errors).Select(x => x.ErrorMessage) });
            repo.Create(pickupPoint);
            return Ok(new { response = ApiMessages.RecordCreated() });
        }

        [HttpPut("{id}")]
        public IActionResult PutPickupPoint([FromRoute] int id, [FromBody] PickupPoint pickupPoint) {
            if (id != pickupPoint.Id) return BadRequest(new { response = ApiMessages.InvalidId() });
            if (!ModelState.IsValid) return BadRequest(new { response = ModelState.Values.SelectMany(x => x.Errors).Select(x => x.ErrorMessage) });
            try {
                repo.Update(pickupPoint);
            } catch (System.Exception) {
                return NotFound(new { response = ApiMessages.RecordNotFound() });
            }
            return Ok(new { response = ApiMessages.RecordUpdated() });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePickupPoint([FromRoute] int id) {
            PickupPoint pickupPoint = await repo.GetById(id);
            if (pickupPoint == null) return NotFound(new { response = ApiMessages.RecordNotFound() });
            try {
                repo.Delete(pickupPoint);
                return Ok(new { response = ApiMessages.RecordDeleted() });
            } catch (DbUpdateException) {
                return BadRequest(new { response = ApiMessages.RecordInUse() });
            }
        }

    }

}