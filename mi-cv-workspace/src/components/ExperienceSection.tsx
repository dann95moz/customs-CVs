import React from 'react';
import { ExperienceItem } from '../types/cv';
import { marked } from 'marked';

interface ExperienceSectionProps {
  title: string;
  items: ExperienceItem[];
  type?: 'experience' | 'projects';
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({ 
  title, 
  items,
  type = 'experience'
}) => {
  return (
    <section className={`cv-section section-${type} section-block`}>
      <h2 className="cv-section-title">{title}</h2>
      <div className="experience-list">
        {items.map((item, idx) => (
          <div key={idx} className="experience-item section-block">
            <div className="item-header">
              <span className="item-company">{item.company}</span>
              {item.location && <span className="item-location">{item.location}</span>}
            </div>
            
            {(item.role || item.date) && (
              <div className="item-sub-header">
                <span className="item-role">{item.role || ''}</span>
                <span className="item-date">{item.date || ''}</span>
              </div>
            )}

            {item.bullets && item.bullets.length > 0 && (
              <ul className="item-bullets">
                {item.bullets.map((bullet, bIdx) => (
                  <li 
                    key={bIdx} 
                    dangerouslySetInnerHTML={{ __html: marked.parseInline(bullet) as string }} 
                  />
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};
