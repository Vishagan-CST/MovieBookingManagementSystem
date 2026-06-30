import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, IconButton, Divider } from '@mui/material';
import {
  Facebook,
  Twitter,
  Instagram,
  YouTube,
  Email,
  Phone,
  Room,
  LocalActivity,
} from '@mui/icons-material';

export const Footer: React.FC = () => {
  return (
    <Box sx={{ bgcolor: '#0B0B0B', color: '#FFFFFF', pt: 6, pb: 3, borderTop: '2px solid #C1121F' }}>
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-8">
          {/* About Us */}
          <div className="md:col-span-4">
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <LocalActivity sx={{ color: '#C1121F', mr: 1, fontSize: 28 }} />
              <Typography variant="h6" sx={{ fontWeight: 800, fontFamily: 'Poppins' }}>
                MARVEL<span className="text-[#FFD700] ml-1">CINEMA</span>
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: '#A0A0A0', lineHeight: 1.7, mb: 2 }}>
              Experience cinema at its finest. Marvel Cinema provides state-of-the-art halls, laser crystal-clear screening, IMAX configurations, Dolby Atmos surround sound, and gourmet refreshment options.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton size="small" sx={{ bgcolor: '#1A1A1A', color: '#FFF', '&:hover': { bgcolor: '#C1121F' } }}>
                <Facebook fontSize="small" />
              </IconButton>
              <IconButton size="small" sx={{ bgcolor: '#1A1A1A', color: '#FFF', '&:hover': { bgcolor: '#C1121F' } }}>
                <Twitter fontSize="small" />
              </IconButton>
              <IconButton size="small" sx={{ bgcolor: '#1A1A1A', color: '#FFF', '&:hover': { bgcolor: '#C1121F' } }}>
                <Instagram fontSize="small" />
              </IconButton>
              <IconButton size="small" sx={{ bgcolor: '#1A1A1A', color: '#FFF', '&:hover': { bgcolor: '#C1121F' } }}>
                <YouTube fontSize="small" />
              </IconButton>
            </Box>
          </div>

          {/* Quick Links */}
          <div className="sm:col-span-1 md:col-span-3">
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2.5, color: '#FFD700', borderLeft: '3px solid #C1121F', pl: 1.5 }}>
              Useful Links
            </Typography>
            <div className="flex flex-col gap-2.5 text-sm text-[#A0A0A0]">
              <Link to="/movies" className="hover:text-[#FFD700] transition-colors">Now Showing</Link>
              <Link to="/movies?filter=Upcoming" className="hover:text-[#FFD700] transition-colors">Upcoming Blockbusters</Link>
              <Link to="/about" className="hover:text-[#FFD700] transition-colors">About Us</Link>
              <Link to="/contact" className="hover:text-[#FFD700] transition-colors">Contact & Support</Link>
              <Link to="/login" className="hover:text-[#FFD700] transition-colors">My Account</Link>
            </div>
          </div>

          {/* Information */}
          <div className="sm:col-span-1 md:col-span-2">
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2.5, color: '#FFD700', borderLeft: '3px solid #C1121F', pl: 1.5 }}>
              Information
            </Typography>
            <div className="flex flex-col gap-2.5 text-sm text-[#A0A0A0]">
              <span className="hover:text-[#FFD700] cursor-pointer transition-colors">Terms of Service</span>
              <span className="hover:text-[#FFD700] cursor-pointer transition-colors">Privacy Policy</span>
              <span className="hover:text-[#FFD700] cursor-pointer transition-colors">Refund & Cancellation</span>
              <span className="hover:text-[#FFD700] cursor-pointer transition-colors">Offers & Loyalty</span>
              <span className="hover:text-[#FFD700] cursor-pointer transition-colors">Cinema Locations</span>
            </div>
          </div>

          {/* Contact Details */}
          <div className="md:col-span-3">
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2.5, color: '#FFD700', borderLeft: '3px solid #C1121F', pl: 1.5 }}>
              Contact Us
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                <Room sx={{ color: '#C1121F', mt: 0.2 }} />
                <Typography variant="body2" sx={{ color: '#A0A0A0' }}>
                  100 Cinematic Boulevard, Regal Plaza, Suite 400, Los Angeles, CA 90028
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Phone sx={{ color: '#C1121F' }} />
                <Typography variant="body2" sx={{ color: '#A0A0A0' }}>
                  +1 (555) 987-6543
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Email sx={{ color: '#C1121F' }} />
                <Typography variant="body2" sx={{ color: '#A0A0A0' }}>
                  support@marvelcinema.com
                </Typography>
              </Box>
            </Box>
          </div>
        </div>

        <Divider sx={{ bgcolor: 'rgba(255,255,255,0.08)', my: 4 }} />

        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
          <Typography variant="caption" sx={{ color: '#707070' }}>
            &copy; {new Date().getFullYear()} Marvel Cinema. All rights reserved. Made for premium viewing.
          </Typography>
          <Typography variant="caption" sx={{ color: '#707070' }}>
            Terms & Conditions | Cookies Policy
          </Typography>
        </Box>
      </div>
    </Box>
  );
};

export default Footer;
