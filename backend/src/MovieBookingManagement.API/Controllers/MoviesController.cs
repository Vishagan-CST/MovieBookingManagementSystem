using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MovieBookingManagement.Application.Common.Interfaces;
using MovieBookingManagement.Domain.Entities;

namespace MovieBookingManagement.API.Controllers;

public class MoviesController : ApiControllerBase
{
    private readonly IMovieService _movieService;

    public MoviesController(IMovieService movieService)
    {
        _movieService = movieService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Movie>>> Get(CancellationToken cancellationToken)
    {
        var movies = await _movieService.GetAllMoviesAsync(cancellationToken);
        return Ok(movies);
    }

    [HttpGet("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<Movie>> GetById(Guid id, CancellationToken cancellationToken)
    {
        var movie = await _movieService.GetMovieByIdAsync(id, cancellationToken);
        if (movie == null)
        {
            return NotFound();
        }
        return Ok(movie);
    }

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    public async Task<ActionResult<Movie>> Create(Movie movie, CancellationToken cancellationToken)
    {
        var createdMovie = await _movieService.CreateMovieAsync(movie, cancellationToken);
        return CreatedAtAction(nameof(GetById), new { id = createdMovie.Id }, createdMovie);
    }

    [HttpPut("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Update(Guid id, Movie movie, CancellationToken cancellationToken)
    {
        if (id != movie.Id)
        {
            return BadRequest("ID mismatch.");
        }

        var result = await _movieService.UpdateMovieAsync(movie, cancellationToken);
        if (!result)
        {
            return BadRequest("Unable to update movie.");
        }

        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        var result = await _movieService.DeleteMovieAsync(id, cancellationToken);
        if (!result)
        {
            return NotFound();
        }

        return NoContent();
    }

    [HttpPost("upload-image")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> UploadImage(IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest("No file uploaded.");

        var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
        if (!Directory.Exists(uploadsFolder))
        {
            Directory.CreateDirectory(uploadsFolder);
        }

        var uniqueFileName = Guid.NewGuid().ToString() + "_" + Path.GetFileName(file.FileName);
        var filePath = Path.Combine(uploadsFolder, uniqueFileName);

        using (var fileStream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(fileStream);
        }

        var request = HttpContext.Request;
        var baseUrl = $"{request.Scheme}://{request.Host}";
        var fileUrl = $"{baseUrl}/uploads/{uniqueFileName}";

        return Ok(new { url = fileUrl });
    }
}

