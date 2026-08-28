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
 * Corporate Top Banner Template (Photo 2 Reference):
 * - Prominent full-width colored header banner with candidate initials monogram box [DC].
 * - Two-column body: Left main narrative (Summary & Work History) + Right sidebar (Contacts, Links, Skills, Education).
 */
export const ExecutiveTemplate: React.FC<CVTemplateProps> = ({ slots, theme }) => {
  const initials = extractCandidateInitials(slots.header.name);
  const contacts = slots.header.contacts || [];

  // Separate links (LinkedIn, GitHub, Portfolio, Globe) from basic contacts (Email, Phone, Location)
  const basicContacts = contacts.filter(c => ['email', 'phone', 'location'].includes(c.type));
  const linkContacts = contacts.filter(c => !['email', 'phone', 'location'].includes(c.type));

  return (
    <div className={`theme-${theme} template-corporate-banner`}>
      <div className="cv-container">
        {/* Full-width Top Header Banner */}
        <header className="banner-header cv-header">
          <div className="banner-monogram-box">
            <span className="banner-monogram">{initials}</span>
          </div>
          <h1 className="banner-name">{slots.header.name}</h1>
          {slots.header.title && (
            <div className="banner-title">{slots.header.title}</div>
          )}
        </header>

        {/* 2-Column Body Layout */}
        <div className="banner-body-grid">
          {/* Main Left Column: Summary & Work History */}
          <main className="banner-main-col">
            {slots.summary && (
              <SummarySlot data={slots.summary} />
            )}

            {slots.experience && (
              <ExperienceSlot data={slots.experience} />
            )}

            {slots.projects && (
              <ExperienceSlot data={slots.projects} />
            )}

            {slots.genericSections.map(sec => (
              <GenericSlot key={sec.id} data={sec} />
            ))}
          </main>

          {/* Right Sidebar: Contacts, Links, Skills, Education, Languages */}
          <aside className="banner-side-col">
            {/* Direct Contact Information */}
            {basicContacts.length > 0 && (
              <div className="banner-side-section banner-contacts-block">
                <ul className="banner-contact-list">
                  {basicContacts.map((c, i) => (
                    <li key={i} className="banner-contact-item">
                      <Icon type={c.type} size={13} />
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
              <div className="banner-side-section banner-links-block">
                <h3 className="banner-side-title">Websites, Portfolios, Profiles</h3>
                <ul className="banner-link-list">
                  {linkContacts.map((c, i) => (
                    <li key={i} className="banner-link-item">
                      <Icon type={c.type} size={13} />
                      <a href={c.url || '#'} target="_blank" rel="noopener noreferrer">
                        {c.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Skills */}
            {slots.skills && (
              <div className="banner-side-section">
                <SkillsSlot data={slots.skills} variant="pills" />
              </div>
            )}

            {/* Education */}
            {slots.education && (
              <div className="banner-side-section">
                <EducationSlot data={slots.education} />
              </div>
            )}

            {/* Languages */}
            {slots.languages && (
              <div className="banner-side-section">
                <LanguagesSlot data={slots.languages} />
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
};
