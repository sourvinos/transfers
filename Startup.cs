using AutoMapper;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SpaServices.AngularCli;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Transfers.Models;
using Transfers.Shared;

namespace Transfers
{
	public class Startup
	{
		public Startup(IConfiguration configuration)
		{
			Configuration = configuration;
		}

		public IConfiguration Configuration { get; }

		public void ConfigureServices(IServiceCollection services)
		{
			Utils.AddIdentity(services);
			Utils.AddAuthentication(Configuration, services);

			services.Configure<CookiePolicyOptions>(options => { options.CheckConsentNeeded = context => true; options.MinimumSameSitePolicy = SameSiteMode.None; });
			services.AddAutoMapper();
			services.AddDbContext<Context>(options => options.UseSqlServer(Configuration["ConnectionStrings:SqlServerConnection"]));
			services.AddMvc(options => { options.SslPort = 44322; options.Filters.Add(new RequireHttpsAttribute()); });
			services.AddAntiforgery(options => { options.Cookie.Name = "_af"; options.Cookie.HttpOnly = true; options.Cookie.SecurePolicy = CookieSecurePolicy.Always; options.HeaderName = "X-XSRF-TOKEN"; });
			services.AddSpaStaticFiles(configuration => { configuration.RootPath = "ClientApp/dist"; });
		}

		public void Configure(IApplicationBuilder app, IHostingEnvironment env)
		{
			if (env.IsDevelopment()) { app.UseDeveloperExceptionPage(); } else { app.UseExceptionHandler("/Error"); app.UseHsts(); }

			app.UseAuthentication();
			app.UseHttpsRedirection();
			app.UseStaticFiles();
			app.UseSpaStaticFiles();
			app.UseMvc(routes => { routes.MapRoute(name: "default", template: "{controller}/{action=Index}/{id?}"); });
			app.UseSpa(spa => { spa.Options.SourcePath = "ClientApp"; if (env.IsDevelopment()) { spa.UseAngularCliServer(npmScript: "start"); } });
		}
	}
}
