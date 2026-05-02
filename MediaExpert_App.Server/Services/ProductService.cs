using MediaExpert_App.Server.Data;
using MediaExpert_App.Server.Interfaces;
using MediaExpert_App.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace MediaExpert_App.Server.Services
{
    public class ProductService : IProductService
    {
        private readonly AppDbContext _context;

        public ProductService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Product>> GetAllAsync()
        {
            return await _context.Products.ToListAsync();
        }

        public async Task<Product?> GetByIdAsync(int id)
        {
            return await _context.Products.FindAsync(id);
        }

        public async Task<Product> CreateAsync(Product product)
        {
            _context.Products.Add(product);
            await _context.SaveChangesAsync();
            return product;
        }

        public async Task<bool> UpdateAsync(Product updatedProduct)
        {
            var product = await _context.Products.FindAsync(updatedProduct.Id);
            if (product == null) return false;

            product.Code = updatedProduct.Code;
            product.Name = updatedProduct.Name;
            product.Price = updatedProduct.Price;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return false;

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteRangeAsync(IEnumerable<int> ids)
        {
            // Pobieramy tylko te produkty, których ID znajduje się na liście
            var productsToDelete = await _context.Products
                .Where(p => ids.Contains(p.Id))
                .ToListAsync();

            // Jeśli nie znaleziono żadnego produktu z podanych ID
            if (!productsToDelete.Any())
            {
                return false;
            }

            // Usuwamy całą kolekcję za jednym razem
            _context.Products.RemoveRange(productsToDelete);

            // Zapisujemy zmiany w jednej transakcji
            await _context.SaveChangesAsync();

            return true;
        }


        public async Task<PagedResult<Product>> GetPagedSearchAsync(int pageNumber, int pageSize, string? searchTerm)
        {
            // Tworzymy bazowe zapytanie (IQueryable jeszcze nie pobiera danych)
            var query = _context.Products.AsQueryable();

            // Filtrowanie (jeśli parametr nie jest pusty)
            if (!string.IsNullOrWhiteSpace(searchTerm))
            {
                searchTerm = searchTerm.Trim().ToLower();
                query = query.Where(p =>
                    p.Name.ToLower().Contains(searchTerm) ||
                    p.Code.ToLower().Contains(searchTerm));
            }

            // Liczymy rekordy po przefiltrowaniu
            var totalCount = await query.CountAsync();

            // Pobieramy dane z bazy (Skip i Take)
            var items = await query
                .OrderBy(p => p.Id)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return new PagedResult<Product>
            {
                Items = items,
                TotalCount = totalCount,
                PageNumber = pageNumber,
                PageSize = pageSize
            };
        }
    }
}
