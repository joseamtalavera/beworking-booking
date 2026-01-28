/**
 * Unified MUI theme configuration for beworking projects.
 * All colors should be referenced from this theme - no hardcoded hex values in components.
 */
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    // Brand colors - use these for all custom styling
    brand: {
      green: '#2ecc71',        // Primary action color (Book, Save, Submit)
      greenHover: '#27ae60',   // Hover state for green
      orange: '#fb923c',       // Destructive/warning actions (Delete, Logout)
      orangeHover: '#ea580c',  // Hover state for orange
      dark: '#2f3b46',
      muted: '#6b747d',
      lightBg: '#f6f8fb',
      border: '#e5e7eb',
      borderSoft: '#eef1f4',
      accentSoft: 'rgba(46, 204, 113, 0.08)',
      orangeSoft: 'rgba(251, 146, 60, 0.08)',
    },
    primary: {
      main: '#2ecc71',         // Green - primary action color
      light: '#58d68d',
      dark: '#27ae60',
      contrastText: '#fff',
    },
    secondary: {
      main: '#fb923c',         // Orange - secondary/destructive color
      light: '#fdba74',
      dark: '#ea580c',
      contrastText: '#fff',
    },
    success: {
      main: '#2ecc71',
      light: '#58d68d',
      dark: '#27ae60',
      contrastText: '#fff',
    },
    info: {
      main: '#3b82f6',
      light: '#60a5fa',
      dark: '#2563eb',
      contrastText: '#fff',
    },
    error: {
      main: '#fb923c',         // Using orange instead of red
      light: '#fdba74',
      dark: '#ea580c',
      contrastText: '#fff',
    },
    warning: {
      main: '#fb923c',
      light: '#fdba74',
      dark: '#ea580c',
      contrastText: '#fff',
    },
    background: {
      default: '#f8fafc',
      paper: '#fff',
    },
    text: {
      primary: '#1f2937',
      secondary: '#475569',
      disabled: '#64748b',
    },
    divider: '#e5e7eb',
    grey: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 600,
        },
        contained: ({ theme }) => ({
          backgroundColor: theme.palette.brand.green,
          '&:hover': {
            backgroundColor: theme.palette.brand.greenHover,
          },
        }),
        outlined: ({ theme }) => ({
          borderColor: theme.palette.brand.green,
          color: theme.palette.brand.green,
          '&:hover': {
            backgroundColor: theme.palette.brand.accentSoft,
            borderColor: theme.palette.brand.green,
          },
        }),
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        },
      },
    },
  },
  shape: {
    borderRadius: 8,
  },
  typography: {
    fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
});

export default theme;
