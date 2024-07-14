
using BlogApp_API.GenericRepository;
using BlogApp_API.Models;

namespace BlogApp_API.Repositories;

public interface IRoleRepository : IGenericRepository<Role>
{
    Task<Role?> GetRoleByNameAsync(string roleName);
}