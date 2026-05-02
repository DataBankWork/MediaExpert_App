using MediaExpert_App.Server.Models;

namespace MediaExpert_App.Server.Interfaces
{
    public interface IProductService
    {
        Task<IEnumerable<Product>> GetAllAsync();
        Task<Product?> GetByIdAsync(int id);
        Task<Product> CreateAsync(Product product);
        Task<bool> UpdateAsync(Product updatedProduct);
        Task<bool> DeleteAsync(int id);
        Task<bool> DeleteRangeAsync(IEnumerable<int> ids);
        Task<PagedResult<Product>> GetPagedSearchAsync(int pageNumber, int pageSize, string? searchTerm);
    }
}
