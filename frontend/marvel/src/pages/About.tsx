import React from 'react';
import { TheaterComedy, Star, WorkspacePremium, Devices } from '@mui/icons-material';

export const About: React.FC = () => {
  const stats = [
    { label: 'Screens Worldwide', value: '450+' },
    { label: 'Annual Visitors', value: '12M+' },
    { label: 'Premium Gold Lounges', value: '85' },
    { label: 'Rating on Trustpilot', value: '4.8★' }
  ];

  return (
    <div className="bg-[#111111] text-white min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 md:px-6 space-y-16">
        
        {/* Title */}
        <div className="text-center max-w-xl mx-auto">
          <span className="text-[#C1121F] font-bold text-xs uppercase tracking-widest bg-red-600/10 px-3.5 py-1.5 rounded-full">
            Our Story
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold font-poppins mt-4 tracking-tight leading-tight">
            About Marvel Cinema
          </h1>
          <p className="text-gray-400 text-sm md:text-base mt-3">
            Redefining your theatrical cinematic experience since 2012.
          </p>
        </div>

        {/* Narrative / Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold font-poppins text-white leading-snug">
              Every Frame is a Masterpiece, <span className="text-[#FFD700]">Every Note is Alive</span>
            </h2>
            <p className="text-gray-300 leading-relaxed text-sm md:text-base">
              Marvel Cinema started with a simple vision: to bridge the gap between simple film projection and absolute, breathtaking audience immersion. We believe that stepping into a cinema should be a magical escape.
            </p>
            <p className="text-gray-300 leading-relaxed text-sm md:text-base">
              Over the years, we have pioneered the installation of double-laser 4K projection systems, Dolby Atmos surround setups, and our signature Platinum auditoriums featuring bespoke recliners and gourmet restaurant dine-in options.
            </p>
          </div>
          <div className="lg:col-span-6">
            <div className="relative rounded-3xl overflow-hidden border border-white/10 aspect-video shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80"
                alt="Cinema Hall View"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent" />
            </div>
          </div>
        </div>

        {/* Key Features */}
        <div className="pt-8">
          <h3 className="text-2xl font-bold text-center mb-10 font-poppins text-[#FFD700]">
            The Marvel Cinema Advantage
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-[#1A1A1A] p-6 rounded-2xl border border-white/5 text-center">
              <div className="bg-[#C1121F]/10 w-fit p-3 rounded-full mx-auto mb-4 text-[#C1121F]">
                <TheaterComedy fontSize="large" />
              </div>
              <h4 className="font-bold text-white text-base">Laser Screenings</h4>
              <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                Enjoy 4K dual-laser crisp color projections with 80% higher contrast ratios.
              </p>
            </div>
            
            <div className="bg-[#1A1A1A] p-6 rounded-2xl border border-white/5 text-center">
              <div className="bg-amber-400/10 w-fit p-3 rounded-full mx-auto mb-4 text-[#FFD700]">
                <Star fontSize="large" />
              </div>
              <h4 className="font-bold text-white text-base">Atmos Surround</h4>
              <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                Overhead soundscapes that put you exactly in the middle of all the action.
              </p>
            </div>

            <div className="bg-[#1A1A1A] p-6 rounded-2xl border border-white/5 text-center">
              <div className="bg-emerald-500/10 w-fit p-3 rounded-full mx-auto mb-4 text-emerald-400">
                <WorkspacePremium fontSize="large" />
              </div>
              <h4 className="font-bold text-white text-base">Platinum Lounges</h4>
              <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                Bespoke leather recliners, phone charging ports, and table servers.
              </p>
            </div>

            <div className="bg-[#1A1A1A] p-6 rounded-2xl border border-white/5 text-center">
              <div className="bg-indigo-600/10 w-fit p-3 rounded-full mx-auto mb-4 text-indigo-400">
                <Devices fontSize="large" />
              </div>
              <h4 className="font-bold text-white text-base">Digital Booking</h4>
              <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                Select your seats online in seconds, pre-order foods, and print direct tickets.
              </p>
            </div>
          </div>
        </div>

        {/* Statistics Grid */}
        <div className="bg-black/30 py-8 px-6 rounded-3xl border border-white/5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, idx) => (
              <div key={idx}>
                <h4 className="text-3xl md:text-4xl font-extrabold text-[#C1121F] font-poppins">{stat.value}</h4>
                <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default About;
