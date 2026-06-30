using System.Reflection;
using Microsoft.EntityFrameworkCore;
using MovieBookingManagement.Application.Common.Interfaces;
using MovieBookingManagement.Domain.Entities;

namespace MovieBookingManagement.Infrastructure.Persistence;

public class ApplicationDbContext : DbContext, IApplicationDbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<Movie> Movies => Set<Movie>();
    public DbSet<CinemaHall> CinemaHalls => Set<CinemaHall>();
    public DbSet<Show> Shows => Set<Show>();
    public DbSet<Booking> Bookings => Set<Booking>();
    public DbSet<Testimonial> Testimonials => Set<Testimonial>();
    public DbSet<Offer> Offers => Set<Offer>();
    public DbSet<Notification> Notifications => Set<Notification>();
    public DbSet<SystemSetting> SystemSettings => Set<SystemSetting>();
    public DbSet<Inquiry> Inquiries => Set<Inquiry>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());

        base.OnModelCreating(modelBuilder);
    }
}
