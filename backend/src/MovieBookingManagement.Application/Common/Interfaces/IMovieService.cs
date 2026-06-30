using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using MovieBookingManagement.Domain.Entities;

namespace MovieBookingManagement.Application.Common.Interfaces;

public interface IMovieService
{
    Task<IEnumerable<Movie>> GetAllMoviesAsync(CancellationToken cancellationToken = default);
    Task<Movie?> GetMovieByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<Movie> CreateMovieAsync(Movie movie, CancellationToken cancellationToken = default);
    Task<bool> UpdateMovieAsync(Movie movie, CancellationToken cancellationToken = default);
    Task<bool> DeleteMovieAsync(Guid id, CancellationToken cancellationToken = default);
}
