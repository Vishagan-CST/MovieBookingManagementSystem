using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using MovieBookingManagement.Domain.Entities;

namespace MovieBookingManagement.Application.Common.Interfaces;

public interface ITestimonialService
{
    Task<IEnumerable<Testimonial>> GetAllTestimonialsAsync(CancellationToken cancellationToken = default);
    Task<Testimonial?> GetTestimonialByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<Testimonial> CreateTestimonialAsync(Testimonial testimonial, CancellationToken cancellationToken = default);
    Task<bool> UpdateTestimonialAsync(Testimonial testimonial, CancellationToken cancellationToken = default);
    Task<bool> DeleteTestimonialAsync(Guid id, CancellationToken cancellationToken = default);
}
