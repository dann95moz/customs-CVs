/**
 * CV Studio Pro - Core CV Data Models
 * 
 * Domain-specific type definitions for CV structure, sections,
 * contact information, and parsed entries.
 * Re-exports sub-domain types to maintain full backward compatibility.
 */

export type SectionType = 
  | 'summary' 
  | 'skills' 
  | 'experience' 
  | 'projects' 
  | 'education' 
  | 'languages' 
  | 'generic';

export type ContactType = 
  | 'email' 
  | 'phone' 
  | 'location' 
  | 'linkedin' 
  | 'github' 
  | 'globe' 
  | 'calendar' 
  | 'text';

export interface ContactItem {
  type: ContactType;
  label: string;
  url?: string;
}

export interface SkillCategory {
  category: string;
  skills: string[];
}

export interface ExperienceItem {
  company: string;
  location?: string;
  role?: string;
  date?: string;
  bullets: string[];
}

export interface ProjectItem {
  name: string;
  links?: { label: string; url: string }[];
  bullets: string[];
  stack?: string[];
}

export interface CVSection {
  id: string;
  type: SectionType;
  title: string;
  rawContent: string;
}

export interface CVData {
  name: string;
  title: string;
  contacts: ContactItem[];
  sections: CVSection[];
  summary?: string;
  skillGroups?: SkillCategory[];
  experience?: ExperienceItem[];
  projects?: ExperienceItem[];
  education?: string[];
  languages?: string[];
}

// Re-export domain-specific types for seamless backward compatibility
export * from './theme';
export * from './ai';
export * from './audit';
export * from './studio';
export * from './components';
