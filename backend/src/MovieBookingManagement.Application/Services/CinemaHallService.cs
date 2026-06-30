using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using MovieBookingManagement.Application.Common.Interfaces;
using MovieBookingManagement.Domain.Entities;

namespace MovieBookingManagement.Application.Services;

public class CinemaHallService : ICinemaHallService
{
    private readonly IApplicationDbContext _context;

    public CinemaHallService(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<CinemaHall>> GetAllCinemaHallsAsync(CancellationToken cancellationToken = default)
    {
        var halls = await _context.CinemaHalls.ToListAsync(cancellationToken);
        if (halls.Count == 0)
        {
            var defaultHalls = new List<CinemaHall>
            {
                new CinemaHall
                {
                    Id = Guid.Parse("a86f9175-1033-4f96-bb3d-a5a4cf025178"),
                    Name = "Silver",
                    SeatCapacity = 60,
                    Rows = 6,
                    Columns = 10,
                    PriceMultiplier = 1.0m,
                    BasePrice = 150m,
                    Status = "active",
                    CreatedAt = DateTime.UtcNow
                },
                new CinemaHall
                {
                    Id = Guid.Parse("464fe130-9b41-47cc-9e67-ea8808940dfd"),
                    Name = "Bronze",
                    SeatCapacity = 80,
                    Rows = 8,
                    Columns = 10,
                    PriceMultiplier = 0.8m,
                    BasePrice = 120m,
                    Status = "active",
                    CreatedAt = DateTime.UtcNow
                },
                new CinemaHall
                {
                    Id = Guid.Parse("73c000e7-3f30-473d-9d41-e94000a300df"),
                    Name = "Platinum",
                    SeatCapacity = 40,
                    Rows = 5,
                    Columns = 8,
                    PriceMultiplier = 1.5m,
                    BasePrice = 250m,
                    Status = "active",
                    CreatedAt = DateTime.UtcNow
                }
            };

            _context.CinemaHalls.AddRange(defaultHalls);
            await _context.SaveChangesAsync(cancellationToken);
            return defaultHalls;
        }
        return halls;
    }

    public async Task<CinemaHall?> GetCinemaHallByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.CinemaHalls.FirstOrDefaultAsync(c => c.Id == id, cancellationToken);
    }

    public async Task<CinemaHall> CreateCinemaHallAsync(CinemaHall cinemaHall, CancellationToken cancellationToken = default)
    {
        if (cinemaHall.Id == Guid.Empty)
        {
            cinemaHall.Id = Guid.NewGuid();
        }
        _context.CinemaHalls.Add(cinemaHall);
        await _context.SaveChangesAsync(cancellationToken);
        return cinemaHall;
    }

    public async Task<bool> UpdateCinemaHallAsync(CinemaHall cinemaHall, CancellationToken cancellationToken = default)
    {
        var existing = await _context.CinemaHalls.FindAsync(new object[] { cinemaHall.Id }, cancellationToken);
        if (existing == null) return false;

        existing.Name = cinemaHall.Name;
        existing.SeatCapacity = cinemaHall.SeatCapacity;
        existing.Rows = cinemaHall.Rows;
        existing.Columns = cinemaHall.Columns;
        existing.PriceMultiplier = cinemaHall.PriceMultiplier;
        existing.BasePrice = cinemaHall.BasePrice;
        existing.Status = cinemaHall.Status;

        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }

    public async Task<bool> DeleteCinemaHallAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var cinemaHall = await _context.CinemaHalls.FindAsync(new object[] { id }, cancellationToken);
        if (cinemaHall == null) return false;

        _context.CinemaHalls.Remove(cinemaHall);
        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}
