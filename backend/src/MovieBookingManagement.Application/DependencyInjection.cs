using Microsoft.Extensions.DependencyInjection;
using MovieBookingManagement.Application.Common.Interfaces;
using MovieBookingManagement.Application.Services;

namespace MovieBookingManagement.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        services.AddScoped<IMovieService, MovieService>();
        services.AddScoped<IUserService, UserService>();
        services.AddScoped<ICinemaHallService, CinemaHallService>();
        services.AddScoped<IShowService, ShowService>();
        services.AddScoped<IBookingService, BookingService>();
        services.AddScoped<ITestimonialService, TestimonialService>();
        services.AddScoped<IOfferService, OfferService>();
        services.AddScoped<INotificationService, NotificationService>();
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<ISystemSettingService, SystemSettingService>();
        
        return services;
    }
}
