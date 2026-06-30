using System.Threading;
using System.Threading.Tasks;
using MovieBookingManagement.Domain.Entities;

namespace MovieBookingManagement.Application.Common.Interfaces;

public interface ISystemSettingService
{
    Task<SystemSetting> GetSystemSettingAsync(CancellationToken cancellationToken = default);
    Task<bool> UpdateSystemSettingAsync(SystemSetting setting, CancellationToken cancellationToken = default);
}
