
using BlogApp_API.GenericRepository;
using BlogApp_API.Models;

namespace BlogApp_API.Repositories;

public interface IUserRepository : IGenericRepository<User>
{
    Task<bool> UserEmailExistsAsync(string email);
    Task<User?> GetUserByEmailAsync(string email, bool includeRole = false);
}