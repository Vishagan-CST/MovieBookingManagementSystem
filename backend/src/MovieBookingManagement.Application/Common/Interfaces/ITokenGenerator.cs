using MovieBookingManagement.Domain.Entities;

namespace MovieBookingManagement.Application.Common.Interfaces;

public interface ITokenGenerator
{
    string GenerateToken(User user);
}
