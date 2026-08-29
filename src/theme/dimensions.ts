/**
 * CV Studio Pro - Centralized Dimension & Spacing Design Tokens
 * 
 * Single source of truth for element sizes, container constraints,
 * paper document dimensions (A4/Letter), and border radiuses.
 * Adheres to DRY & SOLID principles.
 */

export const DOCUMENT_DIMENSIONS = {
  pageWidth: '795px',
  pageHeight: '1123px',
  pageHeightPx: 1123,
  marginSingleCol: '10mm 12mm',
} as const;

export const LAYOUT_DIMENSIONS = {
  navbarHeight: '64px',
  containerSm: '600px',
  containerMd: '900px',
  containerLg: '960px',
  containerXl: '1200px',
  splitEditorMinWidth: '320px',
  splitEditorHeaderHeight: '38px',
} as const;

export const RADIUS_TOKENS = {
  none: '0px',
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  '2xl': '28px',
  full: '9999px',
} as const;

export const SPACING_TOKENS = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
} as const;

/**
 * Generates the CSS custom properties record for layout & dimension tokens.
 */
export function getDimensionCssVariables(): Record<string, string> {
  return {
    '--navbar-height': LAYOUT_DIMENSIONS.navbarHeight,
    '--container-sm': LAYOUT_DIMENSIONS.containerSm,
    '--container-md': LAYOUT_DIMENSIONS.containerMd,
    '--container-lg': LAYOUT_DIMENSIONS.containerLg,
    '--container-xl': LAYOUT_DIMENSIONS.containerXl,
    '--cv-page-width': DOCUMENT_DIMENSIONS.pageWidth,
    '--cv-page-min-height': DOCUMENT_DIMENSIONS.pageHeight,
    '--radius-none': RADIUS_TOKENS.none,
    '--radius-xs': RADIUS_TOKENS.xs,
    '--radius-sm': RADIUS_TOKENS.sm,
    '--radius-md': RADIUS_TOKENS.md,
    '--radius-lg': RADIUS_TOKENS.lg,
    '--radius-xl': RADIUS_TOKENS.xl,
    '--radius-2xl': RADIUS_TOKENS['2xl'],
    '--radius-full': RADIUS_TOKENS.full,
    '--space-xs': SPACING_TOKENS.xs,
    '--space-sm': SPACING_TOKENS.sm,
    '--space-md': SPACING_TOKENS.md,
    '--space-lg': SPACING_TOKENS.lg,
    '--space-xl': SPACING_TOKENS.xl,
  };
}
