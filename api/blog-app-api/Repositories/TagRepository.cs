using BlogApp_API.Data;
using BlogApp_API.GenericRepository;
using BlogApp_API.Models;
using Microsoft.EntityFrameworkCore;

namespace BlogApp_API.Repositories;

public class TagRepository : GenericRepository<Tag>, ITagRepository
{
    private readonly ApplicationDbContext _context;
    private readonly DbSet<Tag> _dbSet;

    public TagRepository(ApplicationDbContext context)
        : base(context)
    {
        _context = context;
        _dbSet = _context.Set<Tag>();
    }

    public async Task<List<Tag>> GetByIdsAsync(List<int> ids)
    {
        if (ids == null || !ids.Any())
            return new List<Tag>();

        return await _dbSet.Where(e => ids.Contains(e.Id)).ToListAsync();
    }

    public async Task<List<Tag>> GetTagsWithPostsAsync()
    {
        return await _dbSet.Where(t => t.Posts.Any()).ToListAsync();
    }
}
