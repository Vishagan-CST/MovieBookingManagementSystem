using System;
using System.Collections.Generic;
using MovieBookingManagement.Domain.Common;

namespace MovieBookingManagement.Domain.Entities;

public class Movie : AuditableEntity
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public List<string> Genre { get; set; } = new();
    public string Language { get; set; } = string.Empty;
    public int Duration { get; set; }  
    public string Director { get; set; } = string.Empty;
    public List<string> Cast { get; set; } = new();
    public string? TrailerUrl { get; set; }
    public DateTime ReleaseDate { get; set; }
    public DateTime EndDate { get; set; }
    public string Status { get; set; } = "Upcoming"; // "Now Showing" | "Upcoming" | "Popular" | "Ended"
    public double Rating { get; set; }
    public string PosterUrl { get; set; } = string.Empty;
    public string? BackdropUrl { get; set; }
    public List<string> CinemaHalls { get; set; } = new();
    public List<string> ShowTimes { get; set; } = new();
}
