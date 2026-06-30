using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MovieBookingManagement.Domain.Entities;

namespace MovieBookingManagement.Infrastructure.Persistence.Configurations;

public class OfferConfiguration : IEntityTypeConfiguration<Offer>
{
    public void Configure(EntityTypeBuilder<Offer> builder)
    {
        builder.HasKey(o => o.Id);

        builder.Property(o => o.DiscountPercentage)
            .HasColumnType("decimal(5,2)");
    }
}
