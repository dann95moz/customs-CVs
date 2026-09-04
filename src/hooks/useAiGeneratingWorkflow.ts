import { useResumeStore } from '../store';

/**
 * Domain hook encapsulating generation state and store actions for the AI generation overlay.
 * Decouples the UI component from direct Zustand store references.
 */
export function useAiGeneratingWorkflow() {
  const isGenerating = useResumeStore((s) => s.isGenerating);
  const companyName = useResumeStore((s) => s.companyName);
  const targetRole = useResumeStore((s) => s.targetRole);
  const generationStage = useResumeStore((s) => s.generationStage);
  const generationProgress = useResumeStore((s) => s.generationProgress);
  const generationStep = useResumeStore((s) => s.generationStep);
  const streamedWords = useResumeStore((s) => s.streamedWords);
  const streamedSnippet = useResumeStore((s) => s.streamedSnippet);
  const activeModelName = useResumeStore((s) => s.activeModelName);
  const generationError = useResumeStore((s) => s.generationError);
  const handleGenerate = useResumeStore((s) => s.handleGenerate);
  const cancelGeneration = useResumeStore((s) => s.cancelGeneration);
  const setActiveTab = useResumeStore((s) => s.setActiveTab);

  return {
    isGenerating,
    companyName,
    targetRole,
    generationStage,
    generationProgress,
    generationStep,
    streamedWords,
    streamedSnippet,
    activeModelName,
    generationError,
    handleGenerate,
    cancelGeneration,
    setActiveTab,
  };
}
