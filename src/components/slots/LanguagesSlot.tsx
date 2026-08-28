import React from 'react';
import { ListSlotData, LanguagesSlotProps } from '../../templates/types';
import { marked } from 'marked';

export type { LanguagesSlotProps };

export const LanguagesSlot: React.FC<LanguagesSlotProps> = ({ data, className = '' }) => {
  return (
    <section className={`cv-section section-languages section-block ${className}`}>
      <h2 className="cv-section-title">{data.title}</h2>
      <ul className="languages-list section-block">
        {data.items.map((item, idx) => (
          <li 
            key={idx} 
            dangerouslySetInnerHTML={{ __html: marked.parseInline(item) as string }} 
          />
        ))}
      </ul>
    </section>
  );
};
