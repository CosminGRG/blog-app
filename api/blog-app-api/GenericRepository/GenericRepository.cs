
using BlogApp_API.Models;
using BlogApp_API.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;

namespace BlogApp_API.GenericRepository;

public class GenericRepository<T> : IGenericRepository<T> where T : class
{
    private readonly ApplicationDbContext _context;
    private readonly DbSet<T> _dbSet;

    public GenericRepository(ApplicationDbContext context)
    {
        _context = context;
        _dbSet = _context.Set<T>();
    }

    public async Task<IEnumerable<T>> GetAllAsync(string[]? relatedEntitis = null)
    {
        IQueryable<T> query = _dbSet;

        if (relatedEntitis != null)
        {
            foreach (var entity in relatedEntitis)
            {
                query = query.Include(entity);
            }
        }

        return await query.ToListAsync();
    }

    public async Task<T?> GetByIdAsync(object Id)
    {
        return await _dbSet.FindAsync(Id);
    }

    public async Task<List<T>> GetByIdsAsync(List<object> ids)
    {
        if (ids == null || !ids.Any()) return new List<T>();
        
        throw new NotImplementedException();
        //Reflection bullshit that upsets EF Core because it can't translate it.
        //return await _dbSet.Where(i => ids.Contains(typeof(T).GetProperty("Id").GetValue(i))).ToListAsync();
    }

    public async Task InsertAsync(T Entity)
    {
        if (Entity != null)
        {
            await _dbSet.AddAsync(Entity);
        }
    }

    public async Task UpdateAsync(T Entity)
    {
        if (Entity != null)
        {
            _dbSet.Update(Entity);
            await SaveAsync();
        }
    }

    public async Task DeleteAsync(object Id)
    {
        var entity = await _dbSet.FindAsync(Id);
        if (entity != null)
        {
            _dbSet.Remove(entity);
        }
    }

    public async Task SaveAsync()
    {
        await _context.SaveChangesAsync();
    }
}