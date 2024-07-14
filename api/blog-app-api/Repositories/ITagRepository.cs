using BlogApp_API.GenericRepository;
using BlogApp_API.Models;

namespace BlogApp_API.Repositories;

public interface ITagRepository : IGenericRepository<Tag>
{
    Task<List<Tag>> GetByIdsAsync(List<int> ids);
    Task<List<Tag>> GetTagsWithPostsAsync();
}
