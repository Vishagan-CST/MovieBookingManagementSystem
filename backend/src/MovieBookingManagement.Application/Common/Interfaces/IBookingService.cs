using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using MovieBookingManagement.Domain.Entities;

namespace MovieBookingManagement.Application.Common.Interfaces;

public interface IBookingService
{
    Task<IEnumerable<Booking>> GetAllBookingsAsync(CancellationToken cancellationToken = default);
    Task<Booking?> GetBookingByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<Booking> CreateBookingAsync(Booking booking, CancellationToken cancellationToken = default);
    Task<bool> UpdateBookingAsync(Booking booking, CancellationToken cancellationToken = default);
    Task<bool> DeleteBookingAsync(Guid id, CancellationToken cancellationToken = default);
}
