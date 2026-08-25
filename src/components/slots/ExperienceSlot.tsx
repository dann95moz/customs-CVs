import React from 'react';
import { ExperienceSlotData } from '../../templates/types';
import { marked } from 'marked';

export interface ExperienceSlotProps {
  data: ExperienceSlotData;
  className?: string;
  maxItems?: number;
}

export const ExperienceSlot: React.FC<ExperienceSlotProps> = ({ 
  data, 
  className = '',
  maxItems
}) => {
  const displayItems = maxItems ? data.items.slice(0, maxItems) : data.items;

  return (
    <section className={`cv-section section-${data.type} section-block ${className}`}>
      <h2 className="cv-section-title">{data.title}</h2>
      <div className="experience-list">
        {displayItems.map((item, idx) => (
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
