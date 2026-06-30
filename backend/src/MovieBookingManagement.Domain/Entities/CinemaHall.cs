using System;
using MovieBookingManagement.Domain.Common;

namespace MovieBookingManagement.Domain.Entities;

public class CinemaHall : AuditableEntity
{
    public string Name { get; set; } = string.Empty; // "Silver" | "Bronze" | "Platinum"
    public int SeatCapacity { get; set; }
    public int Rows { get; set; }
    public int Columns { get; set; }
    public decimal PriceMultiplier { get; set; }
    public decimal BasePrice { get; set; }
    public string Status { get; set; } = "active"; // "active" | "inactive"
}
