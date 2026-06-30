import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { Movie } from '../types';
import { motion } from 'framer-motion';
import { Star, Schedule, Translate } from '@mui/icons-material';
import { Button } from '@mui/material';

interface MovieCardProps {
  movie: Movie;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const navigate = useNavigate();

  const handleBookNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/booking?movieId=${movie.id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="bg-[#1A1A1A] rounded-2xl overflow-hidden border border-white/5 shadow-2xl flex flex-col h-full group"
    >
      <Link to={`/movie/${movie.id}`} className="relative block overflow-hidden aspect-[2/3] cursor-pointer">
        {/* Rating Badge */}
        <div className="absolute top-3 left-3 z-10 bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-lg flex items-center gap-1 border border-amber-400/30">
          <Star className="text-amber-400 !text-sm" />
          <span className="text-white text-xs font-bold">{movie.rating.toFixed(1)}</span>
        </div>

        {/* Status Badge */}
        <div className={`absolute top-3 right-3 z-10 px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${
          movie.status === 'Now Showing' ? 'bg-[#C1121F] text-white' :
          movie.status === 'Upcoming' ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300'
        }`}>
          {movie.status}
        </div>

        {/* Poster Image */}
        <img
          src={movie.posterUrl}
          alt={movie.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Hover overlay content */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
          <p className="text-xs text-amber-400 font-bold mb-1">DIRECTOR</p>
          <p className="text-sm text-white font-medium mb-3 line-clamp-1">{movie.director}</p>
          <p className="text-xs text-gray-300 line-clamp-3 mb-4">{movie.description}</p>
          <span className="text-xs font-semibold text-red-500 uppercase tracking-widest block mb-1">Halls Available</span>
          <div className="flex gap-1.5 flex-wrap">
            {movie.cinemaHalls.map(h => (
              <span key={h} className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-white border border-white/5">{h}</span>
            ))}
          </div>
        </div>
      </Link>

      {/* Info Block */}
      <div className="p-4 flex-grow flex flex-col justify-between">
        <div>
          <Link to={`/movie/${movie.id}`}>
            <h3 className="text-base md:text-lg font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-1 mb-1">
              {movie.title}
            </h3>
          </Link>
          
          {/* Genre chips */}
          <div className="flex flex-wrap gap-1 mb-3">
            {movie.genre.slice(0, 3).map(g => (
              <span key={g} className="text-[10px] text-gray-400 font-medium">{g} &bull; </span>
            ))}
            <span className="text-[10px] text-gray-400 font-medium">{movie.language}</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs text-gray-400 mb-4 bg-black/20 p-2.5 rounded-lg">
            <div className="flex items-center gap-1.5">
              <Schedule sx={{ fontSize: 14, color: '#C1121F' }} />
              <span>{movie.duration} Mins</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Translate sx={{ fontSize: 14, color: '#FFD700' }} />
              <span className="truncate">{movie.language.split(' ')[0]}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2 mt-auto">
          <Button
            fullWidth
            variant="outlined"
            component={Link}
            to={`/movie/${movie.id}`}
            sx={{
              py: 0.8,
              fontSize: '0.8rem',
              borderColor: 'rgba(255,255,255,0.1)',
              color: '#FFF',
              '&:hover': {
                borderColor: '#FFF',
                bgcolor: 'rgba(255,255,255,0.05)'
              }
            }}
          >
            Details
          </Button>
          {movie.status !== 'Upcoming' ? (
            <Button
              fullWidth
              variant="contained"
              onClick={handleBookNow}
              sx={{
                py: 0.8,
                fontSize: '0.8rem',
                bgcolor: '#C1121F',
                color: '#FFF',
                '&:hover': {
                  bgcolor: '#A00F19'
                }
              }}
            >
              Book Now
            </Button>
          ) : (
            <Button
              fullWidth
              disabled
              variant="contained"
              sx={{
                py: 0.8,
                fontSize: '0.8rem',
                bgcolor: '#333 !important',
                color: '#666 !important'
              }}
            >
              Coming Soon
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default MovieCard;
