using System;
using MovieBookingManagement.Domain.Common;

namespace MovieBookingManagement.Domain.Entities;

public class User : AuditableEntity
{
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public string Role { get; set; } = "customer"; // "admin" | "customer"
    public string? AvatarUrl { get; set; }
    public string Status { get; set; } = "active"; // "active" | "disabled"
    public string PasswordHash { get; set; } = string.Empty;
}
