using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MovieBookingManagement.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddOfferValidationRules : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsFirstTicketOnly",
                table: "Offers",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsWeekendOnly",
                table: "Offers",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsFirstTicketOnly",
                table: "Offers");

            migrationBuilder.DropColumn(
                name: "IsWeekendOnly",
                table: "Offers");
        }
    }
}
