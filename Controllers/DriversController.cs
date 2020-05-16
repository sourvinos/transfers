using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Transfers {

    [Route("api/[controller]")]
    [Authorize(Policy = "RequireLoggedIn")]
    public class DriversController : ControllerBase {

        private readonly IDriverRepository repo;

        public DriversController(IDriverRepository repo) =>
            (this.repo) = (repo);

        [HttpGet]
        public async Task<IEnumerable<Driver>> Get() =>
            await repo.Get();

        [HttpGet("[action]")]
        public async Task<IEnumerable<Driver>> GetActive() =>
            await repo.GetActive(x => x.IsActive);

        [HttpGet("{id}")]
        public async Task<IActionResult> GetDriver(int id) {
            Driver driver = await repo.GetById(id);
            if (driver == null) return NotFound(new { response = ApiMessages.RecordNotFound() });
            return Ok(driver);
        }

        [HttpGet("defaultDriver")]
        public async Task<IActionResult> GetDefaultDriver() {
            Driver driver = await repo.GetDefaultDriver();
            if (driver == null) return NotFound(new { response = ApiMessages.RecordNotFound() });
            return Ok(driver);
        }

        [HttpPost]
        public async Task<IActionResult> PostDriver([FromBody] Driver Driver) {
            if (!ModelState.IsValid) return BadRequest(new { response = ModelState.Values.SelectMany(x => x.Errors).Select(x => x.ErrorMessage) });
            var defaultDriver = await repo.CheckDefaultDriverExists(null, Driver);
            if (defaultDriver != null) { return BadRequest(new { response = ApiMessages.DefaultDriverAlreadyExists(defaultDriver) }); };
            repo.Create(Driver);
            return Ok(new { response = ApiMessages.RecordCreated() });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutDriver([FromRoute] int id, [FromBody] Driver Driver) {
            if (id != Driver.Id) return BadRequest(new { response = ApiMessages.InvalidId() });
            var defaultDriver = await repo.CheckDefaultDriverExists(null, Driver);
            if (defaultDriver != null) { return BadRequest(new { response = ApiMessages.DefaultDriverAlreadyExists(defaultDriver) }); };
            if (!ModelState.IsValid) return BadRequest(new { response = ModelState.Values.SelectMany(x => x.Errors).Select(x => x.ErrorMessage) });
            try {
                repo.Update(Driver);
            } catch (System.Exception) {
                return NotFound(new { response = ApiMessages.RecordNotFound() });
            }
            return Ok(new { response = ApiMessages.RecordUpdated() });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDriver([FromRoute] int id) {
            Driver Driver = await repo.GetById(id);
            if (Driver == null) return NotFound(new { response = ApiMessages.RecordNotFound() });
            try {
                repo.Delete(Driver);
                return Ok(new { response = ApiMessages.RecordDeleted() });
            } catch (DbUpdateException) {
                return BadRequest(new { response = ApiMessages.RecordInUse() });
            }
        }

    }

}