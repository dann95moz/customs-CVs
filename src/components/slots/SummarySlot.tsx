import React from 'react';
import { SummarySlotData, SummarySlotProps } from '../../templates/types';
import { marked } from 'marked';

export type { SummarySlotProps };

export const SummarySlot: React.FC<SummarySlotProps> = ({ data, className = '' }) => {
  return (
    <section className={`cv-section section-summary section-block ${className}`}>
      <h2 className="cv-section-title">{data.title}</h2>
      <div 
        className="cv-summary" 
        dangerouslySetInnerHTML={{ __html: marked.parse(data.rawContent) as string }} 
      />
    </section>
  );
};
