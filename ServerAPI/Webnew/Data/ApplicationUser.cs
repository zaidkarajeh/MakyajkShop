using Microsoft.AspNetCore.Identity;

namespace Webnew.Data
{
    public class ApplicationUser : IdentityUser
    {
        public string Name { get; set; }

        public DateTime DOB { get; set; }
    }
}
