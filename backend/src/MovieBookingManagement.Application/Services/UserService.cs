using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using MovieBookingManagement.Application.Common.Interfaces;
using MovieBookingManagement.Domain.Entities;

namespace MovieBookingManagement.Application.Services;

public class UserService : IUserService
{
    private readonly IApplicationDbContext _context;

    public UserService(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<User>> GetAllUsersAsync(CancellationToken cancellationToken = default)
    {
        return await _context.Users.ToListAsync(cancellationToken);
    }

    public async Task<User?> GetUserByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.Users.FirstOrDefaultAsync(u => u.Id == id, cancellationToken);
    }

    public async Task<User> CreateUserAsync(User user, CancellationToken cancellationToken = default)
    {
        if (user.Id == Guid.Empty)
        {
            user.Id = Guid.NewGuid();
        }
        _context.Users.Add(user);
        await _context.SaveChangesAsync(cancellationToken);
        return user;
    }

    public async Task<bool> UpdateUserAsync(User user, CancellationToken cancellationToken = default)
    {
        var existing = await _context.Users.FindAsync(new object[] { user.Id }, cancellationToken);
        if (existing == null) return false;

        existing.Name = user.Name;
        existing.Email = user.Email;
        existing.Phone = user.Phone;
        existing.AvatarUrl = user.AvatarUrl;
        existing.Role = user.Role;
        existing.Status = user.Status;
        if (!string.IsNullOrEmpty(user.PasswordHash) && user.PasswordHash != existing.PasswordHash)
        {
            existing.PasswordHash = user.PasswordHash;
        }

        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }

    public async Task<bool> DeleteUserAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var user = await _context.Users.FindAsync(new object[] { id }, cancellationToken);
        if (user == null) return false;

    
        var bookings = _context.Bookings.Where(b => b.UserId == id);
        _context.Bookings.RemoveRange(bookings);

        _context.Users.Remove(user);
        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }

    public async Task<bool> ChangePasswordAsync(Guid userId, string oldPassword, string newPassword, CancellationToken cancellationToken = default)
    {
        var user = await _context.Users.FindAsync(new object[] { userId }, cancellationToken);
        if (user == null) return false;

        var isPasswordValid = BCrypt.Net.BCrypt.Verify(oldPassword, user.PasswordHash);
        if (!isPasswordValid) return false;

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(newPassword);
        _context.Users.Update(user);
        return await _context.SaveChangesAsync(cancellationToken) > 0;
    }
}
