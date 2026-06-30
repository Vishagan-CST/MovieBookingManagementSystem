using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using MovieBookingManagement.Application.Common.Interfaces;
using MovieBookingManagement.Domain.Entities;

namespace MovieBookingManagement.Application.Services;

public class NotificationService : INotificationService
{
    private readonly IApplicationDbContext _context;

    public NotificationService(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Notification>> GetAllNotificationsAsync(CancellationToken cancellationToken = default)
    {
        return await _context.Notifications.Include(n => n.User).ToListAsync(cancellationToken);
    }

    public async Task<Notification?> GetNotificationByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.Notifications.Include(n => n.User).FirstOrDefaultAsync(n => n.Id == id, cancellationToken);
    }

    public async Task<Notification> CreateNotificationAsync(Notification notification, CancellationToken cancellationToken = default)
    {
        _context.Notifications.Add(notification);
        await _context.SaveChangesAsync(cancellationToken);
        return notification;
    }

    public async Task<bool> UpdateNotificationAsync(Notification notification, CancellationToken cancellationToken = default)
    {
        _context.Notifications.Update(notification);
        return await _context.SaveChangesAsync(cancellationToken) > 0;
    }

    public async Task<bool> DeleteNotificationAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var notification = await _context.Notifications.FindAsync(new object[] { id }, cancellationToken);
        if (notification == null) return false;

        _context.Notifications.Remove(notification);
        return await _context.SaveChangesAsync(cancellationToken) > 0;
    }
}
