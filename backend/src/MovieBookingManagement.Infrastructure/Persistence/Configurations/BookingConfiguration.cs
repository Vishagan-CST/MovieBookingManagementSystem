using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using MovieBookingManagement.Domain.Entities;
using System.Text.Json;
using System.Collections.Generic;
using System.Linq;
using System;

namespace MovieBookingManagement.Infrastructure.Persistence.Configurations;

public class BookingConfiguration : IEntityTypeConfiguration<Booking>
{
    public void Configure(EntityTypeBuilder<Booking> builder)
    {
        builder.HasKey(b => b.Id);

        builder.Property(b => b.ReferenceNumber)
            .IsRequired()
            .HasMaxLength(50);

        var listComparer = new ValueComparer<List<string>>(
            (c1, c2) => c1 != null && c2 != null ? c1.SequenceEqual(c2) : c1 == c2,
            c => c.Aggregate(0, (a, v) => HashCode.Combine(a, v.GetHashCode())),
            c => c.ToList());

        builder.Property(b => b.Seats)
            .HasConversion(
                v => JsonSerializer.Serialize(v, (JsonSerializerOptions)null!),
                v => JsonSerializer.Deserialize<List<string>>(v, (JsonSerializerOptions)null!) ?? new List<string>()
            )
            .Metadata.SetValueComparer(listComparer);

        builder.Property(b => b.TotalPrice)
            .HasColumnType("decimal(18,2)");

        // Avoid multiple cascade paths issue in SQL Server
        builder.HasOne(b => b.User)
            .WithMany()
            .HasForeignKey(b => b.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(b => b.Movie)
            .WithMany()
            .HasForeignKey(b => b.MovieId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(b => b.Show)
            .WithMany()
            .HasForeignKey(b => b.ShowId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
