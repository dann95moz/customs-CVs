import { useResumeStore } from '../store';

/**
 * Domain hook encapsulating store subscriptions and actions for VersionDiffModal.
 * Decouples the UI component from direct Zustand store references.
 */
export function useVersionDiffWorkflow() {
  const masterData = useResumeStore((s) => s.masterData);
  const cvMarkdown = useResumeStore((s) => s.cvMarkdown);
  const savedVersions = useResumeStore((s) => s.savedVersions || []);
  const handleLoadVersion = useResumeStore((s) => s.handleLoadVersion);
  const setCvMarkdown = useResumeStore((s) => s.setCvMarkdown);
  const setWizardStep = useResumeStore((s) => s.setWizardStep);

  const applyVersion = (versionId: string) => {
    if (versionId === 'master') {
      setCvMarkdown(masterData);
    } else if (versionId !== 'current') {
      handleLoadVersion(versionId);
    }
    setWizardStep('preview');
  };

  return {
    masterData,
    cvMarkdown,
    savedVersions,
    applyVersion,
  };
}
