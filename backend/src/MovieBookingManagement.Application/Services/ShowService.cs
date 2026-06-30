using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using MovieBookingManagement.Application.Common.Interfaces;
using MovieBookingManagement.Domain.Entities;

namespace MovieBookingManagement.Application.Services;

public class ShowService : IShowService
{
    private readonly IApplicationDbContext _context;

    public ShowService(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Show>> GetAllShowsAsync(CancellationToken cancellationToken = default)
    {
        return await _context.Shows.Include(s => s.Movie).ToListAsync(cancellationToken);
    }

    public async Task<Show?> GetShowByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.Shows.Include(s => s.Movie).FirstOrDefaultAsync(s => s.Id == id, cancellationToken);
    }

    public async Task<Show> CreateShowAsync(Show show, CancellationToken cancellationToken = default)
    {
        if (show.Id == Guid.Empty)
        {
            show.Id = Guid.NewGuid();
        }
        _context.Shows.Add(show);
        await _context.SaveChangesAsync(cancellationToken);
        return show;
    }

    public async Task<bool> UpdateShowAsync(Show show, CancellationToken cancellationToken = default)
    {
        var existing = await _context.Shows.FindAsync(new object[] { show.Id }, cancellationToken);
        if (existing == null) return false;

        existing.MovieId = show.MovieId;
        existing.MovieTitle = show.MovieTitle;
        existing.MoviePoster = show.MoviePoster;
        existing.HallName = show.HallName;
        existing.Date = show.Date;
        existing.StartTime = show.StartTime;
        existing.EndTime = show.EndTime;
        existing.TicketPrice = show.TicketPrice;
        existing.SeatCapacity = show.SeatCapacity;
        existing.Status = show.Status;

        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }

    public async Task<bool> DeleteShowAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var show = await _context.Shows.FindAsync(new object[] { id }, cancellationToken);
        if (show == null) return false;

        var bookings = _context.Bookings.Where(b => b.ShowId == id);
        _context.Bookings.RemoveRange(bookings);

        _context.Shows.Remove(show);
        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}
