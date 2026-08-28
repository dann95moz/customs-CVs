/**
 * CV Studio Pro - Centralized Color Design Tokens
 * 
 * Single source of truth for all color constants across the application.
 * Adheres to DRY by providing a unified token dictionary that feeds both
 * MUI Palette configurations and CSS custom properties (:root variables).
 */

export interface PaletteColorTokens {
  main: string;
  light: string;
  dark: string;
  contrastText: string;
}

export interface ThemeColorTokens {
  primary: PaletteColorTokens;
  secondary: PaletteColorTokens;
  success: PaletteColorTokens;
  warning: PaletteColorTokens;
  error: PaletteColorTokens;
  background: {
    default: string;
    paper: string;
    card: string;
    cardHover: string;
    input: string;
    code: string;
  };
  text: {
    primary: string;
    secondary: string;
    disabled: string;
  };
  border: {
    default: string;
    light: string;
  };
  accent: {
    main: string;
    hover: string;
    glow: string;
    purple: string;
  };
  shadow: {
    box: string;
  };
}

export const DARK_THEME_TOKENS: ThemeColorTokens = {
  primary: {
    main: '#38bdf8',
    light: '#7dd3fc',
    dark: '#0284c7',
    contrastText: '#0b0f19',
  },
  secondary: {
    main: '#a78bfa',
    light: '#c4b5fd',
    dark: '#7c3aed',
    contrastText: '#ffffff',
  },
  success: {
    main: '#10b981',
    light: '#34d399',
    dark: '#059669',
    contrastText: '#ffffff',
  },
  warning: {
    main: '#f59e0b',
    light: '#fbbf24',
    dark: '#b45309',
    contrastText: '#ffffff',
  },
  error: {
    main: '#ef4444',
    light: '#f87171',
    dark: '#b91c1c',
    contrastText: '#ffffff',
  },
  background: {
    default: '#080b12',
    paper: '#101623',
    card: '#151d2e',
    cardHover: '#1b243b',
    input: '#0b0f19',
    code: '#0b0f19',
  },
  text: {
    primary: '#f8fafc',
    secondary: '#94a3b8',
    disabled: '#64748b',
  },
  border: {
    default: '#232f48',
    light: '#334155',
  },
  accent: {
    main: '#38bdf8',
    hover: '#0284c7',
    glow: 'rgba(56, 189, 248, 0.25)',
    purple: '#818cf8',
  },
  shadow: {
    box: '0 4px 20px -2px rgba(0, 0, 0, 0.4)',
  },
};

export const LIGHT_THEME_TOKENS: ThemeColorTokens = {
  primary: {
    main: '#0284c7',
    light: '#38bdf8',
    dark: '#0369a1',
    contrastText: '#ffffff',
  },
  secondary: {
    main: '#7c3aed',
    light: '#8b5cf6',
    dark: '#6d28d9',
    contrastText: '#ffffff',
  },
  success: {
    main: '#059669',
    light: '#10b981',
    dark: '#047857',
    contrastText: '#ffffff',
  },
  warning: {
    main: '#d97706',
    light: '#f59e0b',
    dark: '#92400e',
    contrastText: '#ffffff',
  },
  error: {
    main: '#dc2626',
    light: '#ef4444',
    dark: '#991b1b',
    contrastText: '#ffffff',
  },
  background: {
    default: '#f8fafc',
    paper: '#ffffff',
    card: '#ffffff',
    cardHover: '#f1f5f9',
    input: '#f8fafc',
    code: '#f1f5f9',
  },
  text: {
    primary: '#0f172a',
    secondary: '#475569',
    disabled: '#94a3b8',
  },
  border: {
    default: '#e2e8f0',
    light: '#cbd5e1',
  },
  accent: {
    main: '#0284c7',
    hover: '#0369a1',
    glow: 'rgba(2, 132, 199, 0.2)',
    purple: '#7c3aed',
  },
  shadow: {
    box: '0 4px 20px -2px rgba(0, 0, 0, 0.06)',
  },
};

/**
 * Generates the CSS custom properties record to inject into :root / CssBaseline.
 */
export function getCssVariablesFromTokens(tokens: ThemeColorTokens): Record<string, string> {
  return {
    '--bg-dark': tokens.background.default,
    '--panel-bg': tokens.background.paper,
    '--card-bg': tokens.background.card,
    '--card-hover': tokens.background.cardHover,
    '--border': tokens.border.default,
    '--border-light': tokens.border.light,
    '--accent': tokens.accent.main,
    '--accent-glow': tokens.accent.glow,
    '--accent-hover': tokens.accent.hover,
    '--primary-purple': tokens.accent.purple,
    '--success': tokens.success.main,
    '--warning': tokens.warning.main,
    '--danger': tokens.error.main,
    '--text-main': tokens.text.primary,
    '--text-muted': tokens.text.secondary,
    '--text-dim': tokens.text.disabled,
    '--input-bg': tokens.background.input,
    '--code-bg': tokens.background.code,
    '--box-shadow': tokens.shadow.box,
  };
}

/**
 * CV Document Engine Neutral & Base Design Tokens
 * 
 * Standardized neutral palette for CV document templates guaranteeing 100% ATS readability.
 * Body text always remains high-contrast charcoal/slate; paper is always clean white.
 */
export const CV_DOCUMENT_TOKENS = {
  paperBg: '#ffffff',
  textPrimary: '#1e293b',
  textHeading: '#0f172a',
  textSecondary: '#334155',
  textStrong: '#090d16',
  textMuted: '#64748b',
  textDim: '#94a3b8',
  borderColor: '#e2e8f0',
  borderLight: '#f1f5f9',
};

