import React from 'react';
import { CVData, ThemeId } from '../types/cv';
import { Header } from './Header';
import { SkillsSection } from './SkillsSection';
import { ExperienceSection } from './ExperienceSection';
import { EducationSection } from './EducationSection';
import { marked } from 'marked';

interface CVRendererProps {
  data: CVData;
  theme?: ThemeId;
}

export const CVRenderer: React.FC<CVRendererProps> = ({ 
  data, 
  theme = 'modern-tech' 
}) => {
  const isTwoColumn = theme === 'two-column';

  // Render individual sections
  const renderSection = (sec: CVData['sections'][0]) => {
    switch (sec.type) {
      case 'summary':
        return (
          <section key={sec.id} className="cv-section section-summary section-block">
            <h2 className="cv-section-title">{sec.title}</h2>
            <div 
              className="cv-summary" 
              dangerouslySetInnerHTML={{ __html: marked.parse(sec.rawContent) as string }} 
            />
          </section>
        );

      case 'skills':
        if (data.skillGroups && data.skillGroups.length > 0) {
          return <SkillsSection key={sec.id} title={sec.title} skillGroups={data.skillGroups} />;
        }
        return null;

      case 'experience':
        if (data.experience && data.experience.length > 0) {
          return <ExperienceSection key={sec.id} title={sec.title} items={data.experience} type="experience" />;
        }
        return null;

      case 'projects':
        if (data.projects && data.projects.length > 0) {
          return <ExperienceSection key={sec.id} title={sec.title} items={data.projects} type="projects" />;
        }
        return null;

      case 'education':
        if (data.education && data.education.length > 0) {
          return <EducationSection key={sec.id} title={sec.title} items={data.education} type="education" />;
        }
        return null;

      case 'languages':
        if (data.languages && data.languages.length > 0) {
          return <EducationSection key={sec.id} title={sec.title} items={data.languages} type="languages" />;
        }
        return null;

      default:
        return (
          <section key={sec.id} className="cv-section section-generic section-block">
            <h2 className="cv-section-title">{sec.title}</h2>
            <div 
              className="cv-content" 
              dangerouslySetInnerHTML={{ __html: marked.parse(sec.rawContent) as string }} 
            />
          </section>
        );
    }
  };

  if (isTwoColumn) {
    const sidebarTypes = ['skills', 'education', 'languages'];
    const sidebarSections = data.sections.filter(s => sidebarTypes.includes(s.type));
    const mainSections = data.sections.filter(s => !sidebarTypes.includes(s.type));

    return (
      <div className={`theme-${theme}`}>
        <div className="cv-container">
          <Header name={data.name} title={data.title} contacts={data.contacts} />
          <div className="cv-body-grid">
            <aside className="cv-sidebar">
              {sidebarSections.map(renderSection)}
            </aside>
            <main className="cv-main">
              {mainSections.map(renderSection)}
            </main>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`theme-${theme}`}>
      <div className="cv-container">
        <Header name={data.name} title={data.title} contacts={data.contacts} />
        <main className="cv-body">
          {data.sections.map(renderSection)}
        </main>
      </div>
    </div>
  );
};
