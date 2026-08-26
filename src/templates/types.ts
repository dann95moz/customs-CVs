import { CVData, ThemeId, ContactItem, SkillCategory, ExperienceItem } from '../types/cv';

export interface HeaderSlotData {
  name: string;
  title?: string;
  contacts: ContactItem[];
}

export interface SummarySlotData {
  title: string;
  rawContent: string;
}

export interface SkillsSlotData {
  title: string;
  skillGroups: SkillCategory[];
}

export interface ExperienceSlotData {
  title: string;
  items: ExperienceItem[];
  type: 'experience' | 'projects';
}

export interface ListSlotData {
  title: string;
  items: string[];
  type: 'education' | 'languages' | 'generic';
}

export interface GenericSlotData {
  id: string;
  title: string;
  rawContent: string;
}

export interface CVSlotMap {
  header: HeaderSlotData;
  summary?: SummarySlotData;
  skills?: SkillsSlotData;
  experience?: ExperienceSlotData;
  projects?: ExperienceSlotData;
  education?: ListSlotData;
  languages?: ListSlotData;
  genericSections: GenericSlotData[];
}

export interface CVTemplateProps {
  data: CVData;
  slots: CVSlotMap;
  theme: ThemeId;
}

export interface TemplateMetadata {
  id: ThemeId;
  name: string;
  category: 'Tech & Engineering' | 'Design & Creative' | 'Legal & Finance' | 'Executive & Leadership' | 'Academic & Research' | 'General & Operations';
  recommendedFor: string;
  description: string;
  layout: 'single-column' | 'two-column' | 'ats-linear';
  defaultMaxPages: number;
  icon?: string;
}
