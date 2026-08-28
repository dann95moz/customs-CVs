import { createTheme, ThemeOptions, alpha } from '@mui/material/styles';
import {
  DARK_THEME_TOKENS,
  LIGHT_THEME_TOKENS,
  getCssVariablesFromTokens,
} from './colors';

export type ThemeMode = 'light' | 'dark';

const getDesignTokens = (mode: ThemeMode): ThemeOptions => {
  const isDark = mode === 'dark';
  const tokens = isDark ? DARK_THEME_TOKENS : LIGHT_THEME_TOKENS;

  return {
    palette: {
      mode,
      primary: tokens.primary,
      secondary: tokens.secondary,
      success: tokens.success,
      warning: tokens.warning,
      error: tokens.error,
      background: {
        default: tokens.background.default,
        paper: tokens.background.paper,
      },
      text: tokens.text,
      divider: tokens.border.default,
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
          ':root': getCssVariablesFromTokens(tokens),
          body: {
            scrollbarColor: isDark
              ? `${tokens.border.light} ${tokens.background.input}`
              : `${tokens.border.light} ${tokens.background.default}`,
            '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
              width: 8,
              height: 8,
            },
            '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
              borderRadius: 8,
              backgroundColor: tokens.border.light,
            },
            '&::-webkit-scrollbar-track, & *::-webkit-scrollbar-track': {
              backgroundColor: tokens.background.input,
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
              borderColor: tokens.primary.main,
              backgroundColor: alpha(tokens.primary.main, isDark ? 0.08 : 0.06),
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
            border: `1px solid ${tokens.border.default}`,
            boxShadow: tokens.shadow.box,
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
            backgroundColor: isDark ? alpha(tokens.primary.main, 0.15) : undefined,
            color: isDark ? tokens.primary.light : undefined,
            border: isDark ? `1px solid ${alpha(tokens.primary.main, 0.3)}` : undefined,
          },
          colorSuccess: {
            backgroundColor: isDark ? alpha(tokens.success.main, 0.15) : undefined,
            color: isDark ? tokens.success.light : undefined,
            border: isDark ? `1px solid ${alpha(tokens.success.main, 0.3)}` : undefined,
          },
          colorWarning: {
            backgroundColor: isDark ? alpha(tokens.warning.main, 0.15) : undefined,
            color: isDark ? tokens.warning.light : undefined,
            border: isDark ? `1px solid ${alpha(tokens.warning.main, 0.3)}` : undefined,
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
            backgroundColor: tokens.background.input,
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: tokens.border.default,
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: tokens.primary.main,
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: tokens.primary.main,
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
            backgroundColor: tokens.background.card,
            border: `1px solid ${tokens.border.default}`,
            color: tokens.text.primary,
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)',
          },
        },
      },
    },
  };
};

export const buildTheme = (mode: ThemeMode) => createTheme(getDesignTokens(mode));
