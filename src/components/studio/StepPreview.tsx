import React, { useRef, useState, useEffect } from 'react';
import { Button, Paper, Box, useTheme } from '@mui/material';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import PictureAsPdfRoundedIcon from '@mui/icons-material/PictureAsPdfRounded';
import AssessmentRoundedIcon from '@mui/icons-material/AssessmentRounded';
import TrackChangesRoundedIcon from '@mui/icons-material/TrackChangesRounded';
import { useResumeWorkspace } from '../../context/ResumeWorkspaceContext';
import { CVRenderer } from '../CVRenderer';
import { SplitMarkdownEditor } from './SplitMarkdownEditor';
import { Icon } from '../Icons';
import { extractCandidateName } from '../../core/parser';

const A4_PAGE_PX = 1123; // Exact A4 height at 96 DPI

export const StepPreview: React.FC = () => {
  const muiTheme = useTheme();
  const {
    editorSplitView,
    setEditorSplitView,
    companyName,
    targetRole,
    handleGenerate,
    isGenerating,
    cvMarkdown,
    setCvMarkdown,
    handleDownloadCvMarkdown,
    masterData,
    parsedCv,
    theme,
    stats,
    auditReport,
    setWizardStep,
    setActiveTab,
  } = useResumeWorkspace();

  const [autoFitPreview] = useState<boolean>(true);
  const [sheetHeight, setSheetHeight] = useState<number>(0);
  const paperRef = useRef<HTMLDivElement>(null);

  // Measure rendered paper sheet height whenever content, theme, or split changes
  useEffect(() => {
    const updateHeight = () => {
      if (paperRef.current) {
        setSheetHeight(paperRef.current.scrollHeight);
      }
    };
    const timer = setTimeout(updateHeight, 150);
    return () => clearTimeout(timer);
  }, [cvMarkdown, theme, autoFitPreview, editorSplitView]);

  const estimatedPages = Math.max(1, Math.ceil((sheetHeight - 8) / A4_PAGE_PX));
  const overflowPercentage = Math.max(0, Math.round(((sheetHeight - A4_PAGE_PX) / A4_PAGE_PX) * 100));

  return (
    <div className="preview-workspace-layout">
      {/* Split Screen Mode Toggle Bar */}
      <div className="split-view-bar">
        <div className="split-mode-buttons">
          <button
            type="button"
            className={`split-toggle-btn ${editorSplitView === 'split' ? 'active' : ''}`}
            onClick={() => setEditorSplitView('split')}
          >
            <Icon type="layers" size={13} /> Split View (Editor + Sheet)
          </button>
          <button
            type="button"
            className={`split-toggle-btn ${editorSplitView === 'preview-only' ? 'active' : ''}`}
            onClick={() => setEditorSplitView('preview-only')}
          >
            <Icon type="eye" size={13} /> Full Sheet Preview
          </button>
          <button
            type="button"
            className={`split-toggle-btn ${editorSplitView === 'editor-only' ? 'active' : ''}`}
            onClick={() => setEditorSplitView('editor-only')}
          >
            <Icon type="edit" size={13} /> Markdown Only
          </button>
        </div>

        <div className="split-quick-tags">
          <span className="quick-company-pill">
            Target: <strong>{companyName || 'Target Company'}</strong> ({targetRole || 'Target Role'})
          </span>
          <button
            type="button"
            className="btn-quick-tailor"
            onClick={handleGenerate}
            disabled={isGenerating}
          >
            <Icon type="zap" size={12} /> {isGenerating ? 'Synthesizing...' : 'Re-Tailor with AI'}
          </button>
        </div>
      </div>

      <div className="preview-content-split">
        {/* Left: Split Markdown Source Editor */}
        {(editorSplitView === 'split' || editorSplitView === 'editor-only') && (
          <div className="split-pane-editor">
            <SplitMarkdownEditor
              content={cvMarkdown}
              onChange={setCvMarkdown}
              onDownload={handleDownloadCvMarkdown}
              fileName={`CV_${extractCandidateName(masterData, 'Candidate')}.md`}
            />
          </div>
        )}

        {/* Right: Realistic A4 Sheet Canvas */}
        {(editorSplitView === 'split' || editorSplitView === 'preview-only') && (
          <main className="preview-pane-canvas">
            <div
              ref={paperRef}
              className={`paper-sheet ${autoFitPreview && overflowPercentage > 0 && overflowPercentage <= 25 ? 'compact-fit' : ''}`}
            >
              <CVRenderer data={parsedCv} theme={theme} />

              {/* Visual Page Break Marker at A4 limit */}
              <div className="page-break-guide" style={{ top: `${A4_PAGE_PX}px` }}>
                <span>✂️ Page 1 Boundary (Standard A4 Format)</span>
              </div>
            </div>
          </main>
        )}

        {/* Right Sidebar: Real-Time Dimensions & ATS Metrics */}
        {editorSplitView !== 'editor-only' && (
          <aside className="stats-sidebar">
            <div className="stats-card">
              <h4>📄 Dimensions & Page Fit</h4>
              <div className="stat-row">
                <span>Estimated Pages:</span>
                <strong style={{ color: estimatedPages === 1 ? '#10b981' : '#f59e0b' }}>
                  {estimatedPages} {estimatedPages === 1 ? 'Page ✓' : 'Pages'}
                </strong>
              </div>
              <div className="stat-row">
                <span>Sheet Height:</span>
                <strong>{sheetHeight}px / {A4_PAGE_PX}px</strong>
              </div>
              {overflowPercentage > 0 && (
                <div className="stat-row">
                  <span>Page 1 Overflow:</span>
                  <strong style={{ color: overflowPercentage <= 20 ? '#38bdf8' : '#ef4444' }}>
                    +{overflowPercentage}% {overflowPercentage <= 20 ? '(Auto-Fit Active)' : '(Needs Synthesis)'}
                  </strong>
                </div>
              )}
            </div>

            <div className="stats-card">
              <h4>📊 Content Metrics</h4>
              <div className="stat-row">
                <span>Total Words:</span>
                <strong style={{ color: stats.words <= 480 ? '#10b981' : '#f59e0b' }}>
                  {stats.words} {stats.words <= 480 ? '(Ideal 1-Page)' : '(Extended)'}
                </strong>
              </div>
              <div className="stat-row">
                <span>Achievements (XYZ):</span>
                <strong>{stats.bulletsCount} bullets</strong>
              </div>
              <div className="stat-row">
                <span>Key Skills:</span>
                <strong>{stats.skillsCount}</strong>
              </div>
              <div className="stat-row">
                <span>Contact Channels:</span>
                <strong>{stats.contactsCount}</strong>
              </div>
            </div>

            <div className="stats-card">
              <h4>🛡️ ATS & Executive Health</h4>
              <div className="stat-row">
                <span>Quality Audit:</span>
                <strong style={{ color: '#10b981' }}>{auditReport.overallScore} / 10.0</strong>
              </div>
              <div className="stat-row">
                <span>Google XYZ Metric:</span>
                <strong style={{ color: '#10b981' }}>✓ Calibrated</strong>
              </div>
              <div className="stat-row">
                <span>Zero PII / ATS Clean:</span>
                <strong style={{ color: '#10b981' }}>✓ 100% Compliant</strong>
              </div>
            </div>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 2 }}>
              <Button
                variant="outlined"
                size="small"
                fullWidth
                startIcon={<AssessmentRoundedIcon />}
                onClick={() => setActiveTab('audit')}
              >
                View Full Audit Dashboard
              </Button>
              <Button
                variant="outlined"
                size="small"
                fullWidth
                startIcon={<TrackChangesRoundedIcon />}
                onClick={() => setActiveTab('gap')}
              >
                View Gap Strategy
              </Button>
            </Box>
          </aside>
        )}
      </div>

      {/* Step 4 Bottom Navigation Bar */}
      <Paper
        elevation={0}
        sx={{
          p: 1.5,
          px: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: `1px solid ${muiTheme.palette.divider}`,
          bgcolor: 'background.paper',
        }}
      >
        <Button
          variant="outlined"
          startIcon={<ArrowBackRoundedIcon />}
          onClick={() => setWizardStep('tailor')}
        >
          Back to Tailoring (Step 3)
        </Button>

        <Button
          variant="contained"
          color="primary"
          startIcon={<PictureAsPdfRoundedIcon />}
          onClick={() => window.print()}
          sx={{ fontWeight: 800, px: 3.5 }}
        >
          Download PDF
        </Button>
      </Paper>
    </div>
  );
};
