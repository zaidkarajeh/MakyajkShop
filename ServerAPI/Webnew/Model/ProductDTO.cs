using AutoMapper;
using System.ComponentModel.DataAnnotations;
using Webnew.Data;

namespace Webnew.Model
{
    [AutoMap(typeof(Product), ReverseMap = true)]

    public class ProductDTO
    {
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public string Description { get; set; }
        [Required]
        public decimal Price { get; set; }
       
        [Required]
        public string Category { get; set; }
        [Required]
        public int Stock { get; set; }
        public List<string> ImageUrls { get; set; } = new List<string>();


    }
}
