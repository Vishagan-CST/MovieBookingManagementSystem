using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using MovieBookingManagement.Application.Common.Interfaces;
using MovieBookingManagement.Domain.Entities;

namespace MovieBookingManagement.Application.Services;

public class AuthService : IAuthService
{
    private readonly IApplicationDbContext _context;
    private readonly ITokenGenerator _tokenGenerator;

    public AuthService(IApplicationDbContext context, ITokenGenerator tokenGenerator)
    {
        _context = context;
        _tokenGenerator = tokenGenerator;
    }

    public async Task<AuthResponse?> RegisterAsync(RegisterRequest request, CancellationToken cancellationToken = default)
    {
        
        var existingUser = await _context.Users.AnyAsync(u => u.Email == request.Email, cancellationToken);
        if (existingUser) return null;

        var user = new User
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
            Email = request.Email,
            Phone = request.Phone,
            Role = request.Role,
            Status = "Active",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            CreatedAt = DateTime.UtcNow
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync(cancellationToken);

        var token = _tokenGenerator.GenerateToken(user);

        return new AuthResponse
        {
            Token = token,
            User = user
        };
    }

    public async Task<AuthResponse?> LoginAsync(LoginRequest request, CancellationToken cancellationToken = default)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email, cancellationToken);
        if (user == null) return null;

        var isPasswordValid = BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash);
        if (!isPasswordValid) return null;

        var token = _tokenGenerator.GenerateToken(user);

        return new AuthResponse
        {
            Token = token,
            User = user
        };
    }
}
