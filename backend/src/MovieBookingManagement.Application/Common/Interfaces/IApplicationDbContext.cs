using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using MovieBookingManagement.Domain.Entities;

namespace MovieBookingManagement.Application.Common.Interfaces;

public interface IApplicationDbContext
{
    DbSet<User> Users { get; }
    DbSet<Movie> Movies { get; }
    DbSet<CinemaHall> CinemaHalls { get; }
    DbSet<Show> Shows { get; }
    DbSet<Booking> Bookings { get; }
    DbSet<Testimonial> Testimonials { get; }
    DbSet<Offer> Offers { get; }
    DbSet<Notification> Notifications { get; }
    DbSet<SystemSetting> SystemSettings { get; }
    DbSet<Inquiry> Inquiries { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
