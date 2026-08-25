import React from 'react';
import { CVTemplateProps } from './types';
import { 
  HeaderSlot, 
  SummarySlot, 
  SkillsSlot, 
  ExperienceSlot, 
  EducationSlot, 
  LanguagesSlot, 
  GenericSlot 
} from '../components/slots';

export const ExecutiveTemplate: React.FC<CVTemplateProps> = ({ slots, theme }) => {
  return (
    <div className={`theme-${theme} template-executive`}>
      <div className="cv-container">
        {/* Centered Corporate Header Slot */}
        <HeaderSlot data={slots.header} />

        {/* Structured Executive Body */}
        <main className="cv-body">
          {slots.summary && (
            <SummarySlot data={slots.summary} />
          )}

          {slots.skills && (
            <SkillsSlot data={slots.skills} variant="inline" />
          )}

          {slots.experience && (
            <ExperienceSlot data={slots.experience} />
          )}

          {slots.projects && (
            <ExperienceSlot data={slots.projects} />
          )}

          {/* Bottom Balanced Row: Education on Left, Languages on Right */}
          {(slots.education || slots.languages) && (
            <div className="cv-bottom-grid" style={{ display: 'grid', gridTemplateColumns: slots.languages && slots.education ? '1.75fr 1fr' : '1fr', gap: '18px' }}>
              {slots.education && (
                <EducationSlot data={slots.education} />
              )}
              {slots.languages && (
                <LanguagesSlot data={slots.languages} />
              )}
            </div>
          )}

          {slots.genericSections.map(sec => (
            <GenericSlot key={sec.id} data={sec} />
          ))}
        </main>
      </div>
    </div>
  );
};
