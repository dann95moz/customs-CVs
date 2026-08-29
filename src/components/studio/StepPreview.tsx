import React, { useRef, useState, useEffect } from 'react';
import {
  Paper,
  Box,
  Button,
  Typography,
  useTheme,
} from '@mui/material';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import {
  useResumeStore,
  useParsedCv,
  useParsedMasterCv,
  useAuditReport,
  useGapInfo,
} from '../../store';
import { CVRenderer } from '../CVRenderer';
import { SplitMarkdownEditor } from './SplitMarkdownEditor';
import { extractCandidateName, sanitizeFileName } from '../../core/parser';
import { getTemplateMetadata } from '../../templates';
import { usePrintPdf } from '../../hooks/usePrintPdf';
import { StepPreviewToolbar } from './preview/StepPreviewToolbar';
import { StepPreviewNavRail } from './preview/StepPreviewNavRail';
import { PreviewViewMode, PreviewSidePanelType, StepPreviewProps } from '../../types';
import { TemplatesPanel } from './preview/TemplatesPanel';
import { DesignFormattingPanel } from './preview/DesignFormattingPanel';
import { PreviewQualityAuditPanel } from './preview/PreviewQualityAuditPanel';
import { PreviewAuditGapDrawer } from './preview/PreviewAuditGapDrawer';
import { PreviewComparisonView } from './preview/PreviewComparisonView';
import { DOCUMENT_DIMENSIONS } from '../../theme/dimensions';

export type { StepPreviewProps };

const A4_PAGE_PX = DOCUMENT_DIMENSIONS.pageHeightPx; // Exact A4 height at 96 DPI

/**
 * Step 3: Master CV Preview & PDF Export Studio.
 * Composes dedicated components adhering to Single Responsibility and DRY.
 */
