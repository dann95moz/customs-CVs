import React, { useRef, useState, useEffect } from 'react';
import {
  Paper,
  Box,
  Button,
  ButtonGroup,
  Chip,
  Typography,
  useTheme,
} from '@mui/material';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import BoltRoundedIcon from '@mui/icons-material/BoltRounded';
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

// Dynamically loaded preview sidebars and heavy editors
const SplitMarkdownEditor = React.lazy(() =>
  import('./SplitMarkdownEditor').then((m) => ({ default: m.SplitMarkdownEditor }))
);
const TemplatesPanel = React.lazy(() =>
  import('./preview/TemplatesPanel').then((m) => ({ default: m.TemplatesPanel }))
);
const DesignFormattingPanel = React.lazy(() =>
  import('./preview/DesignFormattingPanel').then((m) => ({ default: m.DesignFormattingPanel }))
);
const PreviewAuditGapDrawer = React.lazy(() =>
  import('./preview/PreviewAuditGapDrawer').then((m) => ({ default: m.PreviewAuditGapDrawer }))
);
const GitHubStarToast = React.lazy(() =>
  import('./GitHubStarToast').then((m) => ({ default: m.GitHubStarToast }))
);

export type { StepPreviewProps };

export const StepPreview: React.FC<StepPreviewProps> = () => {
  const { t } = useTranslation(['preview', 'target', 'common']);
  const muiTheme = useTheme();
  const { isExportingPdf, handleDirectDownload, handlePrintPdf } = usePrintPdf();
  const { isPromptOpen, triggerPrompt, dismissPrompt, openGitHubAndDismiss } = useGitHubStarPrompt();

  const cvMarkdown = useResumeStore((s) => s.cvMarkdown);
  const setCvMarkdown = useResumeStore((s) => s.setCvMarkdown);
  const masterData = useResumeStore((s) => s.masterData);
  const companyName = useResumeStore((s) => s.companyName);
  const targetRole = useResumeStore((s) => s.targetRole);
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
  const pageFormat = useResumeStore((s) => s.pageFormat || 'a4');
  const setPageFormat = useResumeStore((s) => s.setPageFormat);
  const isGenerating = useResumeStore((s) => s.isGenerating);
  const handleGenerate = useResumeStore((s) => s.handleGenerate);
  const handleDownloadCvMarkdown = useResumeStore((s) => s.handleDownloadCvMarkdown);
  const gapMarkdown = useResumeStore((s) => s.gapMarkdown);
  const handleSaveCurrentVersion = useResumeStore((s) => s.handleSaveCurrentVersion);
  const setWizardStep = useResumeStore((s) => s.setWizardStep);

  // Derived parsed and audit data via memoized hooks
  const parsedCv = useParsedCv();
  const auditReport = useAuditReport();
  const gapInfo = useGapInfo();

  const formatConfig = getPageFormatConfig(pageFormat);
  const targetPagePx = formatConfig.heightPx;
  const targetPageWidthPx = formatConfig.widthPx;

  const [sheetHeight, setSheetHeight] = useState<number>(0);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [zoomMode, setZoomMode] = useState<'fit' | '100%'>('fit');
  const [windowWidth, setWindowWidth] = useState<number>(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );
  const paperRef = useRef<HTMLDivElement>(null);

  // Track viewport resize for responsive scaling
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Left Side Drawer state ('templates' open by default on desktop, closed by default on mobile)
  const [activeSidePanel, setActiveSidePanel] = useState<PreviewSidePanelType | null>(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 860) {
      return null;
    }
    return 'templates';
  });

  // Right Side Unified Audit & Gap Drawer state
  const [isAuditGapOpen, setIsAuditGapOpen] = useState<boolean>(false);
  const [auditGapTab, setAuditGapTab] = useState<'audit' | 'gap'>('audit');

  // Toggle between rendered sheet page (default) and raw markdown editor
  const [isEditingMarkdown, setIsEditingMarkdown] = useState<boolean>(false);

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
  }, [cvMarkdown, theme, palette, customColor, fontFamily, spacingDensity, pageFormat, isEditingMarkdown]);

  const isOverflowing = sheetHeight > targetPagePx + 8;
  const estimatedPages = isOverflowing ? Math.max(2, Math.ceil(sheetHeight / targetPagePx)) : 1;
  const overflowPercentage = isOverflowing ? Math.round(((sheetHeight - targetPagePx) / targetPagePx) * 100) : 0;

  const isMobile = windowWidth < 860;
  const canvasPadding = isMobile ? 24 : 48;
  const availableWidth = windowWidth - (isMobile ? 0 : (activeSidePanel ? 380 : 76)) - canvasPadding;
  const autoScale = Math.min(1, Math.max(0.35, availableWidth / targetPageWidthPx));
  const currentScale = zoomMode === 'fit' && isMobile ? autoScale : 1;

  const handleMagicAutoFit = () => {
    if (spacingDensity === 'spacious') {
      setSpacingDensity('standard');
    } else if (spacingDensity === 'standard') {
      setSpacingDensity('compact');
    } else if (fontFamily === 'serif' || fontFamily === 'mono') {
      setFontFamily('inter');
    }
  };

  const handleSaveToHistory = () => {
    handleSaveCurrentVersion();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleSaveAndExitMarkdown = () => {
    handleSaveToHistory();
    setIsEditingMarkdown(false);
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

  const onTriggerSystemPrintPdf = () => {
    handlePrintPdf(targetPdfName, pageFormat);
    triggerPrompt(2000);
  };

  return (
    <div className="preview-workspace-layout" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Top Studio Control Bar */}
      <StepPreviewToolbar
        activeTemplateName={activeTemplateMeta.name}
        onOpenTemplates={() => {
          setActiveSidePanel('templates');
          setIsAuditGapOpen(false);
        }}
        isEditingMarkdown={isEditingMarkdown}
        onToggleMarkdown={() => setIsEditingMarkdown(prev => !prev)}
        onSaveAndExitMarkdown={handleSaveAndExitMarkdown}
        onSaveVersion={handleSaveToHistory}
        savedSuccess={savedSuccess}
        onReTailor={handleGenerate}
        isGenerating={isGenerating}
        onDownloadPdf={onTriggerDirectDownloadPdf}
        onPrintPdf={onTriggerSystemPrintPdf}
        isExportingPdf={isExportingPdf}
        pageFormat={pageFormat}
        onPageFormatChange={setPageFormat}
        isOverflowing={isOverflowing}
        onAutoFit={handleMagicAutoFit}
      />

      {/* Main Studio Body: Vertical Left Rail + Side Drawer + Sheet Canvas + Right Audit/Gap Drawer */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, overflow: 'hidden', position: 'relative' }}>
        {/* 1. Left Tool Rail (Horizontal on mobile, vertical on desktop) */}
        <StepPreviewNavRail
          activeSidePanel={activeSidePanel}
          onToggleSidePanel={(panel: PreviewSidePanelType) => {
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
          isEditingMarkdown={isEditingMarkdown}
          onToggleMarkdown={() => setIsEditingMarkdown(prev => !prev)}
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
              zIndex: 45,
              boxShadow: { xs: '0 8px 32px rgba(0,0,0,0.5)', md: 'none' },
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
                  onClose={() => setActiveSidePanel(null)}
                />
              )}
            </React.Suspense>
          </Box>
        )}

        {/* 3. Main Center Canvas: Raw Markdown or Pristine Document Sheet */}
        <div className="preview-canvas-wrapper" style={{ position: 'relative', display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden', order: 1 }}>
          {isEditingMarkdown ? (
            <div className="split-pane-editor-full">
              <React.Suspense fallback={<StudioSkeleton variant="masterData" />}>
                <SplitMarkdownEditor
                  content={cvMarkdown}
                  onChange={setCvMarkdown}
                  onDownload={handleDownloadCvMarkdown}
                  fileName={`CV_${candidateName}.md`}
                />
              </React.Suspense>
            </div>
          ) : (
            <main className="preview-pane-canvas" style={{ position: 'relative' }}>
              <div
                className="paper-sheet-wrapper"
                style={{
                  width: isMobile && zoomMode === 'fit' ? `${targetPageWidthPx * currentScale}px` : `${targetPageWidthPx}px`,
                  height: isMobile && zoomMode === 'fit' && sheetHeight ? `${sheetHeight * currentScale}px` : 'auto',
                  transition: 'width 0.2s ease, height 0.2s ease',
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <div
                  ref={paperRef}
                  className={`paper-sheet ${overflowPercentage > 0 && overflowPercentage <= 25 ? 'compact-fit' : ''}`}
                  style={{
                    transform: isMobile && zoomMode === 'fit' ? `scale(${currentScale})` : 'none',
                    transformOrigin: 'top center',
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
                    />
                  </CvLiveEditProvider>
                </div>

                {/* Visual Page Break Marker only on actual overflow */}
                {isOverflowing && (
                  <div
                    className="page-break-guide"
                    style={{
                      top: isMobile && zoomMode === 'fit' ? `${targetPagePx * currentScale}px` : `${targetPagePx}px`,
                    }}
                  >
                    <span>✂️ {t('preview:toolbar.pageBoundary', 'Page 1 Boundary ({{format}} Standard)', { format: pageFormat.toUpperCase() })}</span>
                  </div>
                )}
              </div>
            </main>
          )}

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
              {t('target:actions.backToProfile', 'Back to Target Vacancy (Step 2)')}
            </Button>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              {!isEditingMarkdown && (
                <Chip
                  icon={<EditRoundedIcon sx={{ fontSize: '13px !important' }} />}
                  label="Live Hot Edit • Click text to edit & re-audit"
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
              )}

              {/* Zoom Mode Toggle on Mobile */}
              {isMobile && (
                <ButtonGroup size="small" variant="outlined">
                  <Button
                    variant={zoomMode === 'fit' ? 'contained' : 'outlined'}
                    onClick={() => setZoomMode('fit')}
                    sx={{ fontSize: '0.7rem', px: 1, py: 0.2 }}
                  >
                    Fit
                  </Button>
                  <Button
                    variant={zoomMode === '100%' ? 'contained' : 'outlined'}
                    onClick={() => setZoomMode('100%')}
                    sx={{ fontSize: '0.7rem', px: 1, py: 0.2 }}
                  >
                    100%
                  </Button>
                </ButtonGroup>
              )}

              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, display: { xs: 'none', sm: 'block' } }}>
                {t('preview:toolbar.pageFit', 'Estimated Length')}: <strong style={{ color: estimatedPages === 1 ? '#10b981' : '#f59e0b' }}>{estimatedPages} {estimatedPages === 1 ? `Page (${pageFormat.toUpperCase()})` : 'Pages'}</strong> • Height: {sheetHeight}px / {targetPagePx}px
              </Typography>
            </Box>
          </Paper>
        </div>

        {/* 4. Unified Right-Side Audit & Gap Drawer (Floating Pills when collapsed, Side Panel when expanded) */}
        {!isEditingMarkdown && (
          <React.Suspense fallback={null}>
            <PreviewAuditGapDrawer
              auditReport={auditReport}
              gapInfo={gapInfo}
              gapMarkdown={gapMarkdown}
              companyName={companyName}
              targetRole={targetRole}
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
        )}
      </Box>

      {/* One-Time Post-Export GitHub Star Satisfaction Toast */}
      <React.Suspense fallback={null}>
        <GitHubStarToast
          open={isPromptOpen}
          onClose={dismissPrompt}
          onStarClick={openGitHubAndDismiss}
        />
      </React.Suspense>
    </div>
  );
};
