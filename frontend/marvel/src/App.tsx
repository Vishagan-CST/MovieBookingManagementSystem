import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import theme from './styles/theme';
import { AppProvider } from './context/AppContext';
import { Toaster } from 'react-hot-toast';
import AppRoutes from './routes';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AppProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#222222',
              color: '#ffffff',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '12px',
            },
            success: {
              iconTheme: {
                primary: '#34D399',
                secondary: '#111111',
              },
            },
            error: {
              iconTheme: {
                primary: '#FF5C5C',
                secondary: '#111111',
              },
            },
          }}
        />
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;
