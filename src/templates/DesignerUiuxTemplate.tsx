import React from 'react';
import { CVTemplateProps } from './types';
import { Icon } from '../components/Icons';
import { 
  SummarySlot, 
  SkillsSlot, 
  ExperienceSlot, 
  EducationSlot, 
  LanguagesSlot, 
  GenericSlot 
} from '../components/slots';

/**
 * Editorial Pastel Card Template (Photo 4 Reference):
 * - Top-left soft pastel/tinted card containing Candidate Name, horizontal divider, and direct contacts.
 * - Top-right: Professional Summary.
 * - Left column below card (34%): Skills, Education.
 * - Right column below summary (66%): Websites/Portfolios, Work History, Languages.
 */
export const DesignerUiuxTemplate: React.FC<CVTemplateProps> = ({ slots, theme }) => {
  const contacts = slots.header.contacts || [];

  const basicContacts = contacts.filter(c => ['email', 'phone', 'location'].includes(c.type));
  const linkContacts = contacts.filter(c => !['email', 'phone', 'location'].includes(c.type));

  return (
    <div className={`theme-${theme} template-pastel-card`}>
      <div className="cv-container pastel-layout">
        {/* Top Header Region */}
        <div className="pastel-top-grid">
          {/* Top-Left Pastel Tinted Card */}
          <div className="pastel-header-card">
            <h1 className="pastel-card-name">{slots.header.name}</h1>
            {slots.header.title && (
              <div className="pastel-card-title">{slots.header.title}</div>
            )}
            <div className="pastel-card-divider" />
            <ul className="pastel-card-contacts">
              {basicContacts.map((c, i) => (
                <li key={i} className="pastel-contact-item">
                  <Icon type={c.type} size={12} />
                  {c.url ? (
                    <a href={c.url} target="_blank" rel="noopener noreferrer">
                      {c.label}
                    </a>
                  ) : (
                    <span>{c.label}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Top-Right: Professional Summary */}
          <div className="pastel-top-summary">
            {slots.summary && (
              <SummarySlot data={slots.summary} />
            )}
          </div>
        </div>

        {/* 2-Column Lower Region */}
        <div className="pastel-bottom-grid">
          {/* Left Column: Skills & Education */}
          <aside className="pastel-left-col">
            {slots.skills && (
              <div className="pastel-section">
                <SkillsSlot data={slots.skills} variant="pills" />
              </div>
            )}

            {slots.education && (
              <div className="pastel-section">
                <EducationSlot data={slots.education} />
              </div>
            )}
          </aside>

          {/* Right Column: Links, Work History, Languages */}
          <main className="pastel-right-col">
            {/* Websites & Profiles */}
            {linkContacts.length > 0 && (
              <div className="pastel-section pastel-links-block">
                <h3 className="cv-section-title">Websites, Portfolios, Profiles</h3>
                <ul className="pastel-links-list">
                  {linkContacts.map((c, i) => (
                    <li key={i}>
                      <a href={c.url || '#'} target="_blank" rel="noopener noreferrer">
                        {c.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Work History */}
            {slots.experience && (
              <div className="pastel-section">
                <ExperienceSlot data={slots.experience} />
              </div>
            )}

            {/* Projects */}
            {slots.projects && (
              <div className="pastel-section">
                <ExperienceSlot data={slots.projects} />
              </div>
            )}

            {/* Languages */}
            {slots.languages && (
              <div className="pastel-section">
                <LanguagesSlot data={slots.languages} />
              </div>
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
