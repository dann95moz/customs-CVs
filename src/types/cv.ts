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

export interface MarkdownFileItem {
  name: string;
  path: string;
  content: string;
}

// AI Providers & Configurations
export type AIProviderId = 
  | 'free-pollinations' 
  | 'gemini' 
  | 'openai' 
  | 'claude' 
  | 'groq' 
  | 'openrouter' 
  | 'custom';

export interface AIModelOption {
  id: string;
  name: string;
  provider: AIProviderId;
  description: string;
  isFree?: boolean;
  requiresKey?: boolean;
}

export interface AIProviderSettings {
  provider: AIProviderId;
  model: string;
  apiKey?: string;
  customEndpoint?: string;
  temperature?: number;
}

export interface TailorRequest {
  masterData: string;
  targetJob: string;
  rules?: string;
  companyName?: string;
  targetRole?: string;
  pageBudget: 1 | 2;
  providerSettings: AIProviderSettings;
}

export interface TailorResponse {
  tailoredCvMarkdown: string;
  gapAnalysisMarkdown?: string;
  estimatedMatchScore?: number;
  extractedKeywords?: string[];
  rawResponse?: string;
  modelUsed: string;
}

// Audit & Quality Types
export interface AuditSectionResult {
  sectionName: string;
  score: number; // Scale 1.0 - 10.0
  status: '🟢 Optimal' | '🟡 Solid with Headroom' | '🔴 Needs Attention';
  comment: string;
  identifiedGaps?: string[];
  actionToTen?: string[];
}

export interface StrategicGrowthPillar {
  pillarName: string;
  impactLevel: 'High' | 'Medium-High' | 'Strategic';
  diagnostic: string;
  recommendationForMasterData: string;
}

export interface QualityAuditReport {
  candidateName: string;
  targetCompany: string;
  overallScore: number;
  sections: AuditSectionResult[];
  strategicPillars: StrategicGrowthPillar[];
  markdownReport: string;
}

// Studio Navigation Tabs
export type StudioTab = 
  | 'editor' 
  | 'preview' 
  | 'audit' 
  | 'gap' 
  | 'settings';
