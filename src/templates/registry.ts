import React from 'react';
import { ThemeId } from '../types/cv';
import { CVTemplateProps, TemplateMetadata } from './types';
import { ModernTechTemplate } from './ModernTechTemplate';
import { ExecutiveTemplate } from './ExecutiveTemplate';
import { MinimalAtsTemplate } from './MinimalAtsTemplate';
import { TwoColumnTemplate } from './TwoColumnTemplate';

const TEMPLATE_REGISTRY: Record<ThemeId, React.FC<CVTemplateProps>> = {
  'modern-tech': ModernTechTemplate,
  'executive': ExecutiveTemplate,
  'minimal-ats': MinimalAtsTemplate,
  'two-column': TwoColumnTemplate
};

const TEMPLATE_METADATA: Record<ThemeId, TemplateMetadata> = {
  'modern-tech': {
    id: 'modern-tech',
    name: 'Modern Tech',
    description: 'Estilo Stripe/Linear con badges y diseño modular limpio',
    layout: 'single-column',
    defaultMaxPages: 1
  },
  'executive': {
    id: 'executive',
    name: 'Executive Classic',
    description: 'Diseño corporativo Navy con tipografía Serif formal',
    layout: 'single-column',
    defaultMaxPages: 1
  },
  'minimal-ats': {
    id: 'minimal-ats',
    name: 'Minimal ATS',
    description: 'Monocromático estricto y lineal para máxima compatibilidad con ATS',
    layout: 'ats-linear',
    defaultMaxPages: 1
  },
  'two-column': {
    id: 'two-column',
    name: 'Two-Column Asymmetric',
    description: 'Barra lateral balanceada (Skills + Idiomas) y Columna Principal (Experiencia + Educación)',
    layout: 'two-column',
    defaultMaxPages: 1
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
