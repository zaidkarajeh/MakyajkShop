using System.ComponentModel.DataAnnotations;
using Webnew.Data;

namespace Webnew.Model
{
    public class RoleModel
    {
        public string? Id { get; set; }
        [Required]
        public string Name { get; set; }
        public string? RoleName { get; set; }

    }
}
