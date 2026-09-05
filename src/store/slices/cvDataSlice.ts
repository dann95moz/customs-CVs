import { StateCreator } from 'zustand';
import { ResumeStore, CvDataSlice } from '../types';
import {
  BLANK_MASTER_DATA,
  BLANK_TARGET_JOB,
  BLANK_TAILORED_CV,
  BLANK_GAP_REPORT,
  DEMO_MASTER_DATA,
  DEMO_TARGET_JOB,
  DEMO_TAILORED_CV,
  DEMO_GAP_REPORT,
} from '../../constants/templates';
import { DEFAULT_RULES } from '../../core/ai-service';
import {
  extractCandidateName,
  extractTargetCompany,
  extractTargetRole,
} from '../../core/parser';
import { downloadTextFile, buildTimestampedFileName } from '../../utils/fileUtils';
import { CvTranslationVariant } from '../../types/cv';
import { computeContentHash, detectOutdatedSections } from '../../core/ai/cv-translator';

export const createCvDataSlice: StateCreator<ResumeStore, [], [], CvDataSlice> = (set, get) => ({
  masterData: BLANK_MASTER_DATA,
  targetJob: BLANK_TARGET_JOB,
  cvMarkdown: BLANK_TAILORED_CV,
  activeCvData: null,
  gapMarkdown: BLANK_GAP_REPORT,
  coverLetterMarkdown: '',
  coverLetterTone: 'corporate',
  rules: DEFAULT_RULES,
  companyName: '',
  targetRole: '',
  currentBaseLanguage: 'es',
  activeLanguage: 'es',
  activeVersionId: null,
  translations: {},
  lastBackupTimestamp: Date.now(),
  unsavedChangesCount: 0,

  recordBackup: () => {
    set({ lastBackupTimestamp: Date.now(), unsavedChangesCount: 0 });
  },

  setMasterData: (val) => {
    const nextVal = typeof val === 'function' ? val(get().masterData) : val;
    const extractedRole = extractTargetRole(get().targetJob, nextVal);
    const hasChanged = nextVal !== get().masterData;
    set({
      masterData: nextVal,
      ...(extractedRole ? { targetRole: extractedRole } : {}),
      ...(hasChanged ? { unsavedChangesCount: get().unsavedChangesCount + 1 } : {}),
    });
  },

  setTargetJob: (val) => {
    const nextVal = typeof val === 'function' ? val(get().targetJob) : val;
    const extractedComp = extractTargetCompany(nextVal);
    const extractedRole = extractTargetRole(nextVal, get().masterData);
    set({
      targetJob: nextVal,
      ...(extractedComp ? { companyName: extractedComp.replace(/_/g, ' ') } : {}),
      ...(extractedRole ? { targetRole: extractedRole } : {}),
    });
  },

  setCvMarkdown: (val) => {
    const { cvMarkdown, activeLanguage, currentBaseLanguage, translations } = get();
    const isEditingVariant = Boolean(activeLanguage && currentBaseLanguage && activeLanguage !== currentBaseLanguage);

    if (isEditingVariant && translations[activeLanguage]) {
      const currentVariantText = translations[activeLanguage].cvMarkdown;
      const nextVariantText = typeof val === 'function' ? val(currentVariantText) : val;
      const updatedVariant: CvTranslationVariant = {
        ...translations[activeLanguage],
        cvMarkdown: nextVariantText,
        updatedAt: new Date().toISOString(),
      };
      set({
        translations: {
          ...translations,
          [activeLanguage]: updatedVariant,
        },
        unsavedChangesCount: get().unsavedChangesCount + 1,
      });
      return;
    }

    const nextVal = typeof val === 'function' ? val(cvMarkdown) : val;
    const hasChanged = nextVal !== cvMarkdown;

    // Check existing translations to flag outdated status
    const currentHash = computeContentHash(nextVal);
    const updatedTranslations: Record<string, CvTranslationVariant> = {};
    let translationsChanged = false;

    for (const [lang, variant] of Object.entries(translations)) {
      if (variant.baseMarkdownHash && variant.baseMarkdownHash !== currentHash) {
        const diff = detectOutdatedSections(cvMarkdown, nextVal);
        const mergedOutdatedSections = Array.from(new Set([...(variant.outdatedSections || []), ...diff.changedSections]));
        updatedTranslations[lang] = {
          ...variant,
          isOutdated: true,
          outdatedSections: mergedOutdatedSections,
        };
        translationsChanged = true;
      } else {
        updatedTranslations[lang] = variant;
      }
    }

    set({
      cvMarkdown: nextVal,
      ...(translationsChanged ? { translations: updatedTranslations } : {}),
      ...(hasChanged ? { activeCvData: null, unsavedChangesCount: get().unsavedChangesCount + 1 } : {}),
    });
  },

  setActiveCvData: (data) => {
    set({ activeCvData: data });
  },

  setGapMarkdown: (val) => {
    const nextVal = typeof val === 'function' ? val(get().gapMarkdown) : val;
    set({ gapMarkdown: nextVal });
  },

  setCoverLetterMarkdown: (val) => {
    const nextVal = typeof val === 'function' ? val(get().coverLetterMarkdown) : val;
    set({ coverLetterMarkdown: nextVal });
  },

  setCoverLetterTone: (coverLetterTone) => {
    set({ coverLetterTone });
  },

  setRules: (val) => {
    const nextVal = typeof val === 'function' ? val(get().rules) : val;
    set({ rules: nextVal });
  },

  setCompanyName: (companyName: string) => {
    set({ companyName });
  },

  setTargetRole: (targetRole: string) => {
    set({ targetRole });
  },

  setCurrentBaseLanguage: (currentBaseLanguage: string) => {
    set({ currentBaseLanguage });
  },

  setActiveLanguage: (activeLanguage: string) => {
    set({ activeLanguage });
  },

  setActiveVersionId: (activeVersionId: string | null) => {
    set({ activeVersionId });
  },

  setTranslations: (translations: Record<string, CvTranslationVariant>) => {
    set({ translations });
  },

  saveTranslationVariant: (variant: CvTranslationVariant) => {
    const current = get().translations;
    set({
      translations: {
        ...current,
        [variant.language]: variant,
      },
      activeLanguage: variant.language,
    });
  },

  deleteTranslationVariant: (language: string) => {
    const next = { ...get().translations };
    delete next[language];
    set({
      translations: next,
      ...(get().activeLanguage === language ? { activeLanguage: get().currentBaseLanguage } : {}),
    });
  },

  handleLoadDemoProfile: () => {
    set({
      masterData: DEMO_MASTER_DATA,
      targetJob: DEMO_TARGET_JOB,
      cvMarkdown: DEMO_TAILORED_CV,
      gapMarkdown: DEMO_GAP_REPORT,
      companyName: 'Stripe',
      targetRole: 'Senior Frontend Engineer',
      currentBaseLanguage: 'en',
      activeLanguage: 'en',
      translations: {},
    });
  },

  handleStartBlank: () => {
    set({
      masterData: BLANK_MASTER_DATA,
      targetJob: BLANK_TARGET_JOB,
      cvMarkdown: BLANK_TAILORED_CV,
      gapMarkdown: BLANK_GAP_REPORT,
      companyName: '',
      targetRole: '',
      currentBaseLanguage: 'es',
      activeLanguage: 'es',
      translations: {},
    });
  },

  handleResetWorkspace: () => {
    set({
      masterData: BLANK_MASTER_DATA,
      targetJob: BLANK_TARGET_JOB,
      cvMarkdown: BLANK_TAILORED_CV,
      gapMarkdown: BLANK_GAP_REPORT,
      companyName: '',
      targetRole: '',
      currentBaseLanguage: 'es',
      activeLanguage: 'es',
      translations: {},
      theme: 'modern-tech',
      palette: 'corporate-blue',
      customColor: '#1d4ed8',
      fontFamily: 'inter',
      spacingDensity: 'standard',
      activeTab: 'landing',
      wizardStep: 'profile',
    });
  },

  handleDownloadCvMarkdown: () => {
    const { masterData, targetJob, companyName, cvMarkdown, activeLanguage, currentBaseLanguage, translations } = get();
    const candidateName = extractCandidateName(masterData, 'Candidate');
    const targetComp = companyName || extractTargetCompany(targetJob, 'Target');
    const isVariant = activeLanguage && currentBaseLanguage && activeLanguage !== currentBaseLanguage && translations[activeLanguage];
    const content = isVariant ? translations[activeLanguage].cvMarkdown : cvMarkdown;
    const langSuffix = isVariant ? `_${activeLanguage.toUpperCase()}` : '';
    const baseName = `CV_${candidateName}_${targetComp}${langSuffix}`;
    const fileName = buildTimestampedFileName(baseName, 'md');

    downloadTextFile(content, fileName);
    get().recordBackup();
  },
});
