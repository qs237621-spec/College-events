import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4A90E2', // Electric blue
      light: '#7BB8F5',
      dark: '#2C7CD1',
    },
    secondary: {
      main: '#FFC107', // Golden yellow
      light: '#FFD54F',
      dark: '#F57C00',
    },
    accent: {
      main: '#00C9A7', // Teal for prominent actions
      light: '#1EE0C4',
      dark: '#00A080',
    },
    background: {
      default: '#F7F9FC', // Soft off-white
      paper: '#FFFFFF',
    },
    error: {
      main: '#E74C3C',
    },
    warning: {
      main: '#F39C12',
    },
    success: {
      main: '#27AE60',
    },
    text: {
      primary: 'rgba(0, 0, 0, 0.87)',
      secondary: 'rgba(0, 0, 0, 0.6)',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontFamily: '"Poppins", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      fontWeight: 700,
      fontSize: '3.5rem',
      lineHeight: 1.2,
    },
    h2: {
      fontFamily: '"Poppins", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      fontWeight: 700,
      fontSize: '2.75rem',
      lineHeight: 1.3,
    },
    h3: {
      fontFamily: '"Poppins", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      fontWeight: 600,
      fontSize: '2.25rem',
      lineHeight: 1.3,
    },
    h4: {
      fontFamily: '"Poppins", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      fontWeight: 600,
      fontSize: '1.75rem',
      lineHeight: 1.4,
    },
    h5: {
      fontFamily: '"Poppins", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.4,
    },
    h6: {
      fontFamily: '"Poppins", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.5,
    },
    body1: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      fontWeight: 400,
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      fontWeight: 400,
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    button: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      fontWeight: 500,
      fontSize: '0.875rem',
      textTransform: 'none',
    },
    caption: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      fontWeight: 400,
      fontSize: '0.75rem',
      lineHeight: 1.4,
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0px 2px 1px -1px rgba(0,0,0,0.1),0px 1px 1px 0px rgba(0,0,0,0.07),0px 1px 3px 0px rgba(0,0,0,0.06)',
    '0px 3px 1px -2px rgba(0,0,0,0.1),0px 2px 2px 0px rgba(0,0,0,0.07),0px 1px 5px 0px rgba(0,0,0,0.06)',
    '0px 3px 3px -2px rgba(0,0,0,0.1),0px 3px 4px 0px rgba(0,0,0,0.07),0px 1px 8px 0px rgba(0,0,0,0.06)',
    '0px 2px 4px -1px rgba(0,0,0,0.1),0px 4px 5px 0px rgba(0,0,0,0.07),0px 1px 10px 0px rgba(0,0,0,0.06)',
    '0px 3px 5px -1px rgba(0,0,0,0.1),0px 5px 8px 0px rgba(0,0,0,0.07),0px 1px 14px 0px rgba(0,0,0,0.06)',
    '0px 3px 5px -1px rgba(0,0,0,0.1),0px 6px 10px 0px rgba(0,0,0,0.07),0px 1px 18px 0px rgba(0,0,0,0.06)',
    '0px 4px 7px -1px rgba(0,0,0,0.1),0px 8px 14px 2px rgba(0,0,0,0.07),0px 3px 14px 2px rgba(0,0,0,0.06)',
    '0px 5px 8px -3px rgba(0,0,0,0.1),0px 8px 16px 3px rgba(0,0,0,0.07),0px 3px 18px 3px rgba(0,0,0,0.06)',
    '0px 5px 10px -3px rgba(0,0,0,0.1),0px 10px 20px 4px rgba(0,0,0,0.07),0px 4px 20px 5px rgba(0,0,0,0.06)',
    '0px 6px 12px -3px rgba(0,0,0,0.1),0px 12px 24px 5px rgba(0,0,0,0.07),0px 5px 24px 6px rgba(0,0,0,0.06)',
    '0px 7px 14px -4px rgba(0,0,0,0.1),0px 14px 28px 6px rgba(0,0,0,0.07),0px 6px 28px 8px rgba(0,0,0,0.06)',
    '0px 7px 16px -4px rgba(0,0,0,0.1),0px 16px 32px 8px rgba(0,0,0,0.07),0px 7px 32px 10px rgba(0,0,0,0.06)',
    '0px 8px 18px -5px rgba(0,0,0,0.1),0px 18px 36px 10px rgba(0,0,0,0.07),0px 8px 36px 12px rgba(0,0,0,0.06)',
    '0px 9px 20px -5px rgba(0,0,0,0.1),0px 20px 40px 12px rgba(0,0,0,0.07),0px 9px 40px 14px rgba(0,0,0,0.06)',
    '0px 10px 22px -5px rgba(0,0,0,0.1),0px 22px 44px 14px rgba(0,0,0,0.07),0px 10px 44px 16px rgba(0,0,0,0.06)',
    '0px 11px 24px -6px rgba(0,0,0,0.1),0px 24px 48px 16px rgba(0,0,0,0.07),0px 11px 48px 18px rgba(0,0,0,0.06)',
    '0px 12px 26px -6px rgba(0,0,0,0.1),0px 26px 52px 18px rgba(0,0,0,0.07),0px 12px 52px 20px rgba(0,0,0,0.06)',
    '0px 13px 28px -6px rgba(0,0,0,0.1),0px 28px 56px 20px rgba(0,0,0,0.07),0px 13px 56px 22px rgba(0,0,0,0.06)',
    '0px 14px 30px -7px rgba(0,0,0,0.1),0px 30px 60px 22px rgba(0,0,0,0.07),0px 14px 60px 24px rgba(0,0,0,0.06)',
    '0px 15px 32px -7px rgba(0,0,0,0.1),0px 32px 64px 24px rgba(0,0,0,0.07),0px 15px 64px 26px rgba(0,0,0,0.06)',
    '0px 16px 34px -7px rgba(0,0,0,0.1),0px 34px 68px 26px rgba(0,0,0,0.07),0px 16px 68px 28px rgba(0,0,0,0.06)',
    '0px 17px 36px -8px rgba(0,0,0,0.1),0px 36px 72px 28px rgba(0,0,0,0.07),0px 17px 72px 30px rgba(0,0,0,0.06)',
    '0px 18px 38px -8px rgba(0,0,0,0.1),0px 38px 76px 30px rgba(0,0,0,0.07),0px 18px 76px 32px rgba(0,0,0,0.06)',
    '0px 19px 40px -8px rgba(0,0,0,0.1),0px 40px 80px 32px rgba(0,0,0,0.07),0px 19px 80px 34px rgba(0,0,0,0.06)',
    '0px 20px 42px -9px rgba(0,0,0,0.1),0px 42px 84px 34px rgba(0,0,0,0.07),0px 20px 84px 36px rgba(0,0,0,0.06)',
    '0px 21px 44px -9px rgba(0,0,0,0.1),0px 44px 88px 36px rgba(0,0,0,0.07),0px 21px 88px 38px rgba(0,0,0,0.06)',
    '0px 22px 46px -9px rgba(0,0,0,0.1),0px 46px 92px 38px rgba(0,0,0,0.07),0px 22px 92px 40px rgba(0,0,0,0.06)',
    '0px 23px 48px -10px rgba(0,0,0,0.1),0px 48px 96px 40px rgba(0,0,0,0.07),0px 23px 96px 42px rgba(0,0,0,0.06)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 24px',
          fontWeight: 500,
          textTransform: 'none',
        },
        contained: {
          boxShadow: '0 4px 12px rgba(74, 144, 226, 0.3)',
          '&:hover': {
            boxShadow: '0 6px 16px rgba(74, 144, 226, 0.4)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
          backdropFilter: 'blur(10px)',
          background: 'rgba(255, 255, 255, 0.9)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          fontWeight: 500,
        },
      },
    },
  },
});

export default theme;