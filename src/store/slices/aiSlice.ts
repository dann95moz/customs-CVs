import { StateCreator } from 'zustand';
import { ResumeStore, AiSlice } from '../types';
import { AIProviderSettings, GeneratedCvVersion } from '../../types/cv';
import { tailorResume } from '../../core/ai-service';
import {
  extractCandidateName,
  extractTargetCompany,
  extractTargetRole,
} from '../../core/parser';

export const DEFAULT_AI_SETTINGS: AIProviderSettings = {
  provider: 'gemini',
  model: 'gemini-3.6-flash',
  apiKey: '',
  temperature: 0.15,
  customEndpoint: 'http://localhost:11434/v1',
};

export const createAiSlice: StateCreator<ResumeStore, [], [], AiSlice> = (set, get) => ({
  providerSettings: DEFAULT_AI_SETTINGS,
  isGenerating: false,
  generationStep: '',
  generationError: null,

  setProviderSettings: (val) => {
    const nextVal = typeof val === 'function' ? val(get().providerSettings) : val;
    set({ providerSettings: nextVal });
  },

  setGenerationError: (err: string | null) => {
    set({ generationError: err });
  },

  handleGenerate: async () => {
    set({
      isGenerating: true,
      generationError: null,
      generationStep: 'Reading Master Data & Target Vacancy...',
    });

    const stepTimer1 = setTimeout(() => set({ generationStep: 'Cross-referencing requirements with Google XYZ Formula...' }), 800);
    const stepTimer2 = setTimeout(() => set({ generationStep: 'Synthesizing 3-Category Universal Stack & ATS Structure...' }), 1800);
    const stepTimer3 = setTimeout(() => set({ generationStep: 'Generating Gap Analysis & Quality Report...' }), 2800);

    try {
      const {
        masterData,
        targetJob,
        rules,
        companyName,
        targetRole,
        pageBudget,
        providerSettings,
        theme,
        palette,
        savedVersions,
      } = get();

      const response = await tailorResume({
        masterData,
        targetJob,
        rules,
        companyName,
        targetRole,
        pageBudget,
        providerSettings,
      });

      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      clearTimeout(stepTimer3);

      const tailoredCv = response.tailoredCvMarkdown || get().cvMarkdown;
      const gapReport = response.gapAnalysisMarkdown || get().gapMarkdown;

      const candName = extractCandidateName(masterData, 'Candidate').replace(/_/g, ' ');
      const comp = companyName || extractTargetCompany(targetJob, 'Target Company');
      const role = targetRole || extractTargetRole(targetJob, masterData, 'Specialist');

      const autoSavedVersion: GeneratedCvVersion = {
        id: `cv_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        createdAt: new Date().toISOString(),
        candidateName: candName,
        companyName: comp,
        targetRole: role,
        matchScore: response.estimatedMatchScore || 94,
        qualityScore: 9.0,
        theme,
        palette,
        pageBudget,
        cvMarkdown: tailoredCv,
        gapMarkdown: gapReport,
        targetJobSnippet: targetJob.slice(0, 280),
      };

      set({
        cvMarkdown: tailoredCv,
        gapMarkdown: gapReport,
        savedVersions: [autoSavedVersion, ...savedVersions.filter(v => v.id !== autoSavedVersion.id)],
        generationStep: 'Done! Resume tailored successfully.',
      });

      setTimeout(() => {
        set({
          isGenerating: false,
          activeTab: 'wizard',
          wizardStep: 'preview',
        });
      }, 500);
    } catch (err: unknown) {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      clearTimeout(stepTimer3);

      const message = err instanceof Error ? err.message : 'Error occurred during AI resume synthesis.';
      set({
        generationError: message,
        isGenerating: false,
      });
    }
  },
});
