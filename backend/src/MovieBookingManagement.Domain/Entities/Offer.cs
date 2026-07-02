using System;
using MovieBookingManagement.Domain.Common;

namespace MovieBookingManagement.Domain.Entities;

public class Offer : AuditableEntity
{
    public string Code { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal DiscountPercentage { get; set; }
    public DateTime ExpiryDate { get; set; }
    public bool IsFirstTicketOnly { get; set; }
    public bool IsWeekendOnly { get; set; }
}
