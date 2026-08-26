import { CVData, SectionType } from '../types/cv';
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
 * Maps raw CVData into a strongly-typed, structured Slot Map
 */
export function mapDataToSlots(data: CVData): CVSlotMap {
  const header: HeaderSlotData = {
    name: data.name || 'Candidate',
    title: data.title,
    contacts: data.contacts || []
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
          education = {
            title: section.title,
            items: data.education,
            type: 'education'
          };
        } else if (section.rawContent) {
          genericSections.push({
            id: section.id,
            title: section.title,
            rawContent: section.rawContent
          });
        }
        break;

      case 'languages':
        if (data.languages && data.languages.length > 0) {
          languages = {
            title: section.title,
            items: data.languages,
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
    genericSections
  };
}
