import { createTheme, ThemeOptions, alpha } from '@mui/material/styles';

export type ThemeMode = 'light' | 'dark';

const getDesignTokens = (mode: ThemeMode): ThemeOptions => {
  const isDark = mode === 'dark';

  return {
    palette: {
      mode,
      primary: {
        main: isDark ? '#38bdf8' : '#0284c7',
        light: isDark ? '#7dd3fc' : '#38bdf8',
        dark: isDark ? '#0284c7' : '#0369a1',
        contrastText: isDark ? '#0b0f19' : '#ffffff',
      },
      secondary: {
        main: isDark ? '#a78bfa' : '#7c3aed',
        light: isDark ? '#c4b5fd' : '#8b5cf6',
        dark: isDark ? '#7c3aed' : '#6d28d9',
        contrastText: '#ffffff',
      },
      success: {
        main: isDark ? '#10b981' : '#059669',
        light: isDark ? '#34d399' : '#10b981',
        dark: isDark ? '#059669' : '#047857',
        contrastText: '#ffffff',
      },
      warning: {
        main: isDark ? '#f59e0b' : '#d97706',
        light: isDark ? '#fbbf24' : '#f59e0b',
        dark: isDark ? '#b45309' : '#92400e',
        contrastText: '#ffffff',
      },
      error: {
        main: isDark ? '#ef4444' : '#dc2626',
        light: isDark ? '#f87171' : '#ef4444',
        dark: isDark ? '#b91c1c' : '#991b1b',
        contrastText: '#ffffff',
      },
      background: {
        default: isDark ? '#080b12' : '#f8fafc',
        paper: isDark ? '#101623' : '#ffffff',
      },
      text: {
        primary: isDark ? '#f8fafc' : '#0f172a',
        secondary: isDark ? '#94a3b8' : '#475569',
        disabled: isDark ? '#64748b' : '#94a3b8',
      },
      divider: isDark ? '#232f48' : '#e2e8f0',
    },
    shape: {
      borderRadius: 12,
    },
    typography: {
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      h1: { fontWeight: 800, letterSpacing: '-0.025em' },
      h2: { fontWeight: 700, letterSpacing: '-0.02em' },
      h3: { fontWeight: 700, letterSpacing: '-0.015em' },
      h4: { fontWeight: 700, letterSpacing: '-0.01em' },
      h5: { fontWeight: 600 },
      h6: { fontWeight: 600 },
      subtitle1: { fontWeight: 500 },
      subtitle2: { fontWeight: 600, fontSize: '0.825rem' },
      body1: { fontSize: '0.925rem', lineHeight: 1.6 },
      body2: { fontSize: '0.85rem', lineHeight: 1.5 },
      button: { textTransform: 'none', fontWeight: 600, letterSpacing: '0.01em' },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            scrollbarColor: isDark ? '#334155 #0b0f19' : '#cbd5e1 #f8fafc',
            '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
              width: 8,
              height: 8,
            },
            '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
              borderRadius: 8,
              backgroundColor: isDark ? '#334155' : '#cbd5e1',
            },
            '&::-webkit-scrollbar-track, & *::-webkit-scrollbar-track': {
              backgroundColor: isDark ? '#0b0f19' : '#f8fafc',
            },
          },
        },
      },
      MuiButton: {
        defaultProps: {
          disableElevation: true,
        },
        styleOverrides: {
          root: {
            borderRadius: 10,
            padding: '8px 18px',
            fontSize: '0.875rem',
            transition: 'all 0.15s ease-in-out',
          },
          contained: {
            background: isDark
              ? 'linear-gradient(135deg, #0284c7 0%, #1d4ed8 100%)'
              : 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
            color: '#ffffff',
            boxShadow: isDark 
              ? '0 2px 10px rgba(2, 132, 199, 0.4)'
              : '0 2px 10px rgba(2, 132, 199, 0.25)',
            '&:hover': {
              background: isDark
                ? 'linear-gradient(135deg, #0369a1 0%, #1e40af 100%)'
                : 'linear-gradient(135deg, #0369a1 0%, #1d4ed8 100%)',
              boxShadow: isDark
                ? '0 4px 14px rgba(2, 132, 199, 0.5)'
                : '0 4px 14px rgba(2, 132, 199, 0.35)',
            },
            '&.Mui-disabled': {
              background: isDark ? 'rgba(255, 255, 255, 0.08) !important' : 'rgba(0, 0, 0, 0.08) !important',
              color: isDark ? 'rgba(255, 255, 255, 0.3) !important' : 'rgba(0, 0, 0, 0.26) !important',
              boxShadow: 'none !important',
            },
          },
          outlined: {
            borderColor: isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.12)',
            '&:hover': {
              borderColor: isDark ? '#38bdf8' : '#0284c7',
              backgroundColor: isDark ? alpha('#38bdf8', 0.08) : alpha('#0284c7', 0.06),
            },
            '&.Mui-disabled': {
              borderColor: isDark ? 'rgba(255, 255, 255, 0.08) !important' : 'rgba(0, 0, 0, 0.08) !important',
              color: isDark ? 'rgba(255, 255, 255, 0.3) !important' : 'rgba(0, 0, 0, 0.26) !important',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            backgroundImage: 'none',
            border: `1px solid ${isDark ? '#232f48' : '#e2e8f0'}`,
            boxShadow: isDark
              ? '0 4px 20px -2px rgba(0, 0, 0, 0.5)'
              : '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
          rounded: {
            borderRadius: 14,
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            fontWeight: 600,
            fontSize: '0.78rem',
          },
          colorPrimary: {
            backgroundColor: isDark ? alpha('#38bdf8', 0.15) : undefined,
            color: isDark ? '#7dd3fc' : undefined,
            border: isDark ? `1px solid ${alpha('#38bdf8', 0.3)}` : undefined,
          },
          colorSuccess: {
            backgroundColor: isDark ? alpha('#10b981', 0.15) : undefined,
            color: isDark ? '#34d399' : undefined,
            border: isDark ? `1px solid ${alpha('#10b981', 0.3)}` : undefined,
          },
          colorWarning: {
            backgroundColor: isDark ? alpha('#f59e0b', 0.15) : undefined,
            color: isDark ? '#fbbf24' : undefined,
            border: isDark ? `1px solid ${alpha('#f59e0b', 0.3)}` : undefined,
          },
        },
      },
      MuiTextField: {
        defaultProps: {
          variant: 'outlined',
          size: 'small',
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            backgroundColor: isDark ? '#0b0f19' : '#ffffff',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: isDark ? '#232f48' : '#e2e8f0',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: isDark ? '#38bdf8' : '#0284c7',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: isDark ? '#38bdf8' : '#0284c7',
            },
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '0.875rem',
            minHeight: 44,
            borderRadius: 8,
            margin: '0 4px',
            padding: '6px 14px',
            transition: 'all 0.15s ease',
          },
        },
      },
      MuiTooltip: {
        defaultProps: {
          arrow: true,
        },
        styleOverrides: {
          tooltip: {
            borderRadius: 8,
            fontSize: '0.75rem',
            fontWeight: 500,
            backgroundColor: isDark ? '#151d2e' : '#0f172a',
            border: `1px solid ${isDark ? '#232f48' : '#1e293b'}`,
            color: '#f8fafc',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)',
          },
        },
      },
    },
  };
};

export const buildTheme = (mode: ThemeMode) => createTheme(getDesignTokens(mode));
