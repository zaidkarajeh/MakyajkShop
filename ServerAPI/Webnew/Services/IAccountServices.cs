using Microsoft.AspNetCore.Identity;
using System.Security.Claims;
using Webnew.Data;
using Webnew.Model;

namespace Webnew.Services
{
    public interface IAccountServices
    {
        // Create a new user account
        Task<IdentityResult> CreateAccount(SignUpDTO User);

        // Sign in a user
        Task<SignInResult> SigIn(SignInModel signInModel);

        // Add a new role to the system
        Task<IdentityResult> AddRole(RoleModel roleModel);

        // Retrieve all roles
        Task<List<RoleModel>> GetRoles();

        // Logout the current user
        Task Logout();

        // Get user information by username
        Task<ApplicationUser> getUserInfo(string username);

        // Get the roles assigned to a specific user
        List<string> getUserRole(ApplicationUser user);
    }
}
