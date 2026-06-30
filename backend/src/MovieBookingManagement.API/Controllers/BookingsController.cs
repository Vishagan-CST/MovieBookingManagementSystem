using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MovieBookingManagement.Application.Common.Interfaces;
using MovieBookingManagement.Domain.Entities;

namespace MovieBookingManagement.API.Controllers;

public class BookingsController : ApiControllerBase
{
    private readonly IBookingService _bookingService;

    public BookingsController(IBookingService bookingService)
    {
        _bookingService = bookingService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Booking>>> Get(CancellationToken cancellationToken)
    {
        var bookings = await _bookingService.GetAllBookingsAsync(cancellationToken);
        return Ok(bookings);
    }

    [HttpGet("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<Booking>> GetById(Guid id, CancellationToken cancellationToken)
    {
        var booking = await _bookingService.GetBookingByIdAsync(id, cancellationToken);
        if (booking == null) return NotFound();
        return Ok(booking);
    }

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    public async Task<ActionResult<Booking>> Create(Booking booking, CancellationToken cancellationToken)
    {
        var createdBooking = await _bookingService.CreateBookingAsync(booking, cancellationToken);
        return CreatedAtAction(nameof(GetById), new { id = createdBooking.Id }, createdBooking);
    }

    [HttpPut("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Update(Guid id, Booking booking, CancellationToken cancellationToken)
    {
        if (id != booking.Id) return BadRequest("ID mismatch.");

        var result = await _bookingService.UpdateBookingAsync(booking, cancellationToken);
        if (!result) return BadRequest("Unable to update booking.");

        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        var result = await _bookingService.DeleteBookingAsync(id, cancellationToken);
        if (!result) return NotFound();

        return NoContent();
    }
}
