import {
  ThemeId,
  PaletteId,
  FontFamilyId,
  SpacingDensity,
  StudioTab,
  WizardStep,
  AIProviderSettings,
  GeneratedCvVersion,
} from '../types/cv';

export interface UiSlice {
  activeTab: StudioTab;
  wizardStep: WizardStep;
  editorSplitView: 'split' | 'preview-only' | 'editor-only';
  setActiveTab: (tab: StudioTab) => void;
  setWizardStep: (step: WizardStep) => void;
  setEditorSplitView: (view: 'split' | 'preview-only' | 'editor-only') => void;
  handleStartWizard: () => void;
  handleExploreDemo: () => void;
}

export interface CvDataSlice {
  masterData: string;
  targetJob: string;
  cvMarkdown: string;
  gapMarkdown: string;
  rules: string;
  companyName: string;
  targetRole: string;
  setMasterData: (val: string | ((prev: string) => string)) => void;
  setTargetJob: (val: string | ((prev: string) => string)) => void;
  setCvMarkdown: (val: string | ((prev: string) => string)) => void;
  setGapMarkdown: (val: string | ((prev: string) => string)) => void;
  setRules: (val: string | ((prev: string) => string)) => void;
  setCompanyName: (val: string) => void;
  setTargetRole: (val: string) => void;
  handleLoadDemoProfile: () => void;
  handleStartBlank: () => void;
  handleResetWorkspace: () => void;
  handleDownloadCvMarkdown: () => void;
}

export interface DesignSlice {
  pageBudget: 1 | 2;
  theme: ThemeId;
  palette: PaletteId;
  customColor: string;
  fontFamily: FontFamilyId;
  spacingDensity: SpacingDensity;
  setPageBudget: (val: 1 | 2) => void;
  setTheme: (val: ThemeId) => void;
  setPalette: (val: PaletteId) => void;
  setCustomColor: (val: string) => void;
  setFontFamily: (val: FontFamilyId) => void;
  setSpacingDensity: (val: SpacingDensity) => void;
}

export interface AiSlice {
  providerSettings: AIProviderSettings;
  isGenerating: boolean;
  generationStep: string;
  generationError: string | null;
  setProviderSettings: (val: AIProviderSettings | ((prev: AIProviderSettings) => AIProviderSettings)) => void;
  setGenerationError: (err: string | null) => void;
  handleGenerate: () => Promise<void>;
}

export interface HistorySlice {
  savedVersions: GeneratedCvVersion[];
  handleSaveCurrentVersion: (customTitle?: string) => void;
  handleLoadVersion: (id: string) => void;
  handleDeleteVersion: (id: string) => void;
}

export type ResumeStore = UiSlice & CvDataSlice & DesignSlice & AiSlice & HistorySlice;
