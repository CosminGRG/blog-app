using BlogApp_API.GenericRepository;
using BlogApp_API.Models;

namespace BlogApp_API.Repositories;

public interface ICommentRepository : IGenericRepository<Comment>
{
    Task<List<Comment>> GetPartOfPostComments(int id, int pageNumber, int pageSize);
    Task<List<Comment>> GetCommentsAssociatedWithPost(int postId);
}
