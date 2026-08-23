import React from 'react';
import { SkillCategory } from '../types/cv';

interface SkillsSectionProps {
  title: string;
  skillGroups: SkillCategory[];
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({ title, skillGroups }) => {
  return (
    <section className="cv-section section-skills section-block">
      <h2 className="cv-section-title">{title}</h2>
      <div className="skills-container">
        {skillGroups.map((group, idx) => (
          <div key={idx} className="skills-group">
            <span className="skills-category">{group.category}:</span>
            <span className="skills-items">
              {group.skills.map((skill, sIdx) => (
                <span key={sIdx} className="skill-pill">
                  {skill}
                </span>
              ))}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};
