import { useState, useRef, useEffect } from 'react';
import {
  useResumeStore,
  useParsedCv,
  useAuditReport,
  useGapInfo,
} from '../store';
import { extractCandidateName, sanitizeFileName } from '../core/parser';
import { getTemplateMetadata } from '../templates';
import { usePrintPdf } from './usePrintPdf';
import { useGitHubStarPrompt } from './useGitHubStarPrompt';
import { PreviewSidePanelType } from '../types';
import { getPageFormatConfig } from '../theme/dimensions';

export const useStepPreviewWorkflow = () => {
  const { isExportingPdf, handleDirectDownload } = usePrintPdf();
  const { isPromptOpen, triggerPrompt, dismissPrompt, openGitHubAndDismiss } = useGitHubStarPrompt();

  const [previewDocType, setPreviewDocType] = useState<'cv' | 'cover-letter'>('cv');
  const [isDiffModalOpen, setIsDiffModalOpen] = useState<boolean>(false);

  // Zustand Store selectors
  const cvMarkdown = useResumeStore((s) => s.cvMarkdown);
  const theme = useResumeStore((s) => s.theme);
  const setTheme = useResumeStore((s) => s.setTheme);
  const palette = useResumeStore((s) => s.palette);
  const setPalette = useResumeStore((s) => s.setPalette);
  const customColor = useResumeStore((s) => s.customColor);
  const setCustomColor = useResumeStore((s) => s.setCustomColor);
  const fontFamily = useResumeStore((s) => s.fontFamily);
  const setFontFamily = useResumeStore((s) => s.setFontFamily);
  const spacingDensity = useResumeStore((s) => s.spacingDensity);
  const setSpacingDensity = useResumeStore((s) => s.setSpacingDensity);
  const pageFormat = useResumeStore((s) => s.pageFormat);
  const setPageFormat = useResumeStore((s) => s.setPageFormat);
  const photo = useResumeStore((s) => s.photo);
  const setProfilePhoto = useResumeStore((s) => s.setProfilePhoto);
  const setProfilePhotoEnabled = useResumeStore((s) => s.setProfilePhotoEnabled);
  const handleSaveCurrentVersion = useResumeStore((s) => s.handleSaveCurrentVersion);
  const handleDownloadCvMarkdown = useResumeStore((s) => s.handleDownloadCvMarkdown);
  const handleGenerate = useResumeStore((s) => s.handleGenerate);
  const isGenerating = useResumeStore((s) => s.isGenerating);
  const setWizardStep = useResumeStore((s) => s.setWizardStep);

  const companyName = useResumeStore((s) => s.companyName);
  const targetRole = useResumeStore((s) => s.targetRole);
  const targetJob = useResumeStore((s) => s.targetJob);
  const providerSettings = useResumeStore((s) => s.providerSettings);
  const masterData = useResumeStore((s) => s.masterData);
  const applications = useResumeStore((s) => s.applications);
  const kanbanColumns = useResumeStore((s) => s.kanbanColumns);
  const handleAddApplication = useResumeStore((s) => s.handleAddApplication);
  const savedVersions = useResumeStore((s) => s.savedVersions);
  const gapMarkdown = useResumeStore((s) => s.gapMarkdown);
  const setActiveTab = useResumeStore((s) => s.setActiveTab);

  const parsedCv = useParsedCv();
  const auditReport = useAuditReport();
  const gapInfo = useGapInfo();

  const handleOpenFullAudit = () => {
    setActiveTab('audit');
  };

  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [trackSuccess, setTrackSuccess] = useState<boolean>(false);
  const [sheetHeight, setSheetHeight] = useState<number>(0);
  const [isTrackModalOpen, setIsTrackModalOpen] = useState<boolean>(false);
  const paperRef = useRef<HTMLDivElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  // Page dimensions
  const formatConfig = getPageFormatConfig(pageFormat);
  const targetPagePx = formatConfig.heightPx;
  const targetPageWidthPx = formatConfig.widthPx;

  // Tracked state
  const isTracked = Boolean(
    companyName && applications.some((app) =>
      app.companyName.toLowerCase().trim() === companyName.toLowerCase().trim() &&
      (!targetRole || app.targetRole.toLowerCase().trim() === targetRole.toLowerCase().trim())
    )
  );

  const [isSavingVersion, setIsSavingVersion] = useState<boolean>(false);
  const lastSaveClickRef = useRef<number>(0);

  const handleSaveToHistory = () => {
    if (isSavingVersion) return;
    const now = Date.now();
    if (now - lastSaveClickRef.current < 1000) {
      return; // Debounce rapid double-clicks
    }
    lastSaveClickRef.current = now;

    setIsSavingVersion(true);
    try {
      handleSaveCurrentVersion();
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } finally {
      setTimeout(() => setIsSavingVersion(false), 500);
    }
  };

  const handleTrackApplication = () => {
    if (savedVersions.length === 0) {
      handleSaveCurrentVersion();
    }
    setIsTrackModalOpen(true);
  };

  const handleConfirmTrackApplication = (appData: Parameters<typeof handleAddApplication>[0]) => {
    handleAddApplication(appData);
    setTrackSuccess(true);
    setTimeout(() => setTrackSuccess(false), 3000);
  };

  // Left Tool Rail active side panel
  const [activeSidePanel, setActiveSidePanel] = useState<PreviewSidePanelType | null>(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 900) {
      return null;
    }
    return 'templates';
  });

  // Right Side Unified Audit & Gap Drawer state
  const [isAuditGapOpen, setIsAuditGapOpen] = useState<boolean>(false);
  const [auditGapTab, setAuditGapTab] = useState<'audit' | 'gap' | 'interview'>('audit');

  // Mobile mode toggle: 'edit' vs 'preview'
  const [mobileViewMode, setMobileViewMode] = useState<'edit' | 'preview'>('preview');
  const [canvasScale, setCanvasScale] = useState<number>(1);
  const [mobileZoomMode, setMobileZoomMode] = useState<'fit' | '100%'>('100%');

  const activeTemplateMeta = getTemplateMetadata(theme);

  // Measure rendered paper sheet height whenever styling or content changes
  useEffect(() => {
    const updateHeight = () => {
      if (paperRef.current) {
        setSheetHeight(paperRef.current.scrollHeight);
      }
    };
    updateHeight();
    const timer = setTimeout(updateHeight, 150);
    return () => clearTimeout(timer);
  }, [cvMarkdown, theme, palette, customColor, fontFamily, spacingDensity, pageFormat]);

  // Auto-calculate scale factor for mobile/tablet canvas preview
  useEffect(() => {
    const calculateScale = () => {
      if (!canvasContainerRef.current) return;
      const containerWidth = canvasContainerRef.current.clientWidth;
      if (containerWidth > 0 && containerWidth < 860) {
        if (mobileZoomMode === '100%') {
          setCanvasScale(1);
        } else {
          const padding = containerWidth < 500 ? 16 : 32;
          const scale = Math.min(1, Math.max(0.35, (containerWidth - padding) / targetPageWidthPx));
          setCanvasScale(scale);
        }
      } else {
        setCanvasScale(1);
      }
    };

    calculateScale();
    window.addEventListener('resize', calculateScale);
    const observer = new ResizeObserver(calculateScale);
    if (canvasContainerRef.current) {
      observer.observe(canvasContainerRef.current);
    }

    return () => {
      window.removeEventListener('resize', calculateScale);
      observer.disconnect();
    };
  }, [targetPageWidthPx, mobileViewMode, mobileZoomMode]);

  const isOverflowing = sheetHeight > targetPagePx + 8;
  const estimatedPages = isOverflowing ? Math.max(2, Math.ceil(sheetHeight / targetPagePx)) : 1;
  const overflowPercentage = isOverflowing ? Math.round(((sheetHeight - targetPagePx) / targetPagePx) * 100) : 0;

  const handleMagicAutoFit = () => {
    if (spacingDensity === 'spacious') {
      setSpacingDensity('standard');
    } else if (spacingDensity === 'standard') {
      setSpacingDensity('compact');
    } else if (fontFamily === 'serif' || fontFamily === 'mono') {
      setFontFamily('inter');
    }
  };

  const candidateName = sanitizeFileName(
    parsedCv.name || extractCandidateName(masterData, 'Candidate')
  );
  const cleanCompany = sanitizeFileName(companyName || 'Target');
  const targetPdfName = `CV_${candidateName}_${cleanCompany}.pdf`;

  const onTriggerDirectDownloadPdf = () => {
    if (paperRef.current) {
      handleDirectDownload(paperRef.current, targetPdfName, pageFormat);
      triggerPrompt(2000);
    }
  };

  const handleToggleSidePanel = (panel: PreviewSidePanelType) => {
    if (panel === 'compare') {
      setIsDiffModalOpen(true);
      return;
    }
    if (panel === 'audit') {
      const willBeOpen = !isAuditGapOpen;
      setIsAuditGapOpen(willBeOpen);
      setAuditGapTab('audit');
      if (willBeOpen) {
        setActiveSidePanel(null);
      }
    } else {
      const willBeOpen = activeSidePanel !== panel;
      setActiveSidePanel(willBeOpen ? panel : null);
      if (willBeOpen) {
        setIsAuditGapOpen(false);
      }
    }
  };

  return {
    // Refs
    paperRef,
    canvasContainerRef,
    // Document type & modals
    previewDocType,
    setPreviewDocType,
    isDiffModalOpen,
    setIsDiffModalOpen,
    isTrackModalOpen,
    setIsTrackModalOpen,
    savedSuccess,
    trackSuccess,
    setTrackSuccess,
    isSavingVersion,
    // Side panels & drawers
    activeSidePanel,
    setActiveSidePanel,
    isAuditGapOpen,
    setIsAuditGapOpen,
    auditGapTab,
    setAuditGapTab,
    handleToggleSidePanel,
    handleOpenFullAudit,
    // Mobile canvas & zoom
    mobileViewMode,
    setMobileViewMode,
    mobileZoomMode,
    setMobileZoomMode,
    canvasScale,
    sheetHeight,
    // Dimension & overflow calculations
    formatConfig,
    targetPagePx,
    targetPageWidthPx,
    isOverflowing,
    estimatedPages,
    overflowPercentage,
    activeTemplateMeta,
    // Store data & setters
    theme,
    setTheme,
    palette,
    setPalette,
    customColor,
    setCustomColor,
    fontFamily,
    setFontFamily,
    spacingDensity,
    setSpacingDensity,
    pageFormat,
    setPageFormat,
    photo,
    setProfilePhoto,
    setProfilePhotoEnabled,
    handleGenerate,
    isGenerating,
    handleDownloadCvMarkdown,
    setWizardStep,
    companyName,
    targetRole,
    targetJob,
    providerSettings,
    applications,
    kanbanColumns,
    savedVersions,
    gapMarkdown,
    parsedCv,
    auditReport,
    gapInfo,
    isTracked,
    // Actions
    handleSaveToHistory,
    handleTrackApplication,
    handleConfirmTrackApplication,
    handleMagicAutoFit,
    onTriggerDirectDownloadPdf,
    // Print & Star prompt
    isExportingPdf,
    isPromptOpen,
    dismissPrompt,
    openGitHubAndDismiss,
  };
};
