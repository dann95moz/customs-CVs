import React, { useState, useEffect, useCallback, useRef } from 'react';
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

const EMPTY_SKILL_GROUPS: SkillCategory[] = [];
const EMPTY_EXPERIENCE: ExperienceItem[] = [];
const EMPTY_EDUCATION: string[] = [];
const EMPTY_LANGUAGES: string[] = [];
const EMPTY_PROJECTS: ExperienceItem[] = [];

/**
 * Step 1: Guided visual profile editor orchestrating structured CV sections.
 * Highly optimized with stable callbacks, section isolation, and debounced Markdown serialization.
 */
export const GuidedProfileForm: React.FC<GuidedProfileFormProps> = ({
  markdownContent,
  onChange,
}) => {
  const [formData, setFormData] = useState<CVData>(() => parseCvMarkdownToData(markdownContent));
  const [expandedSection, setExpandedSection] = useState<string | false>('personal');
  const [skillsTextMap, setSkillsTextMap] = useState<Record<number, string>>({});
  
  const lastEmittedMarkdownRef = useRef<string>(markdownContent);
  const formDataRef = useRef<CVData>(formData);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  formDataRef.current = formData;

  // Flush pending changes to parent
  const flushChanges = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    const newMarkdown = serializeCvDataToMarkdown(formDataRef.current);
    if (newMarkdown !== lastEmittedMarkdownRef.current) {
      lastEmittedMarkdownRef.current = newMarkdown;
      onChange(newMarkdown);
    }
  }, [onChange]);

  // Flush on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
        const newMarkdown = serializeCvDataToMarkdown(formDataRef.current);
        if (newMarkdown !== lastEmittedMarkdownRef.current) {
          lastEmittedMarkdownRef.current = newMarkdown;
          onChange(newMarkdown);
        }
      }
    };
  }, [onChange]);

  // Synchronize when external markdownContent changes (e.g. sample loaded or file imported)
  useEffect(() => {
    if (markdownContent === lastEmittedMarkdownRef.current) {
      return;
    }
    lastEmittedMarkdownRef.current = markdownContent;
    const parsed = parseCvMarkdownToData(markdownContent);
    setFormData(parsed);
    formDataRef.current = parsed;
    setSkillsTextMap({});
  }, [markdownContent]);

  const scheduleEmit = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      debounceTimerRef.current = null;
      const newMarkdown = serializeCvDataToMarkdown(formDataRef.current);
      if (newMarkdown !== lastEmittedMarkdownRef.current) {
        lastEmittedMarkdownRef.current = newMarkdown;
        onChange(newMarkdown);
      }
    }, 250);
  }, [onChange]);

  const updateData = useCallback((updater: (prev: CVData) => CVData) => {
    setFormData(prev => {
      const next = updater(prev);
      formDataRef.current = next;
      return next;
    });
    scheduleEmit();
  }, [scheduleEmit]);

  // Identity / Contact Callbacks
  const handleNameChange = useCallback((name: string) => {
    updateData(prev => ({ ...prev, name }));
  }, [updateData]);

  const handleTitleChange = useCallback((title: string) => {
    updateData(prev => ({ ...prev, title }));
  }, [updateData]);

  const handleContactChange = useCallback((type: ContactType, label: string, url?: string) => {
    updateData(prev => {
      const remaining = prev.contacts.filter(c => c.type !== type);
      if (label) {
        let cleanText = label;
        if (type === 'email') {
          cleanText = cleanText.replace(/^mailto:/i, '');
        }

        let finalUrl = url;
        if (type === 'email') {
          finalUrl = cleanText ? `mailto:${cleanText}` : undefined;
        } else if (!finalUrl && (type === 'linkedin' || type === 'github' || type === 'globe')) {
          finalUrl = label;
        }

        const newContact: ContactItem = {
          type,
          label,
          url: finalUrl
        };
        return { ...prev, contacts: [...remaining, newContact] };
      }
      return { ...prev, contacts: remaining };
    });
  }, [updateData]);

  // Summary Callbacks
  const handleSummaryChange = useCallback((summary: string) => {
    updateData(prev => ({ ...prev, summary }));
  }, [updateData]);

  // Skill category helpers
  const handleSkillGroupCategoryChange = useCallback((index: number, newCategory: string) => {
    updateData(prev => {
      const groups = [...(prev.skillGroups || [])];
      if (!groups[index]) return prev;
      groups[index] = { ...groups[index], category: newCategory };
      return { ...prev, skillGroups: groups };
    });
  }, [updateData]);

  const handleSkillGroupSkillsChange = useCallback((index: number, skillsStr: string) => {
    setSkillsTextMap(prev => ({ ...prev, [index]: skillsStr }));
    updateData(prev => {
      const groups = [...(prev.skillGroups || [])];
      if (!groups[index]) return prev;
      groups[index] = {
        ...groups[index],
        skills: skillsStr.split(',').map(s => s.trim()).filter(Boolean)
      };
      return { ...prev, skillGroups: groups };
    });
  }, [updateData]);

  const handleAddSkillGroup = useCallback(() => {
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
  }, [updateData]);

  const handleRemoveSkillGroup = useCallback((index: number) => {
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
  }, [updateData]);

  // Experience helpers
  const handleExperienceChange = useCallback((index: number, field: keyof ExperienceItem, value: string | string[]) => {
    updateData(prev => {
      const expList = [...(prev.experience || [])];
      expList[index] = { ...expList[index], [field]: value };
      return { ...prev, experience: expList };
    });
  }, [updateData]);

  const handleAddExperience = useCallback(() => {
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
  }, [updateData]);

  const handleRemoveExperience = useCallback((index: number) => {
    updateData(prev => ({
      ...prev,
      experience: (prev.experience || []).filter((_, i) => i !== index)
    }));
  }, [updateData]);

  const handleAddBullet = useCallback((expIndex: number) => {
    updateData(prev => {
      const expList = [...(prev.experience || [])];
      const targetExp = expList[expIndex];
      const newBullets = [...targetExp.bullets, 'Accomplished [X] as measured by [Y%] by designing and deploying [Z].'];
      expList[expIndex] = { ...targetExp, bullets: newBullets };
      return { ...prev, experience: expList };
    });
  }, [updateData]);

  const handleUpdateBullet = useCallback((expIndex: number, bulletIndex: number, text: string) => {
    updateData(prev => {
      const expList = [...(prev.experience || [])];
      const targetExp = expList[expIndex];
      const newBullets = [...targetExp.bullets];
      newBullets[bulletIndex] = text;
      expList[expIndex] = { ...targetExp, bullets: newBullets };
      return { ...prev, experience: expList };
    });
  }, [updateData]);

  const handleRemoveBullet = useCallback((expIndex: number, bulletIndex: number) => {
    updateData(prev => {
      const expList = [...(prev.experience || [])];
      const targetExp = expList[expIndex];
      const newBullets = targetExp.bullets.filter((_, i) => i !== bulletIndex);
      expList[expIndex] = { ...targetExp, bullets: newBullets };
      return { ...prev, experience: expList };
    });
  }, [updateData]);

  // Education helpers
  const handleAddEducation = useCallback(() => {
    updateData(prev => ({
      ...prev,
      education: [...(prev.education || []), '**B.S. in Computer Science** – University Name, 2022']
    }));
  }, [updateData]);

  const handleUpdateEducation = useCallback((index: number, text: string) => {
    updateData(prev => {
      const list = [...(prev.education || [])];
      list[index] = text;
      return { ...prev, education: list };
    });
  }, [updateData]);

  const handleRemoveEducation = useCallback((index: number) => {
    updateData(prev => ({
      ...prev,
      education: (prev.education || []).filter((_, i) => i !== index)
    }));
  }, [updateData]);

  // Languages helpers
  const handleAddLanguage = useCallback(() => {
    updateData(prev => ({
      ...prev,
      languages: [...(prev.languages || []), '**English:** Native / Full Professional Proficiency']
    }));
  }, [updateData]);

  const handleUpdateLanguage = useCallback((index: number, text: string) => {
    updateData(prev => {
      const list = [...(prev.languages || [])];
      list[index] = text;
      return { ...prev, languages: list };
    });
  }, [updateData]);

  const handleRemoveLanguage = useCallback((index: number) => {
    updateData(prev => ({
      ...prev,
      languages: (prev.languages || []).filter((_, i) => i !== index)
    }));
  }, [updateData]);

  // Projects & Extras helpers
  const handleAddProject = useCallback(() => {
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
  }, [updateData]);

  const handleProjectFieldChange = useCallback((index: number, field: keyof ExperienceItem, value: string | string[]) => {
    updateData(prev => {
      const list = [...(prev.projects || [])];
      list[index] = { ...list[index], [field]: value };
      return { ...prev, projects: list };
    });
  }, [updateData]);

  const handleRemoveProject = useCallback((index: number) => {
    updateData(prev => ({
      ...prev,
      projects: (prev.projects || []).filter((_, i) => i !== index)
    }));
  }, [updateData]);

  // Dedicated stable toggle callbacks to prevent unnecessary child re-renders
  const handleTogglePersonal = useCallback((_e: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedSection(isExpanded ? 'personal' : false);
  }, []);

  const handleToggleSummary = useCallback((_e: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedSection(isExpanded ? 'summary' : false);
  }, []);

  const handleToggleSkills = useCallback((_e: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedSection(isExpanded ? 'skills' : false);
  }, []);

  const handleToggleExperience = useCallback((_e: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedSection(isExpanded ? 'experience' : false);
  }, []);

  const handleToggleEducation = useCallback((_e: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedSection(isExpanded ? 'education' : false);
  }, []);

  const handleToggleLanguages = useCallback((_e: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedSection(isExpanded ? 'languages' : false);
  }, []);

  const handleToggleProjects = useCallback((_e: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedSection(isExpanded ? 'projects' : false);
  }, []);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: { xs: 1, sm: 2 }, pb: { xs: 3, sm: 4 }, boxSizing: 'border-box' }}>
      {/* 1. Identity & Contact Links */}
      <PersonalInfoSection
        isExpanded={expandedSection === 'personal'}
        onToggle={handleTogglePersonal}
        name={formData.name || ''}
        title={formData.title || ''}
        contacts={formData.contacts}
        onNameChange={handleNameChange}
        onTitleChange={handleTitleChange}
        onContactChange={handleContactChange}
      />

      {/* 2. Professional Summary & Pitch */}
      <SummarySection
        isExpanded={expandedSection === 'summary'}
        onToggle={handleToggleSummary}
        summary={formData.summary || ''}
        onSummaryChange={handleSummaryChange}
      />

      {/* 3. Tech Stack & Competencies */}
      <SkillsSection
        isExpanded={expandedSection === 'skills'}
        onToggle={handleToggleSkills}
        skillGroups={formData.skillGroups || EMPTY_SKILL_GROUPS}
        skillsTextMap={skillsTextMap}
        onCategoryChange={handleSkillGroupCategoryChange}
        onSkillsChange={handleSkillGroupSkillsChange}
        onAddCategory={handleAddSkillGroup}
        onRemoveCategory={handleRemoveSkillGroup}
      />

      {/* 4. Work History & Achievements */}
      <ExperienceSection
        isExpanded={expandedSection === 'experience'}
        onToggle={handleToggleExperience}
        experience={formData.experience || EMPTY_EXPERIENCE}
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
        onToggle={handleToggleEducation}
        education={formData.education || EMPTY_EDUCATION}
        onUpdateEducation={handleUpdateEducation}
        onAddEducation={handleAddEducation}
        onRemoveEducation={handleRemoveEducation}
      />

      {/* 6. Languages */}
      <LanguagesSection
        isExpanded={expandedSection === 'languages'}
        onToggle={handleToggleLanguages}
        languages={formData.languages || EMPTY_LANGUAGES}
        onUpdateLanguage={handleUpdateLanguage}
        onAddLanguage={handleAddLanguage}
        onRemoveLanguage={handleRemoveLanguage}
      />

      {/* 7. Projects & Extras */}
      <ProjectsSection
        isExpanded={expandedSection === 'projects'}
        onToggle={handleToggleProjects}
        projects={formData.projects || EMPTY_PROJECTS}
        onFieldChange={handleProjectFieldChange}
        onAddProject={handleAddProject}
        onRemoveProject={handleRemoveProject}
      />
    </Box>
  );
};
