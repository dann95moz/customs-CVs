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
  model: 'gemini-3.7-flash',
  apiKey: '',
  temperature: 0.15,
  customEndpoint: 'http://localhost:11434/v1',
};

let activeAbortController: AbortController | null = null;

export const createAiSlice: StateCreator<ResumeStore, [], [], AiSlice> = (set, get) => ({
  providerSettings: DEFAULT_AI_SETTINGS,
  isGenerating: false,
  generationStep: '',
  generationStage: 1,
  generationProgress: 0,
  streamedWords: 0,
  streamedSnippet: '',
  activeModelName: '',
  generationError: null,

  setProviderSettings: (val) => {
    const nextVal = typeof val === 'function' ? val(get().providerSettings) : val;
    set({ providerSettings: nextVal });
  },

  setGenerationError: (err: string | null) => {
    set({ generationError: err });
  },

  cancelGeneration: () => {
    if (activeAbortController) {
      activeAbortController.abort();
      activeAbortController = null;
    }
    set({
      isGenerating: false,
      generationStep: '',
      generationStage: 1,
      generationProgress: 0,
      streamedWords: 0,
      streamedSnippet: '',
      generationError: null,
    });
  },

  handleGenerate: async () => {
    if (get().isGenerating && !get().generationError) {
      return;
    }

    if (activeAbortController) {
      activeAbortController.abort();
    }
    activeAbortController = new AbortController();

    const currentModel = get().providerSettings.model || 'AI Model';

    set({
      isGenerating: true,
      generationError: null,
      generationStage: 1,
      generationProgress: 15,
      generationStep: 'Analyzing employer requirements & extracting ATS keywords...',
      streamedWords: 0,
      streamedSnippet: '',
      activeModelName: currentModel,
    });

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

      const response = await tailorResume(
        {
          masterData,
          targetJob,
          rules,
          companyName,
          targetRole,
          pageBudget,
          providerSettings,
        },
        (progress) => {
          set({
            generationStage: progress.stageIndex,
            generationProgress: progress.progress,
            generationStep: progress.message,
            streamedWords: progress.wordCount ?? get().streamedWords,
            streamedSnippet: progress.snippet ?? get().streamedSnippet,
            activeModelName: progress.modelUsed ?? currentModel,
          });
        },
        activeAbortController.signal
      );

      const tailoredCv = response.tailoredCvMarkdown || get().cvMarkdown;
      const gapReport = response.gapAnalysisMarkdown || get().gapMarkdown;

      const candName = extractCandidateName(masterData, 'Candidate').replace(/_/g, ' ');
      const comp = companyName || extractTargetCompany(targetJob, 'Target Company');
      const role = targetRole || extractTargetRole(targetJob, masterData, 'Specialist');

      // Check if an identical version exists in savedVersions
      const existingDuplicate = savedVersions.find(
        (v) =>
          v.cvMarkdown.trim() === tailoredCv.trim() &&
          v.companyName.trim().toLowerCase() === comp.trim().toLowerCase() &&
          v.targetRole.trim().toLowerCase() === role.trim().toLowerCase() &&
          v.theme === theme &&
          v.palette === palette &&
          v.pageBudget === pageBudget
      );

      let nextSavedVersions = savedVersions;
      if (!existingDuplicate) {
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
        nextSavedVersions = [autoSavedVersion, ...savedVersions.filter((v) => v.id !== autoSavedVersion.id)];
      }

      set({
        cvMarkdown: tailoredCv,
        gapMarkdown: gapReport,
        savedVersions: nextSavedVersions,
        generationStage: 4,
        generationProgress: 100,
        generationStep: 'Done! Resume tailored successfully.',
      });

      setTimeout(() => {
        set({
          isGenerating: false,
          activeTab: 'wizard',
          wizardStep: 'preview',
        });
      }, 400);
    } catch (err: unknown) {
      if (err instanceof Error && err.message.includes('cancelled')) {
        set({
          isGenerating: false,
          generationError: null,
          generationProgress: 0,
        });
        return;
      }

      const message = err instanceof Error ? err.message : 'Error occurred during AI resume synthesis.';
      set({
        generationError: message,
        isGenerating: true,
        generationProgress: 0,
      });
    } finally {
      activeAbortController = null;
    }
  },
});
