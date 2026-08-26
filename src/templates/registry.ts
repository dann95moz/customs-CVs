import React from 'react';
import { ThemeId } from '../types/cv';
import { CVTemplateProps, TemplateMetadata } from './types';
import { ModernTechTemplate } from './ModernTechTemplate';
import { ExecutiveTemplate } from './ExecutiveTemplate';
import { MinimalAtsTemplate } from './MinimalAtsTemplate';
import { TwoColumnTemplate } from './TwoColumnTemplate';
import { DesignerUiuxTemplate } from './DesignerUiuxTemplate';
import { FormalLegalTemplate } from './FormalLegalTemplate';
import { AcademicResearchTemplate } from './AcademicResearchTemplate';

const TEMPLATE_REGISTRY: Record<ThemeId, React.FC<CVTemplateProps>> = {
  'modern-tech': ModernTechTemplate,
  'executive': ExecutiveTemplate,
  'minimal-ats': MinimalAtsTemplate,
  'two-column': TwoColumnTemplate,
  'designer-uiux': DesignerUiuxTemplate,
  'formal-legal': FormalLegalTemplate,
  'academic-research': AcademicResearchTemplate,
};

const TEMPLATE_METADATA: Record<ThemeId, TemplateMetadata> = {
  'modern-tech': {
    id: 'modern-tech',
    name: 'Modern Tech',
    category: 'Tech & Engineering',
    recommendedFor: 'Software Engineers, Full-Stack Devs, Cloud/DevOps, Tech Leads',
    description: 'Stripe/Linear aesthetic with monospace badges and high-density tech stack',
    layout: 'single-column',
    defaultMaxPages: 1,
    icon: '💻'
  },
  'designer-uiux': {
    id: 'designer-uiux',
    name: 'UI/UX & Product Design',
    category: 'Design & Creative',
    recommendedFor: 'Product Designers, UI/UX Specialists, Design Systems Leads, Creatives',
    description: 'Modern geometric typography with highlighted portfolio links and design stack pills',
    layout: 'single-column',
    defaultMaxPages: 1,
    icon: '🎨'
  },
  'formal-legal': {
    id: 'formal-legal',
    name: 'Legal, Finance & Counsel',
    category: 'Legal & Finance',
    recommendedFor: 'Attorneys, Corporate Counsel, Investment Bankers, Compliance Directors',
    description: 'Classical prestigious serif styling, formal header rule, case volume and bar admissions',
    layout: 'single-column',
    defaultMaxPages: 1,
    icon: '⚖️'
  },
  'executive': {
    id: 'executive',
    name: 'Executive Classic',
    category: 'Executive & Leadership',
    recommendedFor: 'C-Level, VP of Engineering, Directors, Management Consultants',
    description: 'Authoritative serif header, corporate navy accents, revenue & leadership milestones',
    layout: 'single-column',
    defaultMaxPages: 1,
    icon: '👔'
  },
  'academic-research': {
    id: 'academic-research',
    name: 'Academic & Research',
    category: 'Academic & Research',
    recommendedFor: 'Research Scientists, Postdocs, Professors, Data Scientists, BioTech',
    description: 'Scholarly structure emphasizing publications, research credentials, grants, and education',
    layout: 'single-column',
    defaultMaxPages: 1,
    icon: '🔬'
  },
  'minimal-ats': {
    id: 'minimal-ats',
    name: 'Minimal ATS',
    category: 'Tech & Engineering',
    recommendedFor: 'Strict enterprise ATS systems (Workday, Taleo, Greenhouse), universal screening',
    description: 'Zero-distraction linear monochrome for guaranteed 100% ATS parser extraction',
    layout: 'ats-linear',
    defaultMaxPages: 1,
    icon: '🛡️'
  },
  'two-column': {
    id: 'two-column',
    name: 'Two-Column Compact',
    category: 'General & Operations',
    recommendedFor: 'Solutions Architects, Technical PMs, Multi-disciplinary Consultants',
    description: 'Asymmetric layout with compact skills/languages sidebar and prominent experience flow',
    layout: 'two-column',
    defaultMaxPages: 1,
    icon: '📐'
  }
};

/**
 * Resolves the corresponding Template Component by Theme ID
 */
export function getTemplate(themeId: ThemeId = 'modern-tech'): React.FC<CVTemplateProps> {
  return TEMPLATE_REGISTRY[themeId] || ModernTechTemplate;
}

/**
 * Returns metadata for a given template
 */
export function getTemplateMetadata(themeId: ThemeId = 'modern-tech'): TemplateMetadata {
  return TEMPLATE_METADATA[themeId] || TEMPLATE_METADATA['modern-tech'];
}

/**
 * Returns all available templates
 */
export function getAllTemplates(): TemplateMetadata[] {
  return Object.values(TEMPLATE_METADATA);
}
