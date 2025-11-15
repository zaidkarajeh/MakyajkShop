using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Webnew.Data
{
    public class ShopContext : IdentityDbContext<ApplicationUser>
    {
        IConfiguration configuration;
        public ShopContext(IConfiguration _configuration)
        {
            configuration = _configuration;

        }


        public DbSet<Product> Products { get; set; }


        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer(configuration.GetConnectionString("CoffecConn"));
            base.OnConfiguring(optionsBuilder);
        }

    }
}

