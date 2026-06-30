using System;
using System.Collections.Generic;
using MovieBookingManagement.Domain.Common;

namespace MovieBookingManagement.Domain.Entities;

public class Booking : AuditableEntity
{
    public string ReferenceNumber { get; set; } = string.Empty;
    public Guid UserId { get; set; }
    public User? User { get; set; }
    public string UserName { get; set; } = string.Empty;
    public string UserEmail { get; set; } = string.Empty;
    public Guid MovieId { get; set; }
    public Movie? Movie { get; set; }
    public string MovieTitle { get; set; } = string.Empty;
    public string MoviePoster { get; set; } = string.Empty;
    public string HallName { get; set; } = string.Empty; // "Silver" | "Bronze" | "Platinum"
    public Guid ShowId { get; set; }
    public Show? Show { get; set; }
    public DateTime ShowDate { get; set; }
    public string ShowTime { get; set; } = string.Empty;
    public List<string> Seats { get; set; } = new();
    public decimal TotalPrice { get; set; }
    public string PaymentMethod { get; set; } = "card"; // "card" | "upi" | "cash" | "wallet"
    public string Status { get; set; } = "Pending"; // "Confirmed" | "Cancelled" | "Pending"
    public DateTime BookingDate { get; set; } = DateTime.UtcNow;
}
