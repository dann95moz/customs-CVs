import React from 'react';
import { GenericSlotData, GenericSlotProps } from '../../templates/types';
import { safeMarkdown } from '../../utils/sanitize';

export type { GenericSlotProps };

export const GenericSlot: React.FC<GenericSlotProps> = ({ data, className = '' }) => {
  return (
    <section key={data.id} className={`cv-section section-generic section-block ${className}`}>
      <h2 className="cv-section-title">{data.title}</h2>
      <div 
        className="cv-content" 
        dangerouslySetInnerHTML={{ __html: safeMarkdown(data.rawContent) }} 
      />
    </section>
  );
};
