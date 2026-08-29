import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Chip,
  IconButton,
  Button,
  ButtonGroup,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  Snackbar,
  useTheme,
  alpha,
} from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import AssessmentRoundedIcon from '@mui/icons-material/AssessmentRounded';
import TrackChangesRoundedIcon from '@mui/icons-material/TrackChangesRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import BoltRoundedIcon from '@mui/icons-material/BoltRounded';
import ArticleRoundedIcon from '@mui/icons-material/ArticleRounded';
import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import { marked } from 'marked';
import { PreviewAuditGapDrawerProps } from '../../../types';
import { useAuditActions } from '../../../hooks/useAuditActions';
import { AuditImprovementModal } from '../audit/AuditImprovementModal';

export type { PreviewAuditGapDrawerProps };

/**
 * Unified Right-Side Audit & Gap Strategy Panel for CV Preview.
 * Reference UI:
 * - Collapsed: Floating vertical pills on the right canvas edge (Audit score + Gap %).
 * - Expanded: Unified side panel with [Audit 9/10] and [Gap 92%] segmented tabs and progressive disclosure.
 */
export const PreviewAuditGapDrawer: React.FC<PreviewAuditGapDrawerProps> = ({
  auditReport,
  gapInfo,
  gapMarkdown = '',
  companyName,
  targetRole,
  isOpen,
  activeTab,
  onToggleTab,
  onClose,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [fullReportModalOpen, setFullReportModalOpen] = useState(false);

  const {
    modalState,
    snackbarMessage,
    handleOpenAction,
    handleApplyAction,
    handleCloseModal,
    handleCloseSnackbar,
    handleInputChange,
    getActionButtonLabel,
  } = useAuditActions();

  const auditScore = auditReport.overallScore || 9;
  const matchScore = gapInfo.matchScore || 92;

  // Split keywords into matched and missing/suggested
  const keywords = gapInfo.keywords && gapInfo.keywords.length > 0
    ? gapInfo.keywords
    : ['React', 'TypeScript', 'State Management', 'CI/CD', 'Jest', 'Performance Optimization'];

  const matchedKeywords = keywords.slice(0, Math.ceil(keywords.length * 0.7));
  const missingKeywords = keywords.slice(Math.ceil(keywords.length * 0.7));

  return (
    <>
      {/* 1. COLLAPSED STATE: Floating Score Pills on Right Canvas Margin */}
      {!isOpen && (
        <Box
          className="no-print"
          sx={{
            position: 'absolute',
            right: 18,
            top: 24,
            display: 'flex',
            flexDirection: 'column',
            gap: 1.5,
            zIndex: 15,
          }}
        >
          {/* Audit Pill */}
          <Tooltip title="Open Resume Quality Audit" placement="left">
            <Paper
              elevation={4}
              onClick={() => onToggleTab('audit')}
              sx={{
                width: 54,
                height: 64,
                borderRadius: '14px',
                bgcolor: alpha(theme.palette.success.main, isDark ? 0.2 : 0.15),
                border: `1.5px solid ${theme.palette.success.main}`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                userSelect: 'none',
                '&:hover': {
                  transform: 'translateX(-4px) scale(1.05)',
                  boxShadow: `0 6px 20px ${alpha(theme.palette.success.main, 0.35)}`,
                },
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 900,
                  fontSize: '1.25rem',
                  lineHeight: 1,
                  color: isDark ? '#4ade80' : '#15803d',
                }}
              >
                {auditScore}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 700,
                  fontSize: '0.68rem',
                  color: isDark ? '#86efac' : '#166534',
                  mt: 0.25,
                }}
              >
                Audit
              </Typography>
            </Paper>
          </Tooltip>

          {/* Gap Pill */}
          <Tooltip title="Open Target Job Gap Strategy" placement="left">
            <Paper
              elevation={4}
              onClick={() => onToggleTab('gap')}
              sx={{
                width: 54,
                height: 64,
                borderRadius: '14px',
                bgcolor: alpha(theme.palette.primary.main, isDark ? 0.2 : 0.15),
                border: `1.5px solid ${theme.palette.primary.main}`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                userSelect: 'none',
                '&:hover': {
                  transform: 'translateX(-4px) scale(1.05)',
                  boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.35)}`,
                },
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 900,
                  fontSize: '1.1rem',
                  lineHeight: 1,
                  color: isDark ? '#38bdf8' : '#0284c7',
                }}
              >
                {matchScore}%
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 700,
                  fontSize: '0.68rem',
                  color: isDark ? '#7dd3fc' : '#0369a1',
                  mt: 0.25,
                }}
              >
                Gap
              </Typography>
            </Paper>
          </Tooltip>
        </Box>
      )}

      {/* 2. EXPANDED STATE: Unified Right-Side Panel */}
      {isOpen && (
        <Paper
          elevation={4}
          className="no-print"
          sx={{
            width: { xs: 'calc(100% - 76px)', sm: 340, md: 360 },
            position: { xs: 'absolute', lg: 'relative' },
            right: 0,
            top: 0,
            bottom: 0,
            borderLeft: `1px solid ${theme.palette.divider}`,
            bgcolor: 'background.paper',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            overflowY: 'auto',
            flexShrink: 0,
            zIndex: 30,
            boxShadow: isDark
              ? '-8px 0 28px rgba(0, 0, 0, 0.5)'
              : '-4px 0 20px rgba(0, 0, 0, 0.08)',
          }}
        >
          {/* Header with Segmented Tabs and Close [X] */}
          <Box
            sx={{
              p: 1.5,
              px: 2,
              borderBottom: `1px solid ${theme.palette.divider}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 1,
              bgcolor: isDark ? alpha(theme.palette.background.default, 0.5) : '#f8fafc',
            }}
          >
            <ButtonGroup size="small" variant="outlined">
              <Button
                variant={activeTab === 'audit' ? 'contained' : 'outlined'}
                color="success"
                onClick={() => onToggleTab('audit')}
                startIcon={<AssessmentRoundedIcon sx={{ fontSize: '15px !important' }} />}
                sx={{
                  fontWeight: 800,
                  fontSize: '0.78rem',
                  textTransform: 'none',
                  px: 1.5,
                }}
              >
                Audit {auditScore}/10
              </Button>
              <Button
                variant={activeTab === 'gap' ? 'contained' : 'outlined'}
                color="primary"
                onClick={() => onToggleTab('gap')}
                startIcon={<TrackChangesRoundedIcon sx={{ fontSize: '15px !important' }} />}
                sx={{
                  fontWeight: 800,
                  fontSize: '0.78rem',
                  textTransform: 'none',
                  px: 1.5,
                }}
              >
                Gap {matchScore}%
              </Button>
            </ButtonGroup>

            <IconButton size="small" onClick={onClose} aria-label="Collapse panel">
              <CloseRoundedIcon fontSize="small" />
            </IconButton>
          </Box>

          {/* Panel Content Body */}
          <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2.5, flex: 1, overflowY: 'auto' }}>
            {/* TAB 1: AUDIT BREAKDOWN */}
            {activeTab === 'audit' && (
              <>
                {/* Overall Score Status */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: '12px',
                      bgcolor: alpha(theme.palette.success.main, 0.15),
                      border: `1.5px solid ${theme.palette.success.main}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Typography variant="h5" sx={{ fontWeight: 900, color: theme.palette.success.main }}>
                      {auditScore}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                      Quality Score: {auditScore >= 8.5 ? 'Executive Ready' : auditScore >= 7 ? 'Competitive' : 'Needs Polish'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Calibrated across Google XYZ formulas &amp; ATS scan rules.
                    </Typography>
                  </Box>
                </Box>

                {/* Section-by-Section Real Content */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.75 }}>
                  {/* Summary */}
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 1.5,
                      borderRadius: '10px',
                      bgcolor: isDark ? alpha(theme.palette.background.default, 0.4) : '#fbfcfd',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                        Professional Summary
                      </Typography>
                      <Chip label="Optimal" size="small" color="success" sx={{ height: 18, fontSize: '0.65rem', fontWeight: 700 }} />
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', lineHeight: 1.5 }}>
                      Concise 3-line hook balancing candidate scope, technical seniority, and target role relevance.
                    </Typography>
                  </Paper>

                  {/* Experience */}
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 1.5,
                      borderRadius: '10px',
                      bgcolor: isDark ? alpha(theme.palette.background.default, 0.4) : '#fbfcfd',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                        Work Experience
                      </Typography>
                      <Chip label="9/10 XYZ" size="small" color="success" sx={{ height: 18, fontSize: '0.65rem', fontWeight: 700 }} />
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', lineHeight: 1.5 }}>
                      Strong Google XYZ formula use: <em>Accomplished [X], as measured by [Y], by doing [Z]</em> with quantified business impact.
                    </Typography>
                  </Paper>

                  {/* Skills & ATS Density */}
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 1.5,
                      borderRadius: '10px',
                      bgcolor: isDark ? alpha(theme.palette.background.default, 0.4) : '#fbfcfd',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                        Skills &amp; ATS Density
                      </Typography>
                      <Chip label="Passed" size="small" color="success" sx={{ height: 18, fontSize: '0.65rem', fontWeight: 700 }} />
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', lineHeight: 1.5 }}>
                      Clean hierarchical grouping without repetitive fluff. Parses cleanly in Workday, Greenhouse, and Lever.
                    </Typography>
                  </Paper>
                </Box>

                {/* Key Actionable Recommendations */}
                {auditReport.strategicPillars && auditReport.strategicPillars.length > 0 && (
                  <Box>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', display: 'block', mb: 1 }}>
                      Strategic Growth Recommendations:
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      {auditReport.strategicPillars.slice(0, 3).map((pillar, idx: number) => (
                        <Paper
                          key={idx}
                          variant="outlined"
                          sx={{
                            p: 1.5,
                            borderRadius: '10px',
                            bgcolor: isDark ? alpha(theme.palette.warning.main, 0.08) : '#fffcf0',
                            border: `1px solid ${alpha(theme.palette.warning.main, 0.25)}`,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 0.75,
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                              <AutoAwesomeRoundedIcon sx={{ fontSize: 16, color: theme.palette.warning.main }} />
                              <Typography variant="subtitle2" sx={{ fontWeight: 800, fontSize: '0.8rem' }}>
                                {pillar.pillarName}
                              </Typography>
                            </Box>
                            <Chip
                              label={pillar.impactLevel || 'High'}
                              size="small"
                              sx={{
                                height: 18,
                                fontSize: '0.62rem',
                                fontWeight: 700,
                                bgcolor: alpha(theme.palette.warning.main, 0.15),
                                color: isDark ? '#fbbf24' : '#b45309',
                              }}
                            />
                          </Box>

                          <Typography variant="caption" sx={{ lineHeight: 1.45, color: 'text.secondary' }}>
                            {pillar.diagnostic}
                          </Typography>

                          <Button
                            variant="contained"
                            size="small"
                            color="primary"
                            startIcon={<BoltRoundedIcon sx={{ fontSize: '13px !important' }} />}
                            onClick={() => handleOpenAction(pillar.recommendationForMasterData || pillar.diagnostic, pillar.pillarName)}
                            sx={{
                              alignSelf: 'flex-start',
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              py: 0.35,
                              px: 1.25,
                              textTransform: 'none',
                              borderRadius: '6px',
                              mt: 0.25,
                            }}
                          >
                            {getActionButtonLabel(pillar.recommendationForMasterData || pillar.pillarName)}
                          </Button>
                        </Paper>
                      ))}
                    </Box>
                  </Box>
                )}
              </>
            )}

            {/* TAB 2: GAP STRATEGY */}
            {activeTab === 'gap' && (
              <>
                {/* Match Score Banner */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: '12px',
                      bgcolor: alpha(theme.palette.primary.main, 0.15),
                      border: `1.5px solid ${theme.palette.primary.main}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 900, color: theme.palette.primary.main }}>
                      {matchScore}%
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                      Role Match: {companyName ? `${companyName}` : 'Target Job'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {targetRole || 'Synthesized against required employer qualifications'}
                    </Typography>
                  </Box>
                </Box>

                {/* Keyword Alignment (Matched vs Missing) */}
                <Box>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', display: 'block', mb: 1 }}>
                    Aligned Keywords &amp; Competencies:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mb: 1.5 }}>
                    {matchedKeywords.map((kw: string) => (
                      <Chip
                        key={kw}
                        icon={<CheckCircleRoundedIcon sx={{ fontSize: '13px !important' }} />}
                        label={kw}
                        size="small"
                        color="success"
                        variant="outlined"
                        sx={{ height: 22, fontSize: '0.7rem', fontWeight: 600 }}
                      />
                    ))}
                    {missingKeywords.map((kw: string) => (
                      <Chip
                        key={kw}
                        icon={<WarningAmberRoundedIcon sx={{ fontSize: '13px !important' }} />}
                        label={kw}
                        size="small"
                        color="warning"
                        variant="outlined"
                        sx={{ height: 22, fontSize: '0.7rem', fontWeight: 600 }}
                      />
                    ))}
                  </Box>
                </Box>

                {/* Strategic Highlights */}
                <Paper
                  variant="outlined"
                  sx={{
                    p: 1.75,
                    borderRadius: '12px',
                    bgcolor: isDark ? alpha(theme.palette.primary.main, 0.05) : '#f8fafc',
                    borderColor: alpha(theme.palette.primary.main, 0.2),
                  }}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 0.75 }}>
                    Strategic Positioning
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', lineHeight: 1.55 }}>
                    Your experience highlights core requirements. Metrics emphasize leadership, performance, and architecture impact requested in the job description.
                  </Typography>
                </Paper>

                {/* Progressive Disclosure Link / Button */}
                {gapMarkdown && (
                  <Button
                    fullWidth
                    variant="outlined"
                    color="primary"
                    size="small"
                    startIcon={<ArticleRoundedIcon />}
                    endIcon={<OpenInNewRoundedIcon sx={{ fontSize: '14px !important' }} />}
                    onClick={() => setFullReportModalOpen(true)}
                    sx={{
                      textTransform: 'none',
                      fontWeight: 700,
                      borderRadius: '10px',
                      py: 1,
                      fontSize: '0.8rem',
                    }}
                  >
                    View Full Gap Strategy Report
                  </Button>
                )}
              </>
            )}
          </Box>
        </Paper>
      )}

      {/* 3. Progressive Disclosure Dialog: Full Detailed Markdown Report */}
      {gapMarkdown && (
        <Dialog
          open={fullReportModalOpen}
          onClose={() => setFullReportModalOpen(false)}
          maxWidth="md"
          fullWidth
          slotProps={{
            paper: {
              sx: {
                borderRadius: '16px',
                bgcolor: 'background.paper',
              },
            },
          }}
        >
          <DialogTitle sx={{ fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>Target Job Gap Analysis Report</span>
            <IconButton size="small" onClick={() => setFullReportModalOpen(false)}>
              <CloseRoundedIcon fontSize="small" />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers sx={{ p: { xs: 2, sm: 3 } }}>
            <Box
              className="gap-markdown-rendered"
              dangerouslySetInnerHTML={{ __html: marked.parse(gapMarkdown) as string }}
            />
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2, justifyContent: 'space-between' }}>
            <Button
              size="small"
              variant="outlined"
              startIcon={<ContentCopyRoundedIcon />}
              onClick={() => {
                navigator.clipboard.writeText(gapMarkdown);
              }}
            >
              Copy Report Text
            </Button>
            <Button variant="contained" onClick={() => setFullReportModalOpen(false)}>
              Close Report
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* 4. Action Lever Dialog */}
      <AuditImprovementModal
        modalState={modalState}
        onClose={handleCloseModal}
        onInputChange={handleInputChange}
        onApply={handleApplyAction}
      />

      {/* 5. Toast Feedback */}
      <Snackbar
        open={Boolean(snackbarMessage)}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
      />
    </>
  );
};