export const StepPreview: React.FC<StepPreviewProps> = () => {
  const muiTheme = useTheme();
  const { handleDownloadPdf } = usePrintPdf();

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
  const isGenerating = useResumeStore((s) => s.isGenerating);
  const handleGenerate = useResumeStore((s) => s.handleGenerate);
  const handleDownloadCvMarkdown = useResumeStore((s) => s.handleDownloadCvMarkdown);
  const gapMarkdown = useResumeStore((s) => s.gapMarkdown);
  const handleSaveCurrentVersion = useResumeStore((s) => s.handleSaveCurrentVersion);
  const setWizardStep = useResumeStore((s) => s.setWizardStep);

  // Derived parsed and audit data via memoized hooks
  const parsedCv = useParsedCv();
  const parsedMasterCv = useParsedMasterCv();
  const auditReport = useAuditReport();
  const gapInfo = useGapInfo();



  const [viewMode, setViewMode] = useState<PreviewViewMode>('tailored');
  const [sheetHeight, setSheetHeight] = useState<number>(0);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const paperRef = useRef<HTMLDivElement>(null);

  // Left Side Drawer state ('templates' open by default)
  const [activeSidePanel, setActiveSidePanel] = useState<PreviewSidePanelType | null>('templates');

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
  }, [cvMarkdown, theme, palette, customColor, fontFamily, spacingDensity, isEditingMarkdown, viewMode]);

  const estimatedPages = Math.max(1, Math.ceil((sheetHeight - 24) / A4_PAGE_PX));
  const overflowPercentage = Math.max(0, Math.round(((sheetHeight - A4_PAGE_PX) / A4_PAGE_PX) * 100));

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
    (viewMode === 'generic' ? parsedMasterCv.name : parsedCv.name) || extractCandidateName(masterData, 'Candidate')
  );
  const cleanCompany = sanitizeFileName(companyName || 'Target');
  const targetPdfName = `CV_${candidateName}_${cleanCompany}.pdf`;

  const onTriggerPrintPdf = () => {
    handleDownloadPdf(targetPdfName);
  };

  return (
    <div className="preview-workspace-layout" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Top Studio Control Bar */}
      <StepPreviewToolbar
        viewMode={viewMode}
        onViewModeChange={(mode: PreviewViewMode) => {
          setViewMode(mode);
          setIsEditingMarkdown(false);
        }}
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
        onDownloadPdf={onTriggerPrintPdf}
      />

      {/* Main Studio Body: Vertical Left Rail + Side Drawer + Sheet Canvas + Right Audit/Gap Drawer */}
      <Box sx={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>
        {/* 1. Left Vertical Tool Rail */}
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
              left: { xs: 76, md: 'auto' },
              top: 0,
              bottom: 0,
              width: { xs: 'calc(100% - 76px)', sm: 330 },
              maxWidth: 360,
              borderRight: `1px solid ${muiTheme.palette.divider}`,
              bgcolor: 'background.paper',
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              overflowY: 'auto',
              flexShrink: 0,
              zIndex: 35,
              boxShadow: { xs: '4px 0 24px rgba(0,0,0,0.3)', md: 'none' },
            }}
          >
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
                sheetHeight={sheetHeight}
                a4PagePx={A4_PAGE_PX}
                estimatedPages={estimatedPages}
                onClose={() => setActiveSidePanel(null)}
              />
            )}
          </Box>
        )}

        {/* 3. Main Center Canvas: Raw Markdown or Pristine Document Sheet */}
        <div className="preview-canvas-wrapper" style={{ position: 'relative', display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
          {isEditingMarkdown ? (
            <div className="split-pane-editor-full">
              <SplitMarkdownEditor
                content={viewMode === 'generic' ? masterData : cvMarkdown}
                onChange={viewMode === 'generic' ? () => {} : setCvMarkdown}
                onDownload={handleDownloadCvMarkdown}
                fileName={`CV_${extractCandidateName(masterData, 'Candidate')}.md`}
              />
            </div>
          ) : viewMode === 'compare' ? (
            <PreviewComparisonView
              parsedMasterCv={parsedMasterCv}
              parsedCv={parsedCv}
              theme={theme}
              palette={palette}
              customColor={palette === 'custom' ? customColor : undefined}
              fontFamily={fontFamily}
              spacingDensity={spacingDensity}
              companyName={companyName}
              matchScore={gapInfo.matchScore}
              keywordsCount={gapInfo.keywords.length}
            />
          ) : (
            <main className="preview-pane-canvas" style={{ position: 'relative' }}>
              <div className="paper-sheet-wrapper">
                <div
                  ref={paperRef}
                  className={`paper-sheet ${overflowPercentage > 0 && overflowPercentage <= 25 ? 'compact-fit' : ''}`}
                >
                  <CVRenderer
                    data={viewMode === 'generic' ? parsedMasterCv : parsedCv}
                    theme={theme}
                    palette={palette}
                    customColor={palette === 'custom' ? customColor : undefined}
                    fontFamily={fontFamily}
                    spacingDensity={spacingDensity}
                  />
                </div>

                {/* Visual Page Break Marker at A4 limit */}
                {sheetHeight > A4_PAGE_PX - 30 && (
                  <div className="page-break-guide" style={{ top: `${A4_PAGE_PX}px` }}>
                    <span>✂️ Page 1 Boundary (Standard A4 Format)</span>
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
              p: 1.5,
              px: 3,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
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
            >
              Back to Target Vacancy (Step 2)
            </Button>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, display: { xs: 'none', sm: 'block' } }}>
                Estimated Length: <strong style={{ color: estimatedPages === 1 ? '#10b981' : '#f59e0b' }}>{estimatedPages} {estimatedPages === 1 ? 'Page (Standard A4)' : 'Pages'}</strong> • Height: {sheetHeight}px
              </Typography>
            </Box>
          </Paper>
        </div>

        {/* 4. Unified Right-Side Audit & Gap Drawer (Floating Pills when collapsed, Side Panel when expanded) */}
        {!isEditingMarkdown && viewMode !== 'compare' && (
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
        )}
      </Box>
    </div>
  );
};
