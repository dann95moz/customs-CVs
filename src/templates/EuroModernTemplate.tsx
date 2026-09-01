import React from 'react';
import { CVTemplateProps } from './types';
import { marked } from 'marked';
import { EditableText } from '../components/studio/preview/EditableText';
import { useCvLiveEdit } from '../components/studio/preview/CvLiveEditContext';

export const EuroModernTemplate: React.FC<CVTemplateProps> = ({ slots, theme, data, photo }) => {
  const liveEdit = useCvLiveEdit();
  const { header, summary, skills, experience, education, languages, projects, genericSections } = slots;

  return (
    <div
      className={`theme-${theme} template-euro-modern`}
      style={{
        fontFamily: "'Inter', sans-serif",
        color: '#1e293b',
        fontSize: '12.5px',
        lineHeight: 1.5,
        display: 'flex',
        minHeight: '100%',
        boxSizing: 'border-box',
      }}
    >
      {/* 1. LEFT SIDEBAR (Personal Info, Photo, Languages, Skills, Education) */}
      <aside
        style={{
          width: '34%',
          backgroundColor: '#f8fafc',
          borderRight: '1px solid #e2e8f0',
          padding: '24px 18px',
          display: 'flex',
          flexDirection: 'column',
          gap: '18px',
          boxSizing: 'border-box',
          flexShrink: 0,
        }}
      >
        {/* Profile Photo */}
        {photo?.enabled && photo.url && (
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '4px' }}>
            <div
              style={{
                width: '96px',
                height: '96px',
                borderRadius: '50%',
                border: '3px solid var(--cv-primary, #0284c7)',
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              }}
            >
              <img
                src={photo.url}
                alt={header.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transform: `scale(${photo.crop.zoom}) translate(${photo.crop.x}px, ${photo.crop.y}px)`,
                }}
              />
            </div>
          </div>
        )}

        {/* Contact & Personal Metadata Block */}
        <section>
          <h3
            style={{
              fontSize: '11px',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              color: 'var(--cv-primary, #0284c7)',
              borderBottom: '1.5px solid #e2e8f0',
              paddingBottom: '4px',
              marginBottom: '8px',
            }}
          >
            Contact & Details
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '11px', color: '#475569' }}>
            {header.contacts.map((c, idx) => (
              <div key={idx} style={{ wordBreak: 'break-word' }}>
                {c.url ? (
                  <a href={c.url} target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
                    {c.label}
                  </a>
                ) : (
                  <span>{c.label}</span>
                )}
              </div>
            ))}

            {header.nationality && (
              <div>
                <span style={{ fontWeight: 700, color: '#334155' }}>Nationality: </span>
                <span>{header.nationality}</span>
              </div>
            )}

            {header.dateOfBirth && (
              <div>
                <span style={{ fontWeight: 700, color: '#334155' }}>Birth date: </span>
                <span>{header.dateOfBirth}</span>
              </div>
            )}

            {header.drivingLicense && (
              <div>
                <span style={{ fontWeight: 700, color: '#334155' }}>Driving licence: </span>
                <span>{header.drivingLicense}</span>
              </div>
            )}
          </div>
        </section>

        {/* Languages (CEFR Grid) */}
        {languages && (
          <section>
            <h3
              style={{
                fontSize: '11px',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '1px',
                color: 'var(--cv-primary, #0284c7)',
                borderBottom: '1.5px solid #e2e8f0',
                paddingBottom: '4px',
                marginBottom: '8px',
              }}
            >
              {languages.title || 'Languages'}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {languages.languageItems && languages.languageItems.length > 0 ? (
                languages.languageItems.map((lang, lIdx) => {
                  const isNative = lang.level === 'Native';
                  return (
                    <div
                      key={lIdx}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '11px',
                      }}
                    >
                      <span style={{ fontWeight: 600, color: '#1e293b' }}>{lang.name}</span>
                      <span
                        style={{
                          fontSize: '10px',
                          fontWeight: 800,
                          backgroundColor: isNative ? '#dcfce7' : '#e0f2fe',
                          color: isNative ? '#166534' : '#0369a1',
                          padding: '1px 6px',
                          borderRadius: '9999px',
                        }}
                      >
                        {lang.level}
                      </span>
                    </div>
                  );
                })
              ) : (
                languages.items.map((rawLang, lIdx) => (
                  <EditableText
                    key={lIdx}
                    tagName="div"
                    value={rawLang}
                    onSave={(val) => liveEdit?.updateLanguageItem(lIdx, val)}
                    htmlContent={marked.parseInline(rawLang) as string}
                    style={{ fontSize: '11px' }}
                  />
                ))
              )}
            </div>
          </section>
        )}

        {/* Skills */}
        {skills && (
          <section>
            <h3
              style={{
                fontSize: '11px',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '1px',
                color: 'var(--cv-primary, #0284c7)',
                borderBottom: '1.5px solid #e2e8f0',
                paddingBottom: '4px',
                marginBottom: '8px',
              }}
            >
              {skills.title || 'Competences'}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {skills.skillGroups.map((group, gIdx) => (
                <div key={gIdx} style={{ fontSize: '11px' }}>
                  <div style={{ fontWeight: 700, color: '#334155', marginBottom: '2px' }}>{group.category}</div>
                  <div style={{ color: '#64748b', lineHeight: 1.4 }}>{group.skills.join(', ')}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {education && (
          <section>
            <h3
              style={{
                fontSize: '11px',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '1px',
                color: 'var(--cv-primary, #0284c7)',
                borderBottom: '1.5px solid #e2e8f0',
                paddingBottom: '4px',
                marginBottom: '8px',
              }}
            >
              {education.title || 'Education'}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {education.items.map((edu, eIdx) => (
                <EditableText
                  key={eIdx}
                  tagName="div"
                  value={edu}
                  onSave={(val) => liveEdit?.updateEducationItem(eIdx, val)}
                  htmlContent={marked.parseInline(edu) as string}
                  style={{ fontSize: '11px', color: '#334155' }}
                />
              ))}
            </div>
          </section>
        )}
      </aside>

      {/* 2. MAIN BODY (Header, Pitch, Work Experience, Projects) */}
      <main
        style={{
          width: '66%',
          padding: '24px 22px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          boxSizing: 'border-box',
        }}
      >
        {/* Header Name & Title */}
        <header style={{ borderBottom: '2px solid var(--cv-primary, #0284c7)', paddingBottom: '10px' }}>
          <EditableText
            tagName="h1"
            value={header.name}
            onSave={(val) => liveEdit?.updateName(val)}
            placeholder="Full Name..."
            style={{
              fontSize: '24px',
              fontWeight: 800,
              color: '#0f172a',
              margin: '0 0 2px 0',
              lineHeight: 1.15,
            }}
          />
          {header.title && (
            <EditableText
              tagName="div"
              value={header.title}
              onSave={(val) => liveEdit?.updateTitle(val)}
              placeholder="Professional Title..."
              style={{
                fontSize: '13px',
                fontWeight: 700,
                color: 'var(--cv-primary, #0284c7)',
              }}
            />
          )}
        </header>

        {/* Summary / Profile */}
        {summary && (
          <section>
            <h2
              style={{
                fontSize: '12px',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                color: '#0f172a',
                borderBottom: '1px solid #e2e8f0',
                paddingBottom: '2px',
                marginBottom: '6px',
              }}
            >
              {summary.title || 'Profile'}
            </h2>
            <EditableText
              tagName="p"
              value={summary.rawContent}
              onSave={(val) => liveEdit?.updateSummary(val)}
              htmlContent={marked.parse(summary.rawContent) as string}
              placeholder="Summary text..."
              style={{ margin: 0, fontSize: '11.5px', lineHeight: 1.5, color: '#334155' }}
            />
          </section>
        )}

        {/* Work Experience */}
        {experience && (
          <section>
            <h2
              style={{
                fontSize: '12px',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                color: '#0f172a',
                borderBottom: '1px solid #e2e8f0',
                paddingBottom: '2px',
                marginBottom: '8px',
              }}
            >
              {experience.title || 'Work Experience'}
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {experience.items.map((exp, expIdx) => (
                <div key={expIdx} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap' }}>
                    <div>
                      <EditableText
                        tagName="span"
                        value={exp.role || 'Position'}
                        onSave={(val) => liveEdit?.updateExperienceField('experience', expIdx, 'role', val)}
                        style={{ fontWeight: 800, color: '#0f172a', fontSize: '12px' }}
                      />
                      <span style={{ color: '#94a3b8', margin: '0 4px' }}>|</span>
                      <EditableText
                        tagName="span"
                        value={exp.company}
                        onSave={(val) => liveEdit?.updateExperienceField('experience', expIdx, 'company', val)}
                        style={{ fontWeight: 700, color: 'var(--cv-primary, #0284c7)', fontSize: '11.5px' }}
                      />
                    </div>
                    {exp.date && (
                      <span style={{ fontSize: '10.5px', fontWeight: 700, color: '#64748b' }}>
                        {exp.date}
                      </span>
                    )}
                  </div>

                  {exp.bullets && (
                    <ul style={{ margin: '3px 0 0 0', paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      {exp.bullets.map((bullet, bIdx) => (
                        <EditableText
                          key={bIdx}
                          tagName="li"
                          value={bullet}
                          onSave={(val) => liveEdit?.updateExperienceBullet('experience', expIdx, bIdx, val)}
                          htmlContent={marked.parseInline(bullet) as string}
                          style={{ fontSize: '11px', color: '#334155', lineHeight: 1.4 }}
                        />
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects / Publications / Generic */}
        {projects && (
          <section>
            <h2
              style={{
                fontSize: '12px',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                color: '#0f172a',
                borderBottom: '1px solid #e2e8f0',
                paddingBottom: '2px',
                marginBottom: '6px',
              }}
            >
              {projects.title || 'Projects'}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {projects.items.map((proj, pIdx) => (
                <div key={pIdx}>
                  <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '11.5px' }}>{proj.company}</div>
                  {proj.bullets && (
                    <ul style={{ margin: '2px 0 0 0', paddingLeft: '16px' }}>
                      {proj.bullets.map((b, bIdx) => (
                        <li key={bIdx} style={{ fontSize: '11px', color: '#334155' }}>
                          <span dangerouslySetInnerHTML={{ __html: marked.parseInline(b) as string }} />
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {genericSections.map((sec) => (
          <section key={sec.id}>
            <h2
              style={{
                fontSize: '12px',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                color: '#0f172a',
                borderBottom: '1px solid #e2e8f0',
                paddingBottom: '2px',
                marginBottom: '6px',
              }}
            >
              {sec.title}
            </h2>
            <div
              style={{ fontSize: '11px', color: '#334155', lineHeight: 1.4 }}
              dangerouslySetInnerHTML={{ __html: marked.parse(sec.rawContent) as string }}
            />
          </section>
        ))}
      </main>
    </div>
  );
};
