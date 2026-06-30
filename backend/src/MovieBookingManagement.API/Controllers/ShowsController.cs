using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MovieBookingManagement.Application.Common.Interfaces;
using MovieBookingManagement.Domain.Entities;

namespace MovieBookingManagement.API.Controllers;

public class ShowsController : ApiControllerBase
{
    private readonly IShowService _showService;

    public ShowsController(IShowService showService)
    {
        _showService = showService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Show>>> Get(CancellationToken cancellationToken)
    {
        var shows = await _showService.GetAllShowsAsync(cancellationToken);
        return Ok(shows);
    }

    [HttpGet("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<Show>> GetById(Guid id, CancellationToken cancellationToken)
    {
        var show = await _showService.GetShowByIdAsync(id, cancellationToken);
        if (show == null) return NotFound();
        return Ok(show);
    }

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    public async Task<ActionResult<Show>> Create(Show show, CancellationToken cancellationToken)
    {
        var createdShow = await _showService.CreateShowAsync(show, cancellationToken);
        return CreatedAtAction(nameof(GetById), new { id = createdShow.Id }, createdShow);
    }

    [HttpPut("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Update(Guid id, Show show, CancellationToken cancellationToken)
    {
        if (id != show.Id) return BadRequest("ID mismatch.");

        var result = await _showService.UpdateShowAsync(show, cancellationToken);
        if (!result) return BadRequest("Unable to update show.");

        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        var result = await _showService.DeleteShowAsync(id, cancellationToken);
        if (!result) return NotFound();

        return NoContent();
    }
}
