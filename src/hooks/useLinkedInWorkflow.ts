import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { CVData } from '../types/cv';
import { LinkedInProfileResult } from '../types/linkedin';
import { AIProviderSettings } from '../types/ai';
import { generateLinkedInProfile } from '../core/ai-service';
import { useCopyToClipboard } from './useCopyToClipboard';

export interface UseLinkedInWorkflowProps {
  cvData: CVData;
  companyName: string;
  targetRole: string;
  targetJob?: string;
  providerSettings?: AIProviderSettings;
}

export interface UseLinkedInWorkflowReturn {
  loading: boolean;
  data: LinkedInProfileResult | null;
  copiedId: string | null;
  isEditingAbout: boolean;
  setIsEditingAbout: React.Dispatch<React.SetStateAction<boolean>>;
  aboutText: string;
  setAboutText: (text: string) => void;
  snackbar: string | null;
  handleGenerate: () => Promise<void>;
  handleCopy: (text: string, id: string, label: string) => Promise<void>;
  handleCloseSnackbar: () => void;
}

const DEFAULT_SETTINGS_FALLBACK: AIProviderSettings = {
  provider: 'gemini',
  apiKey: '',
  model: 'gemini-3.7-flash',
  temperature: 0.2,
};

export function useLinkedInWorkflow({
  cvData,
  companyName,
  targetRole,
  targetJob = '',
  providerSettings,
}: UseLinkedInWorkflowProps): UseLinkedInWorkflowReturn {
  const { t } = useTranslation(['preview', 'common']);
  const { copy } = useCopyToClipboard();

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<LinkedInProfileResult | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isEditingAbout, setIsEditingAbout] = useState(false);
  const [aboutText, setAboutText] = useState('');
  const [snackbar, setSnackbar] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    setLoading(true);
    try {
      const res = await generateLinkedInProfile(
        cvData,
        targetJob,
        companyName,
        targetRole,
        providerSettings || DEFAULT_SETTINGS_FALLBACK
      );
      setData(res);
      setAboutText(res.about.text);
    } catch (err) {
      console.error('Failed to generate LinkedIn profile:', err);
    } finally {
      setLoading(false);
    }
  }, [cvData, targetJob, companyName, targetRole, providerSettings]);

  useEffect(() => {
    handleGenerate();
  }, [companyName, targetRole, handleGenerate]);

  const handleCopy = useCallback(
    async (text: string, id: string, label: string) => {
      await copy(text);
      setCopiedId(id);
      setSnackbar(t('preview:linkedin.copiedToast', '{{label}} copied to clipboard!', { label }));
      setTimeout(() => setCopiedId(null), 2000);
    },
    [copy, t]
  );

  const handleCloseSnackbar = useCallback(() => {
    setSnackbar(null);
  }, []);

  return {
    loading,
    data,
    copiedId,
    isEditingAbout,
    setIsEditingAbout,
    aboutText,
    setAboutText,
    snackbar,
    handleGenerate,
    handleCopy,
    handleCloseSnackbar,
  };
}
