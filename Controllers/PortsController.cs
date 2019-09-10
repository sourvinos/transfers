using AutoMapper;
using DinkToPdf;
using DinkToPdf.Contracts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RazorLight;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using Transfers.Models;
using Transfers.Utils;

namespace Transfers.Controllers
{
    [Route("api/[controller]")]
    // [Authorize(Policy = "RequireLoggedIn")]
    public class PortsController : ControllerBase
    {
        // Variables
        private readonly IMapper mapper;
        private readonly ApplicationDbContext context;
        private readonly IConverter converter;
        private readonly IRazorLightEngine razorEngine;

        // Constructor
        public PortsController(IMapper mapper, ApplicationDbContext context, IConverter converter, IRazorLightEngine razorEngine)
        {
            this.mapper = mapper;
            this.context = context;
            this.converter = converter;
            this.razorEngine = razorEngine;
        }

        // GET: api/ports
        [HttpGet]
        public async Task<IEnumerable<Port>> Get()
        {
            return await context.Ports.OrderBy(o => o.Description).AsNoTracking().ToListAsync();
        }

        // GET: api/ports/5
        // [HttpGet("{id}")]
        // public async Task<IActionResult> GetPort(int id)
        // {
        //     Port port = await context.Ports.SingleOrDefaultAsync(m => m.Id == id);
        //     if (port == null) return NotFound();
        //     return Ok(port);
        // }

        // POST: api/ports
        [HttpPost]
        public async Task<IActionResult> PostPort([FromBody] Port port)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            context.Ports.Add(port);

            await context.SaveChangesAsync();

            return Ok(port);
        }

        // PUT: api/ports/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPort([FromRoute] int id, [FromBody] Port port)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            if (id != port.Id) return BadRequest();

            context.Entry(port).State = EntityState.Modified;

            try
            {
                await context.SaveChangesAsync();
            }

            catch (DbUpdateConcurrencyException)
            {
                port = await context.Ports.SingleOrDefaultAsync(m => m.Id == id);

                if (port == null) return NotFound(); else throw;
            }

            return Ok(port);
        }

        // DELETE: api/ports/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePort([FromRoute] int id)
        {
            Port port = await context.Ports.SingleOrDefaultAsync(m => m.Id == id);

            if (port == null) { return NotFound(); }

            context.Ports.Remove(port);

            await context.SaveChangesAsync();

            return NoContent();
        }

        // GET: api/ports/pdf
        [HttpGet("pdf")]
        public IActionResult CreatePDF()
        // public async Task<byte[]> CreatePDF()
        {
            var customers = new List<Customer>();

            customers.Add(new Customer { Id = 1, Description = "ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ" });
            customers.Add(new Customer { Id = 2, Description = "what" });

            // var model = Data.CarRepository.GetCars();
            // var templatePath = Path.Combine(Path.GetDirectoryName(Assembly.GetEntryAssembly().Location), $"Templates/PDFTemplate.cshtml");
            // string template = await razorEngine.CompileRenderAsync(templatePath, customers);

            var globalSettings = new GlobalSettings
            {
                ColorMode = ColorMode.Color,
                Orientation = Orientation.Portrait,
                PaperSize = PaperKind.A4,
                Margins = new MarginSettings { Top = 10, Bottom = 30 },
                DocumentTitle = "PDF Report"
            };

            var objectSettings = new ObjectSettings
            {
                PagesCount = true,
                // HtmlContent = template,
                HtmlContent = TemplateGenerator.GetHTMLString(),
                WebSettings = { DefaultEncoding = "utf-8" },
            };

            var pdf = new HtmlToPdfDocument()
            {
                GlobalSettings = globalSettings,
                Objects = { objectSettings }
            };

            // byte[] file = converter.Convert(pdf);

            // return file;
            var file = converter.Convert(pdf);

            return File(file, "application/pdf");
        }
    }
}