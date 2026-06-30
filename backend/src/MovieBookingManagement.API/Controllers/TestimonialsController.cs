using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MovieBookingManagement.Application.Common.Interfaces;
using MovieBookingManagement.Domain.Entities;

namespace MovieBookingManagement.API.Controllers;

public class TestimonialsController : ApiControllerBase
{
    private readonly ITestimonialService _testimonialService;

    public TestimonialsController(ITestimonialService testimonialService)
    {
        _testimonialService = testimonialService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Testimonial>>> Get(CancellationToken cancellationToken)
    {
        var testimonials = await _testimonialService.GetAllTestimonialsAsync(cancellationToken);
        return Ok(testimonials);
    }

    [HttpGet("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<Testimonial>> GetById(Guid id, CancellationToken cancellationToken)
    {
        var testimonial = await _testimonialService.GetTestimonialByIdAsync(id, cancellationToken);
        if (testimonial == null) return NotFound();
        return Ok(testimonial);
    }

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    public async Task<ActionResult<Testimonial>> Create(Testimonial testimonial, CancellationToken cancellationToken)
    {
        var createdTestimonial = await _testimonialService.CreateTestimonialAsync(testimonial, cancellationToken);
        return CreatedAtAction(nameof(GetById), new { id = createdTestimonial.Id }, createdTestimonial);
    }

    [HttpPut("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Update(Guid id, Testimonial testimonial, CancellationToken cancellationToken)
    {
        if (id != testimonial.Id) return BadRequest("ID mismatch.");

        var result = await _testimonialService.UpdateTestimonialAsync(testimonial, cancellationToken);
        if (!result) return BadRequest("Unable to update testimonial.");

        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        var result = await _testimonialService.DeleteTestimonialAsync(id, cancellationToken);
        if (!result) return NotFound();

        return NoContent();
    }
}
