import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// English
import enCommon from './locales/en/common.json';
import enLanding from './locales/en/landing.json';
import enProfile from './locales/en/profile.json';
import enTarget from './locales/en/target.json';
import enPreview from './locales/en/preview.json';
import enAudit from './locales/en/audit.json';
import enGap from './locales/en/gap.json';
import enHistory from './locales/en/history.json';
import enSettings from './locales/en/settings.json';

// Spanish
import esCommon from './locales/es/common.json';
import esLanding from './locales/es/landing.json';
import esProfile from './locales/es/profile.json';
import esTarget from './locales/es/target.json';
import esPreview from './locales/es/preview.json';
import esAudit from './locales/es/audit.json';
import esGap from './locales/es/gap.json';
import esHistory from './locales/es/history.json';
import esSettings from './locales/es/settings.json';

// French
import frCommon from './locales/fr/common.json';
import frLanding from './locales/fr/landing.json';
import frProfile from './locales/fr/profile.json';
import frTarget from './locales/fr/target.json';
import frPreview from './locales/fr/preview.json';
import frAudit from './locales/fr/audit.json';
import frGap from './locales/fr/gap.json';
import frHistory from './locales/fr/history.json';
import frSettings from './locales/fr/settings.json';

// German
import deCommon from './locales/de/common.json';
import deLanding from './locales/de/landing.json';
import deProfile from './locales/de/profile.json';
import deTarget from './locales/de/target.json';
import dePreview from './locales/de/preview.json';
import deAudit from './locales/de/audit.json';
import deGap from './locales/de/gap.json';
import deHistory from './locales/de/history.json';
import deSettings from './locales/de/settings.json';

// Italian
import itCommon from './locales/it/common.json';
import itLanding from './locales/it/landing.json';
import itProfile from './locales/it/profile.json';
import itTarget from './locales/it/target.json';
import itPreview from './locales/it/preview.json';
import itAudit from './locales/it/audit.json';
import itGap from './locales/it/gap.json';
import itHistory from './locales/it/history.json';
import itSettings from './locales/it/settings.json';

export const resources = {
  en: {
    common: enCommon,
    landing: enLanding,
    profile: enProfile,
    target: enTarget,
    preview: enPreview,
    audit: enAudit,
    gap: enGap,
    history: enHistory,
    settings: enSettings,
  },
  es: {
    common: esCommon,
    landing: esLanding,
    profile: esProfile,
    target: esTarget,
    preview: esPreview,
    audit: esAudit,
    gap: esGap,
    history: esHistory,
    settings: esSettings,
  },
  fr: {
    common: frCommon,
    landing: frLanding,
    profile: frProfile,
    target: frTarget,
    preview: frPreview,
    audit: frAudit,
    gap: frGap,
    history: frHistory,
    settings: frSettings,
  },
  de: {
    common: deCommon,
    landing: deLanding,
    profile: deProfile,
    target: deTarget,
    preview: dePreview,
    audit: deAudit,
    gap: deGap,
    history: deHistory,
    settings: deSettings,
  },
  it: {
    common: itCommon,
    landing: itLanding,
    profile: itProfile,
    target: itTarget,
    preview: itPreview,
    audit: itAudit,
    gap: itGap,
    history: itHistory,
    settings: itSettings,
  },
} as const;

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    supportedLngs: ['en', 'es', 'fr', 'de', 'it'],
    defaultNS: 'common',
    ns: ['common', 'landing', 'profile', 'target', 'preview', 'audit', 'gap', 'history', 'settings'],
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      lookupLocalStorage: 'i18nextLng',
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;
