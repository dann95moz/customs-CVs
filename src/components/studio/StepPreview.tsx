import React, { useRef, useState, useEffect } from 'react';
import {
  Paper,
  Box,
  Button,
  ButtonGroup,
  Chip,
  Typography,
  Snackbar,
  Alert,
  useTheme,
  alpha,
} from '@mui/material';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import {
  useResumeStore,
  useParsedCv,
  useAuditReport,
  useGapInfo,
} from '../../store';
import { CVRenderer } from '../CVRenderer';
import { CvLiveEditProvider } from './preview/CvLiveEditContext';
import { extractCandidateName, sanitizeFileName } from '../../core/parser';
import { getTemplateMetadata } from '../../templates';
import { usePrintPdf } from '../../hooks/usePrintPdf';
import { useGitHubStarPrompt } from '../../hooks/useGitHubStarPrompt';
import { StepPreviewToolbar } from './preview/StepPreviewToolbar';
import { StepPreviewNavRail } from './preview/StepPreviewNavRail';
import { PreviewSidePanelType, StepPreviewProps } from '../../types';
import { useTranslation } from 'react-i18next';
import { getPageFormatConfig } from '../../theme/dimensions';
import { StudioSkeleton } from './StudioSkeleton';
import { TrackApplicationDialog } from './history/TrackApplicationDialog';
import { StepPreviewMobileEdit } from './preview/StepPreviewMobileEdit';

// Dynamically loaded preview sidebars
const TemplatesPanel = React.lazy(() =>
  import('./preview/TemplatesPanel').then((m) => ({ default: m.TemplatesPanel }))
);
const DesignFormattingPanel = React.lazy(() =>
  import('./preview/DesignFormattingPanel').then((m) => ({ default: m.DesignFormattingPanel }))
);
const PreviewAuditGapDrawer = React.lazy(() =>
  import('./preview/PreviewAuditGapDrawer').then((m) => ({ default: m.PreviewAuditGapDrawer }))
);
const CoverLetterView = React.lazy(() =>
  import('./preview/CoverLetterView').then((m) => ({ default: m.CoverLetterView }))
);
const LinkedInPanel = React.lazy(() =>
  import('./preview/LinkedInPanel').then((m) => ({ default: m.LinkedInPanel }))
);
const VersionDiffModal = React.lazy(() =>
  import('./history/VersionDiffModal').then((m) => ({ default: m.VersionDiffModal }))
);
const GitHubStarToast = React.lazy(() =>
  import('./GitHubStarToast').then((m) => ({ default: m.GitHubStarToast }))
);

export type { StepPreviewProps };

