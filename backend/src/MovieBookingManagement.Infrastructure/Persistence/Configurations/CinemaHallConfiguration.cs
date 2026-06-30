using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MovieBookingManagement.Domain.Entities;

namespace MovieBookingManagement.Infrastructure.Persistence.Configurations;

public class CinemaHallConfiguration : IEntityTypeConfiguration<CinemaHall>
{
    public void Configure(EntityTypeBuilder<CinemaHall> builder)
    {
        builder.HasKey(c => c.Id);

        builder.Property(c => c.BasePrice)
            .HasColumnType("decimal(18,2)");

        builder.Property(c => c.PriceMultiplier)
            .HasColumnType("decimal(18,4)");
    }
}
