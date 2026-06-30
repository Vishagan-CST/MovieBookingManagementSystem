using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using MovieBookingManagement.Domain.Entities;

namespace MovieBookingManagement.Application.Common.Interfaces;

public interface IShowService
{
    Task<IEnumerable<Show>> GetAllShowsAsync(CancellationToken cancellationToken = default);
    Task<Show?> GetShowByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<Show> CreateShowAsync(Show show, CancellationToken cancellationToken = default);
    Task<bool> UpdateShowAsync(Show show, CancellationToken cancellationToken = default);
    Task<bool> DeleteShowAsync(Guid id, CancellationToken cancellationToken = default);
}