export const StepPreview: React.FC<StepPreviewProps> = () => {
  const { t } = useTranslation(['preview', 'target', 'common']);
  const muiTheme = useTheme();
  const { isExportingPdf, handleDirectDownload } = usePrintPdf();
  const { isPromptOpen, triggerPrompt, dismissPrompt, openGitHubAndDismiss } = useGitHubStarPrompt();

  const [previewDocType, setPreviewDocType] = useState<'cv' | 'cover-letter'>('cv');
  const [isDiffModalOpen, setIsDiffModalOpen] = useState<boolean>(false);

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


  const parsedCv = useParsedCv();
  const auditReport = useAuditReport();
  const gapInfo = useGapInfo();

  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [trackSuccess, setTrackSuccess] = useState<boolean>(false);
  const [sheetHeight, setSheetHeight] = useState<number>(0);
  const [isTrackModalOpen, setIsTrackModalOpen] = useState<boolean>(false);
  const paperRef = useRef<HTMLDivElement>(null);

  // Get standardized page dimensions for target format
  const formatConfig = getPageFormatConfig(pageFormat);
  const targetPagePx = formatConfig.heightPx;
  const targetPageWidthPx = formatConfig.widthPx;

  // Check if current target application is already tracked
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

  // Mobile mode toggle: 'edit' (card-based touch list) vs 'preview' (scaled PDF sheet)
  const [mobileViewMode, setMobileViewMode] = useState<'edit' | 'preview'>('preview');

  const activeTemplateMeta = getTemplateMetadata(theme);

  // Canvas container reference and mobile auto-scale factor
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [canvasScale, setCanvasScale] = useState<number>(1);
  const [mobileZoomMode, setMobileZoomMode] = useState<'fit' | '100%'>('100%');

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
          // Fit mode: calculate scale to comfortably fit screen width
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

  return (
    <div className="preview-workspace-layout" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Top Studio Control Bar */}
      <StepPreviewToolbar
        previewDocType={previewDocType}
        onPreviewDocTypeChange={setPreviewDocType}
        activeTemplateName={activeTemplateMeta.name}
        onOpenTemplates={() => {
          setActiveSidePanel('templates');
          setIsAuditGapOpen(false);
        }}
        onSaveVersion={handleSaveToHistory}
        savedSuccess={savedSuccess}
        isSavingVersion={isSavingVersion}
        onReTailor={handleGenerate}
        isGenerating={isGenerating}
        onDownloadPdf={onTriggerDirectDownloadPdf}
        onDownloadMarkdown={handleDownloadCvMarkdown}
        isExportingPdf={isExportingPdf}
        pageFormat={pageFormat}
        onPageFormatChange={setPageFormat}
        isOverflowing={isOverflowing}
        onAutoFit={handleMagicAutoFit}
        onTrackApplication={handleTrackApplication}
        isTracked={isTracked}
      />

      {/* Main Studio Body: Vertical Left Rail + Side Drawer + Sheet Canvas + Right Audit/Gap Drawer */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, overflow: 'hidden', position: 'relative' }}>
        {/* 1. Left Tool Rail (Horizontal on mobile, vertical on desktop) */}
        <StepPreviewNavRail
          activeSidePanel={activeSidePanel}
          onToggleSidePanel={(panel: PreviewSidePanelType) => {
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
          }}
        />

        {/* 2. Expandable Left Side Panel */}
        {activeSidePanel && (
          <Box
            className="no-print preview-side-panel"
            sx={{
              position: { xs: 'absolute', md: 'relative' },
              left: { xs: 0, md: 'auto' },
              right: { xs: 0, md: 'auto' },
              top: 0,
              bottom: 0,
              width: { xs: '100%', sm: 330 },
              maxWidth: { xs: '100%', sm: 360 },
              borderRight: `1px solid ${muiTheme.palette.divider}`,
              bgcolor: 'background.paper',
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              overflowY: 'auto',
              flexShrink: 0,
              zIndex: 10,
              boxShadow: { xs: 8, md: 'none' },
            }}
          >
            <React.Suspense fallback={<StudioSkeleton variant="drawer" />}>
              {activeSidePanel === 'templates' && (
                <TemplatesPanel
                  theme={theme}
                  onSelectTheme={setTheme}
                  palette={palette}
                  onSelectPalette={setPalette}
                  customColor={customColor}
                  onCustomColorChange={setCustomColor}
                  onClose={() => setActiveSidePanel(null)}
                />
              )}

              {activeSidePanel === 'design' && (
                <DesignFormattingPanel
                  customColor={customColor}
                  onCustomColorChange={setCustomColor}
                  palette={palette}
                  onSelectPalette={setPalette}
                  fontFamily={fontFamily}
                  onFontFamilyChange={setFontFamily}
                  spacingDensity={spacingDensity}
                  onSpacingDensityChange={setSpacingDensity}
                  pageFormat={pageFormat}
                  onPageFormatChange={setPageFormat}
                  onAutoFit={handleMagicAutoFit}
                  sheetHeight={sheetHeight}
                  a4PagePx={targetPagePx}
                  estimatedPages={estimatedPages}
                  photo={photo}
                  onPhotoChange={setProfilePhoto}
                  onPhotoToggle={setProfilePhotoEnabled}
                  activeTheme={theme}
                  onClose={() => setActiveSidePanel(null)}
                />
              )}


              {activeSidePanel === 'linkedin' && (
                <LinkedInPanel
                  cvData={parsedCv}
                  companyName={companyName}
                  targetRole={targetRole}
                  targetJob={targetJob}
                  providerSettings={providerSettings}
                  onClose={() => setActiveSidePanel(null)}
                />
              )}

            </React.Suspense>
          </Box>
        )}

        {/* 3. Main Center Canvas: Document Sheet & Mobile Touch Editor or Cover Letter */}
        <div
          className="preview-canvas-wrapper"
          style={{ position: 'relative', display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden', order: 1 }}
        >
          {previewDocType === 'cover-letter' ? (
            <Box
              sx={{
                flex: 1,
                overflowY: 'auto',
                overflowX: 'hidden',
                p: { xs: 1.5, sm: 3 },
                pb: { xs: 'calc(env(safe-area-inset-bottom, 0px) + 64px)', sm: 6 },
                bgcolor: 'background.default',
                display: 'flex',
                justifyContent: 'center',
                boxSizing: 'border-box',
              }}
            >
              <React.Suspense fallback={<StudioSkeleton variant="preview" />}>
                <CoverLetterView
                  cvData={parsedCv}
                  companyName={companyName}
                  targetRole={targetRole}
                  themeId={theme}
                  paletteId={palette}
                  customColor={customColor}
                  fontFamily={fontFamily}
                  onExportPdf={onTriggerDirectDownloadPdf}
                />
              </React.Suspense>
            </Box>
          ) : (
            <>
              {/* Mobile View Mode Segmented Control (Visible only on mobile xs/sm) */}
              <Box
                className="no-print"
                sx={{
                  display: { xs: 'flex', md: 'none' },
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  py: 0.75,
                  px: 1.5,
                  bgcolor: 'background.paper',
                  borderBottom: `1px solid ${muiTheme.palette.divider}`,
                  zIndex: 10,
                  gap: 1,
                }}
              >
                <ButtonGroup
                  variant="outlined"
                  size="small"
                  sx={{
                    bgcolor: alpha(muiTheme.palette.primary.main, 0.06),
                    p: 0.3,
                    border: 'none',
                    gap: 0.5,
                  }}
                >
                  <Button
                    onClick={() => setMobileViewMode('edit')}
                    variant={mobileViewMode === 'edit' ? 'contained' : 'text'}
                    sx={{
                      px: 2.25,
                      py: 0.5,
                      minHeight: 32,
                      fontWeight: 700,
                      fontSize: '0.78rem',
                      textTransform: 'none',
                      boxShadow: 'none',
                      bgcolor: mobileViewMode === 'edit' ? 'primary.main' : 'transparent',
                      color: mobileViewMode === 'edit' ? 'common.white' : 'text.secondary',
                    }}
                  >
                    {t('preview:aiRegen.mobileModeEdit', 'Edit')}
                  </Button>
                  <Button
                    onClick={() => setMobileViewMode('preview')}
                    variant={mobileViewMode === 'preview' ? 'contained' : 'text'}
                    sx={{
                      px: 2.25,
                      py: 0.5,
                      minHeight: 32,
                      fontWeight: 700,
                      fontSize: '0.78rem',
                      textTransform: 'none',
                      boxShadow: 'none',
                      bgcolor: mobileViewMode === 'preview' ? 'primary.main' : 'transparent',
                      color: mobileViewMode === 'preview' ? 'common.white' : 'text.secondary',
                    }}
                  >
                    {t('preview:aiRegen.mobileModePreview', 'Preview')}
                  </Button>
                </ButtonGroup>


                {/* Mobile Zoom Fit Mode Toggle */}
                {mobileViewMode === 'preview' && (
                  <Chip
                    size="small"
                    label={mobileZoomMode === 'fit' ? t('preview:toolbar.zoomFit', 'Fit Width') : t('preview:toolbar.zoom100', '100% Real')}
                    color={mobileZoomMode === 'fit' ? 'primary' : 'default'}
                    variant={mobileZoomMode === 'fit' ? 'filled' : 'outlined'}
                    onClick={() => setMobileZoomMode((m) => (m === 'fit' ? '100%' : 'fit'))}
                    sx={{ fontWeight: 700, fontSize: '0.72rem', cursor: 'pointer' }}
                  />
                )}
              </Box>

              {/* Mobile 'Edit' Mode: Vertical List of Cards with Large Touch Buttons */}
              {mobileViewMode === 'edit' && (
                <Box
                  className="no-print preview-mobile-edit"
                  sx={{
                    display: { xs: 'block', md: 'none' },
                    flex: 1,
                    overflowY: 'auto',
                    bgcolor: 'background.default',
                    '@media print': {
                      display: 'none !important',
                    },
                  }}
                >
                  <CvLiveEditProvider parsedCv={parsedCv} isEditable={true}>
                    <StepPreviewMobileEdit parsedCv={parsedCv} activeTheme={theme} />
                  </CvLiveEditProvider>

                </Box>
              )}

          {/* Desktop OR Mobile 'Preview' Mode: Standard Pristine Canvas */}
          <Box
            component="main"
            ref={canvasContainerRef}
            className="preview-pane-canvas"
            sx={{
              position: 'relative',
              display: {
                xs: mobileViewMode === 'edit' ? 'none' : 'flex',
                md: 'flex',
              },
              flexDirection: 'column',
              alignItems: canvasScale < 1 && mobileZoomMode === 'fit' ? 'center' : 'flex-start',
              justifyContent: 'flex-start',
              flex: 1,
              overflowX: 'auto',
              overflowY: 'auto',
              WebkitOverflowScrolling: 'touch',
              p: { xs: 1.5, sm: 2, md: 3.5 },
              pb: { xs: 'calc(env(safe-area-inset-bottom, 0px) + 64px)', sm: 5, md: 6 },
              boxSizing: 'border-box',
              '@media print': {
                display: 'block !important',
                visibility: 'visible !important',
                overflow: 'visible !important',
                p: '0 !important',
                m: '0 !important',
              },
            }}
          >
            {/* Scaled Wrapper Container with strict visual pixel footprint */}
            <div
              className="paper-scale-container"
              style={{
                width: canvasScale < 1 && mobileZoomMode === 'fit' ? `${targetPageWidthPx * canvasScale}px` : `${targetPageWidthPx}px`,
                height: canvasScale < 1 && mobileZoomMode === 'fit' ? `${sheetHeight * canvasScale}px` : `${sheetHeight}px`,
                position: 'relative',
                margin: canvasScale < 1 && mobileZoomMode === 'fit' ? '0 auto' : '0 auto',
                flexShrink: 0,
              }}
            >
              <div
                className="paper-sheet-wrapper"
                style={{
                  width: `${targetPageWidthPx}px`,
                  transform: canvasScale < 1 && mobileZoomMode === 'fit' ? `scale(${canvasScale})` : undefined,
                  transformOrigin: 'top left',
                  position: canvasScale < 1 && mobileZoomMode === 'fit' ? 'absolute' : 'relative',
                  top: 0,
                  left: 0,
                }}
              >
                <div
                  ref={paperRef}
                  className={`paper-sheet ${overflowPercentage > 0 && overflowPercentage <= 25 ? 'compact-fit' : ''}`}
                  style={{
                    width: `${targetPageWidthPx}px`,
                    margin: '0 auto',
                  }}
                >
                  <CvLiveEditProvider parsedCv={parsedCv} isEditable={true}>
                    <CVRenderer
                      data={parsedCv}
                      theme={theme}
                      palette={palette}
                      customColor={palette === 'custom' ? customColor : undefined}
                      fontFamily={fontFamily}
                      spacingDensity={spacingDensity}
                      photo={photo}
                    />
                  </CvLiveEditProvider>
                </div>

                {/* Visual Page Break Marker only on actual overflow */}
                {isOverflowing && (
                  <div
                    className="page-break-guide"
                    style={{
                      top: `${targetPagePx}px`,
                    }}
                  >
                    <span>✂️ {t('preview:toolbar.pageBoundary', 'Page 1 Boundary ({{format}} Standard)', { format: pageFormat.toUpperCase() })}</span>
                  </div>
                )}
              </div>
            </div>
          </Box>

          {/* Bottom Navigation Bar */}
          <Paper
            elevation={0}
            className="no-print preview-nav-footer"
            sx={{
              p: 1.25,
              px: { xs: 1.5, sm: 3 },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 1,
              borderTop: `1px solid ${muiTheme.palette.divider}`,
              bgcolor: 'background.paper',
              zIndex: 10,
            }}
          >
            <Button
              variant="outlined"
              startIcon={<ArrowBackRoundedIcon />}
              onClick={() => setWizardStep('target')}
              size="small"
              sx={{ fontSize: { xs: '0.74rem', sm: '0.8rem' } }}
            >
              {t('preview:actions.backToTarget', 'Back to Target Vacancy')}
            </Button>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Chip
                icon={<EditRoundedIcon sx={{ fontSize: '13px !important' }} />}
                label={t('preview:toolbar.liveHotEdit', 'Live Hot Edit • Click text to edit & re-audit')}
                size="small"
                variant="outlined"
                color="primary"
                sx={{
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  height: 24,
                  display: { xs: 'none', md: 'inline-flex' },
                }}
              />

              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, display: { xs: 'none', sm: 'block' } }}>
                {t('preview:toolbar.pageFit', 'Estimated Length')}: <strong style={{ color: estimatedPages === 1 ? muiTheme.palette.success.main : muiTheme.palette.warning.main }}>{estimatedPages} {estimatedPages === 1 ? `Page (${pageFormat.toUpperCase()})` : 'Pages'}</strong> • Height: {sheetHeight}px / {targetPagePx}px
              </Typography>
            </Box>
          </Paper>
            </>
          )}
        </div>

        {/* 4. Unified Right-Side Audit & Gap Drawer */}
        <React.Suspense fallback={null}>
          <PreviewAuditGapDrawer
            auditReport={auditReport}
            gapInfo={gapInfo}
            gapMarkdown={gapMarkdown}
            companyName={companyName}
            targetRole={targetRole}
            cvData={parsedCv}
            isOpen={isAuditGapOpen}
            activeTab={auditGapTab}
            onToggleTab={(tab) => {
              setIsAuditGapOpen(true);
              setAuditGapTab(tab);
              setActiveSidePanel(null);
            }}
            onClose={() => setIsAuditGapOpen(false)}
          />
        </React.Suspense>
      </Box>

      {/* One-Time Post-Export GitHub Star Satisfaction Toast */}
      <React.Suspense fallback={null}>
        <GitHubStarToast
          open={isPromptOpen}
          onClose={dismissPrompt}
          onStarClick={openGitHubAndDismiss}
        />
      </React.Suspense>

      {/* Opt-in Track Application Dialog */}
      <TrackApplicationDialog
        open={isTrackModalOpen}
        onClose={() => setIsTrackModalOpen(false)}
        onConfirm={handleConfirmTrackApplication}
        prefillCompany={companyName}
        prefillRole={targetRole}
        savedVersions={savedVersions}
        existingApplications={applications}
        columns={kanbanColumns}
      />

      {/* Visual Version Diff Modal */}
      <React.Suspense fallback={null}>
        <VersionDiffModal
          open={isDiffModalOpen}
          onClose={() => setIsDiffModalOpen(false)}
        />
      </React.Suspense>

      {/* Toast Feedback when application is tracked */}
      <Snackbar
        open={trackSuccess}
        autoHideDuration={3000}
        onClose={() => setTrackSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" variant="filled" sx={{ fontWeight: 600 }}>
          {t('preview:toolbar.trackedSuccess', 'Saved to My Applications')}
        </Alert>
      </Snackbar>
    </div>
  );
};

