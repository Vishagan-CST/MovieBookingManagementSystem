using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MovieBookingManagement.Application.Common.Interfaces;
using MovieBookingManagement.Domain.Entities;

namespace MovieBookingManagement.API.Controllers;

public class OffersController : ApiControllerBase
{
    private readonly IOfferService _offerService;

    public OffersController(IOfferService offerService)
    {
        _offerService = offerService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Offer>>> Get(CancellationToken cancellationToken)
    {
        var offers = await _offerService.GetAllOffersAsync(cancellationToken);
        return Ok(offers);
    }

    [HttpGet("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<Offer>> GetById(Guid id, CancellationToken cancellationToken)
    {
        var offer = await _offerService.GetOfferByIdAsync(id, cancellationToken);
        if (offer == null) return NotFound();
        return Ok(offer);
    }

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    public async Task<ActionResult<Offer>> Create(Offer offer, CancellationToken cancellationToken)
    {
        var createdOffer = await _offerService.CreateOfferAsync(offer, cancellationToken);
        return CreatedAtAction(nameof(GetById), new { id = createdOffer.Id }, createdOffer);
    }

    [HttpPut("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Update(Guid id, Offer offer, CancellationToken cancellationToken)
    {
        if (id != offer.Id) return BadRequest("ID mismatch.");

        var result = await _offerService.UpdateOfferAsync(offer, cancellationToken);
        if (!result) return BadRequest("Unable to update offer.");

        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        var result = await _offerService.DeleteOfferAsync(id, cancellationToken);
        if (!result) return NotFound();

        return NoContent();
    }

    [HttpPost("validate")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> ValidateOffer(ValidateOfferRequest request, CancellationToken cancellationToken)
    {
        if (!Guid.TryParse(request.UserId, out var userIdGuid))
        {
            userIdGuid = Guid.Empty;
        }

        var result = await _offerService.ValidateOfferAsync(request.Code, userIdGuid, request.ShowDate, cancellationToken);
        if (!result.IsValid)
        {
            return BadRequest(new { Message = result.Message });
        }

        return Ok(new { Message = result.Message, DiscountPercentage = result.DiscountPercentage });
    }
}

public class ValidateOfferRequest
{
    public string Code { get; set; } = string.Empty;
    public string UserId { get; set; } = string.Empty;
    public DateTime ShowDate { get; set; }
}
