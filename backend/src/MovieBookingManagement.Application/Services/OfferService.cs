using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using MovieBookingManagement.Application.Common.Interfaces;
using MovieBookingManagement.Domain.Entities;

namespace MovieBookingManagement.Application.Services;

public class OfferService : IOfferService
{
    private readonly IApplicationDbContext _context;

    public OfferService(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Offer>> GetAllOffersAsync(CancellationToken cancellationToken = default)
    {
        return await _context.Offers.ToListAsync(cancellationToken);
    }

    public async Task<Offer?> GetOfferByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.Offers.FirstOrDefaultAsync(o => o.Id == id, cancellationToken);
    }

    public async Task<Offer> CreateOfferAsync(Offer offer, CancellationToken cancellationToken = default)
    {
        _context.Offers.Add(offer);
        await _context.SaveChangesAsync(cancellationToken);
        return offer;
    }

    public async Task<bool> UpdateOfferAsync(Offer offer, CancellationToken cancellationToken = default)
    {
        _context.Offers.Update(offer);
        return await _context.SaveChangesAsync(cancellationToken) > 0;
    }

    public async Task<bool> DeleteOfferAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var offer = await _context.Offers.FindAsync(new object[] { id }, cancellationToken);
        if (offer == null) return false;

        _context.Offers.Remove(offer);
        return await _context.SaveChangesAsync(cancellationToken) > 0;
    }
}
