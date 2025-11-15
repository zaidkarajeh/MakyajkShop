using System.ComponentModel.DataAnnotations;

namespace Webnew.Model
{
    public class SignInModel
    {
        [Required]
        public string Username { get; set; }
        [Required]
        public string Password { get; set; }
    }
}
