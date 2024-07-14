using BlogApp_API.GenericRepository;
using BlogApp_API.Models;

namespace BlogApp_API.RoleSeeder;

public class RoleSeeder
{
    private readonly IGenericRepository<Role> repo;
    private readonly IConfiguration configuration;

    public RoleSeeder(IGenericRepository<Role> _repo, IConfiguration _configuration)
    {
        repo = _repo;
        configuration = _configuration;
    }

    public async Task SeedRoleAsync()
    {
        var roles = configuration.GetSection("Roles").Get<string[]>();

        var dbRoles = await repo.GetAllAsync();
        foreach (var roleName in roles!)
        {
            if (!dbRoles.Any(r => r.RoleName == roleName))
            {
                Role newRole = new Role { RoleName = roleName };
                await repo.InsertAsync(newRole);
                await repo.SaveAsync();
            }
        }
    }
}
