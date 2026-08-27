import React from 'react';
import { CVData, ThemeId, PaletteId, FontFamilyId, SpacingDensity } from '../types/cv';
import { getTemplate, mapDataToSlots } from '../templates';
import { getPaletteConfig } from '../constants/palettes';

export interface CVRendererProps {
  data: CVData;
  theme?: ThemeId;
  palette?: PaletteId;
  customColor?: string;
  fontFamily?: FontFamilyId;
  spacingDensity?: SpacingDensity;
}

const FONT_MAP: Record<FontFamilyId, string> = {
  inter: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  outfit: "'Outfit', 'Plus Jakarta Sans', -apple-system, sans-serif",
  serif: "'Merriweather', 'EB Garamond', Georgia, serif",
  mono: "'JetBrains Mono', Consolas, Monaco, monospace",
};

const DENSITY_MAP: Record<SpacingDensity, { fontSize: string; lineHeight: string; sectionGap: string; itemGap: string }> = {
  compact: {
    fontSize: '8.8pt',
    lineHeight: '1.34',
    sectionGap: '8px',
    itemGap: '5px',
  },
  standard: {
    fontSize: '9.5pt',
    lineHeight: '1.42',
    sectionGap: '12px',
    itemGap: '8px',
  },
  spacious: {
    fontSize: '10.2pt',
    lineHeight: '1.5',
    sectionGap: '16px',
    itemGap: '12px',
  },
};

/**
 * Main CVRenderer: Resolves the active Template Component and delegates
 * slot rendering according to the template's layout architecture,
 * injecting curated/custom palette variables and typography settings.
 */
export const CVRenderer: React.FC<CVRendererProps> = ({ 
  data, 
  theme = 'modern-tech',
  palette = 'corporate-blue',
  customColor,
  fontFamily = 'inter',
  spacingDensity = 'standard',
}) => {
  const TemplateComponent = getTemplate(theme);
  const slots = mapDataToSlots(data);
  const palConfig = getPaletteConfig(palette, customColor);
  const density = DENSITY_MAP[spacingDensity] || DENSITY_MAP.standard;
  const fontFam = FONT_MAP[fontFamily] || FONT_MAP.inter;

  const styleVariables: React.CSSProperties = {
    '--cv-primary-color': palConfig.primaryColor,
    '--cv-accent-color': palConfig.accentColor,
    '--cv-accent-light': palConfig.accentLight,
    '--cv-accent-border': palConfig.accentBorder,
    '--cv-accent-hover': palConfig.accentHover,
    '--cv-header-bg': palConfig.headerBg,
    '--cv-sidebar-bg': palConfig.sidebarBg,
    '--cv-badge-bg': palConfig.badgeBg,
    '--cv-badge-text': palConfig.badgeText,
    '--cv-font-family': fontFam,
    '--cv-font-size': density.fontSize,
    '--cv-line-height': density.lineHeight,
    '--cv-section-gap': density.sectionGap,
    '--cv-item-gap': density.itemGap,
    fontFamily: fontFam,
    fontSize: density.fontSize,
    lineHeight: density.lineHeight,
  } as React.CSSProperties;

  return (
    <div className="cv-palette-wrapper" style={styleVariables}>
      <TemplateComponent data={data} slots={slots} theme={theme} />
    </div>
  );
};
