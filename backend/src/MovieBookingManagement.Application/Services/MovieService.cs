using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using MovieBookingManagement.Application.Common.Interfaces;
using MovieBookingManagement.Domain.Entities;

namespace MovieBookingManagement.Application.Services;

public class MovieService : IMovieService
{
    private readonly IApplicationDbContext _context;

    public MovieService(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Movie>> GetAllMoviesAsync(CancellationToken cancellationToken = default)
    {
        return await _context.Movies.ToListAsync(cancellationToken);
    }

    public async Task<Movie?> GetMovieByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.Movies.FirstOrDefaultAsync(m => m.Id == id, cancellationToken);
    }

    public async Task<Movie> CreateMovieAsync(Movie movie, CancellationToken cancellationToken = default)
    {
        if (movie.Id == Guid.Empty)
        {
            movie.Id = Guid.NewGuid();
        }
        _context.Movies.Add(movie);
        await _context.SaveChangesAsync(cancellationToken);
        return movie;
    }

    public async Task<bool> UpdateMovieAsync(Movie movie, CancellationToken cancellationToken = default)
    {
        var existing = await _context.Movies.FindAsync(new object[] { movie.Id }, cancellationToken);
        if (existing == null) return false;

        existing.Title = movie.Title;
        existing.Description = movie.Description;
        existing.Genre = movie.Genre;
        existing.Language = movie.Language;
        existing.Duration = movie.Duration;
        existing.Director = movie.Director;
        existing.Cast = movie.Cast;
        existing.TrailerUrl = movie.TrailerUrl;
        existing.ReleaseDate = movie.ReleaseDate;
        existing.EndDate = movie.EndDate;
        existing.Status = movie.Status;
        existing.Rating = movie.Rating;
        existing.PosterUrl = movie.PosterUrl;
        existing.BackdropUrl = movie.BackdropUrl;
        existing.CinemaHalls = movie.CinemaHalls;
        existing.ShowTimes = movie.ShowTimes;

        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }

    public async Task<bool> DeleteMovieAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var movie = await _context.Movies.FindAsync(new object[] { id }, cancellationToken);
        if (movie == null) return false;

        var bookings = _context.Bookings.Where(b => b.MovieId == id);
        _context.Bookings.RemoveRange(bookings);

        _context.Movies.Remove(movie);
        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}
