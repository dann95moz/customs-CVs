import React from 'react';
import { CVData, ThemeId } from '../types/cv';
import { getTemplate, mapDataToSlots } from '../templates';

export interface CVRendererProps {
  data: CVData;
  theme?: ThemeId;
}

/**
 * Main CVRenderer: Resolves the active Template Component and delegates
 * slot rendering according to the template's layout architecture.
 */
export const CVRenderer: React.FC<CVRendererProps> = ({ 
  data, 
  theme = 'modern-tech' 
}) => {
  const TemplateComponent = getTemplate(theme);
  const slots = mapDataToSlots(data);

  return <TemplateComponent data={data} slots={slots} theme={theme} />;
};
