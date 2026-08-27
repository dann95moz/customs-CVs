import React from 'react';
import { CVTemplateProps } from './types';
import { extractCandidateInitials } from '../core/parser';
import { Icon } from '../components/Icons';
import { 
  SummarySlot, 
  ExperienceSlot, 
  EducationSlot, 
  GenericSlot 
} from '../components/slots';

/**
 * Modern Contrast Sidebar Template (Photo 3 Reference):
 * - Left main content (66%): Extra bold modern name, Professional Summary, Work History, Education.
 * - Right full-height solid colored sidebar (34%): White geometric diamond/monogram card, contact info with circular icon badges, Websites & Profiles, and Skills in white text.
 */
export const TwoColumnTemplate: React.FC<CVTemplateProps> = ({ slots, theme }) => {
  const initials = extractCandidateInitials(slots.header.name);
  const contacts = slots.header.contacts || [];

  const basicContacts = contacts.filter(c => ['email', 'phone', 'location'].includes(c.type));
  const linkContacts = contacts.filter(c => !['email', 'phone', 'location'].includes(c.type));

  return (
    <div className={`theme-${theme} template-contrast-sidebar`}>
      <div className="cv-container contrast-grid-layout">
        {/* LEFT MAIN CONTENT AREA */}
        <main className="contrast-main-col">
          {/* Header Name & Title */}
          <header className="contrast-header">
            <h1 className="contrast-name">{slots.header.name}</h1>
            {slots.header.title && (
              <div className="contrast-title">{slots.header.title}</div>
            )}
          </header>

          {/* Professional Summary */}
          {slots.summary && (
            <div className="contrast-section">
              <SummarySlot data={slots.summary} />
            </div>
          )}

          {/* Work History */}
          {slots.experience && (
            <div className="contrast-section">
              <ExperienceSlot data={slots.experience} />
            </div>
          )}

          {/* Projects */}
          {slots.projects && (
            <div className="contrast-section">
              <ExperienceSlot data={slots.projects} />
            </div>
          )}

          {/* Education in Main Column */}
          {slots.education && (
            <div className="contrast-section">
              <EducationSlot data={slots.education} />
            </div>
          )}

          {slots.genericSections.map(sec => (
            <GenericSlot key={sec.id} data={sec} />
          ))}
        </main>

        {/* RIGHT SOLID COLORED SIDEBAR */}
        <aside className="contrast-sidebar-col">
          {/* Geometric Diamond Emblem Card (like Photo 3) */}
          <div className="contrast-emblem-card">
            <svg viewBox="0 0 24 24" className="contrast-emblem-svg">
              <path d="M12 2L15 9.5L22 12L15 14.5L12 22L9 14.5L2 12L9 9.5Z" />
            </svg>
            <span className="contrast-emblem-initials">{initials}</span>
          </div>

          {/* Contact Details with Circular Icon Badges */}
          {basicContacts.length > 0 && (
            <div className="contrast-side-block">
              <ul className="contrast-contact-list">
                {basicContacts.map((c, i) => (
                  <li key={i} className="contrast-contact-item">
                    <span className="contrast-icon-badge">
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

          {/* Websites, Portfolios, Profiles */}
          {linkContacts.length > 0 && (
            <div className="contrast-side-block">
              <h3 className="contrast-side-title">Websites, Portfolios, Profiles</h3>
              <ul className="contrast-link-list">
                {linkContacts.map((c, i) => (
                  <li key={i} className="contrast-link-item">
                    <a href={c.url || '#'} target="_blank" rel="noopener noreferrer">
                      {c.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Skills List in White */}
          {slots.skills && (
            <div className="contrast-side-block">
              <h3 className="contrast-side-title">Skills</h3>
              <div className="contrast-skills-list">
                {slots.skills.skillGroups.map((group, gIdx) => (
                  <div key={gIdx} className="contrast-skill-group">
                    <span className="contrast-skill-group-name">{group.category}:</span>
                    <ul className="contrast-skill-bullets">
                      {group.skills.map((skill, sIdx) => (
                        <li key={sIdx}>{skill}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Languages in White */}
          {slots.languages && (
            <div className="contrast-side-block">
              <h3 className="contrast-side-title">Languages</h3>
              <ul className="contrast-skill-bullets">
                {slots.languages.items.map((item, lIdx) => (
                  <li key={lIdx}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};
