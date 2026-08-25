import React from 'react';
import { ListSlotData } from '../../templates/types';
import { marked } from 'marked';

export interface EducationSlotProps {
  data: ListSlotData;
  className?: string;
  maxItems?: number;
}

export const EducationSlot: React.FC<EducationSlotProps> = ({ 
  data, 
  className = '',
  maxItems 
}) => {
  const displayItems = maxItems ? data.items.slice(0, maxItems) : data.items;

  return (
    <section className={`cv-section section-${data.type} section-block ${className}`}>
      <h2 className="cv-section-title">{data.title}</h2>
      <ul className={`${data.type}-list section-block`}>
        {displayItems.map((item, idx) => (
          <li 
            key={idx} 
            dangerouslySetInnerHTML={{ __html: marked.parseInline(item) as string }} 
          />
        ))}
      </ul>
    </section>
  );
};
