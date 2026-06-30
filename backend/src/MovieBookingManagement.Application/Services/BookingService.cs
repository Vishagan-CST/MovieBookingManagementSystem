using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using MovieBookingManagement.Application.Common.Interfaces;
using MovieBookingManagement.Domain.Entities;

namespace MovieBookingManagement.Application.Services;

public class BookingService : IBookingService
{
    private readonly IApplicationDbContext _context;

    public BookingService(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Booking>> GetAllBookingsAsync(CancellationToken cancellationToken = default)
    {
        return await _context.Bookings
            .Include(b => b.User)
            .Include(b => b.Movie)
            .Include(b => b.Show)
            .ToListAsync(cancellationToken);
    }

    public async Task<Booking?> GetBookingByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.Bookings
            .Include(b => b.User)
            .Include(b => b.Movie)
            .Include(b => b.Show)
            .FirstOrDefaultAsync(b => b.Id == id, cancellationToken);
    }

    public async Task<Booking> CreateBookingAsync(Booking booking, CancellationToken cancellationToken = default)
    {
        if (booking.Id == Guid.Empty)
        {
            booking.Id = Guid.NewGuid();
        }
        _context.Bookings.Add(booking);
        await _context.SaveChangesAsync(cancellationToken);
        return booking;
    }

    public async Task<bool> UpdateBookingAsync(Booking booking, CancellationToken cancellationToken = default)
    {
        var existing = await _context.Bookings.FindAsync(new object[] { booking.Id }, cancellationToken);
        if (existing == null) return false;

        existing.ReferenceNumber = booking.ReferenceNumber;
        existing.UserId = booking.UserId;
        existing.UserName = booking.UserName;
        existing.UserEmail = booking.UserEmail;
        existing.MovieId = booking.MovieId;
        existing.MovieTitle = booking.MovieTitle;
        existing.MoviePoster = booking.MoviePoster;
        existing.ShowId = booking.ShowId;
        existing.ShowDate = booking.ShowDate;
        existing.ShowTime = booking.ShowTime;
        existing.HallName = booking.HallName;
        existing.Seats = booking.Seats;
        existing.TotalPrice = booking.TotalPrice;
        existing.PaymentMethod = booking.PaymentMethod;
        existing.BookingDate = booking.BookingDate;
        existing.Status = booking.Status;

        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }

    public async Task<bool> DeleteBookingAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var booking = await _context.Bookings.FindAsync(new object[] { id }, cancellationToken);
        if (booking == null) return false;

        _context.Bookings.Remove(booking);
        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}
