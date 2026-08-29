import { useLocalStorage } from './useLocalStorage';
import { GeneratedCvVersion, ThemeId, PaletteId, StudioTab, WizardStep } from '../types/cv';

export interface UseCvVersionHistoryParams {
  setCvMarkdown: (val: string) => void;
  setGapMarkdown: (val: string) => void;
  setCompanyName: (val: string) => void;
  setTargetRole: (val: string) => void;
  setTheme: (val: ThemeId) => void;
  setPalette: (val: PaletteId) => void;
  setPageBudget: (val: 1 | 2) => void;
  setActiveTab: (val: StudioTab) => void;
  setWizardStep: (val: WizardStep) => void;
}

/**
 * Custom hook to manage saved tailored CV versions in local storage.
 * Principle: Single Responsibility & Layer Separation (SOLID).
 */
export const useCvVersionHistory = ({
  setCvMarkdown,
  setGapMarkdown,
  setCompanyName,
  setTargetRole,
  setTheme,
  setPalette,
  setPageBudget,
  setActiveTab,
  setWizardStep,
}: UseCvVersionHistoryParams) => {
  const [savedVersions, setSavedVersions] = useLocalStorage<GeneratedCvVersion[]>('cv_saved_versions', []);

  const saveVersion = (version: GeneratedCvVersion) => {
    setSavedVersions(prev => [
      version,
      ...prev.filter(v => v.id !== version.id)
    ]);
  };

  const handleLoadVersion = (id: string) => {
    const found = savedVersions.find(v => v.id === id);
    if (found) {
      setCvMarkdown(found.cvMarkdown);
      if (found.gapMarkdown) setGapMarkdown(found.gapMarkdown);
      if (found.companyName) setCompanyName(found.companyName);
      if (found.targetRole) setTargetRole(found.targetRole);
      if (found.theme) setTheme(found.theme);
      if (found.palette) setPalette(found.palette);
      if (found.pageBudget) setPageBudget(found.pageBudget);
      setActiveTab('wizard');
      setWizardStep('preview');
    }
  };

  const handleDeleteVersion = (id: string) => {
    setSavedVersions(prev => prev.filter(v => v.id !== id));
  };

  return {
    savedVersions,
    setSavedVersions,
    saveVersion,
    handleLoadVersion,
    handleDeleteVersion,
  };
};
