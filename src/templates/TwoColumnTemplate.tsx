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

export const TwoColumnTemplate: React.FC<CVTemplateProps> = ({ slots, theme }) => {
  return (
    <div className={`theme-${theme} template-two-column`}>
      <div className="cv-container">
        {/* Full-width Top Header Slot */}
        <HeaderSlot data={slots.header} />

        {/* Fixed 2-Column Asymmetric Grid */}
        <div className="cv-body-grid">
          {/* LEFT SIDEBAR SLOT (34% width): Compact Skills & Languages */}
          <aside className="cv-sidebar">
            {slots.skills && (
              <SkillsSlot data={slots.skills} variant="pills" />
            )}

            {slots.languages && (
              <LanguagesSlot data={slots.languages} />
            )}
          </aside>

          {/* MAIN COLUMN SLOT (66% width): Narrative Content & Milestones */}
          <main className="cv-main">
            {slots.summary && (
              <SummarySlot data={slots.summary} />
            )}

            {slots.experience && (
              <ExperienceSlot data={slots.experience} />
            )}

            {slots.projects && (
              <ExperienceSlot data={slots.projects} />
            )}

            {slots.education && (
              <EducationSlot data={slots.education} />
            )}

            {slots.genericSections.map(sec => (
              <GenericSlot key={sec.id} data={sec} />
            ))}
          </main>
        </div>
      </div>
    </div>
  );
};
