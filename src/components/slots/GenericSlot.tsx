import React from 'react';
import { GenericSlotData } from '../../templates/types';
import { marked } from 'marked';

export interface GenericSlotProps {
  data: GenericSlotData;
  className?: string;
}

export const GenericSlot: React.FC<GenericSlotProps> = ({ data, className = '' }) => {
  return (
    <section key={data.id} className={`cv-section section-generic section-block ${className}`}>
      <h2 className="cv-section-title">{data.title}</h2>
      <div 
        className="cv-content" 
        dangerouslySetInnerHTML={{ __html: marked.parse(data.rawContent) as string }} 
      />
    </section>
  );
};
