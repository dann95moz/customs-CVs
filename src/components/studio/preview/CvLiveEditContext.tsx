import React, { createContext, useContext, useCallback, useMemo } from 'react';
import { CVData, ExperienceItem } from '../../../types/cv';
import { useResumeStore } from '../../../store';
import { serializeCvDataToMarkdown } from '../../../core/parser';

export interface ActiveFieldFormatter {
  executeFormat: (command: 'bold' | 'italic' | 'highlight') => void;
}

export interface CvLiveEditContextValue {
  isLiveEditing: boolean;
  setLiveEditing: (enabled: boolean) => void;
  activeFormatter: ActiveFieldFormatter | null;
  setActiveFormatter: (formatter: ActiveFieldFormatter | null) => void;
  formatSelection: (command: 'bold' | 'italic' | 'highlight') => void;
  updateName: (name: string) => void;
  updateTitle: (title: string) => void;
  updateSummary: (summary: string) => void;
  updateContact: (index: number, label: string, url?: string) => void;
  updateSkillCategory: (groupIndex: number, category: string) => void;
  updateSkillList: (groupIndex: number, skills: string[]) => void;
  updateExperienceField: (
    type: 'experience' | 'projects',
    itemIndex: number,
    field: keyof Pick<ExperienceItem, 'company' | 'role' | 'date' | 'location'>,
    value: string
  ) => void;
  updateExperienceBullet: (
    type: 'experience' | 'projects',
    itemIndex: number,
    bulletIndex: number,
    value: string
  ) => void;
  updateEducationItem: (itemIndex: number, value: string) => void;
  updateLanguageItem: (itemIndex: number, value: string) => void;
}

const CvLiveEditContext = createContext<CvLiveEditContextValue | null>(null);

export interface CvLiveEditProviderProps {
  children: React.ReactNode;
  parsedCv: CVData;
  isEditable?: boolean;
}

/**
 * Provider for live hot in-place editing of CV elements.
 * Updates the underlying structured CV model and serializes it back to Markdown,
 * which instantly and reactively triggers the Quality Audit and ATS scoring engine.
 */
