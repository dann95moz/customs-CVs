import React from 'react';
import { SkillsSlotData } from '../../templates/types';

export interface SkillsSlotProps {
  data: SkillsSlotData;
  className?: string;
  variant?: 'pills' | 'inline' | 'compact';
}

export const SkillsSlot: React.FC<SkillsSlotProps> = ({ 
  data, 
  className = '',
  variant = 'pills'
}) => {
  return (
    <section className={`cv-section section-skills section-block ${className} variant-${variant}`}>
      <h2 className="cv-section-title">{data.title}</h2>
      <div className="skills-container">
        {data.skillGroups.map((group, idx) => (
          <div key={idx} className="skills-group">
            <span className="skills-category">{group.category}:</span>{' '}
            <span className="skills-items">
              {group.skills.map((skill, sIdx) => (
                <React.Fragment key={sIdx}>
                  <span className="skill-pill">
                    {skill}
                  </span>
                  {variant === 'inline' && sIdx < group.skills.length - 1 && (
                    <span className="skill-separator">, </span>
                  )}
                </React.Fragment>
              ))}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};
