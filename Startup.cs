using AutoMapper;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SpaServices.AngularCli;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Transfers {

    public class Startup {

        public Startup(IConfiguration configuration) {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services) {
            services.AddScoped<Token>();
            Extensions.AddIdentity(services);
            Extensions.AddAuthentication(Configuration, services);
            Extensions.AddAuthorization(services);
            Extensions.AddCors(services);
            services.AddEmailSenders();
            services.AddAntiforgery(options => { options.Cookie.Name = "_af"; options.Cookie.HttpOnly = true; options.Cookie.SecurePolicy = CookieSecurePolicy.Always; options.HeaderName = "X-XSRF-TOKEN"; });
            services.AddAutoMapper();
            services.AddDbContext<ApplicationDbContext>(options => options.UseMySql(Configuration["ConnectionStrings:MySqlServerConnection"]));
            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_1);
            services.AddSpaStaticFiles(configuration => { configuration.RootPath = "ClientApp/dist"; });
            services.Configure<CookiePolicyOptions>(options => { options.CheckConsentNeeded = context => true; options.MinimumSameSitePolicy = SameSiteMode.None; });
        }

        public void Configure(IApplicationBuilder app, IHostingEnvironment env) {
            if (env.IsDevelopment()) { app.UseDeveloperExceptionPage(); } else { app.UseExceptionHandler("/Error"); app.UseHsts(); }

            app.UseAuthentication();
            app.UseHttpsRedirection();
            app.UseSpaStaticFiles();
            app.UseStaticFiles();
            app.UseStatusCodePages();
            app.UseMvc(routes => { routes.MapRoute(name: "default", template: "{controller}/{action=Index}/{id?}"); });
            app.UseSpa(spa => { spa.Options.SourcePath = "ClientApp"; if (env.IsDevelopment()) { spa.UseAngularCliServer(npmScript: "start"); } });
        }

    }

}