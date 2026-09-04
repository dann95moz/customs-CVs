import { useResumeStore } from '../store';

/**
 * Domain hook encapsulating store mutations for WelcomeLandingView.
 * Decouples the landing view from direct Zustand store references.
 */
export function useWelcomeLandingWorkflow() {
  const handleStartWizard = useResumeStore((s) => s.handleStartWizard);
  const handleExploreDemo = useResumeStore((s) => s.handleExploreDemo);
  const setMasterData = useResumeStore((s) => s.setMasterData);
  const setActiveTab = useResumeStore((s) => s.setActiveTab);
  const setWizardStep = useResumeStore((s) => s.setWizardStep);

  const handleUploadSuccess = (content: string) => {
    setMasterData(content);
    setActiveTab('wizard');
    setWizardStep('profile');
  };

  return {
    handleStartWizard,
    handleExploreDemo,
    handleUploadSuccess,
  };
}