export const CvLiveEditProvider: React.FC<CvLiveEditProviderProps> = ({
  children,
  parsedCv,
  isEditable = true,
}) => {
  const [isLiveEditing, setLiveEditing] = React.useState<boolean>(isEditable);
  const [activeFormatter, setActiveFormatter] = React.useState<ActiveFieldFormatter | null>(null);
  const setCvMarkdown = useResumeStore((s) => s.setCvMarkdown);

  const formatSelection = useCallback((command: 'bold' | 'italic' | 'highlight') => {
    if (activeFormatter) {
      activeFormatter.executeFormat(command);
    }
  }, [activeFormatter]);

  const applyCvUpdate = useCallback((updater: (prev: CVData) => CVData) => {
    const updated = updater(parsedCv);
    const serialized = serializeCvDataToMarkdown(updated);
    setCvMarkdown(serialized);
  }, [parsedCv, setCvMarkdown]);

  const updateName = useCallback((name: string) => {
    applyCvUpdate((prev) => ({
      ...prev,
      name: name.trim() || 'Candidate Name',
    }));
  }, [applyCvUpdate]);

  const updateTitle = useCallback((title: string) => {
    applyCvUpdate((prev) => ({
      ...prev,
      title: title.trim(),
    }));
  }, [applyCvUpdate]);

  const updateSummary = useCallback((summary: string) => {
    applyCvUpdate((prev) => ({
      ...prev,
      summary: summary.trim(),
    }));
  }, [applyCvUpdate]);

  const updateContact = useCallback((index: number, label: string, url?: string) => {
    applyCvUpdate((prev) => {
      const contacts = [...(prev.contacts || [])];
      if (contacts[index]) {
        contacts[index] = {
          ...contacts[index],
          label: label.trim(),
          url: url !== undefined ? url : contacts[index].url,
        };
      }
      return { ...prev, contacts };
    });
  }, [applyCvUpdate]);

  const updateSkillCategory = useCallback((groupIndex: number, category: string) => {
    applyCvUpdate((prev) => {
      const skillGroups = (prev.skillGroups || []).map((g, idx) => {
        if (idx === groupIndex) {
          return { ...g, category: category.trim() };
        }
        return g;
      });
      return { ...prev, skillGroups };
    });
  }, [applyCvUpdate]);

  const updateSkillList = useCallback((groupIndex: number, skills: string[]) => {
    applyCvUpdate((prev) => {
      const skillGroups = (prev.skillGroups || []).map((g, idx) => {
        if (idx === groupIndex) {
          return { ...g, skills };
        }
        return g;
      });
      return { ...prev, skillGroups };
    });
  }, [applyCvUpdate]);

  const updateExperienceField = useCallback((
    type: 'experience' | 'projects',
    itemIndex: number,
    field: keyof Pick<ExperienceItem, 'company' | 'role' | 'date' | 'location'>,
    value: string
  ) => {
    applyCvUpdate((prev) => {
      const listKey = type === 'projects' ? 'projects' : 'experience';
      const items = (prev[listKey] || []).map((item, idx) => {
        if (idx === itemIndex) {
          return { ...item, [field]: value };
        }
        return item;
      });
      return { ...prev, [listKey]: items };
    });
  }, [applyCvUpdate]);

  const updateExperienceBullet = useCallback((
    type: 'experience' | 'projects',
    itemIndex: number,
    bulletIndex: number,
    value: string
  ) => {
    applyCvUpdate((prev) => {
      const listKey = type === 'projects' ? 'projects' : 'experience';
      const items = (prev[listKey] || []).map((item, idx) => {
        if (idx === itemIndex) {
          const bullets = [...(item.bullets || [])];
          if (value.trim()) {
            bullets[bulletIndex] = value.trim();
          } else {
            bullets.splice(bulletIndex, 1);
          }
          return { ...item, bullets };
        }
        return item;
      });
      return { ...prev, [listKey]: items };
    });
  }, [applyCvUpdate]);

  const updateEducationItem = useCallback((itemIndex: number, value: string) => {
    applyCvUpdate((prev) => {
      const education = [...(prev.education || [])];
      if (value.trim()) {
        education[itemIndex] = value.trim();
      } else {
        education.splice(itemIndex, 1);
      }
      return { ...prev, education };
    });
  }, [applyCvUpdate]);

  const updateLanguageItem = useCallback((itemIndex: number, value: string) => {
    applyCvUpdate((prev) => {
      const languages = [...(prev.languages || [])];
      if (value.trim()) {
        languages[itemIndex] = value.trim();
      } else {
        languages.splice(itemIndex, 1);
      }
      return { ...prev, languages };
    });
  }, [applyCvUpdate]);

  const value = useMemo<CvLiveEditContextValue>(() => ({
    isLiveEditing,
    setLiveEditing,
    activeFormatter,
    setActiveFormatter,
    formatSelection,
    updateName,
    updateTitle,
    updateSummary,
    updateContact,
    updateSkillCategory,
    updateSkillList,
    updateExperienceField,
    updateExperienceBullet,
    updateEducationItem,
    updateLanguageItem,
  }), [
    isLiveEditing,
    setLiveEditing,
    activeFormatter,
    setActiveFormatter,
    formatSelection,
    updateName,
    updateTitle,
    updateSummary,
    updateContact,
    updateSkillCategory,
    updateSkillList,
    updateExperienceField,
    updateExperienceBullet,
    updateEducationItem,
    updateLanguageItem,
  ]);

  return (
    <CvLiveEditContext.Provider value={value}>
      {children}
    </CvLiveEditContext.Provider>
  );
};

export const useCvLiveEdit = (): CvLiveEditContextValue | null => {
  return useContext(CvLiveEditContext);
};
