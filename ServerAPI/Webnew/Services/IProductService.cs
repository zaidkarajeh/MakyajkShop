// Interface defining product-related operations (CRUD and search)
using Webnew.Data;
using Webnew.Model;

namespace Webnew.Services
{
    public interface IProductService
    {
        // Get all products with optional search and category filters
        Task<IEnumerable<ProductDTO>> GetAllAsync(string? search = null, string? category = null);

        // Get a single product by its ID
        Task<ProductDTO> GetByIdAsync(int id);

        // Create a new product
        Task<ProductDTO> CreateAsync(ProductDTO dto);

        // Update an existing product by ID
        Task<bool> UpdateAsync(int id, ProductDTO dto);

        // Delete a product by ID
        Task<bool> DeleteAsync(int id);

        // Search products by name or description
        Task<IEnumerable<ProductDTO>> SearchAsync(string query);
    }
}
