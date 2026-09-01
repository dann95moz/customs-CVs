import { CVData, SectionType, ContactItem } from '../types/cv';
import { 
  CVSlotMap, 
  HeaderSlotData, 
  SummarySlotData, 
  SkillsSlotData, 
  ExperienceSlotData, 
  ListSlotData, 
  GenericSlotData 
} from './types';

/**
 * Normalizes contact item labels to clean human-friendly badges (LinkedIn, GitHub, Portfolio)
 */
function cleanContactDisplayLabel(c: ContactItem): ContactItem {
  let label = c.label;
  if (c.type === 'linkedin') {
    if (label.startsWith('http') || label.includes('linkedin.com') || label.includes('/in/')) {
      label = 'LinkedIn';
    }
  } else if (c.type === 'github') {
    if (label.startsWith('http') || label.includes('github.com')) {
      label = 'GitHub';
    }
  } else if (c.type === 'globe') {
    if (label.startsWith('http') || label.includes('http://') || label.includes('https://') || label.includes('www.')) {
      label = 'Portfolio';
    }
  }
  return {
    ...c,
    label
  };
}

/**
 * Maps raw CVData into a strongly-typed, structured Slot Map
 */
export function mapDataToSlots(data: CVData): CVSlotMap {
  const header: HeaderSlotData = {
    name: data.name || 'Candidate',
    title: data.title,
    contacts: (data.contacts || []).map(cleanContactDisplayLabel),
    photo: data.photo,
    nationality: data.nationality,
    dateOfBirth: data.dateOfBirth,
    drivingLicense: data.drivingLicense,
  };

  let summary: SummarySlotData | undefined;
  let skills: SkillsSlotData | undefined;
  let experience: ExperienceSlotData | undefined;
  let projects: ExperienceSlotData | undefined;
  let education: ListSlotData | undefined;
  let languages: ListSlotData | undefined;
  const genericSections: GenericSlotData[] = [];

  for (const section of data.sections) {
    switch (section.type) {
      case 'summary':
        summary = {
          title: section.title,
          rawContent: data.summary || section.rawContent
        };
        break;

      case 'skills':
        if (data.skillGroups && data.skillGroups.length > 0) {
          skills = {
            title: section.title,
            skillGroups: data.skillGroups
          };
        }
        break;

      case 'experience':
        if (data.experience && data.experience.length > 0) {
          experience = {
            title: section.title,
            items: data.experience,
            type: 'experience'
          };
        } else if (section.rawContent) {
          genericSections.push({
            id: section.id,
            title: section.title,
            rawContent: section.rawContent
          });
        }
        break;

      case 'projects':
        if (data.projects && data.projects.length > 0) {
          projects = {
            title: section.title,
            items: data.projects,
            type: 'projects'
          };
        } else if (section.rawContent) {
          genericSections.push({
            id: section.id,
            title: section.title,
            rawContent: section.rawContent
          });
        }
        break;

      case 'education':
        if (data.education && data.education.length > 0) {
          if (!education) {
            education = {
              title: section.title,
              items: data.education,
              type: 'education'
            };
          }
        } else if (section.rawContent) {
          genericSections.push({
            id: section.id,
            title: section.title,
            rawContent: section.rawContent
          });
        }
        break;

      case 'languages':
        if ((data.languageItems && data.languageItems.length > 0) || (data.languages && data.languages.length > 0)) {
          languages = {
            title: section.title,
            items: data.languages || [],
            languageItems: data.languageItems,
            type: 'languages'
          };
        } else if (section.rawContent) {
          genericSections.push({
            id: section.id,
            title: section.title,
            rawContent: section.rawContent
          });
        }
        break;

      default:
        genericSections.push({
          id: section.id,
          title: section.title,
          rawContent: section.rawContent
        });
        break;
    }
  }

  return {
    header,
    summary,
    skills,
    experience,
    projects,
    education,
    languages,
    genericSections,
    photo: data.photo,
  };
}
