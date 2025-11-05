import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { Box, CssBaseline, GlobalStyles } from '@mui/material';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';

// Lazy load pages for better performance
const Home = React.lazy(() => import('./pages/Home'));
const EventDetails = React.lazy(() => import('./pages/EventDetails'));
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));
const Profile = React.lazy(() => import('./pages/Profile'));
const NotFound = React.lazy(() => import('./pages/NotFound'));

// Global styles for glassmorphism effects
const globalStyles = (
  <GlobalStyles
    styles={(theme) => ({
      ':root': {
        '--glass-bg': theme.palette.mode === 'dark'
          ? 'rgba(30, 30, 30, 0.8)'
          : 'rgba(255, 255, 255, 0.8)',
        '--glass-border': theme.palette.mode === 'dark'
          ? 'rgba(255, 255, 255, 0.1)'
          : 'rgba(0, 0, 0, 0.1)',
        '--glass-shadow': theme.palette.mode === 'dark'
          ? 'rgba(0, 0, 0, 0.3)'
          : 'rgba(0, 0, 0, 0.1)',
      },
      'body': {
        margin: 0,
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
        lineHeight: 1.6,
        '-webkit-font-smoothing': 'antialiased',
        '-moz-osx-font-smoothing': 'grayscale',
      },
      '*': {
        boxSizing: 'border-box',
      },
      'html': {
        scrollBehavior: 'smooth',
      },
      'a': {
        color: 'inherit',
        textDecoration: 'none',
      },
      '::-webkit-scrollbar': {
        width: '8px',
      },
      '::-webkit-scrollbar-track': {
        background: 'var(--glass-bg)',
      },
      '::-webkit-scrollbar-thumb': {
        background: 'var(--glass-border)',
        borderRadius: '4px',
        '&:hover': {
          background: theme.palette.primary.main,
        },
      },
    })}
  />
);

// Loading component for lazy loaded pages
const PageLoader = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '60vh',
      flexDirection: 'column',
      gap: 2
    }}
  >
    <Box
      sx={{
        width: 40,
        height: 40,
        border: '3px solid var(--glass-border)',
        borderTop: '3px solid primary.main',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        '@keyframes spin': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        }
      }}
    />
    <Typography variant="body2" color="text.secondary">
      Loading...
    </Typography>
  </Box>
);

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <CssBaseline />
          {globalStyles}

          <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />

            <Box component="main" sx={{ flexGrow: 1 }}>
              <React.Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/events" element={<Home />} />
                  <Route path="/event/:id" element={<EventDetails />} />
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/me" element={<Profile />} />
                  <Route path="/404" element={<NotFound />} />
                  <Route path="*" element={<Navigate to="/404" replace />} />
                </Routes>
              </React.Suspense>
            </Box>

            <Footer />
          </Box>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
