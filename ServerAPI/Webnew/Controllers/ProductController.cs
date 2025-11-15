using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Webnew.Data;
using Webnew.Model;
using Webnew.Services;

namespace Webnew.Controllers
{
    [Route("api/[controller]")]
    [ApiController]

    public class ProductController : ControllerBase
    {
        private readonly IProductService productService;
        private readonly IMapper mapper;

        public ProductController(IProductService productService, IMapper _mapper)
        {
            this.productService = productService;
            mapper = _mapper;
        }

        // ======================
        // GET ALL PRODUCTS
        // ======================
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductDTO>>> GetProducts(
             [FromQuery] string? search,
             [FromQuery] string? category)
        {
            var products = await productService.GetAllAsync(search, category);
            return Ok(products);
        }



        // ======================
        // GET PRODUCT BY ID
        // ======================
        [HttpGet("{id}")]
        public async Task<ActionResult<ProductDTO>> GetProduct(int id)
        {
            var product = await productService.GetByIdAsync(id);
            if (product == null) return NotFound();
            return Ok(product);
        }

        // ======================
        // CREATE PRODUCT
        // ======================
        [HttpPost]

        public async Task<ActionResult<ProductDTO>> CreateProduct(ProductDTO dto)
        {
            var createdProduct = await productService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetProduct), new { id = createdProduct.Id }, createdProduct);
        }

        // ======================
        // UPDATE PRODUCT
        // ======================
        [HttpPut("{id}")]

        public async Task<IActionResult> UpdateProduct(int id, ProductDTO dto)
        {
            var updated = await productService.UpdateAsync(id, dto);
            if (!updated) return NotFound();
            return NoContent();
        }

        // ======================
        // DELETE PRODUCT
        // ======================
        [HttpDelete("{id}")]

        public async Task<IActionResult> DeleteProduct(int id)
        {
            var deleted = await productService.DeleteAsync(id);
            if (!deleted) return NotFound();
            return NoContent();
        }

        // ======================
        // upload PRODUCT
        // ======================
        [HttpPost("upload")]

        public async Task<IActionResult> UploadImages(List<IFormFile> files)
        {
            if (files == null || files.Count == 0)
                return BadRequest("No files uploaded.");

            var fileNames = new List<string>();
            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/images");

            if (!Directory.Exists(uploadsFolder))
                Directory.CreateDirectory(uploadsFolder);

            foreach (var file in files)
            {
                var filePath = Path.Combine(uploadsFolder, file.FileName);
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }
                fileNames.Add(file.FileName);
            }

            return Ok(new { fileNames });
        }
        // ======================
        // SEARCH PRODUCTS (BY NAME OR DESCRIPTION)
        // ======================
        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<ProductDTO>>> SearchProducts([FromQuery] string query)
        {
            if (string.IsNullOrWhiteSpace(query))
                return BadRequest("Search query is required.");

            var products = await productService.SearchAsync(query);

            return Ok(products);
        }





    }
}



