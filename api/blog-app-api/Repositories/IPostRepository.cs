using BlogApp_API.GenericRepository;
using BlogApp_API.Models;

namespace BlogApp_API.Repositories;

public interface IPostRepository : IGenericRepository<Post>
{
    Task<Post?> GetPostByIdAsync(int Id, string[]? includeProperties = null);
    Task<List<Post>> GetPostsByTagAsync(string tagName);
}
