import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import {
  parseCvMarkdownToData,
  extractCandidateName,
  extractTargetCompany,
  extractTargetRole,
} from '../core/parser';
import { tailorResume, DEFAULT_RULES } from '../core/ai-service';
import { auditCvContent } from '../core/audit-engine';
import {
  BLANK_MASTER_DATA,
  BLANK_TARGET_JOB,
  BLANK_TAILORED_CV,
  BLANK_GAP_REPORT,
  DEMO_MASTER_DATA,
  DEMO_TARGET_JOB,
  DEMO_TAILORED_CV,
  DEMO_GAP_REPORT,
} from '../constants/templates';
import {
  ThemeId,
  StudioTab,
  WizardStep,
  AIProviderSettings,
  CVData,
  QualityAuditReport,
} from '../types/cv';

export interface ResumeWorkspaceContextType {
  // Navigation
  activeTab: StudioTab;
  setActiveTab: React.Dispatch<React.SetStateAction<StudioTab>>;
  wizardStep: WizardStep;
  setWizardStep: React.Dispatch<React.SetStateAction<WizardStep>>;
  editorSplitView: 'split' | 'preview-only' | 'editor-only';
  setEditorSplitView: React.Dispatch<React.SetStateAction<'split' | 'preview-only' | 'editor-only'>>;

  // Core Data
  masterData: string;
  setMasterData: React.Dispatch<React.SetStateAction<string>>;
  targetJob: string;
  setTargetJob: React.Dispatch<React.SetStateAction<string>>;
  cvMarkdown: string;
  setCvMarkdown: React.Dispatch<React.SetStateAction<string>>;
  gapMarkdown: string;
  setGapMarkdown: React.Dispatch<React.SetStateAction<string>>;
  rules: string;
  setRules: React.Dispatch<React.SetStateAction<string>>;
  companyName: string;
  setCompanyName: React.Dispatch<React.SetStateAction<string>>;
  targetRole: string;
  setTargetRole: React.Dispatch<React.SetStateAction<string>>;
  pageBudget: 1 | 2;
  setPageBudget: React.Dispatch<React.SetStateAction<1 | 2>>;
  theme: ThemeId;
  setTheme: React.Dispatch<React.SetStateAction<ThemeId>>;
  providerSettings: AIProviderSettings;
  setProviderSettings: React.Dispatch<React.SetStateAction<AIProviderSettings>>;

  // Generation State
  isGenerating: boolean;
  generationStep: string;
  generationError: string | null;
  setGenerationError: React.Dispatch<React.SetStateAction<string | null>>;

  // Derived Values
  parsedCv: CVData;
  auditReport: QualityAuditReport;
  gapInfo: { matchScore: number; keywords: string[] };
  stats: { words: number; bulletsCount: number; skillsCount: number; contactsCount: number };
  hasTargetJob: boolean;
  hasGeneratedCv: boolean;
  hasGapReport: boolean;

  // Actions
  handleGenerate: () => Promise<void>;
  handleDownloadCvMarkdown: () => void;
  handleLoadDemoProfile: () => void;
  handleStartBlank: () => void;
  handleResetWorkspace: () => void;
}

const ResumeWorkspaceContext = createContext<ResumeWorkspaceContextType | null>(null);

const DEFAULT_AI_SETTINGS: AIProviderSettings = {
  provider: 'free-pollinations',
  model: 'free-openai',
  apiKey: '',
  temperature: 0.15,
};

