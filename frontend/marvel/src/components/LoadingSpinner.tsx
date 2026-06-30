import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

export const LoadingSpinner: React.FC = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        width: '100%',
        gap: 2,
      }}
    >
      <CircularProgress
        size={60}
        thickness={4.5}
        sx={{
          color: '#C1121F', // Marvel Red
        }}
      />
      <span className="text-gray-400 font-medium text-sm animate-pulse tracking-widest uppercase">
        Loading Cinema Experience...
      </span>
    </Box>
  );
};

export default LoadingSpinner;
