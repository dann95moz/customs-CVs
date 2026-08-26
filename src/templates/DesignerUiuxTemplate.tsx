import React from 'react';
import { CVTemplateProps } from './types';
import { SingleColumnLayout } from './SingleColumnLayout';

/**
 * Designer & UI/UX Template
 * Built for Product Designers, UI/UX Specialists, Design Systems Leads, and Creatives.
 * Highlights visual hierarchy, design tooling pills, portfolio URL accents, and case studies.
 */
export const DesignerUiuxTemplate: React.FC<CVTemplateProps> = ({ slots, theme }) => {
  return (
    <SingleColumnLayout
      slots={slots}
      theme={theme}
      templateClass="template-designer-uiux"
      skillsVariant="pills"
    />
  );
};
