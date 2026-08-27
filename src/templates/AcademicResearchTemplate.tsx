import React from 'react';
import { CVTemplateProps } from './types';
import { extractCandidateInitials } from '../core/parser';
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
 * Executive Dual-Tone Template (Photo 5 Reference):
 * - Left dark charcoal sidebar: Candidate initials monogram avatar circle [DC], contact info, websites, and education.
 * - Right main area: Top accent header banner with spaced uppercase name, Professional Summary, Skills grid, and Work History.
 */
export const AcademicResearchTemplate: React.FC<CVTemplateProps> = ({ slots, theme }) => {
  const initials = extractCandidateInitials(slots.header.name);
  const contacts = slots.header.contacts || [];

  const basicContacts = contacts.filter(c => ['email', 'phone', 'location'].includes(c.type));
  const linkContacts = contacts.filter(c => !['email', 'phone', 'location'].includes(c.type));

  return (
    <div className={`theme-${theme} template-dualtone-split`}>
      <div className="cv-container dualtone-grid-layout">
        {/* LEFT DARK CHARCOAL SIDEBAR */}
        <aside className="dualtone-sidebar-col">
          {/* Monogram Initials Avatar Circle */}
          <div className="dualtone-avatar-circle">
            <span className="dualtone-avatar-initials">{initials}</span>
          </div>

          {/* Contact Details */}
          {basicContacts.length > 0 && (
            <div className="dualtone-side-block">
              <ul className="dualtone-contact-list">
                {basicContacts.map((c, i) => (
                  <li key={i} className="dualtone-contact-item">
                    <span className="dualtone-icon-badge">
                      <Icon type={c.type} size={12} />
                    </span>
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
          )}

          {/* Websites & Profiles */}
          {linkContacts.length > 0 && (
            <div className="dualtone-side-block">
              <h3 className="dualtone-side-title">Websites, Portfolios, Profiles</h3>
              <ul className="dualtone-link-list">
                {linkContacts.map((c, i) => (
                  <li key={i} className="dualtone-link-item">
                    <a href={c.url || '#'} target="_blank" rel="noopener noreferrer">
                      {c.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Education in Dark Sidebar */}
          {slots.education && (
            <div className="dualtone-side-block">
              <h3 className="dualtone-side-title">Education</h3>
              <ul className="dualtone-edu-list">
                {slots.education.items.map((item, eIdx) => (
                  <li key={eIdx}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </aside>

        {/* RIGHT MAIN CONTENT AREA */}
        <main className="dualtone-main-col">
          {/* Top Header Banner with Soft Accent Tint */}
          <header className="dualtone-top-header">
            <h1 className="dualtone-name">{slots.header.name}</h1>
            {slots.header.title && (
              <div className="dualtone-title">{slots.header.title}</div>
            )}
          </header>

          <div className="dualtone-main-body">
            {/* Professional Summary */}
            {slots.summary && (
              <div className="dualtone-section">
                <SummarySlot data={slots.summary} />
              </div>
            )}

            {/* Skills Multi-Column Grid */}
            {slots.skills && (
              <div className="dualtone-section">
                <SkillsSlot data={slots.skills} variant="inline" />
              </div>
            )}

            {/* Work History */}
            {slots.experience && (
              <div className="dualtone-section">
                <ExperienceSlot data={slots.experience} />
              </div>
            )}

            {/* Projects */}
            {slots.projects && (
              <div className="dualtone-section">
                <ExperienceSlot data={slots.projects} />
              </div>
            )}

            {/* Languages */}
            {slots.languages && (
              <div className="dualtone-section">
                <LanguagesSlot data={slots.languages} />
              </div>
            )}

            {slots.genericSections.map(sec => (
              <GenericSlot key={sec.id} data={sec} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};
