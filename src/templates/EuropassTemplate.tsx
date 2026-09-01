import React from 'react';
import { CVTemplateProps } from './types';
import { safeMarkdown, safeMarkdownInline, getCleanContactLabel } from '../utils/sanitize';
import { EditableText } from '../components/studio/preview/EditableText';
import { useCvLiveEdit } from '../components/studio/preview/CvLiveEditContext';

export const EuropassTemplate: React.FC<CVTemplateProps> = ({ slots, theme, data, photo }) => {
  const liveEdit = useCvLiveEdit();
  const euBlue = '#0e4194'; // Official Europass Navy Blue
  const euSoftBg = '#f1f5fa';
  const euBorder = '#d4e2f4';

  const { header, summary, skills, experience, education, languages, projects, genericSections } = slots;


  return (
    <div
      className={`theme-${theme} template-europass cv-container`}
      style={{
        fontFamily: "'Inter', Arial, sans-serif",
        color: '#1e293b',
        fontSize: '13px',
        lineHeight: 1.45,
        padding: '32px 38px',
        boxSizing: 'border-box',
        width: '100%',
      }}
    >
      {/* EUROPASS OFFICIAL HEADER BANNER */}
      <header
        style={{
          borderBottom: `2px solid ${euBlue}`,
          paddingBottom: '16px',
          marginBottom: '18px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: '20px',
        }}
      >
        {/* Left: Candidate Identification */}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: euBlue }}>
              Curriculum Vitae • Europass
            </span>
          </div>

          <EditableText
            tagName="h1"
            value={header.name}
            onSave={(val) => liveEdit?.updateName(val)}
            placeholder="Full Name..."
            style={{
              fontSize: '22px',
              fontWeight: 800,
              color: euBlue,
              margin: '0 0 4px 0',
              lineHeight: 1.15,
            }}
          />

          {header.title && (
            <EditableText
              tagName="div"
              value={header.title}
              onSave={(val) => liveEdit?.updateTitle(val)}
              placeholder="Job Applied For / Professional Title..."
              style={{
                fontSize: '13px',
                fontWeight: 700,
                color: '#475569',
                marginBottom: '10px',
              }}
            />
          )}

          {/* Contact Details Grid */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '6px 16px',
              fontSize: '11.5px',
              color: '#334155',
            }}
          >
            {header.contacts.map((c, i) => {
              const displayLabel = getCleanContactLabel(c);
              return (
                <div key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ fontWeight: 600, color: euBlue }}>•</span>
                  {c.url ? (
                    <a href={c.url} target="_blank" rel="noreferrer" style={{ color: '#0369a1', textDecoration: 'none', fontWeight: 600 }}>
                      {displayLabel}
                    </a>
                  ) : (
                    <span>{displayLabel}</span>
                  )}
                </div>
              );
            })}

            {header.nationality && (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ fontWeight: 700, color: euBlue }}>Nationality:</span>
                <span>{header.nationality}</span>
              </div>
            )}

            {header.dateOfBirth && (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ fontWeight: 700, color: euBlue }}>Date of birth:</span>
                <span>{header.dateOfBirth}</span>
              </div>
            )}

            {header.drivingLicense && (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ fontWeight: 700, color: euBlue }}>Driving licence:</span>
                <span>{header.drivingLicense}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Optional Photo */}
        {(() => {
          const activePhoto = photo || slots.header.photo;
          if (!activePhoto?.enabled || !activePhoto.url) return null;
          const photoSize = activePhoto.size || 96;
          const scale = photoSize / 96;
          const photoWidth = Math.round(84 * scale);
          const photoHeight = Math.round(105 * scale);
          return (
            <div
              style={{
                width: `${photoWidth}px`,
                height: `${photoHeight}px`,
                borderRadius: '4px',
                border: `2px solid ${euBorder}`,
                overflow: 'hidden',
                flexShrink: 0,
                backgroundColor: '#e2e8f0',
              }}
            >
              <img
                src={activePhoto.url}
                alt={header.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transform: `scale(${activePhoto.crop.zoom}) translate(${activePhoto.crop.x}px, ${activePhoto.crop.y}px)`,
                }}
              />
            </div>
          );
        })()}
      </header>



      {/* BODY SECTIONS */}
      <main style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* 1. PROFESSIONAL SUMMARY / PROFILE */}
        {summary && (
          <section>
            <h2
              style={{
                fontSize: '13px',
                fontWeight: 800,
                color: euBlue,
                textTransform: 'uppercase',
                borderBottom: `1.5px solid ${euBorder}`,
                paddingBottom: '3px',
                marginBottom: '8px',
                letterSpacing: '0.5px',
              }}
            >
              {summary.title || 'Work Profile'}
            </h2>
            <EditableText
              tagName="div"
              value={summary.rawContent}
              onSave={(val) => liveEdit?.updateSummary(val)}
              multiline
              htmlContent={safeMarkdown(summary.rawContent)}
              placeholder="Professional summary..."
              aiConfig={{
                type: 'summary',
                fieldKey: 'summary-main',
              }}
              style={{ margin: 0, fontSize: '12px', lineHeight: 1.5, color: '#334155' }}
            />
          </section>
        )}

        {/* 2. WORK EXPERIENCE */}
        {experience && (
          <section>
            <h2
              style={{
                fontSize: '13px',
                fontWeight: 800,
                color: euBlue,
                textTransform: 'uppercase',
                borderBottom: `1.5px solid ${euBorder}`,
                paddingBottom: '3px',
                marginBottom: '10px',
                letterSpacing: '0.5px',
              }}
            >
              {experience.title || 'Work Experience'}
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {experience.items.map((exp, expIdx) => (
                <div key={expIdx} style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                      <EditableText
                        tagName="span"
                        value={exp.role || 'Position'}
                        onSave={(val) => liveEdit?.updateExperienceField('experience', expIdx, 'role', val)}
                        style={{ fontWeight: 800, color: '#0f172a', fontSize: '12.5px' }}
                      />
                      <span style={{ color: '#64748b' }}>•</span>
                      <EditableText
                        tagName="span"
                        value={exp.company}
                        onSave={(val) => liveEdit?.updateExperienceField('experience', expIdx, 'company', val)}
                        style={{ fontWeight: 700, color: euBlue, fontSize: '12px' }}
                      />
                      {exp.location && (
                        <span style={{ fontSize: '11px', color: '#64748b' }}>({exp.location})</span>
                      )}
                    </div>

                    {exp.date && (
                      <span style={{ fontSize: '11px', fontWeight: 700, color: '#475569', backgroundColor: euSoftBg, padding: '2px 6px', borderRadius: '3px' }}>
                        {exp.date}
                      </span>
                    )}
                  </div>

                  {exp.bullets && exp.bullets.length > 0 && (
                    <ul style={{ margin: '4px 0 0 0', paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                      {exp.bullets.map((bullet, bIdx) => (
                        <EditableText
                          key={bIdx}
                          tagName="li"
                          value={bullet}
                          onSave={(val) => liveEdit?.updateExperienceBullet('experience', expIdx, bIdx, val)}
                          htmlContent={safeMarkdownInline(bullet)}
                          aiConfig={{
                            type: 'bullet',
                            fieldKey: `europass-exp-${expIdx}-bullet-${bIdx}`,
                            sectionType: 'experience',
                            itemIndex: expIdx,
                            bulletIndex: bIdx,
                            company: exp.company,
                            role: exp.role,
                          }}
                          style={{ fontSize: '11.5px', color: '#334155', lineHeight: 1.45 }}
                        />
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 3. EDUCATION AND TRAINING */}
        {education && (
          <section>
            <h2
              style={{
                fontSize: '13px',
                fontWeight: 800,
                color: euBlue,
                textTransform: 'uppercase',
                borderBottom: `1.5px solid ${euBorder}`,
                paddingBottom: '3px',
                marginBottom: '8px',
                letterSpacing: '0.5px',
              }}
            >
              {education.title || 'Education and Training'}
            </h2>

            <ul style={{ margin: 0, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {education.items.map((rawEdu, eduIdx) => {
                let edu = (rawEdu || '').trim();
                if (/^\*?[^*]+\*\*/.test(edu)) {
                  edu = edu.replace(/^\*?([^*]+)\*\*/, '**$1**');
                } else if (!edu.includes('**') && /^[A-Za-z0-9\s.,/&()-]+?\s+[–—\-]\s+/.test(edu)) {
                  edu = edu.replace(/^([A-Za-z0-9\s.,/&()-]+?)\s+([–—\-])\s+/, '**$1** $2 ');
                }

                return (
                  <EditableText
                    key={eduIdx}
                    tagName="li"
                    value={edu}
                    onSave={(val) => liveEdit?.updateEducationItem(eduIdx, val)}
                    htmlContent={safeMarkdownInline(edu)}
                    style={{ fontSize: '12px', color: '#334155', lineHeight: 1.45 }}
                  />
                );
              })}
            </ul>
          </section>
        )}

        {/* 4. LANGUAGE SKILLS (CEFR SELF-ASSESSMENT GRID) */}
        {languages && (
          <section>
            <h2
              style={{
                fontSize: '13px',
                fontWeight: 800,
                color: euBlue,
                textTransform: 'uppercase',
                borderBottom: `1.5px solid ${euBorder}`,
                paddingBottom: '3px',
                marginBottom: '8px',
                letterSpacing: '0.5px',
              }}
            >
              {languages.title || 'Language Skills'}
            </h2>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {languages.languageItems && languages.languageItems.length > 0 ? (
                languages.languageItems.map((lang, lIdx) => {
                  const isNative = lang.level === 'Native';
                  return (
                    <div
                      key={lIdx}
                      style={{
                        backgroundColor: euSoftBg,
                        border: `1px solid ${euBorder}`,
                        borderRadius: '4px',
                        padding: '5px 10px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      <span style={{ fontWeight: 700, fontSize: '12px', color: '#0f172a' }}>{lang.name}:</span>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 800,
                          color: isNative ? '#166534' : euBlue,
                          backgroundColor: isNative ? '#dcfce7' : '#ffffff',
                          border: `1px solid ${isNative ? '#86efac' : euBorder}`,
                          padding: '1px 6px',
                          borderRadius: '3px',
                        }}
                      >
                        {isNative ? 'Native' : lang.level}
                      </span>
                      {!isNative && lang.displayLevel && !lang.displayLevel.startsWith(lang.level) && (
                        <span style={{ fontSize: '10.5px', color: '#64748b' }}>({lang.displayLevel})</span>
                      )}
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
                    htmlContent={safeMarkdownInline(rawLang)}
                    style={{
                      backgroundColor: euSoftBg,
                      border: `1px solid ${euBorder}`,
                      borderRadius: '4px',
                      padding: '4px 8px',
                      fontSize: '11.5px',
                    }}
                  />
                ))
              )}
            </div>
          </section>
        )}

        {/* 5. DIGITAL SKILLS & COMPETENCES */}
        {skills && (
          <section>
            <h2
              style={{
                fontSize: '13px',
                fontWeight: 800,
                color: euBlue,
                textTransform: 'uppercase',
                borderBottom: `1.5px solid ${euBorder}`,
                paddingBottom: '3px',
                marginBottom: '8px',
                letterSpacing: '0.5px',
              }}
            >
              {skills.title || 'Digital Skills & Competencies'}
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {skills.skillGroups.map((group, gIdx) => (
                <div key={gIdx} style={{ fontSize: '11.5px', lineHeight: 1.45 }}>
                  <span style={{ fontWeight: 700, color: '#0f172a' }}>{group.category}: </span>
                  <span style={{ color: '#334155' }}>{group.skills.join(' • ')}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 6. PROJECTS & GENERIC SECTIONS */}
        {projects && (
          <section>
            <h2
              style={{
                fontSize: '13px',
                fontWeight: 800,
                color: euBlue,
                textTransform: 'uppercase',
                borderBottom: `1.5px solid ${euBorder}`,
                paddingBottom: '3px',
                marginBottom: '8px',
                letterSpacing: '0.5px',
              }}
            >
              {projects.title || 'Key Projects & Initiatives'}
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {projects.items.map((proj, pIdx) => (
                <div key={pIdx}>
                  <span style={{ fontWeight: 800, color: '#0f172a', fontSize: '12px' }}>{proj.company}</span>
                  {proj.bullets && (
                    <ul style={{ margin: '2px 0 0 0', paddingLeft: '18px' }}>
                      {proj.bullets.map((b, bIdx) => (
                        <li key={bIdx} style={{ fontSize: '11.5px', color: '#334155' }}>
                          <span dangerouslySetInnerHTML={{ __html: safeMarkdownInline(b) }} />
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
                fontSize: '13px',
                fontWeight: 800,
                color: euBlue,
                textTransform: 'uppercase',
                borderBottom: `1.5px solid ${euBorder}`,
                paddingBottom: '3px',
                marginBottom: '8px',
                letterSpacing: '0.5px',
              }}
            >
              {sec.title}
            </h2>
            <div
              style={{ fontSize: '11.5px', color: '#334155', lineHeight: 1.45 }}
              dangerouslySetInnerHTML={{ __html: safeMarkdown(sec.rawContent) }}
            />
          </section>
        ))}
      </main>
    </div>
  );
};
