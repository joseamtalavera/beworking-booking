/**
 * Unified MUI theme configuration for beworking booking.
 * Matches beworking-frontend theme: Green primary buttons + editorial typography.
 */
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    brand: {
      green: '#009624',
      greenHover: '#007a1d',
      orange: '#fb923c',
      orangeHover: '#ea580c',
      orangeSoft: 'rgba(251, 146, 60, 0.08)',
      ink: '#1a1a1a',
      inkLight: '#2d2d2d',
      graphite: '#4a4a4a',
      muted: '#71717a',
      dark: '#1a1a1a',
      lightBg: '#fafafa',
      warmWhite: '#f8f8f6',
      border: '#e5e5e5',
      borderSoft: '#eeeeee',
      accentSoft: 'rgba(0, 150, 36, 0.06)',
      accentMedium: 'rgba(0, 150, 36, 0.12)',
    },
    primary: {
      main: '#009624',
      light: '#2ecc71',
      dark: '#007a1d',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#fb923c',
      light: '#fdba74',
      dark: '#ea580c',
      contrastText: '#ffffff',
    },
    success: {
      main: '#009624',
      light: '#2ecc71',
      dark: '#007a1d',
      contrastText: '#fff',
    },
    info: {
      main: '#3b82f6',
      light: '#60a5fa',
      dark: '#2563eb',
      contrastText: '#fff',
    },
    error: {
      main: '#dc2626',
      light: '#ef4444',
      dark: '#b91c1c',
      contrastText: '#fff',
    },
    warning: {
      main: '#f59e0b',
      light: '#fbbf24',
      dark: '#d97706',
      contrastText: '#000',
    },
    background: {
      default: '#fafafa',
      paper: '#ffffff',
    },
    text: {
      primary: '#1a1a1a',
      secondary: '#71717a',
      disabled: '#a1a1aa',
    },
    divider: 'rgba(0, 0, 0, 0.06)',
    grey: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#e5e5e5',
      300: '#d4d4d4',
      400: '#a1a1aa',
      500: '#71717a',
      600: '#52525b',
      700: '#3f3f46',
      800: '#27272a',
      900: '#18181b',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 500,
          letterSpacing: '-0.01em',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        containedPrimary: {
          backgroundColor: '#009624',
          '&:hover': {
            backgroundColor: '#007a1d',
          },
        },
        containedSecondary: {
          backgroundColor: '#fb923c',
          '&:hover': {
            backgroundColor: '#ea580c',
          },
        },
        outlined: {
          '&:hover': {
            backgroundColor: 'rgba(0, 150, 36, 0.06)',
          },
        },
        outlinedPrimary: {
          borderColor: '#009624',
          color: '#009624',
          '&:hover': {
            backgroundColor: 'rgba(0, 150, 36, 0.06)',
            borderColor: '#007a1d',
          },
        },
        text: {
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: '#009624',
          '&:hover': {
            backgroundColor: 'rgba(0, 150, 36, 0.08)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            '& fieldset': {
              borderColor: '#e5e5e5',
            },
            '&:hover fieldset': {
              borderColor: '#009624',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#009624',
              borderWidth: 1,
            },
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#e5e5e5',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#009624',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#009624',
            borderWidth: 1,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: 'none',
          border: '1px solid rgba(0, 0, 0, 0.06)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: 'rgba(0, 0, 0, 0.06)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 500,
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: '#009624',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            color: '#009624',
          },
        },
      },
    },
  },
  shape: {
    borderRadius: 8,
  },
  typography: {
    fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    display: {
      fontSize: 'clamp(2.5rem, 4.5vw, 3.75rem)',
      fontWeight: 500,
      lineHeight: 1.08,
      letterSpacing: '-0.035em',
    },
    h2: {
      fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
      fontWeight: 500,
      lineHeight: 1.12,
      letterSpacing: '-0.03em',
    },
    h3: {
      fontSize: 'clamp(1.5rem, 2.5vw, 2rem)',
      fontWeight: 500,
      lineHeight: 1.15,
      letterSpacing: '-0.025em',
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 500,
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
    },
    bodyLg: {
      fontSize: '1.125rem',
      fontWeight: 400,
      lineHeight: 1.6,
      letterSpacing: '-0.01em',
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: 1.7,
      letterSpacing: '-0.01em',
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: 1.6,
      letterSpacing: '-0.005em',
    },
    bodySm: {
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: 1.5,
    },
    overline: {
      fontSize: '0.75rem',
      fontWeight: 500,
      lineHeight: 1.5,
      textTransform: 'uppercase',
      letterSpacing: '0.08em',
    },
    nav: {
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: 1.5,
      letterSpacing: '-0.01em',
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
      fontSize: '0.875rem',
      letterSpacing: '-0.01em',
    },
  },
});

export default theme;
