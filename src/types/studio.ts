/**
 * CV Studio Pro - Studio Workspace & Navigation Types
 * 
 * Domain-specific type definitions for studio tabs, wizard steps,
 * preview modes, nav rail panels, and historical version records.
 */

import { ThemeId, PaletteId } from './theme';

export type WizardStep = 
  | 'profile' 
  | 'target' 
  | 'tailor' 
  | 'preview';

export type StudioTab = 
  | 'wizard'
  | 'editor' 
  | 'preview' 
  | 'audit' 
  | 'gap' 
  | 'history'
  | 'settings';

export type PreviewViewMode = 'tailored' | 'generic' | 'compare';

export type PreviewSidePanelType = 'templates' | 'design' | 'audit';

export interface StepMeta {
  id: WizardStep;
  number: number;
  label: string;
  shortLabel?: string;
  subtitle: string;
  icon?: React.ReactNode;
}

export interface GeneratedCvVersion {
  id: string;
  createdAt: string; // ISO string
  candidateName: string;
  companyName: string;
  targetRole: string;
  matchScore: number;
  qualityScore: number;
  theme: ThemeId;
  palette: PaletteId;
  pageBudget: 1 | 2;
  cvMarkdown: string;
  gapMarkdown?: string;
  targetJobSnippet?: string;
}

export interface MarkdownFileItem {
  name: string;
  path: string;
  content: string;
}
