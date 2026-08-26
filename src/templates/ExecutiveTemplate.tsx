import React from 'react';
import { CVTemplateProps } from './types';
import { SingleColumnLayout } from './SingleColumnLayout';

export const ExecutiveTemplate: React.FC<CVTemplateProps> = ({ slots, theme }) => {
  return (
    <SingleColumnLayout
      slots={slots}
      theme={theme}
      templateClass="template-executive"
      skillsVariant="inline"
    />
  );
};
