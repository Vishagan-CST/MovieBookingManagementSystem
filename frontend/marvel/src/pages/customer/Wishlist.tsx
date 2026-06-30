import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Header from '../../components/Header';
import { Card, Button } from '@mui/material';
import { Favorite, LocalActivity, Delete } from '@mui/icons-material';

export const Wishlist: React.FC = () => {
  const { wishlist, movies, toggleWishlist } = useApp();
  const navigate = useNavigate();

  const favoriteMovies = useMemo(() => {
    return movies.filter(m => wishlist.includes(m.id));
  }, [movies, wishlist]);

  const breadcrumbs = [
    { label: 'Dashboard', path: '/customer' },
    { label: 'Wishlist' }
  ];

  return (
    <div className="space-y-8">
      <Header title="My Favorite Movies" breadcrumbs={breadcrumbs} />

      {favoriteMovies.length === 0 ? (
        <div className="bg-[#1A1A1A] p-12 text-center rounded-2xl border border-white/5">
          <Favorite className="text-gray-600 mb-3 mx-auto" sx={{ fontSize: 48 }} />
          <p className="text-sm text-gray-400">Your wishlist is empty. Browse movies to add favorites!</p>
          <Button
            variant="contained"
            onClick={() => navigate('/movies')}
            sx={{ bgcolor: '#C1121F', mt: 3, '&:hover': { bgcolor: '#A00F19' } }}
          >
            Browse Movies
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {favoriteMovies.map((movie) => (
            <div key={movie.id}>
              <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                {/* Poster */}
                <div className="relative aspect-[2/3] w-full overflow-hidden">
                  <img src={movie.posterUrl} alt={movie.title} className="w-full h-full object-cover" />
                  <div className="absolute top-3 right-3 bg-black/85 px-2.5 py-1 rounded-lg text-xs font-bold text-amber-400">
                    ★ {movie.rating}
                  </div>
                </div>
                
                {/* Info block */}
                <div className="p-4 flex-grow flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-white text-base truncate">{movie.title}</h4>
                    <p className="text-xs text-gray-500 mt-1">{movie.genre.join(', ')}</p>
                  </div>
                  
                  <div className="flex gap-2 mt-4 pt-3 border-t border-white/5">
                    <Button
                      fullWidth
                      variant="outlined"
                      size="small"
                      startIcon={<Delete />}
                      onClick={() => toggleWishlist(movie.id)}
                      sx={{ color: '#FF6B6B', borderColor: 'rgba(255, 107, 107, 0.2)', '&:hover': { borderColor: '#FF6B6B', bgcolor: 'rgba(255, 107, 107, 0.05)' } }}
                    >
                      Remove
                    </Button>
                    <Button
                      fullWidth
                      variant="contained"
                      size="small"
                      startIcon={<LocalActivity />}
                      onClick={() => navigate(`/booking?movieId=${movie.id}`)}
                      sx={{ bgcolor: '#C1121F', '&:hover': { bgcolor: '#A00F19' } }}
                    >
                      Book
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default Wishlist;
