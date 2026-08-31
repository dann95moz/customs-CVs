import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { parseCvMarkdownToData, serializeCvDataToMarkdown } from '../../core/parser';
import { CVData, ContactItem, ContactType, ExperienceItem, SkillCategory } from '../../types/cv';
import { PersonalInfoSection } from './profile/PersonalInfoSection';
import { SummarySection } from './profile/SummarySection';
import { SkillsSection } from './profile/SkillsSection';
import { ExperienceSection } from './profile/ExperienceSection';
import { EducationSection } from './profile/EducationSection';
import { LanguagesSection } from './profile/LanguagesSection';
import { ProjectsSection } from './profile/ProjectsSection';
import { GuidedProfileFormProps } from '../../types';

export type { GuidedProfileFormProps };

/**
 * Step 1: Guided visual profile editor orchestrating structured CV sections.
 * Principle: Single Responsibility (S) - delegates each CV section to its own dedicated subcomponent.
 */
export const GuidedProfileForm: React.FC<GuidedProfileFormProps> = ({
  markdownContent,
  onChange,
}) => {
  const [formData, setFormData] = useState<CVData>(() => parseCvMarkdownToData(markdownContent));
  const [expandedSection, setExpandedSection] = useState<string | false>('personal');
  const [skillsTextMap, setSkillsTextMap] = useState<Record<number, string>>({});
  const lastEmittedMarkdownRef = React.useRef<string>(markdownContent);

  useEffect(() => {
    if (markdownContent === lastEmittedMarkdownRef.current) {
      return;
    }
    lastEmittedMarkdownRef.current = markdownContent;
    const parsed = parseCvMarkdownToData(markdownContent);
    setFormData(parsed);
    setSkillsTextMap({});
  }, [markdownContent]);

  const updateData = (updater: (prev: CVData) => CVData) => {
    setFormData(prev => {
      const next = updater(prev);
      const newMarkdown = serializeCvDataToMarkdown(next);
      lastEmittedMarkdownRef.current = newMarkdown;
      onChange(newMarkdown);
      return next;
    });
  };

  // Contacts Helpers
  const handleContactChange = (type: ContactType, label: string, url?: string) => {
    updateData(prev => {
      const remaining = prev.contacts.filter(c => c.type !== type);
      const cleanLabel = label.trim();
      if (cleanLabel) {
        let cleanText = cleanLabel;
        if (type === 'email') {
          cleanText = cleanLabel.replace(/^mailto:/i, '').trim();
        }

        let finalUrl = url;
        if (type === 'email') {
          finalUrl = cleanText ? `mailto:${cleanText}` : undefined;
        } else if (!finalUrl && (type === 'linkedin' || type === 'github' || type === 'globe')) {
          finalUrl = cleanLabel;
        }

        const newContact: ContactItem = {
          type,
          label: label,
          url: finalUrl
        };
        return { ...prev, contacts: [...remaining, newContact] };
      }
      return { ...prev, contacts: remaining };
    });
  };

  // Skill category helpers
  const handleSkillGroupCategoryChange = (index: number, newCategory: string) => {
    updateData(prev => {
      const groups = [...(prev.skillGroups || [])];
      if (!groups[index]) return prev;
      groups[index] = { ...groups[index], category: newCategory };
      return { ...prev, skillGroups: groups };
    });
  };

  const handleSkillGroupSkillsChange = (index: number, skillsStr: string) => {
    updateData(prev => {
      const groups = [...(prev.skillGroups || [])];
      if (!groups[index]) return prev;
      groups[index] = {
        ...groups[index],
        skills: skillsStr.split(',').map(s => s.trim()).filter(Boolean)
      };
      return { ...prev, skillGroups: groups };
    });
  };

  const handleAddSkillGroup = () => {
    updateData(prev => {
      const current = prev.skillGroups ? [...prev.skillGroups] : [];
      const newIdx = current.length;
      const defaultCategory = newIdx === 0
        ? 'Languages & Fundamentals'
        : newIdx === 1
        ? 'Frameworks & Architecture'
        : newIdx === 2
        ? 'Tooling, CI/CD & Cloud'
        : `Competency Group ${newIdx + 1}`;

      const newGroup: SkillCategory = {
        category: defaultCategory,
        skills: ['Technology 1', 'Technology 2']
      };
      setSkillsTextMap(prevMap => ({ ...prevMap, [newIdx]: 'Technology 1, Technology 2' }));
      return {
        ...prev,
        skillGroups: [...current, newGroup]
      };
    });
  };

  const handleRemoveSkillGroup = (index: number) => {
    setSkillsTextMap(prevMap => {
      const newMap: Record<number, string> = {};
      Object.keys(prevMap).forEach(keyStr => {
        const k = Number(keyStr);
        if (k < index) newMap[k] = prevMap[k];
        else if (k > index) newMap[k - 1] = prevMap[k];
      });
      return newMap;
    });
    updateData(prev => ({
      ...prev,
      skillGroups: (prev.skillGroups || []).filter((_, i) => i !== index)
    }));
  };

  // Experience helpers
  const handleExperienceChange = (index: number, field: keyof ExperienceItem, value: string | string[]) => {
    updateData(prev => {
      const expList = [...(prev.experience || [])];
      expList[index] = { ...expList[index], [field]: value };
      return { ...prev, experience: expList };
    });
  };

  const handleAddExperience = () => {
    const newExp: ExperienceItem = {
      company: 'Company Name',
      role: 'Job Title / Specialization',
      location: 'City, Country (or Remote)',
      date: 'Mon YYYY – Present',
      bullets: [
        'Spearheaded key architectural initiatives cutting build times by 45% through modern CI/CD automation.'
      ]
    };
    updateData(prev => ({
      ...prev,
      experience: [newExp, ...(prev.experience || [])]
    }));
  };

  const handleRemoveExperience = (index: number) => {
    updateData(prev => ({
      ...prev,
      experience: (prev.experience || []).filter((_, i) => i !== index)
    }));
  };

  const handleAddBullet = (expIndex: number) => {
    updateData(prev => {
      const expList = [...(prev.experience || [])];
      const targetExp = expList[expIndex];
      const newBullets = [...targetExp.bullets, 'Accomplished [X] as measured by [Y%] by designing and deploying [Z].'];
      expList[expIndex] = { ...targetExp, bullets: newBullets };
      return { ...prev, experience: expList };
    });
  };

  const handleUpdateBullet = (expIndex: number, bulletIndex: number, text: string) => {
    updateData(prev => {
      const expList = [...(prev.experience || [])];
      const targetExp = expList[expIndex];
      const newBullets = [...targetExp.bullets];
      newBullets[bulletIndex] = text;
      expList[expIndex] = { ...targetExp, bullets: newBullets };
      return { ...prev, experience: expList };
    });
  };

  const handleRemoveBullet = (expIndex: number, bulletIndex: number) => {
    updateData(prev => {
      const expList = [...(prev.experience || [])];
      const targetExp = expList[expIndex];
      const newBullets = targetExp.bullets.filter((_, i) => i !== bulletIndex);
      expList[expIndex] = { ...targetExp, bullets: newBullets };
      return { ...prev, experience: expList };
    });
  };

  // Education helpers
  const handleAddEducation = () => {
    updateData(prev => ({
      ...prev,
      education: [...(prev.education || []), '**B.S. in Computer Science** – University Name, 2022']
    }));
  };

  const handleUpdateEducation = (index: number, text: string) => {
    updateData(prev => {
      const list = [...(prev.education || [])];
      list[index] = text;
      return { ...prev, education: list };
    });
  };

  const handleRemoveEducation = (index: number) => {
    updateData(prev => ({
      ...prev,
      education: (prev.education || []).filter((_, i) => i !== index)
    }));
  };

  // Languages helpers
  const handleAddLanguage = () => {
    updateData(prev => ({
      ...prev,
      languages: [...(prev.languages || []), '**English:** Native / Full Professional Proficiency']
    }));
  };

  const handleUpdateLanguage = (index: number, text: string) => {
    updateData(prev => {
      const list = [...(prev.languages || [])];
      list[index] = text;
      return { ...prev, languages: list };
    });
  };

  const handleRemoveLanguage = (index: number) => {
    updateData(prev => ({
      ...prev,
      languages: (prev.languages || []).filter((_, i) => i !== index)
    }));
  };

  // Projects & Extras helpers
  const handleAddProject = () => {
    const newProject: ExperienceItem = {
      company: '',
      role: 'Personal Project',
      location: '',
      date: '',
      bullets: []
    };
    updateData(prev => ({
      ...prev,
      projects: [...(prev.projects || []), newProject]
    }));
  };

  const handleProjectFieldChange = (index: number, field: keyof ExperienceItem, value: string | string[]) => {
    updateData(prev => {
      const list = [...(prev.projects || [])];
      list[index] = { ...list[index], [field]: value };
      return { ...prev, projects: list };
    });
  };

  const handleRemoveProject = (index: number) => {
    updateData(prev => ({
      ...prev,
      projects: (prev.projects || []).filter((_, i) => i !== index)
    }));
  };

  const handleAccordionChange = (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedSection(isExpanded ? panel : false);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: { xs: 1, sm: 2 } }}>
      {/* 1. Identity & Contact Links */}
      <PersonalInfoSection
        isExpanded={expandedSection === 'personal'}
        onToggle={handleAccordionChange('personal')}
        name={formData.name || ''}
        title={formData.title || ''}
        contacts={formData.contacts}
        onNameChange={(name) => updateData(prev => ({ ...prev, name }))}
        onTitleChange={(title) => updateData(prev => ({ ...prev, title }))}
        onContactChange={handleContactChange}
      />

      {/* 2. Professional Summary & Pitch */}
      <SummarySection
        isExpanded={expandedSection === 'summary'}
        onToggle={handleAccordionChange('summary')}
        summary={formData.summary || ''}
        onSummaryChange={(summary) => updateData(prev => ({ ...prev, summary }))}
      />

      {/* 3. Tech Stack & Competencies */}
      <SkillsSection
        isExpanded={expandedSection === 'skills'}
        onToggle={handleAccordionChange('skills')}
        skillGroups={formData.skillGroups || []}
        skillsTextMap={skillsTextMap}
        onCategoryChange={handleSkillGroupCategoryChange}
        onSkillsChange={(idx, val) => {
          setSkillsTextMap(prev => ({ ...prev, [idx]: val }));
          handleSkillGroupSkillsChange(idx, val);
        }}
        onAddCategory={handleAddSkillGroup}
        onRemoveCategory={handleRemoveSkillGroup}
      />

      {/* 4. Work History & Achievements */}
      <ExperienceSection
        isExpanded={expandedSection === 'experience'}
        onToggle={handleAccordionChange('experience')}
        experience={formData.experience || []}
        onFieldChange={handleExperienceChange}
        onAddExperience={handleAddExperience}
        onRemoveExperience={handleRemoveExperience}
        onAddBullet={handleAddBullet}
        onUpdateBullet={handleUpdateBullet}
        onRemoveBullet={handleRemoveBullet}
      />

      {/* 5. Education & Certifications */}
      <EducationSection
        isExpanded={expandedSection === 'education'}
        onToggle={handleAccordionChange('education')}
        education={formData.education || []}
        onUpdateEducation={handleUpdateEducation}
        onAddEducation={handleAddEducation}
        onRemoveEducation={handleRemoveEducation}
      />

      {/* 6. Languages */}
      <LanguagesSection
        isExpanded={expandedSection === 'languages'}
        onToggle={handleAccordionChange('languages')}
        languages={formData.languages || []}
        onUpdateLanguage={handleUpdateLanguage}
        onAddLanguage={handleAddLanguage}
        onRemoveLanguage={handleRemoveLanguage}
      />

      {/* 7. Projects & Extras */}
      <ProjectsSection
        isExpanded={expandedSection === 'projects'}
        onToggle={handleAccordionChange('projects')}
        projects={formData.projects || []}
        onFieldChange={handleProjectFieldChange}
        onAddProject={handleAddProject}
        onRemoveProject={handleRemoveProject}
      />
    </Box>
  );
};
