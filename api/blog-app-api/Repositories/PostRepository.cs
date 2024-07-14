using BlogApp_API.Data;
using BlogApp_API.GenericRepository;
using BlogApp_API.Models;
using Microsoft.EntityFrameworkCore;

namespace BlogApp_API.Repositories;

public class PostRepository : GenericRepository<Post>, IPostRepository
{
    private readonly ApplicationDbContext _context;
    private readonly DbSet<Post> _dbSet;

    public PostRepository(ApplicationDbContext context)
        : base(context)
    {
        _context = context;
        _dbSet = _context.Set<Post>();
    }

    public async Task<Post?> GetPostByIdAsync(int Id, string[]? includeProperties = null)
    {
        IQueryable<Post> query = _dbSet;

        if (includeProperties != null)
        {
            foreach (var includeProperty in includeProperties)
            {
                query = query.Include(includeProperty);
            }
        }

        return await query.FirstOrDefaultAsync(p => p.Id == Id);
    }

    public async Task<List<Post>> GetPostsByTagAsync(string tagName)
    {
        var posts = await _dbSet
            .Where(p => p.Tags.Any(t => t.TagName == tagName))
            .Include(p => p.User)
            .Include(p => p.Tags)
            .Include(p => p.Comments)
            .ToListAsync();

        return posts;
    }
}
