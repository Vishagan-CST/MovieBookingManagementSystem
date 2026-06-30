import React, { useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import MovieCard from '../components/MovieCard';
import FilterPanel from '../components/FilterPanel';
import { Button } from '@mui/material';
import { Refresh } from '@mui/icons-material';

export const Movies: React.FC = () => {
  const { movies } = useApp();
  const location = useLocation();

  // Extract initial status filter from URL (e.g. from Home page link "?filter=Upcoming")
  const queryParams = new URLSearchParams(location.search);
  const initialFilter = queryParams.get('filter') || '';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedHall, setSelectedHall] = useState(initialFilter === 'Upcoming' ? '' : '');
  const [statusFilter, setStatusFilter] = useState<string>(initialFilter);
  const [sortBy, setSortBy] = useState('latest');

  const onClearFilters = () => {
    setSearchQuery('');
    setSelectedGenre('');
    setSelectedLanguage('');
    setSelectedHall('');
    setStatusFilter('');
    setSortBy('latest');
  };

  // Perform search, filter, and sorting calculations
  const processedMovies = useMemo(() => {
    let result = [...movies];

    // Status filter (Now Showing / Upcoming / Popular)
    if (statusFilter) {
      result = result.filter(m => m.status.toLowerCase() === statusFilter.toLowerCase());
    }

    // Text search (Title, Director, Cast)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        m =>
          m.title.toLowerCase().includes(q) ||
          m.director.toLowerCase().includes(q) ||
          m.cast.some(actor => actor.toLowerCase().includes(q))
      );
    }

    // Genre filter
    if (selectedGenre) {
      result = result.filter(m => m.genre.includes(selectedGenre));
    }

    // Language filter
    if (selectedLanguage) {
      result = result.filter(m => m.language === selectedLanguage);
    }

    // Cinema Hall filter
    if (selectedHall) {
      result = result.filter(m => m.cinemaHalls.includes(selectedHall));
    }

    // Sort order
    if (sortBy === 'latest') {
      result.sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime());
    } else if (sortBy === 'popular') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'title') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }

    return result;
  }, [movies, searchQuery, selectedGenre, selectedLanguage, selectedHall, statusFilter, sortBy]);

  return (
    <div className="bg-[#111111] min-h-screen text-white py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        
        {/* Header Title */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight font-poppins">
              Explore Our <span className="text-[#C1121F]">Movies Catalogue</span>
            </h1>
            <p className="text-gray-400 text-sm mt-1">Search or filter through your favorite shows</p>
          </div>

          {/* Quick tab controls */}
          <div className="flex gap-2 bg-black/40 p-1.5 rounded-xl border border-white/5 w-fit">
            <button
              onClick={() => setStatusFilter('')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
                statusFilter === '' ? 'bg-[#C1121F] text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter('Now Showing')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
                statusFilter === 'Now Showing' ? 'bg-[#C1121F] text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              Now Showing
            </button>
            <button
              onClick={() => setStatusFilter('Upcoming')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
                statusFilter === 'Upcoming' ? 'bg-[#C1121F] text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              Upcoming
            </button>
          </div>
        </div>

        {/* Filter Panel */}
        <FilterPanel
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedGenre={selectedGenre}
          setSelectedGenre={setSelectedGenre}
          selectedLanguage={selectedLanguage}
          setSelectedLanguage={setSelectedLanguage}
          selectedHall={selectedHall}
          setSelectedHall={setSelectedHall}
          sortBy={sortBy}
          setSortBy={setSortBy}
          onClearFilters={onClearFilters}
        />

        {/* Result Stats */}
        <div className="mb-6 flex justify-between items-center text-xs text-gray-500 font-bold uppercase tracking-wider">
          <span>Found {processedMovies.length} movies</span>
        </div>

        {/* Movies Grid */}
        {processedMovies.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-[#1A1A1A] rounded-3xl border border-white/5 text-center px-4">
            <h3 className="text-white font-bold text-lg mb-2">No Movies Found</h3>
            <p className="text-gray-400 text-sm max-w-sm mb-6 leading-relaxed">
              We couldn't find any results matching your search terms. Try clearing or expanding your filter selections.
            </p>
            <Button
              variant="contained"
              startIcon={<Refresh />}
              onClick={onClearFilters}
              sx={{ bgcolor: '#C1121F', '&:hover': { bgcolor: '#A00F19' } }}
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {processedMovies.map((movie) => (
              <div key={movie.id}>
                <MovieCard movie={movie} />
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default Movies;
