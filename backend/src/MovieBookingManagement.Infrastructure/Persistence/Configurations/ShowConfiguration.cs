using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MovieBookingManagement.Domain.Entities;

namespace MovieBookingManagement.Infrastructure.Persistence.Configurations;

public class ShowConfiguration : IEntityTypeConfiguration<Show>
{
    public void Configure(EntityTypeBuilder<Show> builder)
    {
        builder.HasKey(s => s.Id);

        builder.Property(s => s.TicketPrice)
            .HasColumnType("decimal(18,2)");
    }
}
