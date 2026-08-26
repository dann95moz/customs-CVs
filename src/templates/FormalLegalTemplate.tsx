import React from 'react';
import { CVTemplateProps } from './types';
import { SingleColumnLayout } from './SingleColumnLayout';

/**
 * Formal Legal & Corporate Template
 * Built for Lawyers, Corporate Counsel, Legal Specialists, Compliance Directors, and Bankers.
 * Prioritizes classical dignified typography, bar admissions, deal/case volume, and structured formal hierarchy.
 */
export const FormalLegalTemplate: React.FC<CVTemplateProps> = ({ slots, theme }) => {
  return (
    <SingleColumnLayout
      slots={slots}
      theme={theme}
      templateClass="template-formal-legal"
      skillsVariant="inline"
    />
  );
};
