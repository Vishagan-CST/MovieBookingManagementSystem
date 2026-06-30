using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using MovieBookingManagement.Domain.Entities;

namespace MovieBookingManagement.Application.Common.Interfaces;

public interface IOfferService
{
    Task<IEnumerable<Offer>> GetAllOffersAsync(CancellationToken cancellationToken = default);
    Task<Offer?> GetOfferByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<Offer> CreateOfferAsync(Offer offer, CancellationToken cancellationToken = default);
    Task<bool> UpdateOfferAsync(Offer offer, CancellationToken cancellationToken = default);
    Task<bool> DeleteOfferAsync(Guid id, CancellationToken cancellationToken = default);
}
