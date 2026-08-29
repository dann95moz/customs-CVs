export type SupportedLanguage = 'en' | 'es' | 'fr' | 'de' | 'it';

export interface LanguageInfo {
  code: SupportedLanguage;
  label: string;
  nativeLabel: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  {
    code: 'en',
    label: 'English',
    nativeLabel: 'English',
    flag: '🇺🇸',
  },
  {
    code: 'es',
    label: 'Spanish',
    nativeLabel: 'Español',
    flag: '🇪🇸',
  },
  {
    code: 'fr',
    label: 'French',
    nativeLabel: 'Français',
    flag: '🇫🇷',
  },
  {
    code: 'de',
    label: 'German',
    nativeLabel: 'Deutsch',
    flag: '🇩🇪',
  },
  {
    code: 'it',
    label: 'Italian',
    nativeLabel: 'Italiano',
    flag: '🇮🇹',
  },
];

export const NAMESPACES = [
  'common',
  'landing',
  'profile',
  'target',
  'preview',
  'audit',
  'gap',
  'history',
  'settings',
] as const;

export type Namespace = typeof NAMESPACES[number];
