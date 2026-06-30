using System;
using MovieBookingManagement.Domain.Common;

namespace MovieBookingManagement.Domain.Entities;

public class Testimonial : AuditableEntity
{
    public string UserName { get; set; } = string.Empty;
    public double Rating { get; set; }
    public string Comment { get; set; } = string.Empty;
    public string AvatarUrl { get; set; } = string.Empty;
}
