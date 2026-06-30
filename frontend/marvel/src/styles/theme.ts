import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#C1121F', // Marvel Red
      light: '#E63946',
      dark: '#780000',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#111111', // Cinematic Black
      light: '#222222',
      dark: '#000000',
      contrastText: '#FFFFFF',
    },
    warning: {
      main: '#FFD700', // Gold Accent
    },
    background: {
      default: '#111111',
      paper: '#1A1A1A',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#B0B0B0',
    },
  },
  typography: {
    fontFamily: 'Poppins, Roboto, sans-serif',
    h1: {
      fontWeight: 800,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 700,
    },
    h4: {
      fontWeight: 600,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      borderRadius: 9999, // Pill buttons
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 30,
          padding: '8px 24px',
          fontWeight: 600,
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 20px rgba(193, 18, 31, 0.4)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#1A1A1A',
          borderRadius: 16,
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.5)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          overflow: 'hidden',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            backgroundColor: '#222222',
            '& fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.1)',
            },
            '&:hover fieldset': {
              borderColor: '#C1121F',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#FFD700',
            },
          },
        },
      },
    },
  },
});

export default theme;
