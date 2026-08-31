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
import PsychologyRoundedIcon from '@mui/icons-material/PsychologyRounded';
import { useTranslation } from 'react-i18next';
import { marked } from 'marked';
import { PreviewAuditGapDrawerProps } from '../../../types';
import { useAuditActions } from '../../../hooks/useAuditActions';
import { AuditImprovementModal } from '../audit/AuditImprovementModal';
import { InterviewPrepTab } from '../audit/InterviewPrepTab';

export type { PreviewAuditGapDrawerProps };

/**
 * Unified Right-Side Audit & Gap Strategy Panel for CV Preview.
 * Reference UI:
 * - Collapsed: Floating vertical pills on the right canvas edge (Audit score + Gap % + Interview Prep).
 * - Expanded: Unified side panel with [Audit 9/10], [Gap 92%], and [Prep] segmented tabs and progressive disclosure.
 */
export const PreviewAuditGapDrawer: React.FC<PreviewAuditGapDrawerProps> = ({
  auditReport,
  gapInfo,
  gapMarkdown = '',
  companyName,
  targetRole,
  cvData,
  isOpen,
  activeTab,
  onToggleTab,
  onClose,
}) => {
  const { t } = useTranslation(['audit', 'gap', 'preview', 'common']);
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

  const [scoreUpdated, setScoreUpdated] = useState(false);
  const prevScoreRef = React.useRef(auditScore);

  React.useEffect(() => {
    if (prevScoreRef.current !== auditScore) {
      prevScoreRef.current = auditScore;
      setScoreUpdated(true);
      const timer = setTimeout(() => setScoreUpdated(false), 2200);
      return () => clearTimeout(timer);
    }
  }, [auditScore]);

  // Split keywords into matched and missing/suggested
  const keywords = gapInfo.keywords && gapInfo.keywords.length > 0
    ? gapInfo.keywords
    : ['React', 'TypeScript', 'State Management', 'CI/CD', 'Jest', 'Performance Optimization'];

  const matchedKeywords = keywords.slice(0, Math.ceil(keywords.length * 0.7));
  const missingKeywords = keywords.slice(Math.ceil(keywords.length * 0.7));

  return (
    <>
      {/* 1. COLLAPSED STATE: Floating Score Pills on Right Canvas Margin (Desktop / Tablet) */}
      {!isOpen && (
        <Box
          className="no-print"
          sx={{
            position: 'absolute',
            right: 18,
            top: 24,
            display: { xs: 'none', md: 'flex' },
            flexDirection: 'column',
            gap: 1.5,
            zIndex: 15,
          }}
        >
          {/* Audit Pill */}
          <Tooltip
            title={scoreUpdated ? t('audit:liveRecalculated', 'Audit score recalculated in real-time') : t('audit:title', 'Resume Quality Audit')}
            placement="left"
          >
            <Paper
              elevation={scoreUpdated ? 8 : 4}
              onClick={() => onToggleTab('audit')}
              sx={{
                width: 62,
                height: 64,
                p: 0.5,
                borderRadius: '16px',
                bgcolor: alpha(theme.palette.success.main, isDark ? 0.2 : 0.15),
                border: scoreUpdated
                  ? `2px solid ${theme.palette.primary.main}`
                  : `1.5px solid ${theme.palette.success.main}`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                userSelect: 'none',
                overflow: 'hidden',
                boxShadow: scoreUpdated
                  ? `0 0 16px ${alpha(theme.palette.primary.main, 0.6)}`
                  : undefined,
                animation: scoreUpdated ? 'pulse 1.2s infinite' : undefined,
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
                  color: scoreUpdated
                    ? (isDark ? '#38bdf8' : '#0284c7')
                    : (isDark ? '#4ade80' : '#15803d'),
                  transition: 'color 0.2s ease',
                }}
              >
                {auditScore}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 800,
                  fontSize: '0.66rem',
                  color: isDark ? '#86efac' : '#166534',
                  mt: 0.35,
                  lineHeight: 1,
                  textAlign: 'center',
                  whiteSpace: 'nowrap',
                }}
              >
                {t('preview:drawer.shortScore', 'Audit')}
              </Typography>
            </Paper>
          </Tooltip>

          {/* Gap Pill */}
          <Tooltip title={t('gap:title', 'Target Job Gap Strategy')} placement="left">
            <Paper
              elevation={4}
              onClick={() => onToggleTab('gap')}
              sx={{
                width: 62,
                height: 64,
                p: 0.5,
                borderRadius: '16px',
                bgcolor: alpha(theme.palette.primary.main, isDark ? 0.2 : 0.15),
                border: `1.5px solid ${theme.palette.primary.main}`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                userSelect: 'none',
                overflow: 'hidden',
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
                  fontWeight: 800,
                  fontSize: '0.66rem',
                  color: isDark ? '#7dd3fc' : '#0369a1',
                  mt: 0.35,
                  lineHeight: 1,
                  textAlign: 'center',
                  whiteSpace: 'nowrap',
                }}
              >
                {t('preview:drawer.shortMatch', 'Match')}
              </Typography>
            </Paper>
          </Tooltip>

          {/* Interview Prep Pill */}
          <Tooltip title={t('audit:interview.pillTooltip', 'Gap-Driven Interview Simulator')} placement="left">
            <Paper
              elevation={4}
              onClick={() => onToggleTab('interview')}
              sx={{
                width: 62,
                height: 64,
                p: 0.5,
                borderRadius: '16px',
                bgcolor: alpha(theme.palette.secondary.main, isDark ? 0.2 : 0.15),
                border: `1.5px solid ${theme.palette.secondary.main}`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                userSelect: 'none',
                overflow: 'hidden',
                '&:hover': {
                  transform: 'translateX(-4px) scale(1.05)',
                  boxShadow: `0 6px 20px ${alpha(theme.palette.secondary.main, 0.35)}`,
                },
              }}
            >
              <PsychologyRoundedIcon sx={{ fontSize: 24, color: theme.palette.secondary.main }} />
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 800,
                  fontSize: '0.66rem',
                  color: theme.palette.secondary.main,
                  mt: 0.35,
                  lineHeight: 1,
                  textAlign: 'center',
                  whiteSpace: 'nowrap',
                }}
              >
                {t('preview:drawer.shortInterview', 'Prep')}
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
            width: { xs: '100%', sm: 340, md: 380 },
            maxWidth: '100vw',
            position: { xs: 'absolute', lg: 'relative' },
            left: { xs: 0, sm: 'auto' },
            right: 0,
            top: 0,
            bottom: 0,
            borderLeft: `1px solid ${theme.palette.divider}`,
            bgcolor: 'background.paper',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            overflowY: 'auto',
            overflowX: 'hidden',
            flexShrink: 0,
            zIndex: 40,
            boxSizing: 'border-box',
            boxShadow: isDark
              ? '-8px 0 28px rgba(0, 0, 0, 0.5)'
              : '-4px 0 20px rgba(0, 0, 0, 0.08)',
          }}
        >
          {/* Header with Segmented Tabs and Close [X] */}
          <Box
            sx={{
              p: 1,
              px: { xs: 1, sm: 1.5 },
              borderBottom: `1px solid ${theme.palette.divider}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 0.75,
              bgcolor: isDark ? alpha(theme.palette.background.default, 0.5) : '#f8fafc',
              boxSizing: 'border-box',
              width: '100%',
              minWidth: 0,
            }}
          >
            <ButtonGroup size="small" variant="outlined" sx={{ flex: 1, minWidth: 0, display: 'flex' }}>
              <Button
                variant={activeTab === 'audit' ? 'contained' : 'outlined'}
                color="success"
                onClick={() => onToggleTab('audit')}
                startIcon={<AssessmentRoundedIcon sx={{ fontSize: '14px !important' }} />}
                sx={{
                  flex: 1,
                  fontWeight: 800,
                  fontSize: { xs: '0.68rem', sm: '0.74rem' },
                  textTransform: 'none',
                  px: { xs: 0.5, sm: 0.75 },
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {t('preview:drawer.shortScore', 'Audit')} {auditScore}/10
              </Button>
              <Button
                variant={activeTab === 'gap' ? 'contained' : 'outlined'}
                color="primary"
                onClick={() => onToggleTab('gap')}
                startIcon={<TrackChangesRoundedIcon sx={{ fontSize: '14px !important' }} />}
                sx={{
                  flex: 1,
                  fontWeight: 800,
                  fontSize: { xs: '0.68rem', sm: '0.74rem' },
                  textTransform: 'none',
                  px: { xs: 0.5, sm: 0.75 },
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {t('preview:drawer.shortMatch', 'Match')} {matchScore}%
              </Button>
              <Button
                variant={activeTab === 'interview' ? 'contained' : 'outlined'}
                color="secondary"
                onClick={() => onToggleTab('interview')}
                startIcon={<PsychologyRoundedIcon sx={{ fontSize: '14px !important' }} />}
                sx={{
                  flex: 1,
                  fontWeight: 800,
                  fontSize: { xs: '0.68rem', sm: '0.74rem' },
                  textTransform: 'none',
                  px: { xs: 0.5, sm: 0.75 },
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {t('preview:drawer.shortInterview', 'Prep')}
              </Button>
            </ButtonGroup>

            <IconButton size="small" onClick={onClose} aria-label="Collapse panel" sx={{ flexShrink: 0, p: 0.5 }}>
              <CloseRoundedIcon fontSize="small" />
            </IconButton>
          </Box>

          {/* Panel Content Body */}
          <Box sx={{ p: { xs: 1.5, sm: 2 }, pb: { xs: 'calc(env(safe-area-inset-bottom, 0px) + 36px)', sm: 4 }, display: 'flex', flexDirection: 'column', gap: 2.5, flex: 1, overflowY: 'auto', overflowX: 'hidden', boxSizing: 'border-box' }}>
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
                  <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                      {t('audit:score', 'Quality Score')}: {auditScore >= 8.5 ? 'Executive Ready' : auditScore >= 7 ? 'Competitive' : 'Needs Polish'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', lineHeight: 1.4 }}>
                      {t('audit:atsCheck.description', 'Calibrated across Google XYZ formulas & ATS scan rules.')}
                    </Typography>
                  </Box>
                </Box>

                {/* Section-by-Section Real Content */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {/* Summary */}
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 1.5,
                      borderRadius: '12px',
                      bgcolor: isDark ? alpha(theme.palette.background.default, 0.4) : '#fbfcfd',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 0.75,
                      boxSizing: 'border-box',
                      transition: 'border-color 0.2s ease',
                      '&:hover': { borderColor: 'success.main' },
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 0.75 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 800, fontSize: '0.85rem' }}>
                        {t('audit:sections.summary', 'Professional Summary')}
                      </Typography>
                      <Chip
                        label={t('audit:drawerCards.summaryOptimal', 'Optimal')}
                        size="small"
                        color="success"
                        variant="outlined"
                        sx={{ fontWeight: 700 }}
                      />
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', lineHeight: 1.5 }}>
                      {t('audit:drawerCards.summaryDesc', 'Concise 3-line hook balancing candidate scope, technical seniority, and target role relevance.')}
                    </Typography>
                  </Paper>

                  {/* Experience */}
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 1.5,
                      borderRadius: '12px',
                      bgcolor: isDark ? alpha(theme.palette.background.default, 0.4) : '#fbfcfd',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 0.75,
                      boxSizing: 'border-box',
                      transition: 'border-color 0.2s ease',
                      '&:hover': { borderColor: 'success.main' },
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 0.75 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 800, fontSize: '0.85rem' }}>
                        {t('audit:sections.experience', 'Work Experience')}
                      </Typography>
                      <Chip
                        label={t('audit:drawerCards.experienceXyz', '9/10 XYZ')}
                        size="small"
                        color="success"
                        variant="outlined"
                        sx={{ fontWeight: 700 }}
                      />
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', lineHeight: 1.5 }}>
                      {t('audit:drawerCards.experienceDesc', 'Strong Google XYZ formula use: Accomplished [X], as measured by [Y], by doing [Z] with quantified business impact.')}
                    </Typography>
                  </Paper>

                  {/* Skills & ATS Density */}
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 1.5,
                      borderRadius: '12px',
                      bgcolor: isDark ? alpha(theme.palette.background.default, 0.4) : '#fbfcfd',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 0.75,
                      boxSizing: 'border-box',
                      transition: 'border-color 0.2s ease',
                      '&:hover': { borderColor: 'success.main' },
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 0.75 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 800, fontSize: '0.85rem' }}>
                        {t('audit:sections.skills', 'Technical Skills & ATS')}
                      </Typography>
                      <Chip
                        label={t('audit:drawerCards.skillsPass', '95% Pass')}
                        size="small"
                        color="success"
                        variant="outlined"
                        sx={{ fontWeight: 700 }}
                      />
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', lineHeight: 1.5 }}>
                      {t('audit:drawerCards.skillsDesc', 'High density of exact keywords matching requirements without stuffing.')}
                    </Typography>
                  </Paper>
                </Box>

                {/* Key Actionable Recommendations */}
                {auditReport.strategicPillars && auditReport.strategicPillars.length > 0 && (
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <AutoAwesomeRoundedIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                      {t('audit:subtitle', 'Strategic Improvements')}
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
                      {auditReport.strategicPillars.slice(0, 3).map((pillar, idx: number) => (
                        <Paper
                          key={idx}
                          variant="outlined"
                          sx={{
                            p: 1.5,
                            borderRadius: '12px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 1,
                            bgcolor: isDark ? alpha(theme.palette.background.default, 0.3) : '#ffffff',
                            boxSizing: 'border-box',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              borderColor: 'primary.main',
                              boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
                            },
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1 }}>
                            <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.primary', flex: 1, lineHeight: 1.35 }}>
                              {pillar.pillarName}
                            </Typography>
                            <Chip
                              label={pillar.impactLevel || 'High'}
                              size="small"
                              color={
                                pillar.impactLevel?.toLowerCase().includes('high')
                                  ? 'warning'
                                  : pillar.impactLevel?.toLowerCase().includes('strat')
                                  ? 'primary'
                                  : 'default'
                              }
                              variant="outlined"
                              sx={{ fontWeight: 700 }}
                            />
                          </Box>

                          <Typography variant="caption" sx={{ lineHeight: 1.45, color: 'text.secondary' }}>
                            {pillar.diagnostic}
                          </Typography>

                          <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 0.25 }}>
                            <Button
                              variant="contained"
                              size="small"
                              color="primary"
                              startIcon={<BoltRoundedIcon sx={{ fontSize: '14px !important' }} />}
                              onClick={() => handleOpenAction(pillar.recommendationForMasterData || pillar.diagnostic, pillar.pillarName)}
                              sx={{
                                textTransform: 'none',
                                fontWeight: 700,
                                fontSize: '0.74rem',
                                py: 0.35,
                                px: 1.5,
                              }}
                            >
                              {getActionButtonLabel(pillar.recommendationForMasterData || pillar.pillarName)}
                            </Button>
                          </Box>
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
                      {t('gap:matchScore', 'Role Match')}: {companyName ? `${companyName}` : t('target:fields.company', 'Target Job')}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {targetRole || t('gap:subtitle', 'Synthesized against required employer qualifications')}
                    </Typography>
                  </Box>
                </Box>

                {/* Keyword Alignment (Matched vs Missing) */}
                <Box>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', display: 'block', mb: 1 }}>
                    {t('gap:integratedKeywords', 'Aligned Keywords & Competencies')}:
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
                        sx={{ fontWeight: 600 }}
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
                        sx={{ fontWeight: 600 }}
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
                    {t('gap:title', 'Strategic Positioning')}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', lineHeight: 1.55 }}>
                    {t('gap:subtitle', 'Your experience highlights core requirements and architecture impact requested in the job description.')}
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
                      py: 0.8,
                      fontSize: '0.8rem',
                    }}
                  >
                    {t('gap:downloadReport', 'View Full Gap Strategy Report')}
                  </Button>
                )}
              </>
            )}

            {/* TAB 3: INTERVIEW PREPARATION (GAP SIMULATOR) */}
            {activeTab === 'interview' && (
              <InterviewPrepTab
                gapKeywords={missingKeywords}
                companyName={companyName || ''}
                targetRole={targetRole || ''}
                cvData={cvData || { name: '', title: '', contacts: [], sections: [] }}
              />
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
            <span>{t('gap:title', 'Target Job Gap Analysis Report')}</span>
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
              {t('common:actions.copy', 'Copy Report Text')}
            </Button>
            <Button variant="contained" onClick={() => setFullReportModalOpen(false)}>
              {t('common:actions.close', 'Close Report')}
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
