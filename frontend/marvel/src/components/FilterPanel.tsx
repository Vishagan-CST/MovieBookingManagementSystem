import React from 'react';
import { Search, FilterList, Refresh } from '@mui/icons-material';
import { TextField, MenuItem, Select, FormControl, InputLabel, InputAdornment, Button } from '@mui/material';

interface FilterPanelProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedGenre: string;
  setSelectedGenre: (genre: string) => void;
  selectedLanguage: string;
  setSelectedLanguage: (lang: string) => void;
  selectedHall: string;
  setSelectedHall: (hall: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  onClearFilters: () => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  searchQuery,
  setSearchQuery,
  selectedGenre,
  setSelectedGenre,
  selectedLanguage,
  setSelectedLanguage,
  selectedHall,
  setSelectedHall,
  sortBy,
  setSortBy,
  onClearFilters,
}) => {
  const genres = ['Action', 'Sci-Fi', 'Adventure', 'Crime', 'Drama', 'Animation', 'Thriller'];
  const languages = ['English', 'English (Dolby Atmos)', 'English (IMAX)', 'English (Dolby 7.1)'];
  const halls = ['Silver', 'Bronze', 'Platinum'];

  return (
    <div className="bg-[#1A1A1A] p-5 rounded-2xl border border-white/5 shadow-xl mb-8">
      <div className="flex items-center gap-2 mb-4">
        <FilterList className="text-[#C1121F]" />
        <h2 className="text-white font-bold text-lg">Search & Filter Movies</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Search */}
        <TextField
          fullWidth
          size="small"
          placeholder="Search by title, cast, director..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          {...({
            InputProps: {
              startAdornment: (
                <InputAdornment position="start">
                  <Search className="text-gray-400" />
                </InputAdornment>
              ),
            }
          } as any)}
          sx={{
            input: { color: 'white' },
          }}
        />

        {/* Genre Filter */}
        <FormControl fullWidth size="small">
          <InputLabel id="genre-select-label" sx={{ color: '#aaa', '&.Mui-focused': { color: '#FFD700' } }}>Genre</InputLabel>
          <Select
            labelId="genre-select-label"
            value={selectedGenre}
            label="Genre"
            onChange={(e) => setSelectedGenre(e.target.value)}
            sx={{
              color: 'white',
              '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.1)' },
            }}
          >
            <MenuItem value="">All Genres</MenuItem>
            {genres.map(g => (
              <MenuItem key={g} value={g}>{g}</MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Language Filter */}
        <FormControl fullWidth size="small">
          <InputLabel id="lang-select-label" sx={{ color: '#aaa', '&.Mui-focused': { color: '#FFD700' } }}>Language</InputLabel>
          <Select
            labelId="lang-select-label"
            value={selectedLanguage}
            label="Language"
            onChange={(e) => setSelectedLanguage(e.target.value)}
            sx={{
              color: 'white',
              '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.1)' },
            }}
          >
            <MenuItem value="">All Languages</MenuItem>
            {languages.map(l => (
              <MenuItem key={l} value={l}>{l}</MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Cinema Hall Filter */}
        <FormControl fullWidth size="small">
          <InputLabel id="hall-select-label" sx={{ color: '#aaa', '&.Mui-focused': { color: '#FFD700' } }}>Cinema Hall</InputLabel>
          <Select
            labelId="hall-select-label"
            value={selectedHall}
            label="Cinema Hall"
            onChange={(e) => setSelectedHall(e.target.value)}
            sx={{
              color: 'white',
              '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.1)' },
            }}
          >
            <MenuItem value="">All Halls</MenuItem>
            {halls.map(h => (
              <MenuItem key={h} value={h}>{h}</MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Sort By */}
        <FormControl fullWidth size="small">
          <InputLabel id="sort-select-label" sx={{ color: '#aaa', '&.Mui-focused': { color: '#FFD700' } }}>Sort By</InputLabel>
          <Select
            labelId="sort-select-label"
            value={sortBy}
            label="Sort By"
            onChange={(e) => setSortBy(e.target.value)}
            sx={{
              color: 'white',
              '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.1)' },
            }}
          >
            <MenuItem value="latest">Release Date (Latest)</MenuItem>
            <MenuItem value="popular">Popularity (Rating)</MenuItem>
            <MenuItem value="title">Alphabetical (A-Z)</MenuItem>
          </Select>
        </FormControl>
      </div>

      {(searchQuery || selectedGenre || selectedLanguage || selectedHall) && (
        <div className="flex justify-end mt-4">
          <Button
            size="small"
            startIcon={<Refresh />}
            onClick={onClearFilters}
            sx={{
              color: '#FFD700',
              '&:hover': {
                bgcolor: 'rgba(255, 215, 0, 0.05)'
              }
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;
