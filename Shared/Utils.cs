using System.Text;
using Transfers.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;

namespace Transfers.Shared
{
	public static class Utils
	{
		public static void AddIdentity(IServiceCollection services)
		{
			services
				.AddIdentity<IdentityUser, IdentityRole>(option =>
						 {
							 option.Password.RequireDigit = false;
							 option.Password.RequiredLength = 6;
							 option.Password.RequireNonAlphanumeric = false;
							 option.Password.RequireUppercase = false;
							 option.Password.RequireLowercase = false;
						 })
				.AddEntityFrameworkStores<Context>()
				.AddDefaultTokenProviders();
		}

		public static void AddAuthentication(IConfiguration configuration, IServiceCollection services)
		{
			var settings = configuration.GetSection("Jwt");

			services
				.AddAuthentication(option =>
				{
					option.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
					option.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
					option.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
				})
				.AddJwtBearer(options =>
				{
					options.SaveToken = true;
					options.RequireHttpsMetadata = true;
					options.TokenValidationParameters = new TokenValidationParameters()
					{
						ValidateIssuer = true,
						ValidateAudience = true,
						ValidAudience = settings.GetValue<string>("Site"),
						ValidIssuer = settings.GetValue<string>("Site"),
						IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(settings.GetValue<string>("SigningKey")))
					};
				});
		}
	}
}