using System.ComponentModel.DataAnnotations.Schema;
using MovieBookingManagement.Domain.Common;

namespace MovieBookingManagement.Domain.Entities;

public class SystemSetting : AuditableEntity
{
    public int BookingTimeout { get; set; } = 10;

    [Column(TypeName = "decimal(18,2)")]
    public decimal TaxRate { get; set; } = 8m;

    public int CancellationNoticeHours { get; set; } = 2;
}