export const ResumeWorkspaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation State
  const [activeTab, setActiveTab] = useLocalStorage<StudioTab>('cv_active_tab', 'wizard');
  const [wizardStep, setWizardStep] = useLocalStorage<WizardStep>('cv_wizard_step', 'profile');
  const [editorSplitView, setEditorSplitView] = useState<'split' | 'preview-only' | 'editor-only'>('split');

  // Core Data States
  const [masterData, setMasterData] = useLocalStorage<string>('cv_master_data', BLANK_MASTER_DATA);
  const [targetJob, setTargetJob] = useLocalStorage<string>('cv_target_job', BLANK_TARGET_JOB);
  const [cvMarkdown, setCvMarkdown] = useLocalStorage<string>('cv_tailored_markdown', BLANK_TAILORED_CV);
  const [gapMarkdown, setGapMarkdown] = useLocalStorage<string>('cv_gap_markdown', BLANK_GAP_REPORT);
  const [rules, setRules] = useLocalStorage<string>('cv_rules_markdown', DEFAULT_RULES);
  const [companyName, setCompanyName] = useLocalStorage<string>('cv_company_name', '');
  const [targetRole, setTargetRole] = useLocalStorage<string>('cv_target_role', '');
  const [pageBudget, setPageBudget] = useLocalStorage<1 | 2>('cv_page_budget', 1);
  const [theme, setTheme] = useLocalStorage<ThemeId>('cv_theme', 'modern-tech');
  const [providerSettings, setProviderSettings] = useLocalStorage<AIProviderSettings>('cv_ai_settings', DEFAULT_AI_SETTINGS);

  // Generator Loading States
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationStep, setGenerationStep] = useState<string>('');
  const [generationError, setGenerationError] = useState<string | null>(null);

  // Auto-synchronize extracted Company & Role from targetJob and masterData
  useEffect(() => {
    const extractedComp = extractTargetCompany(targetJob);
    if (extractedComp) {
      setCompanyName(extractedComp.replace(/_/g, ' '));
    }
    const extractedRole = extractTargetRole(targetJob, masterData);
    if (extractedRole) {
      setTargetRole(extractedRole);
    }
  }, [targetJob, masterData, setCompanyName, setTargetRole]);

  // Detection Flags for conditional availability
  const hasTargetJob = useMemo(() => {
    return Boolean(
      targetJob &&
      targetJob.trim().length > 40 &&
      !targetJob.includes('[Paste the raw job description') &&
      !targetJob.includes('[Target Company Name]')
    );
  }, [targetJob]);

  const hasGeneratedCv = useMemo(() => {
    return Boolean(
      cvMarkdown &&
      cvMarkdown.trim().length > 60 &&
      !cvMarkdown.includes('[CANDIDATE FULL NAME]') &&
      !cvMarkdown.includes('[Target Role Title')
    );
  }, [cvMarkdown]);

  const hasGapReport = useMemo(() => {
    return Boolean(
      gapMarkdown &&
      gapMarkdown.trim().length > 50 &&
      !gapMarkdown.includes('--/100') &&
      !gapMarkdown.includes('[Target Company]')
    );
  }, [gapMarkdown]);

  // Parsed CV Data for Live Rendering
  const parsedCv = useMemo(() => {
    return parseCvMarkdownToData(cvMarkdown);
  }, [cvMarkdown]);

  // Calibrated Quality Audit Report
  const auditReport = useMemo(() => {
    return auditCvContent(cvMarkdown, targetJob, masterData);
  }, [cvMarkdown, targetJob, masterData]);

  // Extracted Gap Information
  const gapInfo = useMemo(() => {
    let matchScore = 92;
    const scoreMatch = gapMarkdown.match(/Estimated Match Score:\*{0,2}\s*(\d{1,3})/i);
    if (scoreMatch) {
      matchScore = parseInt(scoreMatch[1], 10);
    }

    let keywords = ['TypeScript', 'React', 'Microfrontends', 'Module Federation', 'Zustand', 'CI/CD', 'Jest'];
    const kwMatch = gapMarkdown.match(/Critical Integrated Keywords:\*{0,2}\s*\[?([^\]\r\n]+)\]?/i);
    if (kwMatch) {
      keywords = kwMatch[1].split(/[,|•]/).map(k => k.trim()).filter(Boolean);
    }

    return { matchScore, keywords };
  }, [gapMarkdown]);

  // Statistics
  const stats = useMemo(() => {
    const words = cvMarkdown.trim().split(/\s+/).filter(Boolean).length;
    let bulletsCount = 0;
    if (parsedCv.experience) {
      bulletsCount += parsedCv.experience.reduce((acc, curr) => acc + curr.bullets.length, 0);
    }
    if (parsedCv.projects) {
      bulletsCount += parsedCv.projects.reduce((acc, curr) => acc + curr.bullets.length, 0);
    }
    const skillsCount = parsedCv.skillGroups?.reduce((acc, curr) => acc + curr.skills.length, 0) || 0;

    return { words, bulletsCount, skillsCount, contactsCount: parsedCv.contacts.length };
  }, [cvMarkdown, parsedCv]);

  // Actions
  const handleGenerate = async () => {
    setIsGenerating(true);
    setGenerationError(null);
    setGenerationStep('Reading Master Data & Target Vacancy...');

    try {
      setTimeout(() => setGenerationStep('Cross-referencing requirements with Google XYZ Formula...'), 800);
      setTimeout(() => setGenerationStep('Synthesizing 3-Category Universal Stack & ATS Structure...'), 1800);
      setTimeout(() => setGenerationStep('Generating Gap Analysis & Quality Report...'), 2800);

      const response = await tailorResume({
        masterData,
        targetJob,
        rules,
        companyName,
        targetRole,
        pageBudget,
        providerSettings,
      });

      if (response.tailoredCvMarkdown) {
        setCvMarkdown(response.tailoredCvMarkdown);
      }
      if (response.gapAnalysisMarkdown) {
        setGapMarkdown(response.gapAnalysisMarkdown);
      }

      setGenerationStep('Done! Resume tailored successfully.');
      setTimeout(() => {
        setIsGenerating(false);
        setActiveTab('wizard');
        setWizardStep('preview');
      }, 500);
    } catch (err: any) {
      setGenerationError(err.message || 'Error occurred during AI resume synthesis.');
      setIsGenerating(false);
    }
  };

  const handleDownloadCvMarkdown = () => {
    const candidateName = extractCandidateName(masterData, 'Candidate');
    const targetComp = companyName || extractTargetCompany(targetJob, 'Target');
    const fileName = `CV_${candidateName}_${targetComp}.md`;

    const blob = new Blob([cvMarkdown], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleLoadDemoProfile = () => {
    setMasterData(DEMO_MASTER_DATA);
    setTargetJob(DEMO_TARGET_JOB);
    setCvMarkdown(DEMO_TAILORED_CV);
    setGapMarkdown(DEMO_GAP_REPORT);
    setCompanyName('Stripe');
    setTargetRole('Senior Frontend Engineer');
  };

  const handleStartBlank = () => {
    setMasterData(BLANK_MASTER_DATA);
    setTargetJob(BLANK_TARGET_JOB);
    setCvMarkdown(BLANK_TAILORED_CV);
    setGapMarkdown(BLANK_GAP_REPORT);
    setCompanyName('');
    setTargetRole('');
  };

  const handleResetWorkspace = () => {
    if (confirm('Are you sure you want to reset all workspace data to a clean blank slate?')) {
      handleStartBlank();
      setRules(DEFAULT_RULES);
      setPageBudget(1);
      setTheme('modern-tech');
      localStorage.clear();
    }
  };

  const value: ResumeWorkspaceContextType = {
    activeTab,
    setActiveTab,
    wizardStep,
    setWizardStep,
    editorSplitView,
    setEditorSplitView,
    masterData,
    setMasterData,
    targetJob,
    setTargetJob,
    cvMarkdown,
    setCvMarkdown,
    gapMarkdown,
    setGapMarkdown,
    rules,
    setRules,
    companyName,
    setCompanyName,
    targetRole,
    setTargetRole,
    pageBudget,
    setPageBudget,
    theme,
    setTheme,
    providerSettings,
    setProviderSettings,
    isGenerating,
    generationStep,
    generationError,
    setGenerationError,
    parsedCv,
    auditReport,
    gapInfo,
    stats,
    hasTargetJob,
    hasGeneratedCv,
    hasGapReport,
    handleGenerate,
    handleDownloadCvMarkdown,
    handleLoadDemoProfile,
    handleStartBlank,
    handleResetWorkspace,
  };

  return (
    <ResumeWorkspaceContext.Provider value={value}>
      {children}
    </ResumeWorkspaceContext.Provider>
  );
};

export const useResumeWorkspace = (): ResumeWorkspaceContextType => {
  const context = useContext(ResumeWorkspaceContext);
  if (!context) {
    throw new Error('useResumeWorkspace must be used within a ResumeWorkspaceProvider');
  }
  return context;
};
