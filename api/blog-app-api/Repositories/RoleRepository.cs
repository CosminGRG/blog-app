
using BlogApp_API.Data;
using BlogApp_API.GenericRepository;
using BlogApp_API.Models;
using Microsoft.EntityFrameworkCore;

namespace BlogApp_API.Repositories;

public class RoleRepository : GenericRepository<Role>, IRoleRepository
{
    private readonly ApplicationDbContext _context;

    public RoleRepository(ApplicationDbContext context) : base(context)
    {
        _context = context;
    }

    public async Task<Role?> GetRoleByNameAsync(string roleName)
    {
        return await _context.Set<Role>().FirstOrDefaultAsync(r => r.RoleName == roleName);
    }
}