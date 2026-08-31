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
import { downloadTextFile } from '../../utils/fileUtils';

export const createCvDataSlice: StateCreator<ResumeStore, [], [], CvDataSlice> = (set, get) => ({
  masterData: BLANK_MASTER_DATA,
  targetJob: BLANK_TARGET_JOB,
  cvMarkdown: BLANK_TAILORED_CV,
  gapMarkdown: BLANK_GAP_REPORT,
  coverLetterMarkdown: '',
  coverLetterTone: 'corporate',
  rules: DEFAULT_RULES,
  companyName: '',
  targetRole: '',

  setMasterData: (val) => {
    const nextVal = typeof val === 'function' ? val(get().masterData) : val;
    const extractedRole = extractTargetRole(get().targetJob, nextVal);
    set({
      masterData: nextVal,
      ...(extractedRole ? { targetRole: extractedRole } : {}),
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
    const nextVal = typeof val === 'function' ? val(get().cvMarkdown) : val;
    set({ cvMarkdown: nextVal });
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

  handleLoadDemoProfile: () => {
    set({
      masterData: DEMO_MASTER_DATA,
      targetJob: DEMO_TARGET_JOB,
      cvMarkdown: DEMO_TAILORED_CV,
      gapMarkdown: DEMO_GAP_REPORT,
      companyName: 'Stripe',
      targetRole: 'Senior Frontend Engineer',
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
    });
  },

  handleResetWorkspace: () => {
    get().handleStartBlank();
    set({
      rules: DEFAULT_RULES,
      pageBudget: 1,
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
    const { masterData, targetJob, companyName, cvMarkdown } = get();
    const candidateName = extractCandidateName(masterData, 'Candidate');
    const targetComp = companyName || extractTargetCompany(targetJob, 'Target');
    const fileName = `CV_${candidateName}_${targetComp}.md`;

    downloadTextFile(cvMarkdown, fileName);
  },
});
