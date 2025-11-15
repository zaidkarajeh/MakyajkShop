using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Webnew.Model;
using Webnew.Services;

namespace Webnew.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly IAccountServices accountServices;
        private readonly IConfiguration configuration;

        public AccountController(IAccountServices _accountServices, IConfiguration _configuration)
        {
            accountServices = _accountServices;
            configuration = _configuration;
        }

        [HttpPost]
        [Route("AddRole")]
        public async Task AddRole(RoleModel role)
        {
            await accountServices.AddRole(role);
        }

        [HttpGet]
        [Route("loadAllRoles")]
        public async Task<List<RoleModel>> loadAllRoles()
        {
            return await accountServices.GetRoles();
        }

        [HttpPost]
        [Route("CreateAccount")]
        public async Task<IActionResult> CreateAccount([FromBody] SignUpDTO signUpDTO)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await accountServices.CreateAccount(signUpDTO);

            if (result.Succeeded)
                return Ok();

            return BadRequest(result.Errors);
        }

        [HttpPost]
        [Route("login")]
        public async Task<IActionResult> login(SignInModel signIn)
        {
            var result = await accountServices.SigIn(signIn);
            if (!result.Succeeded)
                return Unauthorized();

            List<Claim> authClaim = new List<Claim>
            {
                new Claim(ClaimTypes.Name, signIn.Username),
                new Claim("unigueValue", Guid.NewGuid().ToString())
            };

            var user = await accountServices.getUserInfo(signIn.Username);
            List<string> roles = accountServices.getUserRole(user);

            authClaim.AddRange(roles.Select(r => new Claim(ClaimTypes.Role, r)));

            var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["JWT:Secret"]));
            var token = new JwtSecurityToken(
                issuer: configuration["JWT:ValidIssuer"],
                audience: configuration["JWT:ValidAudience"],
                expires: DateTime.Now.AddDays(15),
                claims: authClaim,
                signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
            );

            return Ok(new { token = new JwtSecurityTokenHandler().WriteToken(token) });
        }
    }
}
