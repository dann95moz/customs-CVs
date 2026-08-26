import React from 'react';
import { CVTemplateProps } from './types';
import { SingleColumnLayout } from './SingleColumnLayout';

/**
 * Academic & Scientific Research Template
 * Built for Research Scientists, Postdocs, Professors, Data Scientists, BioTech & Healthcare Specialists.
 * Emphasizes publications, education, laboratory competencies, grants, and scholarly credentials.
 */
export const AcademicResearchTemplate: React.FC<CVTemplateProps> = ({ slots, theme }) => {
  return (
    <SingleColumnLayout
      slots={slots}
      theme={theme}
      templateClass="template-academic-research"
      skillsVariant="inline"
    />
  );
};
