using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using MovieBookingManagement.Application.Common.Interfaces;
using MovieBookingManagement.Domain.Entities;

namespace MovieBookingManagement.Application.Services;

public class TestimonialService : ITestimonialService
{
    private readonly IApplicationDbContext _context;

    public TestimonialService(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Testimonial>> GetAllTestimonialsAsync(CancellationToken cancellationToken = default)
    {
        return await _context.Testimonials.ToListAsync(cancellationToken);
    }

    public async Task<Testimonial?> GetTestimonialByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.Testimonials.FirstOrDefaultAsync(t => t.Id == id, cancellationToken);
    }

    public async Task<Testimonial> CreateTestimonialAsync(Testimonial testimonial, CancellationToken cancellationToken = default)
    {
        _context.Testimonials.Add(testimonial);
        await _context.SaveChangesAsync(cancellationToken);
        return testimonial;
    }

    public async Task<bool> UpdateTestimonialAsync(Testimonial testimonial, CancellationToken cancellationToken = default)
    {
        _context.Testimonials.Update(testimonial);
        return await _context.SaveChangesAsync(cancellationToken) > 0;
    }

    public async Task<bool> DeleteTestimonialAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var testimonial = await _context.Testimonials.FindAsync(new object[] { id }, cancellationToken);
        if (testimonial == null) return false;

        _context.Testimonials.Remove(testimonial);
        return await _context.SaveChangesAsync(cancellationToken) > 0;
    }
}
