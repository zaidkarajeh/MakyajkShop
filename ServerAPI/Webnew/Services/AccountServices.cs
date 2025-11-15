using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Threading.Tasks;
using Webnew.Data;
using Webnew.Model;

namespace Webnew.Services
{
    public class AccountServices : IAccountServices
    {
        private readonly UserManager<ApplicationUser> userManager;
        private readonly SignInManager<ApplicationUser> signInManager;
        private readonly RoleManager<IdentityRole> roleManager;

        public AccountServices(UserManager<ApplicationUser> _userManager, SignInManager<ApplicationUser> _signInManager, RoleManager<IdentityRole> _roleManager)
        {
            userManager = _userManager;
            signInManager = _signInManager;
            roleManager = _roleManager;
        }

        // Create a new user and assign role (Admin or User)
        public async Task<IdentityResult> CreateAccount(SignUpDTO User)
        {
            ApplicationUser newUser = new ApplicationUser
            {
                UserName = User.Email,
                Email = User.Email,
                Name = User.Name,
                DOB = User.DOB
            };

            string assignedRole = "User";
            List<string> adminEmails = new List<string> { "Zaid@gmail.com", "otheradmin@gmail.com" };
            if (adminEmails.Contains(User.Email))
                assignedRole = "Admin";

            var result = await userManager.CreateAsync(newUser, User.Password);

            if (result.Succeeded)
            {
                var roleResult = await userManager.AddToRoleAsync(newUser, assignedRole);
                if (!roleResult.Succeeded)
                    await userManager.DeleteAsync(newUser); // rollback if role assignment fails
            }

            return result;
        }

        // Sign in a user with username and password
        public async Task<SignInResult> SigIn(SignInModel signInModel)
        {
            return await signInManager.PasswordSignInAsync(signInModel.Username, signInModel.Password, false, false);
        }

        // Add a new role to the system
        public async Task<IdentityResult> AddRole(RoleModel roleModel)
        {
            var role = new IdentityRole { Name = roleModel.Name };
            return await roleManager.CreateAsync(role);
        }

        // Retrieve all roles
        public async Task<List<RoleModel>> GetRoles()
        {
            var allRoles = await roleManager.Roles.ToListAsync();
            var roles = allRoles.Select(r => new RoleModel { Id = r.Id, Name = r.Name }).ToList();
            return roles;
        }

        // Logout the current user
        public async Task Logout()
        {
            await signInManager.SignOutAsync();
        }

        // Get user info by username
        public async Task<ApplicationUser> getUserInfo(string username)
        {
            return await userManager.FindByNameAsync(username);
        }

        // Get all roles assigned to a specific user
        public List<string> getUserRole(ApplicationUser user)
        {
            return userManager.GetRolesAsync(user).Result.ToList();
        }
    }
}
