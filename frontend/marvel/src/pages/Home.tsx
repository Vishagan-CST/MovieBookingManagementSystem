import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import MovieCard from '../components/MovieCard';
import { motion } from 'framer-motion';
import { LocalActivity, Loyalty, Star, InfoOutlined } from '@mui/icons-material';
import { Button, Card } from '@mui/material';

export const Home: React.FC = () => {
  const { movies, offers, testimonials } = useApp();
  const navigate = useNavigate();

  // Find a popular movie to display as featured hero
  const heroMovie = movies.find(m => m.id === 'mov_1') || movies[0];
  const nowShowing = movies.filter(m => m.status === 'Now Showing');
  const upcoming = movies.filter(m => m.status === 'Upcoming');

  return (
    <div className="bg-[#111111] text-white min-h-screen">
      
      {/* 1. HERO SECTION */}
      {heroMovie && (
        <div className="relative h-[80vh] md:h-[90vh] w-full flex items-center overflow-hidden">
          {/* Backdrop Image */}
          <div className="absolute inset-0 z-0">
            <img
              src={heroMovie.backdropUrl || heroMovie.posterUrl}
              alt={heroMovie.title}
              className="w-full h-full object-cover object-top opacity-35 scale-105"
            />
            {/* Cinematic Gradients Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#111111] via-[#111111]/80 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-[#111111]/30" />
          </div>

          {/* Hero Content */}
          <div className="max-w-7xl mx-auto px-4 md:px-6 w-full relative z-10">
            <div className="max-w-2xl">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center gap-2 mb-3"
              >
                <span className="bg-[#C1121F] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                  Featured blockbusters
                </span>
                <span className="flex items-center gap-1 text-amber-400 font-bold text-sm">
                  <Star className="!text-base" /> {heroMovie.rating.toFixed(1)} IMDB
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl md:text-6xl font-extrabold text-white tracking-tight font-poppins leading-tight"
              >
                {heroMovie.title}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-gray-350 text-sm md:text-base mt-4 line-clamp-3 leading-relaxed"
              >
                {heroMovie.description}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-wrap gap-4 mt-8"
              >
                <Button
                  variant="contained"
                  onClick={() => navigate(`/booking?movieId=${heroMovie.id}`)}
                  startIcon={<LocalActivity />}
                  sx={{
                    bgcolor: '#C1121F',
                    px: 4,
                    py: 1.5,
                    fontSize: '1rem',
                    '&:hover': { bgcolor: '#A00F19' }
                  }}
                >
                  Book Tickets
                </Button>
                <Button
                  variant="outlined"
                  component={Link}
                  to={`/movie/${heroMovie.id}`}
                  startIcon={<InfoOutlined />}
                  sx={{
                    color: '#FFFFFF',
                    borderColor: 'rgba(255,255,255,0.3)',
                    px: 4,
                    py: 1.5,
                    fontSize: '1rem',
                    '&:hover': { borderColor: '#FFFFFF', bgcolor: 'rgba(255,255,255,0.05)' }
                  }}
                >
                  View Details
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-16 space-y-24">
        
        {/* 2. NOW SHOWING SECTION */}
        <section>
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white font-poppins">
                Now <span className="text-[#C1121F]">Showing</span>
              </h2>
              <p className="text-gray-400 text-sm mt-1">Book your tickets for movies playing today</p>
            </div>
            <Link to="/movies" className="text-[#FFD700] hover:underline font-semibold text-sm">
              See All Movies
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {nowShowing.slice(0, 4).map((movie) => (
              <div key={movie.id}>
                <MovieCard movie={movie} />
              </div>
            ))}
          </div>
        </section>

        {/* 3. FEATURED CINEMA - REGAL CINEMA */}
        <section className="bg-gradient-to-r from-red-950/20 via-black to-[#111111] p-8 md:p-12 rounded-3xl border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/5 rounded-full blur-[80px] pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-2 mb-3 text-[#FFD700]">
                <LocalActivity />
                <span className="font-bold tracking-widest uppercase text-sm">Featured Location</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white font-poppins leading-tight">
                Regal Cinema Hall Experience
              </h2>
              <p className="text-gray-400 text-sm md:text-base mt-4 leading-relaxed">
                Our flagship destination features three distinct auditorium types, each customized to give you the perfect cinematic immersion. Experience movie screening in high-fidelity comfort.
              </p>
              
              <div className="grid grid-cols-3 gap-4 mt-8 bg-black/40 p-5 rounded-2xl border border-white/5">
                <div>
                  <h4 className="font-bold text-[#FFD700] text-lg">Silver</h4>
                  <p className="text-xs text-gray-500 mt-1">Standard premium luxury layout.</p>
                </div>
                <div>
                  <h4 className="font-bold text-[#FFD700] text-lg">Bronze</h4>
                  <p className="text-xs text-gray-500 mt-1">Economic, massive screens.</p>
                </div>
                <div>
                  <h4 className="font-bold text-[#FFD700] text-lg">Platinum</h4>
                  <p className="text-xs text-gray-500 mt-1">Ultimate luxury recliners & butler.</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-[#1A1A1A] p-6 rounded-2xl border border-white/5">
                <span className="text-xs text-[#C1121F] font-bold tracking-widest uppercase">Dolby Sound</span>
                <h4 className="font-bold text-white text-lg mt-1">Atmos Surround</h4>
                <p className="text-xs text-gray-450 mt-2">Hear overhead soundscapes with pin-point cinematic accuracy.</p>
              </div>
              <div className="bg-[#1A1A1A] p-6 rounded-2xl border border-white/5">
                <span className="text-xs text-[#FFD700] font-bold tracking-widest uppercase">Ultimate Comfort</span>
                <h4 className="font-bold text-white text-lg mt-1">Plush Recliners</h4>
                <p className="text-xs text-gray-450 mt-2">Enjoy full lumbar support and electronic leg-rest configurations.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. UPCOMING MOVIES */}
        <section>
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white font-poppins">
                Upcoming <span className="text-[#FFD700]">Blockbusters</span>
              </h2>
              <p className="text-gray-400 text-sm mt-1">Exclusively arriving soon to Marvel Cinema</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {upcoming.slice(0, 4).map((movie) => (
              <div key={movie.id}>
                <MovieCard movie={movie} />
              </div>
            ))}
          </div>
        </section>

        {/* 5. PROMO OFFERS */}
        <section>
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white font-poppins">
              Exclusive <span className="text-[#C1121F]">Offers</span>
            </h2>
            <p className="text-gray-400 text-sm mt-1">Save big on booking tickets and meals combo</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {offers.map((offer) => (
              <motion.div
                key={offer.id}
                whileHover={{ y: -5 }}
                className="bg-[#1A1A1A] p-6 rounded-2xl border border-white/5 flex flex-col justify-between relative overflow-hidden group shadow-lg"
              >
                {/* Decorative background badge */}
                <Loyalty className="absolute -bottom-8 -right-8 text-white/5 !text-9xl group-hover:text-white/10 transition-colors" />
                
                <div>
                  <div className="bg-[#C1121F]/10 px-3 py-1 rounded text-xs font-bold text-[#C1121F] w-fit mb-3">
                    CODE: {offer.code}
                  </div>
                  <h3 className="font-bold text-white text-lg">{offer.title}</h3>
                  <p className="text-xs text-gray-405 mt-2 leading-relaxed">{offer.description}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center relative z-10">
                  <span className="text-xs text-gray-500 font-bold">Expires: {offer.expiryDate}</span>
                  <span className="text-sm text-[#FFD700] font-bold">Save {offer.discountPercentage}%</span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 6. TESTIMONIALS */}
        <section className="pb-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white font-poppins">
              What Our <span className="text-[#FFD700]">Audiences Say</span>
            </h2>
            <p className="text-gray-450 text-sm mt-2">Hear directly from moviegoers who enjoy Marvel Cinema</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((test) => (
              <Card key={test.id} sx={{ p: 4, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                <div>
                  <div className="flex gap-1 mb-4 text-[#FFD700]">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} sx={{ fontSize: 18 }} />
                    ))}
                  </div>
                  <p className="text-[#BBB] text-sm italic leading-relaxed mb-6">
                    "{test.comment}"
                  </p>
                </div>
                <div className="flex items-center gap-3.5 mt-auto">
                  <img src={test.avatarUrl} alt={test.userName} className="w-10 h-10 rounded-full border border-[#C1121F]" />
                  <div>
                    <h5 className="font-bold text-white text-sm">{test.userName}</h5>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Verified Moviegoer</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};

export default Home;
