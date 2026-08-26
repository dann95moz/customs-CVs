/**
 * Curated Professional Palettes for CV Studio Pro.
 * CRITICAL RULE: These palettes are applied EXCLUSIVELY to accents
 * (section lines, headers, badges, tags, icons, hover links).
 * Body text ALWAYS remains deep charcoal/black (#0f172a / #1e293b / #000000)
 * to guarantee 100% ATS readability and optimal contrast.
 */

import { PaletteId } from '../types/cv';

export interface PaletteConfig {
  id: PaletteId;
  name: string;
  description: string;
  accentColor: string;
  accentLight: string;
  accentBorder: string;
  accentHover: string;
  badgeBg: string;
  badgeText: string;
  previewColor: string;
}

export const CURATED_PALETTES: Record<PaletteId, PaletteConfig> = {
  'corporate-blue': {
    id: 'corporate-blue',
    name: 'Corporate Blue',
    description: 'Trusted executive standard for tech, engineering & enterprise',
    accentColor: '#1d4ed8', // Royal / Cobalt Blue
    accentLight: 'rgba(29, 78, 216, 0.07)',
    accentBorder: 'rgba(29, 78, 216, 0.22)',
    accentHover: '#1e40af',
    badgeBg: '#eff6ff',
    badgeText: '#1e40af',
    previewColor: '#2563eb',
  },
  'accent-teal': {
    id: 'accent-teal',
    name: 'Accent Teal',
    description: 'Modern, fresh & dynamic for fintech, product & growth',
    accentColor: '#0f766e', // Deep Emerald Teal
    accentLight: 'rgba(15, 118, 110, 0.07)',
    accentBorder: 'rgba(15, 118, 110, 0.22)',
    accentHover: '#115e59',
    badgeBg: '#f0fdfa',
    badgeText: '#0f766e',
    previewColor: '#0d9488',
  },
  'editorial-black': {
    id: 'editorial-black',
    name: 'Editorial Black',
    description: 'High-contrast monochrome, understated, timeless & 100% ATS clean',
    accentColor: '#0f172a', // Deep Onyx
    accentLight: 'rgba(15, 23, 42, 0.05)',
    accentBorder: 'rgba(15, 23, 42, 0.2)',
    accentHover: '#000000',
    badgeBg: '#f8fafc',
    badgeText: '#0f172a',
    previewColor: '#0f172a',
  },
  'minimal-slate': {
    id: 'minimal-slate',
    name: 'Minimal Slate',
    description: 'Refined and subtle with cool steel grayscale balance',
    accentColor: '#475569', // Slate Steel
    accentLight: 'rgba(71, 85, 105, 0.07)',
    accentBorder: 'rgba(71, 85, 105, 0.2)',
    accentHover: '#334155',
    badgeBg: '#f1f5f9',
    badgeText: '#334155',
    previewColor: '#64748b',
  },
  'modern-indigo': {
    id: 'modern-indigo',
    name: 'Modern Indigo',
    description: 'Linear & Stripe inspired, engineered for software and startups',
    accentColor: '#4338ca', // Deep Indigo
    accentLight: 'rgba(67, 56, 202, 0.07)',
    accentBorder: 'rgba(67, 56, 202, 0.22)',
    accentHover: '#3730a3',
    badgeBg: '#eef2ff',
    badgeText: '#4338ca',
    previewColor: '#6366f1',
  },
  'executive-burgundy': {
    id: 'executive-burgundy',
    name: 'Executive Burgundy',
    description: 'Distinguished tone for leadership, consulting, finance & C-Suite',
    accentColor: '#881337', // Deep Crimson Rose
    accentLight: 'rgba(136, 19, 55, 0.06)',
    accentBorder: 'rgba(136, 19, 55, 0.22)',
    accentHover: '#701a31',
    badgeBg: '#fff1f2',
    badgeText: '#881337',
    previewColor: '#9f1239',
  },
  'forest-green': {
    id: 'forest-green',
    name: 'Forest Green',
    description: 'Grounding, authoritative & organic tone for sustainability, life sciences & health',
    accentColor: '#15803d', // Forest Emerald
    accentLight: 'rgba(21, 128, 61, 0.07)',
    accentBorder: 'rgba(21, 128, 61, 0.22)',
    accentHover: '#166534',
    badgeBg: '#f0fdf4',
    badgeText: '#15803d',
    previewColor: '#16a34a',
  },
  'warm-amber': {
    id: 'warm-amber',
    name: 'Warm Amber',
    description: 'Warm gold tone for hospitality, client relationships, marketing & media',
    accentColor: '#b45309', // Warm Bronze
    accentLight: 'rgba(180, 83, 9, 0.07)',
    accentBorder: 'rgba(180, 83, 9, 0.22)',
    accentHover: '#92400e',
    badgeBg: '#fffbeb',
    badgeText: '#b45309',
    previewColor: '#d97706',
  },
  'creative-coral': {
    id: 'creative-coral',
    name: 'Creative Coral',
    description: 'Vibrant, warm accent for design, content creators & modern product teams',
    accentColor: '#c2410c', // Coral Terra
    accentLight: 'rgba(194, 65, 12, 0.07)',
    accentBorder: 'rgba(194, 65, 12, 0.22)',
    accentHover: '#9a3412',
    badgeBg: '#fff7ed',
    badgeText: '#c2410c',
    previewColor: '#ea580c',
  },
};

export const DEFAULT_PALETTE_ID: PaletteId = 'corporate-blue';

export function getPaletteConfig(id: PaletteId = DEFAULT_PALETTE_ID): PaletteConfig {
  return CURATED_PALETTES[id] || CURATED_PALETTES[DEFAULT_PALETTE_ID];
}

export function getAllPalettes(): PaletteConfig[] {
  return Object.values(CURATED_PALETTES);
}
