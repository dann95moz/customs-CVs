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

export type ThemeId = 'modern-tech' | 'executive' | 'minimal-ats' | 'two-column';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  description: string;
  accentColor: string;
  isTwoColumn?: boolean;
}

export interface GapAnalysisResult {
  matchScore: number;
  keywords: string[];
  missingSkills: string[];
  strategy: string;
}

export interface MarkdownFileItem {
  name: string;
  path: string;
  content: string;
}
