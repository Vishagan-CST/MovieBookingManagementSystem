using System;
using System.Threading;
using System.Threading.Tasks;
using MovieBookingManagement.Domain.Entities;

namespace MovieBookingManagement.Application.Common.Interfaces;

public class RegisterRequest
{
    public string Name { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string Password { get; set; } = null!;
    public string? Phone { get; set; }
    public string Role { get; set; } = "Customer";
}

public class LoginRequest
{
    public string Email { get; set; } = null!;
    public string Password { get; set; } = null!;
}

public class AuthResponse
{
    public string Token { get; set; } = null!;
    public User User { get; set; } = null!;
}

public interface IAuthService
{
    Task<AuthResponse?> RegisterAsync(RegisterRequest request, CancellationToken cancellationToken = default);
    Task<AuthResponse?> LoginAsync(LoginRequest request, CancellationToken cancellationToken = default);
}
