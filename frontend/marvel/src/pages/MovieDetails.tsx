import React, { useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import MovieCard from '../components/MovieCard';
import { Star, Favorite, FavoriteBorder, Schedule, CalendarMonth, Language, TheaterComedy } from '@mui/icons-material';
import { Button } from '@mui/material';

export const MovieDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { movies, shows, wishlist, toggleWishlist } = useApp();

  const movie = movies.find(m => m.id === id);

  const isFavorite = movie ? wishlist.includes(movie.id) : false;

  // Filter shows scheduled for this movie
  const movieShows = useMemo(() => {
    return shows.filter(s => s.movieId === id && s.status === 'active');
  }, [shows, id]);

  // Group shows by Hall Name
  const showsByHall = useMemo(() => {
    const groups: { [key: string]: typeof movieShows } = {
      Platinum: [],
      Silver: [],
      Bronze: []
    };
    movieShows.forEach(show => {
      if (groups[show.hallName]) {
        groups[show.hallName].push(show);
      }
    });
    return groups;
  }, [movieShows]);

  // Related movies (same genre, excluding current)
  const relatedMovies = useMemo(() => {
    if (!movie) return [];
    return movies
      .filter(m => m.id !== movie.id && m.genre.some(g => movie.genre.includes(g)))
      .slice(0, 4);
  }, [movies, movie]);

  if (!movie) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#111111] text-white">
        <h2 className="text-2xl font-bold">Movie Not Found</h2>
        <Link to="/movies" className="text-amber-400 hover:underline mt-4">Back to catalogue</Link>
      </div>
    );
  }

  const handleBookShow = (showId: string) => {
    navigate(`/booking?showId=${showId}`);
  };

  return (
    <div className="bg-[#111111] text-white min-h-screen">
      
      {/* 1. LARGE BACKDROP / HERO */}
      <div className="relative h-[55vh] md:h-[65vh] overflow-hidden flex items-end">
        <div className="absolute inset-0 z-0">
          <img
            src={movie.backdropUrl || movie.posterUrl}
            alt={movie.title}
            className="w-full h-full object-cover object-top opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#111111] via-[#111111]/70 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-6 w-full pb-8 relative z-10">
          <div className="flex flex-col md:flex-row gap-6 md:items-end">
            
            {/* Small poster */}
            <div className="hidden md:block w-52 rounded-2xl overflow-hidden border-2 border-white/10 shadow-2xl flex-shrink-0 relative aspect-[2/3]">
              <img src={movie.posterUrl} alt={movie.title} className="w-full h-full object-cover" />
            </div>

            {/* Backdrop textual details */}
            <div className="flex-grow">
              <div className="flex items-center gap-3 flex-wrap">
                {movie.genre.map(g => (
                  <span key={g} className="bg-white/10 border border-white/10 text-xs font-semibold px-3 py-0.5 rounded-full">
                    {g}
                  </span>
                ))}
                <span className="flex items-center gap-1 text-amber-400 font-bold text-sm">
                  <Star className="!text-sm" /> {movie.rating.toFixed(1)} / 10
                </span>
              </div>

              <h1 className="text-3xl md:text-5xl font-extrabold font-poppins mt-3 leading-tight">
                {movie.title}
              </h1>

              <div className="flex items-center gap-4 text-xs text-gray-400 mt-4 flex-wrap">
                <div className="flex items-center gap-1"><Schedule className="!text-sm text-[#C1121F]" /> {movie.duration} Mins</div>
                <div className="flex items-center gap-1"><CalendarMonth className="!text-sm text-[#FFD700]" /> Released {movie.releaseDate ? new Date(movie.releaseDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}</div>
                <div className="flex items-center gap-1"><Language className="!text-sm text-sky-400" /> {movie.language}</div>
              </div>
            </div>

            {/* Favorite Action */}
            <div className="flex-shrink-0 self-start md:self-end">
              <Button
                variant="outlined"
                onClick={() => toggleWishlist(movie.id)}
                startIcon={isFavorite ? <Favorite className="text-red-500" /> : <FavoriteBorder />}
                sx={{
                  color: isFavorite ? '#FF5C5C' : '#FFF',
                  borderColor: isFavorite ? 'rgba(255, 92, 92, 0.4)' : 'rgba(255,255,255,0.2)',
                  px: 3,
                  py: 1,
                  borderRadius: 2,
                  '&:hover': {
                    borderColor: isFavorite ? '#FF5C5C' : '#FFF',
                    bgcolor: isFavorite ? 'rgba(255, 92, 92, 0.05)' : 'rgba(255,255,255,0.05)'
                  }
                }}
              >
                {isFavorite ? 'In Wishlist' : 'Add Wishlist'}
              </Button>
            </div>

          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT: Description & Trailer */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Synopsis */}
            <div>
              <h3 className="text-xl font-bold border-b border-white/5 pb-2.5 mb-4 font-poppins">
                Synopsis
              </h3>
              <p className="text-gray-300 leading-relaxed text-sm md:text-base">
                {movie.description}
              </p>
            </div>

            {/* Cast & Director */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-black/25 p-6 rounded-2xl border border-white/5">
              <div>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Director</p>
                <p className="font-semibold text-white mt-1 text-sm">{movie.director}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Starring Cast</p>
                <p className="font-semibold text-white mt-1 text-sm">{movie.cast.join(', ')}</p>
              </div>
            </div>

            {/* Trailer embed section */}
            {movie.trailerUrl && (
              <div>
                <h3 className="text-xl font-bold border-b border-white/5 pb-2.5 mb-4 font-poppins">
                  Official Trailer
                </h3>
                <div className="aspect-video w-full rounded-2xl overflow-hidden border border-white/15 bg-black">
                  <iframe
                    className="w-full h-full"
                    src={movie.trailerUrl}
                    title={`${movie.title} Trailer`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: Show Times & Booking Triggers */}
          <div className="lg:col-span-4">
            <div className="bg-[#1A1A1A] p-6 rounded-3xl border border-white/5 sticky top-24 shadow-2xl">
              <h3 className="text-lg font-bold border-b border-white/5 pb-3 mb-5 text-[#FFD700] flex items-center gap-2">
                <TheaterComedy /> Available Showtimes
              </h3>

              {movie.status === 'Upcoming' ? (
                <div className="text-center py-6 text-gray-500 text-sm font-semibold uppercase tracking-wider bg-black/20 rounded-xl border border-dashed border-white/5">
                  Tickets releasing soon
                </div>
              ) : movieShows.length === 0 ? (
                <div className="text-center py-6 text-gray-500 text-sm font-semibold uppercase tracking-wider bg-black/20 rounded-xl border border-dashed border-white/5">
                  No shows scheduled today
                </div>
              ) : (
                <div className="space-y-6">
                  {Object.entries(showsByHall).map(([hall, list]) => {
                    if (list.length === 0) return null;
                    return (
                      <div key={hall} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold uppercase tracking-wider text-red-500">{hall} Hall</span>
                          <span className="text-[10px] text-gray-400">capacity: {list[0].seatCapacity} seats</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {list.map((show) => (
                            <button
                              key={show.id}
                              onClick={() => handleBookShow(show.id)}
                              className="bg-black/30 hover:bg-[#C1121F]/10 border border-white/5 hover:border-[#C1121F]/30 p-2.5 rounded-xl transition-all text-left flex flex-col justify-between group"
                            >
                              <span className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">{show.startTime}</span>
                              <span className="text-[10px] text-gray-500 mt-1">${show.ticketPrice} per ticket</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {movie.status !== 'Upcoming' && (
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => navigate(`/booking?movieId=${movie.id}`)}
                  sx={{
                    mt: 4,
                    py: 1.5,
                    bgcolor: '#C1121F',
                    '&:hover': { bgcolor: '#A00F19' }
                  }}
                >
                  Quick Booking Flow
                </Button>
              )}
            </div>
          </div>

        </div>

        {/* 3. RELATED MOVIES */}
        {relatedMovies.length > 0 && (
          <section className="mt-16 pt-12 border-t border-white/5">
            <h3 className="text-2xl font-extrabold mb-8 tracking-tight font-poppins">
              You Might Also <span className="text-[#C1121F]">Like</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {relatedMovies.map((m) => (
                <div key={m.id}>
                  <MovieCard movie={m} />
                </div>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
};

export default MovieDetails;
