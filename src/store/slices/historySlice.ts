import { StateCreator } from 'zustand';
import { ResumeStore, HistorySlice } from '../types';
import { GeneratedCvVersion } from '../../types/cv';
import {
  extractCandidateName,
  extractTargetCompany,
  extractTargetRole,
} from '../../core/parser';
import { auditCvContent } from '../../core/audit-engine';

export const createHistorySlice: StateCreator<ResumeStore, [], [], HistorySlice> = (set, get) => ({
  savedVersions: [],

  handleSaveCurrentVersion: () => {
    const {
      masterData,
      companyName,
      targetJob,
      targetRole,
      gapMarkdown,
      cvMarkdown,
      theme,
      palette,
      pageBudget,
      savedVersions,
    } = get();

    const candName = extractCandidateName(masterData, 'Candidate').replace(/_/g, ' ');
    const comp = companyName || extractTargetCompany(targetJob, 'Target Company');
    const role = targetRole || extractTargetRole(targetJob, masterData, 'Specialist');

    let matchScore = 92;
    const scoreMatch = gapMarkdown.match(/Estimated Match Score:\*{0,2}\s*(\d{1,3})/i);
    if (scoreMatch) {
      matchScore = parseInt(scoreMatch[1], 10);
    }

    const audit = auditCvContent(cvMarkdown, targetJob, masterData);

    const newVersion: GeneratedCvVersion = {
      id: `cv_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
      candidateName: candName,
      companyName: comp,
      targetRole: role,
      matchScore: matchScore || 92,
      qualityScore: audit.overallScore || 8.8,
      theme,
      palette,
      pageBudget,
      cvMarkdown,
      gapMarkdown,
      targetJobSnippet: targetJob.slice(0, 280),
    };

    set({
      savedVersions: [newVersion, ...savedVersions.filter((v) => v.id !== newVersion.id)],
    });
  },

  handleLoadVersion: (id: string) => {
    const found = get().savedVersions.find((v) => v.id === id);
    if (found) {
      set({
        cvMarkdown: found.cvMarkdown,
        ...(found.gapMarkdown ? { gapMarkdown: found.gapMarkdown } : {}),
        ...(found.companyName ? { companyName: found.companyName } : {}),
        ...(found.targetRole ? { targetRole: found.targetRole } : {}),
        ...(found.theme ? { theme: found.theme } : {}),
        ...(found.palette ? { palette: found.palette } : {}),
        ...(found.pageBudget ? { pageBudget: found.pageBudget } : {}),
        activeTab: 'wizard',
        wizardStep: 'preview',
      });
    }
  },

  handleDeleteVersion: (id: string) => {
    set({
      savedVersions: get().savedVersions.filter((v) => v.id !== id),
    });
  },
});
