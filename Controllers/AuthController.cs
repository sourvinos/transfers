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
				await userManager.AddToRoleAsync(user, "Customer");
			}

			return Ok(new { Username = user.UserName });
		}

		[HttpPost]
		[Route("login")]
		public async Task<ActionResult> Login([FromBody] LoginViewModel model)
		{
			IdentityUser user = await userManager.FindByNameAsync(model.Username);

			if (user != null && await userManager.CheckPasswordAsync(user, model.Password))
			{
				Claim[] claims = new Claim[] { new Claim(JwtRegisteredClaimNames.Sub, user.UserName) };
				SymmetricSecurityKey signinKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("Paris Berlin Cairo Sydney Tokyo Beijing Rome London Athens"));
				int expiryInMinutes = Convert.ToInt32("60");
				JwtSecurityToken token = new JwtSecurityToken(
					issuer: "http://www.peoplemovers.io",
					audience: "http://www.peoplemovers.io",
					claims: claims,
					expires: DateTime.UtcNow.AddMinutes(expiryInMinutes),
					signingCredentials: new SigningCredentials(signinKey, SecurityAlgorithms.HmacSha256));

				return Ok(new { token = new JwtSecurityTokenHandler().WriteToken(token), expiration = token.ValidTo });
			}

			return Unauthorized();
		}
	}
}