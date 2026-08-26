import React from 'react';
import { CVData, ThemeId, PaletteId } from '../types/cv';
import { getTemplate, mapDataToSlots } from '../templates';
import { getPaletteConfig } from '../constants/palettes';

export interface CVRendererProps {
  data: CVData;
  theme?: ThemeId;
  palette?: PaletteId;
}

/**
 * Main CVRenderer: Resolves the active Template Component and delegates
 * slot rendering according to the template's layout architecture,
 * injecting curated accent palette variables while keeping body text strictly dark.
 */
export const CVRenderer: React.FC<CVRendererProps> = ({ 
  data, 
  theme = 'modern-tech',
  palette = 'corporate-blue',
}) => {
  const TemplateComponent = getTemplate(theme);
  const slots = mapDataToSlots(data);
  const palConfig = getPaletteConfig(palette);

  const styleVariables: React.CSSProperties = {
    '--cv-accent-color': palConfig.accentColor,
    '--cv-accent-light': palConfig.accentLight,
    '--cv-accent-border': palConfig.accentBorder,
    '--cv-accent-hover': palConfig.accentHover,
    '--cv-badge-bg': palConfig.badgeBg,
    '--cv-badge-text': palConfig.badgeText,
  } as React.CSSProperties;

  return (
    <div className="cv-palette-wrapper" style={styleVariables}>
      <TemplateComponent data={data} slots={slots} theme={theme} />
    </div>
  );
};
