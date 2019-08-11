using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using System.Threading.Tasks;
using System;
using Transfers.ViewModels;
using System.Security.Claims;

namespace Transfers.Controllers
{
	public class AuthController : Controller
	{
		private readonly UserManager<IdentityUser> userManager;
		private readonly IConfiguration configuration;

		public AuthController(UserManager<IdentityUser> userManager, IConfiguration configuration)
		{
			this.userManager = userManager;
			this.configuration = configuration;
		}

		[HttpPost]
		[Route("auth/register")]
		public async Task<ActionResult> Register([FromBody] RegisterViewModel model)
		{
			IdentityUser user = new IdentityUser { Email = model.Email, UserName = model.Email, SecurityStamp = Guid.NewGuid().ToString() };
			IdentityResult result = await userManager.CreateAsync(user, model.Password);

			if (result.Succeeded)
			{
				await userManager.AddToRoleAsync(user, "Admin");
			}

			return Ok(new { UserName = user.UserName });
		}

		[HttpPost]
		[Route("login")]
		public async Task<ActionResult> Login([FromBody] LoginViewModel model)
		{
			var settings = configuration.GetSection("Jwt");

			IdentityUser user = await userManager.FindByNameAsync(model.UserName);

			if (user != null && await userManager.CheckPasswordAsync(user, model.Password))
			{
				Claim[] claims = new Claim[] { new Claim(JwtRegisteredClaimNames.Sub, user.UserName) };
				SymmetricSecurityKey signinKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(settings.GetValue<string>("SigningKey")));
				JwtSecurityToken token = new JwtSecurityToken(
					issuer: settings.GetValue<string>("Site"),
					audience: settings.GetValue<string>("Site"),
					claims: claims,
					expires: DateTime.UtcNow.AddMinutes(Convert.ToInt32(settings.GetValue<string>("ExpiryInMinutes"))),
					signingCredentials: new SigningCredentials(signinKey, SecurityAlgorithms.HmacSha256));

				return Ok(new { token = new JwtSecurityTokenHandler().WriteToken(token), expiration = token.ValidTo });
			}

			return Unauthorized();
		}
	}
}