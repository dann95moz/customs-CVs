import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Button,
  ButtonGroup,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  Snackbar,
  Slide,
  Chip,
  useTheme,
  alpha,
} from '@mui/material';

import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import AssessmentRoundedIcon from '@mui/icons-material/AssessmentRounded';
import TrackChangesRoundedIcon from '@mui/icons-material/TrackChangesRounded';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import PsychologyRoundedIcon from '@mui/icons-material/PsychologyRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded';
import { useTranslation } from 'react-i18next';
import { safeMarkdown } from '../../../utils/sanitize';
import { PreviewAuditGapDrawerProps } from '../../../types';
import { HexagonRadarChart, RadarDimension } from '../../atoms/HexagonRadarChart';
import { useAuditActions } from '../../../hooks/useAuditActions';
import { useCopyToClipboard } from '../../../hooks/useCopyToClipboard';
import { AuditImprovementModal } from '../audit/AuditImprovementModal';
import { InterviewPrepTab } from '../audit/InterviewPrepTab';
import { AuditScoreHero } from '../audit/AuditScoreHero';
import { AuditPillarsBreakdown } from '../audit/AuditPillarsBreakdown';
import { AuditGapTabContent } from '../audit/AuditGapTabContent';

export type { PreviewAuditGapDrawerProps };

/**
 * Unified Right-Side Audit & Gap Strategy Panel for CV Preview.
 * Reference UI:
 * - Collapsed: Floating vertical pills on the right canvas edge (Audit score + Gap % + Interview Prep).
 * - Expanded: Unified side panel with [Audit 9/10], [Gap 92%], and [Prep] segmented tabs and progressive disclosure.
 */
