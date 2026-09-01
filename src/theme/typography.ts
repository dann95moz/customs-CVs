import { FontFamilyId } from '../types/theme';

/**
 * Single Source of Truth (SSOT) for font family stacks across preview and PDF rendering (DRY).
 */
export const FONT_FAMILY_CSS_MAP: Record<FontFamilyId, string> = {
  inter: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  outfit: "'Outfit', 'Plus Jakarta Sans', -apple-system, sans-serif",
  serif: "'Merriweather', 'EB Garamond', Georgia, serif",
  mono: "'JetBrains Mono', Consolas, Monaco, monospace",
};

/**
 * Resolves font CSS string by FontFamilyId with fallback to Inter.
 */
export function getFontFamilyCss(fontFamily?: FontFamilyId): string {
  if (!fontFamily) return FONT_FAMILY_CSS_MAP.inter;
  return FONT_FAMILY_CSS_MAP[fontFamily] || FONT_FAMILY_CSS_MAP.inter;
}
