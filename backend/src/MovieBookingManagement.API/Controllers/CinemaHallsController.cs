using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MovieBookingManagement.Application.Common.Interfaces;
using MovieBookingManagement.Domain.Entities;

namespace MovieBookingManagement.API.Controllers;

public class CinemaHallsController : ApiControllerBase
{
    private readonly ICinemaHallService _cinemaHallService;

    public CinemaHallsController(ICinemaHallService cinemaHallService)
    {
        _cinemaHallService = cinemaHallService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<CinemaHall>>> Get(CancellationToken cancellationToken)
    {
        var halls = await _cinemaHallService.GetAllCinemaHallsAsync(cancellationToken);
        return Ok(halls);
    }

    [HttpGet("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<CinemaHall>> GetById(Guid id, CancellationToken cancellationToken)
    {
        var hall = await _cinemaHallService.GetCinemaHallByIdAsync(id, cancellationToken);
        if (hall == null) return NotFound();
        return Ok(hall);
    }

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    public async Task<ActionResult<CinemaHall>> Create(CinemaHall cinemaHall, CancellationToken cancellationToken)
    {
        var createdHall = await _cinemaHallService.CreateCinemaHallAsync(cinemaHall, cancellationToken);
        return CreatedAtAction(nameof(GetById), new { id = createdHall.Id }, createdHall);
    }

    [HttpPut("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Update(Guid id, CinemaHall cinemaHall, CancellationToken cancellationToken)
    {
        if (id != cinemaHall.Id) return BadRequest("ID mismatch.");

        var result = await _cinemaHallService.UpdateCinemaHallAsync(cinemaHall, cancellationToken);
        if (!result) return BadRequest("Unable to update cinema hall.");

        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        var result = await _cinemaHallService.DeleteCinemaHallAsync(id, cancellationToken);
        if (!result) return NotFound();

        return NoContent();
    }
}
