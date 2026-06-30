using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using MovieBookingManagement.Domain.Entities;

namespace MovieBookingManagement.Application.Common.Interfaces;

public interface ICinemaHallService
{
    Task<IEnumerable<CinemaHall>> GetAllCinemaHallsAsync(CancellationToken cancellationToken = default);
    Task<CinemaHall?> GetCinemaHallByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<CinemaHall> CreateCinemaHallAsync(CinemaHall cinemaHall, CancellationToken cancellationToken = default);
    Task<bool> UpdateCinemaHallAsync(CinemaHall cinemaHall, CancellationToken cancellationToken = default);
    Task<bool> DeleteCinemaHallAsync(Guid id, CancellationToken cancellationToken = default);
}