export const PreviewAuditGapDrawer: React.FC<PreviewAuditGapDrawerProps> = React.memo(({
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
  onOpenFullAudit,
}) => {
  const { t } = useTranslation(['audit', 'gap', 'preview', 'common']);
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [fullReportModalOpen, setFullReportModalOpen] = useState(false);
  const { copied: isReportCopied, copy: copyReport } = useCopyToClipboard();

  const radarDimensions: RadarDimension[] = (auditReport.sections || []).map((sec) => {
    let shortLabel = sec.sectionName.split(' ')[0];
    if (sec.sectionName.includes('Header')) shortLabel = t('audit:dimensions.header', 'Contacto');
    else if (sec.sectionName.includes('Summary')) shortLabel = t('audit:dimensions.summary', 'Extracto');
    else if (sec.sectionName.includes('Skills')) shortLabel = t('audit:dimensions.skills', 'Habilidades');
    else if (sec.sectionName.includes('Experience')) shortLabel = t('audit:dimensions.experience', 'Impacto');
    else if (sec.sectionName.includes('Education')) shortLabel = t('audit:dimensions.education', 'Educación');
    else if (sec.sectionName.includes('Languages')) shortLabel = t('audit:dimensions.languages', 'Idiomas');
    else if (sec.sectionName.includes('Structure') || sec.sectionName.includes('Legibility')) shortLabel = t('audit:dimensions.structure', 'Estructura');

    return {
      key: sec.sectionName,
      label: shortLabel,
      score: sec.score,
      targetScore: sec.targetScore ?? 9.0,
      maxScore: 10,
      recommendation: sec.actionToTen?.[0] || sec.comment,
    };
  });

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

  const auditScore = auditReport.overallScore ?? 0;
  const matchScore = gapInfo.matchScore ?? 0;

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
  const keywords = gapInfo.keywords && gapInfo.keywords.length > 0 ? gapInfo.keywords : [];

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
                borderRadius: 2,
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
                    ? 'primary.main'
                    : 'success.main',
                }}
              >
                {auditScore > 0 ? auditScore : '--'}
              </Typography>
              <Typography variant="caption" sx={{ fontWeight: 800, fontSize: '0.62rem', letterSpacing: 0.5, color: 'text.secondary', textTransform: 'uppercase', mt: 0.35 }}>
                {t('preview:drawer.shortScore', 'Score')}
              </Typography>
            </Paper>
          </Tooltip>

          {/* Gap Pill */}
          <Tooltip title={t('gap:matchScore', 'ATS Keyword Alignment')} placement="left">
            <Paper
              elevation={4}
              onClick={() => onToggleTab('gap')}
              sx={{
                width: 62,
                height: 64,
                p: 0.5,
                borderRadius: 2,
                bgcolor: alpha(theme.palette.primary.main, isDark ? 0.2 : 0.12),
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
              <Typography variant="h6" sx={{ fontWeight: 900, fontSize: '1.15rem', lineHeight: 1, color: 'primary.main' }}>
                {matchScore > 0 ? `${matchScore}%` : '--'}
              </Typography>
              <Typography variant="caption" sx={{ fontWeight: 800, fontSize: '0.62rem', letterSpacing: 0.5, color: 'text.secondary', textTransform: 'uppercase', mt: 0.35 }}>
                {t('preview:drawer.shortMatch', 'Match')}
              </Typography>
            </Paper>
          </Tooltip>

          {/* Interview Prep Pill */}
          <Tooltip title={t('preview:drawer.interviewPrep', 'AI Interview Gap Simulator')} placement="left">
            <Paper
              elevation={4}
              onClick={() => onToggleTab('interview')}
              sx={{
                width: 62,
                height: 64,
                p: 0.5,
                borderRadius: 2,
                bgcolor: alpha(theme.palette.secondary.main, isDark ? 0.2 : 0.12),
                border: `1.5px solid ${theme.palette.secondary.main}`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                userSelect: 'none',
                '&:hover': {
                  transform: 'translateX(-4px) scale(1.05)',
                  boxShadow: `0 6px 20px ${alpha(theme.palette.secondary.main, 0.35)}`,
                },
              }}
            >
              <PsychologyRoundedIcon sx={{ fontSize: 20, color: theme.palette.secondary.main }} />
              <Typography variant="caption" sx={{ fontWeight: 800, fontSize: '0.62rem', letterSpacing: 0.5, color: 'text.secondary', textTransform: 'uppercase', mt: 0.35 }}>
                {t('preview:drawer.shortInterview', 'Prep')}
              </Typography>
            </Paper>
          </Tooltip>
        </Box>
      )}

      {/* 2. EXPANDED STATE: Unified Right-Side Panel */}
      <Slide direction="left" in={isOpen} mountOnEnter unmountOnExit>
        <Box
          sx={{
            position: { xs: 'fixed', md: 'relative' },
            top: { xs: 'var(--navbar-height, 56px)', md: 'auto' },
            bottom: { xs: 0, md: 'auto' },
            right: 0,
            width: { xs: '100%', sm: 390, md: 430 },
            maxWidth: '100vw',
            borderLeft: `1px solid ${theme.palette.divider}`,
            bgcolor: 'background.paper',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            overflowY: 'auto',
            overflowX: 'hidden',
            flexShrink: 0,
            zIndex: { xs: theme.zIndex.modal, md: 10 },
            boxSizing: 'border-box',
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
              bgcolor: 'background.default',
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
                {t('preview:drawer.shortScore', 'Audit')} {auditScore > 0 ? `${auditScore}/10` : '--'}
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
                {t('preview:drawer.shortMatch', 'Match')} {matchScore > 0 ? `${matchScore}%` : '--'}
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
                <AuditScoreHero score={auditScore} />

                {/* Multidimensional Radar Chart in Lateral Drawer */}
                {radarDimensions.length >= 3 && (
                  <Paper
                    elevation={0}
                    sx={{
                      p: { xs: 1.5, sm: 2 },
                      borderRadius: 2,
                      bgcolor: alpha(theme.palette.background.default, 0.6),
                      border: `1px solid ${theme.palette.divider}`,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}
                  >
                    <Box sx={{ width: '100%', mb: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: 0.75, fontSize: '0.85rem' }}>
                        <AutoAwesomeRoundedIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                        {t('audit:radar.title', 'Análisis Multidimensional de Afinidad')}
                      </Typography>
                      <Chip
                        size="small"
                        label={t('audit:radar.sevenAxes', '7 Ejes ATS')}
                        color="primary"
                        variant="outlined"
                        sx={{ fontSize: '0.65rem', height: 20, fontWeight: 700 }}
                      />
                    </Box>

                    <Typography variant="caption" color="text.secondary" sx={{ width: '100%', mb: 1.5, display: 'block', lineHeight: 1.35 }}>
                      {t('audit:radar.descShort', 'Pasa el cursor sobre los vértices para comparar tu puntuación actual vs la meta calibrada de la vacante.')}
                    </Typography>

                    <HexagonRadarChart
                      dimensions={radarDimensions}
                      size={275}
                      actualLabel={t('audit:radar.actualLabel', 'Actual')}
                      targetLabel={t('audit:radar.targetLabel', 'Objetivo para esta vacante')}
                      targetShortLabel={t('audit:radar.targetShort', 'Meta')}
                    />

                    {onOpenFullAudit && (
                      <Button
                        size="small"
                        variant="text"
                        color="primary"
                        endIcon={<OpenInNewRoundedIcon sx={{ fontSize: '14px !important' }} />}
                        onClick={onOpenFullAudit}
                        sx={{
                          mt: 1.5,
                          fontSize: '0.74rem',
                          fontWeight: 700,
                          textTransform: 'none',
                          width: '100%',
                          py: 0.5,
                        }}
                      >
                        {t('audit:radar.openFullAudit', 'Ver Diagnóstico Completo y Palancas de Acción')}
                      </Button>
                    )}
                  </Paper>
                )}

                <AuditPillarsBreakdown
                  auditReport={auditReport}
                  onOpenAction={handleOpenAction}
                  getActionButtonLabel={getActionButtonLabel}
                />
              </>
            )}

            {/* TAB 2: GAP STRATEGY */}
            {activeTab === 'gap' && (
              <AuditGapTabContent
                matchScore={matchScore}
                companyName={companyName}
                targetRole={targetRole}
                matchedKeywords={matchedKeywords}
                missingKeywords={missingKeywords}
                hasGapMarkdown={Boolean(gapMarkdown)}
                onViewFullReport={() => setFullReportModalOpen(true)}
              />
            )}

            {/* TAB 3: INTERVIEW PREPARATION */}
            {activeTab === 'interview' && (
              <InterviewPrepTab
                gapKeywords={missingKeywords}
                companyName={companyName || ''}
                targetRole={targetRole || ''}
                cvData={cvData || { name: '', title: '', contacts: [], sections: [] }}
              />
            )}
          </Box>
        </Box>
      </Slide>


      {/* 3. Progressive Disclosure Dialog: Full Detailed Markdown Report */}
      {gapMarkdown && (
        <Dialog
          open={fullReportModalOpen}
          onClose={() => setFullReportModalOpen(false)}
          fullWidth
          maxWidth="md"
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
              dangerouslySetInnerHTML={{ __html: safeMarkdown(gapMarkdown) }}
            />
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2, justifyContent: 'space-between' }}>
            <Button
              size="small"
              variant="outlined"
              startIcon={isReportCopied ? <CheckRoundedIcon color="success" /> : <ContentCopyRoundedIcon />}
              onClick={() => copyReport(gapMarkdown)}
            >
              {isReportCopied ? t('common:status.copied', 'Copied!') : t('common:actions.copy', 'Copy Report Text')}
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
});
