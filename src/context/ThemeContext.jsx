import React, { createContext, useContext, useState, useEffect } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { useThemeStorage } from '../hooks/useLocalStorage';
import theme from '../theme/theme';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [storedTheme, setStoredTheme] = useThemeStorage();
  const [mode, setMode] = useState(storedTheme || 'light');

  // Create light and dark themes
  const lightTheme = createTheme({
    ...theme,
    palette: {
      ...theme.palette,
      mode: 'light',
      background: {
        default: '#F7F9FC',
        paper: '#FFFFFF',
      },
      text: {
        primary: 'rgba(0, 0, 0, 0.87)',
        secondary: 'rgba(0, 0, 0, 0.6)',
      },
    },
  });

  const darkTheme = createTheme({
    ...theme,
    palette: {
      ...theme.palette,
      mode: 'dark',
      background: {
        default: '#121212',
        paper: '#1E1E1E',
      },
      text: {
        primary: 'rgba(255, 255, 255, 0.87)',
        secondary: 'rgba(255, 255, 255, 0.6)',
      },
    },
    components: {
      ...theme.components,
      MuiCard: {
        styleOverrides: {
          root: {
            ...theme.components.MuiCard.styleOverrides.root,
            background: 'rgba(30, 30, 30, 0.9)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          },
        },
      },
    },
  });

  // Toggle theme function
  const toggleTheme = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    setStoredTheme(newMode);
  };

  // Set theme function
  const setTheme = (newMode) => {
    if (newMode === 'light' || newMode === 'dark') {
      setMode(newMode);
      setStoredTheme(newMode);
    }
  };

  // Get current theme object
  const currentTheme = mode === 'dark' ? darkTheme : lightTheme;

  // Apply theme to document root for CSS custom properties
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', mode);

    // Set CSS custom properties for glassmorphism effects
    const root = document.documentElement;
    if (mode === 'dark') {
      root.style.setProperty('--glass-bg', 'rgba(30, 30, 30, 0.8)');
      root.style.setProperty('--glass-border', 'rgba(255, 255, 255, 0.1)');
      root.style.setProperty('--glass-shadow', 'rgba(0, 0, 0, 0.3)');
    } else {
      root.style.setProperty('--glass-bg', 'rgba(255, 255, 255, 0.8)');
      root.style.setProperty('--glass-border', 'rgba(0, 0, 0, 0.1)');
      root.style.setProperty('--glass-shadow', 'rgba(0, 0, 0, 0.1)');
    }
  }, [mode]);

  // Check system preference on mount
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      if (!storedTheme) {
        setMode(e.matches ? 'dark' : 'light');
      }
    };

    // Set initial theme based on system preference if no stored theme
    if (!storedTheme) {
      setMode(mediaQuery.matches ? 'dark' : 'light');
    }

    // Listen for system theme changes
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [storedTheme]);

  const value = {
    mode,
    theme: currentTheme,
    toggleTheme,
    setTheme,
    isLight: mode === 'light',
    isDark: mode === 'dark'
  };

  return (
    <ThemeContext.Provider value={value}>
      <MuiThemeProvider theme={currentTheme}>
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeContext;