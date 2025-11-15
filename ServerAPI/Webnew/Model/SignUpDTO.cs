using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Webnew.Model
{
    public class SignUpDTO
    {
        public string Name { get; set; }
        [Required]
        [Column(TypeName = "date")]
        public DateTime DOB { get; set; }
        [EmailAddress]
        [Required]

        public string Email { get; set; }
        [Required]
        public string Password { get; set; }
        public string? RoleName { get; set; }



    }
}
