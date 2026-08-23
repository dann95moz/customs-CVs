import React from 'react';
import { marked } from 'marked';

interface EducationSectionProps {
  title: string;
  items: string[];
  type?: 'education' | 'languages' | 'generic';
}

export const EducationSection: React.FC<EducationSectionProps> = ({ 
  title, 
  items,
  type = 'education'
}) => {
  return (
    <section className={`cv-section section-${type} section-block`}>
      <h2 className="cv-section-title">{title}</h2>
      <ul className={`${type}-list section-block`}>
        {items.map((item, idx) => (
          <li 
            key={idx} 
            dangerouslySetInnerHTML={{ __html: marked.parseInline(item) as string }} 
          />
        ))}
      </ul>
    </section>
  );
};
