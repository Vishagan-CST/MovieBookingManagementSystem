using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using MovieBookingManagement.Domain.Entities;

namespace MovieBookingManagement.Application.Common.Interfaces;

public interface INotificationService
{
    Task<IEnumerable<Notification>> GetAllNotificationsAsync(CancellationToken cancellationToken = default);
    Task<Notification?> GetNotificationByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<Notification> CreateNotificationAsync(Notification notification, CancellationToken cancellationToken = default);
    Task<bool> UpdateNotificationAsync(Notification notification, CancellationToken cancellationToken = default);
    Task<bool> DeleteNotificationAsync(Guid id, CancellationToken cancellationToken = default);
}
