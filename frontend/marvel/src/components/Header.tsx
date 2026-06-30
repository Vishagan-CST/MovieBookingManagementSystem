import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Breadcrumbs, Typography, IconButton } from '@mui/material';
import { Home, NavigateNext, ArrowBack } from '@mui/icons-material';

interface HeaderProps {
  title: string;
  breadcrumbs: { label: string; path?: string }[];
}

export const Header: React.FC<HeaderProps> = ({ title, breadcrumbs }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-6 mb-6 border-b border-white/5">
      <div>
        <Breadcrumbs
          separator={<NavigateNext fontSize="small" className="text-gray-600" />}
          aria-label="breadcrumb"
          sx={{ mb: 1 }}
        >
          <Link to="/" className="text-gray-500 hover:text-white flex items-center gap-1 text-xs transition-colors">
            <Home fontSize="inherit" />
            Home
          </Link>
          {breadcrumbs.map((bc, idx) => {
            const isLast = idx === breadcrumbs.length - 1;
            return isLast ? (
              <Typography key={idx} variant="caption" className="text-gray-300 font-medium">
                {bc.label}
              </Typography>
            ) : (
              <Link
                key={idx}
                to={bc.path || '#'}
                className="text-gray-500 hover:text-white text-xs transition-colors"
              >
                {bc.label}
              </Link>
            );
          })}
        </Breadcrumbs>
        
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          {title}
        </h1>
      </div>

      <div className="mt-4 md:mt-0 flex gap-2">
        <IconButton
          onClick={() => navigate(-1)}
          sx={{
            bgcolor: 'rgba(255, 255, 255, 0.03)',
            color: 'white',
            border: '1px solid rgba(255,255,255,0.05)',
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.08)'
            }
          }}
        >
          <ArrowBack />
        </IconButton>
      </div>
    </div>
  );
};

export default Header;
