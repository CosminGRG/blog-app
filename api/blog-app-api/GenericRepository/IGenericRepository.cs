
namespace BlogApp_API.GenericRepository;

public interface IGenericRepository<T> where T : class
{
    Task<IEnumerable<T>> GetAllAsync(string[]? relatedEntitis = null);
    Task<T?> GetByIdAsync(object Id);
    Task<List<T>> GetByIdsAsync(List<object> ids);
    Task InsertAsync(T Entity);
    Task UpdateAsync(T Entity);
    Task DeleteAsync(object Id);
    Task SaveAsync();
}