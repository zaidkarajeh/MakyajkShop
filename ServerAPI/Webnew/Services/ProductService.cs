using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Webnew.Data;
using Webnew.Model;

namespace Webnew.Services
{
    public class ProductService : IProductService
    {
        private readonly ShopContext context;
        private readonly IMapper mapper;
        private readonly string baseUrl = "https://localhost:44333/images/"; 

        public ProductService(ShopContext _context, IMapper _mapper)

        {
            context = _context;
            mapper = _mapper;
        }
        // ======================
        // GET ALL PRODUCTS
        // ======================
        public async Task<IEnumerable<ProductDTO>> GetAllAsync(string? search = null, string? category = null)
        {
            var query = context.Products
                .Include(p => p.Images)
                .AsQueryable();

            // فلترة الفئة
            if (!string.IsNullOrEmpty(category))
                query = query.Where(p => p.Category.Contains(category));

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(p =>
                    p.Name.Contains(search) ||
                    p.Description.Contains(search) ||
                    p.Category.Contains(search)
                );
            }

            var products = await query.ToListAsync();

            return products.Select(p => new ProductDTO
            {
                Id = p.Id,
                Name = p.Name,
                Description = p.Description,
                Category = p.Category,
                Stock = p.Stock,
                Price = p.Price,
                ImageUrls = p.Images.Select(img => baseUrl + img.ImageUrl).ToList()
            }).ToList();
        }


        // ======================
        // GET PRODUCT BY ID
        // ======================
        public async Task<ProductDTO> GetByIdAsync(int id)
        {
            var product = await context.Products
                .Include(p => p.Images)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (product == null) return null;

            var dto = mapper.Map<ProductDTO>(product);
            dto.ImageUrls = product.Images.Select(img => baseUrl + img.ImageUrl).ToList();
            return dto;
        }

      
        // ======================
        // CREATE PRODUCT
        // ======================
        public async Task<ProductDTO> CreateAsync(ProductDTO dto)
        {
            var product = mapper.Map<Product>(dto);

            if (dto.ImageUrls != null && dto.ImageUrls.Count > 0)
            {
                product.Images = dto.ImageUrls
                    .Select(url => new ProductImage { ImageUrl = url })
                    .ToList();
            }

            context.Products.Add(product);
            await context.SaveChangesAsync();

            return mapper.Map<ProductDTO>(product);
        }

        // ======================
        // UPDATE PRODUCT
        // ======================
        public async Task<bool> UpdateAsync(int id, ProductDTO dto)
        {
            var product = await context.Products
                .Include(p => p.Images)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (product == null) return false;

            mapper.Map(dto, product);

            var imagesToRemove = product.Images
                .Where(img => !dto.ImageUrls.Contains(img.ImageUrl))
                .ToList();

            context.RemoveRange(imagesToRemove);

            var newImages = dto.ImageUrls
                .Where(url => !product.Images.Any(img => img.ImageUrl == url))
                .Select(url => new ProductImage { ImageUrl = url, ProductId = id })
                .ToList();

            product.Images.AddRange(newImages);

            await context.SaveChangesAsync();
            return true;
        }


        // ======================
        // DELETE PRODUCT
        // ======================
        public async Task<bool> DeleteAsync(int id)
        {
            var product = await context.Products.FindAsync(id);
            if (product == null) return false;

            context.Products.Remove(product);
            await context.SaveChangesAsync();
            return true;
        }

        // ======================
        // SEARCH PRODUCTS (BY NAME OR DESCRIPTION)
        // ======================
        public async Task<IEnumerable<ProductDTO>> SearchAsync(string query)
        {
            var q = query.ToLower();

            var products = await context.Products
                .Include(p => p.Images)
                .Where(p =>
                    p.Name.ToLower().Contains(q) ||
                    p.Description.ToLower().Contains(q))
                .ToListAsync();

            return products.Select(p => new ProductDTO
            {
                Id = p.Id,
                Name = p.Name,
                Description = p.Description,
                Category = p.Category,
                Stock = p.Stock,
                Price = p.Price,
                ImageUrls = p.Images.Select(img => img.ImageUrl).ToList()
            }).ToList();
        }



    }

}
