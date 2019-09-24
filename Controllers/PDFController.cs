using AutoMapper;
using DinkToPdf;
using DinkToPdf.Contracts;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RazorLight;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using Transfers.Models;

namespace Transfers.Controllers
{
    public class PDFController : ControllerBase
    {
        // Variables
        private readonly ApplicationDbContext context;
        private readonly IConverter converter;
        private readonly IRazorLightEngine razorEngine;

        // Constructor
        public PDFController(IMapper mapper, ApplicationDbContext context, IConverter converter, IRazorLightEngine razorEngine)
        {
            this.context = context;
            this.converter = converter;
            this.razorEngine = razorEngine;
        }

        // GET: pdf/create
        [HttpGet]
        public async Task<IActionResult> Create()
        {
            List<Port> ports = context.Ports.OrderBy(o => o.Description).AsNoTracking().ToList();

            string templatePath = Path.Combine(Path.GetDirectoryName(Assembly.GetEntryAssembly().Location), $"Templates/Ports.cshtml");
            string template = await razorEngine.CompileRenderAsync(templatePath, ports);

            var globalSettings = new GlobalSettings
            {
                ColorMode = ColorMode.Color,
                Orientation = Orientation.Landscape,
                PaperSize = PaperKind.A5,
                Margins = new MarginSettings { Top = 10, Bottom = 10 },
                DocumentTitle ="PDF Report"
            };

            var objectSettings = new ObjectSettings
            {
                PagesCount = true,
                HtmlContent = template,
                WebSettings = { DefaultEncoding ="utf-8" },
            };

            var pdf = new HtmlToPdfDocument()
            {
                GlobalSettings = globalSettings,
                Objects = { objectSettings }
            };

            byte[] file = converter.Convert(pdf);

            return File(file,"application/pdf");
        }
    }
}