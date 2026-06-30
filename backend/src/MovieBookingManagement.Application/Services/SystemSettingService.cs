using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using MovieBookingManagement.Application.Common.Interfaces;
using MovieBookingManagement.Domain.Entities;

namespace MovieBookingManagement.Application.Services;

public class SystemSettingService : ISystemSettingService
{
    private readonly IApplicationDbContext _context;

    public SystemSettingService(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<SystemSetting> GetSystemSettingAsync(CancellationToken cancellationToken = default)
    {
        var setting = await _context.SystemSettings.FirstOrDefaultAsync(cancellationToken);
        if (setting == null)
        {
            var defaultSetting = new SystemSetting
            {
                Id = Guid.Parse("f94a2b6e-4e78-43d9-a78b-ea32cf025178"),
                BookingTimeout = 10,
                TaxRate = 8m,
                CancellationNoticeHours = 2,
                CreatedAt = DateTime.UtcNow
            };

            _context.SystemSettings.Add(defaultSetting);
            await _context.SaveChangesAsync(cancellationToken);
            return defaultSetting;
        }

        return setting;
    }

    public async Task<bool> UpdateSystemSettingAsync(SystemSetting setting, CancellationToken cancellationToken = default)
    {
        var existing = await _context.SystemSettings.FirstOrDefaultAsync(cancellationToken);
        if (existing == null)
        {
            setting.Id = Guid.Parse("f94a2b6e-4e78-43d9-a78b-ea32cf025178");
            _context.SystemSettings.Add(setting);
        }
        else
        {
            existing.BookingTimeout = setting.BookingTimeout;
            existing.TaxRate = setting.TaxRate;
            existing.CancellationNoticeHours = setting.CancellationNoticeHours;
            existing.LastModifiedAt = DateTime.UtcNow;
        }

        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}
