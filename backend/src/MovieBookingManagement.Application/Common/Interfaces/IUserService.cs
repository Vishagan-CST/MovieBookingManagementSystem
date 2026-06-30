using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using MovieBookingManagement.Domain.Entities;

namespace MovieBookingManagement.Application.Common.Interfaces;

public interface IUserService
{
    Task<IEnumerable<User>> GetAllUsersAsync(CancellationToken cancellationToken = default);
    Task<User?> GetUserByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<User> CreateUserAsync(User user, CancellationToken cancellationToken = default);
    Task<bool> UpdateUserAsync(User user, CancellationToken cancellationToken = default);
    Task<bool> DeleteUserAsync(Guid id, CancellationToken cancellationToken = default);
    Task<bool> ChangePasswordAsync(Guid userId, string oldPassword, string newPassword, CancellationToken cancellationToken = default);
}
