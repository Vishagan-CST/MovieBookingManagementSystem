using System;
using MovieBookingManagement.Domain.Common;

namespace MovieBookingManagement.Domain.Entities;

public class Notification : AuditableEntity
{
    public Guid UserId { get; set; }
    public User? User { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public DateTime Date { get; set; } = DateTime.UtcNow;
    public bool Read { get; set; }
}
