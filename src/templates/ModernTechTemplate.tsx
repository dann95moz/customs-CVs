import React from 'react';
import { CVTemplateProps } from './types';
import { SingleColumnLayout } from './SingleColumnLayout';

export const ModernTechTemplate: React.FC<CVTemplateProps> = ({ slots, theme }) => {
  return (
    <SingleColumnLayout
      slots={slots}
      theme={theme}
      templateClass="template-modern-tech"
      skillsVariant="pills"
    />
  );
};
