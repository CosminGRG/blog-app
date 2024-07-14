using BlogApp_API.Data;
using BlogApp_API.GenericRepository;
using BlogApp_API.Models;
using BlogApp_API.Repositories;
using BlogApp_API.ViewModels;
using Microsoft.EntityFrameworkCore;

public class CommentRepository : GenericRepository<Comment>, ICommentRepository
{
    private readonly ApplicationDbContext _context;
    private readonly DbSet<Comment> _dbSet;

    public CommentRepository(ApplicationDbContext context)
        : base(context)
    {
        _context = context;
        _dbSet = _context.Set<Comment>();
    }

    public async Task<List<Comment>> GetPartOfPostComments(int postId, int pageNumber, int pageSize)
    {
        var comments = await _dbSet
            .Where(c => c.PostId == postId)
            .Include(p => p.User)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return comments ?? new List<Comment>();
    }

    public async Task<List<Comment>> GetCommentsAssociatedWithPost(int postId)
    {
        var comments = await _dbSet.Where(c => c.PostId == postId).ToListAsync();

        return comments ?? new List<Comment>();
    }
}
