
using BlogApp_API.Data;
using BlogApp_API.GenericRepository;
using BlogApp_API.Models;
using Microsoft.EntityFrameworkCore;

namespace BlogApp_API.Repositories;

public class UserRepository : GenericRepository<User>, IUserRepository
{
    private readonly ApplicationDbContext _context;

    public UserRepository(ApplicationDbContext context) : base(context)
    {
        _context = context;
    }

    public async Task<bool> UserEmailExistsAsync(string email)
    {
        return await _context.Set<User>().AnyAsync(u => u.Email == email);
    }

    public async Task<User?> GetUserByEmailAsync(string email, bool includeRole = false)
    {
        IQueryable<User> query = _context.Set<User>().Where(u => u.Email == email);

        if (includeRole)
        {
            query = query.Include(u => u.Role);
        }

        var user = await query.FirstOrDefaultAsync();
        return user;
    }
}