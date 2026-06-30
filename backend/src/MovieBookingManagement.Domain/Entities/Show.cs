using System;
using MovieBookingManagement.Domain.Common;

namespace MovieBookingManagement.Domain.Entities;

public class Show : AuditableEntity
{
    public Guid MovieId { get; set; }
    public Movie? Movie { get; set; }
    public string MovieTitle { get; set; } = string.Empty;
    public string MoviePoster { get; set; } = string.Empty;
    public string HallName { get; set; } = string.Empty; // "Silver" | "Bronze" | "Platinum"
    public DateTime Date { get; set; }
    public string StartTime { get; set; } = string.Empty;
    public string EndTime { get; set; } = string.Empty;
    public decimal TicketPrice { get; set; }
    public int SeatCapacity { get; set; }
    public string Status { get; set; } = "active"; // "active" | "cancelled"
}
