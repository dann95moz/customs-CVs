import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Chip,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
  Tooltip,
  IconButton,
  Snackbar,
  useTheme,
  alpha,
  Card,
  CardContent,
} from '@mui/material';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded';
import PsychologyRoundedIcon from '@mui/icons-material/PsychologyRounded';
import WorkRoundedIcon from '@mui/icons-material/WorkRounded';
import StarRateRoundedIcon from '@mui/icons-material/StarRateRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import { useTranslation } from 'react-i18next';
import { CVData } from '../../../types/cv';
import { InterviewQuestion } from '../../../types/audit';
import { useInterviewPrepWorkflow } from '../../../hooks/useInterviewPrepWorkflow';

export interface InterviewPrepTabProps {
  gapKeywords: string[];
  companyName: string;
  targetRole: string;
  cvData: CVData;
}

export const InterviewPrepTab: React.FC<InterviewPrepTabProps> = ({
  gapKeywords,
  companyName,
  targetRole,
  cvData,
}) => {
  const { t } = useTranslation(['audit', 'common']);
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const {
    loading,
    prepResult,
    copiedId,
    snackbar,
    setSnackbar,
    expandedId,
    setExpandedId,
    fetchInterviewPrep,
    handleCopyQuestion,
    handleCopyAll,
  } = useInterviewPrepWorkflow({
    gapKeywords,
    companyName,
    targetRole,
    cvData,
  });

  const getCategoryChip = (category: InterviewQuestion['category'], relatedGap?: string) => {
    switch (category) {
      case 'gap':
        return (
          <Chip
            size="small"
            color="warning"
            variant="outlined"
            icon={<WorkRoundedIcon sx={{ fontSize: '13px !important' }} />}
            label={relatedGap ? `${t('audit:interview.gapTag', 'Gap Target')}: ${relatedGap}` : t('audit:interview.gapTag', 'Gap Target')}
            sx={{ fontWeight: 700, fontSize: '0.68rem' }}
          />
        );
      case 'technical':
        return (
          <Chip
            size="small"
            color="info"
            variant="outlined"
            icon={<PsychologyRoundedIcon sx={{ fontSize: '13px !important' }} />}
            label={t('audit:interview.techTag', 'Technical Deep-Dive')}
            sx={{ fontWeight: 700, fontSize: '0.68rem' }}
          />
        );
      case 'behavioral':
        return (
          <Chip
            size="small"
            color="success"
            variant="outlined"
            icon={<StarRateRoundedIcon sx={{ fontSize: '13px !important' }} />}
            label={t('audit:interview.behavioralTag', 'Behavioral (STAR)')}
            sx={{ fontWeight: 700, fontSize: '0.68rem' }}
          />
        );
      case 'leadership':
        return (
          <Chip
            size="small"
            color="secondary"
            variant="outlined"
            icon={<AutoAwesomeRoundedIcon sx={{ fontSize: '13px !important' }} />}
            label={t('audit:interview.leadershipTag', 'Strategic & Leadership')}
            sx={{ fontWeight: 700, fontSize: '0.68rem' }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* Header Banner */}
      <Box
        sx={{
          p: 2,
          borderRadius: '12px',
          bgcolor: isDark ? alpha(theme.palette.primary.main, 0.08) : alpha(theme.palette.primary.main, 0.04),
          border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PsychologyRoundedIcon color="primary" fontSize="small" />
            <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
              {t('audit:interview.title', 'Gap-Driven Interview Simulator')}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Button
              size="small"
              variant="outlined"
              color="inherit"
              startIcon={loading ? <CircularProgress size={14} color="inherit" /> : <RefreshRoundedIcon />}
              onClick={fetchInterviewPrep}
              disabled={loading}
              sx={{ fontWeight: 600, fontSize: '0.72rem', py: 0.25 }}
            >
              {t('audit:interview.regenerate', 'Regenerate')}
            </Button>
            <Button
              size="small"
              variant="contained"
              color="primary"
              startIcon={<ContentCopyRoundedIcon />}
              onClick={handleCopyAll}
              disabled={loading || !prepResult}
              sx={{ fontWeight: 700, fontSize: '0.72rem', py: 0.25 }}
            >
              {t('audit:interview.copyAll', 'Copy Kit')}
            </Button>
          </Box>
        </Box>

        <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.45 }}>
          {t('audit:interview.subtitle', 'Custom coaching questions targeting your detected ATS keyword gaps, with structured STAR answering strategies.')}
        </Typography>
      </Box>

      {/* Loading State */}
      {loading && (
        <Box sx={{ py: 6, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1.5 }}>
          <CircularProgress size={32} thickness={4} color="primary" />
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
            {t('audit:interview.generating', 'Analyzing ATS gaps and crafting STAR interview questions...')}
          </Typography>
        </Box>
      )}

      {/* Loaded Questions & Tips */}
      {!loading && prepResult && (
        <>
          {/* Coaching Tips Card */}
          {prepResult.overallTips && prepResult.overallTips.length > 0 && (
            <Card
              variant="outlined"
              sx={{
                borderRadius: '12px',
                bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)',
                borderColor: alpha(theme.palette.divider, 0.8),
              }}
            >
              <CardContent sx={{ p: 1.75, '&:last-child': { pb: 1.75 } }}>
                <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 0.5, display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                  <HelpOutlineRoundedIcon sx={{ fontSize: 14 }} color="primary" />
                  {t('audit:interview.tipsTitle', 'Key Strategy Tips for this Interview')}
                </Typography>
                <Box component="ul" sx={{ m: 0, pl: 2, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  {prepResult.overallTips.map((tip, i) => (
                    <Typography component="li" key={i} variant="caption" color="text.secondary" sx={{ lineHeight: 1.45 }}>
                      {tip}
                    </Typography>
                  ))}
                </Box>
              </CardContent>
            </Card>
          )}

          {/* Question Accordion List */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
            <Typography variant="overline" sx={{ fontWeight: 800, color: 'text.secondary', letterSpacing: '0.08em', px: 0.5 }}>
              {t('audit:interview.questionsCount', '{{count}} Targeted Questions & STAR Guides', { count: prepResult.questions.length })}
            </Typography>

            {prepResult.questions.map((q, idx) => (
              <Accordion
                key={q.id || idx}
                expanded={expandedId === q.id}
                onChange={(_, isExpanded) => setExpandedId(isExpanded ? q.id : false)}
                sx={{
                  borderRadius: '12px !important',
                  border: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
                  bgcolor: 'background.paper',
                  boxShadow: 'none',
                  '&:before': { display: 'none' },
                  overflow: 'hidden',
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreRoundedIcon />}
                  sx={{
                    px: 1.75,
                    py: 0.75,
                    '& .MuiAccordionSummary-content': {
                      my: 0.5,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 0.75,
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, flexWrap: 'wrap' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="caption" sx={{ fontWeight: 800, color: 'primary.main', minWidth: 20 }}>
                        #{idx + 1}
                      </Typography>
                      {getCategoryChip(q.category, q.relatedGap)}
                    </Box>

                    <Tooltip title={t('common:actions.copy', 'Copy Question & STAR Guide')}>
                      <IconButton
                        size="small"
                        onClick={(e) => handleCopyQuestion(q, e)}
                        sx={{ p: 0.5, color: copiedId === q.id ? 'success.main' : 'text.secondary' }}
                      >
                        {copiedId === q.id ? <CheckCircleRoundedIcon fontSize="small" /> : <ContentCopyRoundedIcon fontSize="small" />}
                      </IconButton>
                    </Tooltip>
                  </Box>

                  <Typography variant="subtitle2" sx={{ fontWeight: 700, lineHeight: 1.35, color: 'text.primary' }}>
                    {q.question}
                  </Typography>
                </AccordionSummary>

                <AccordionDetails sx={{ px: 2, pt: 0, pb: 2, borderTop: `1px solid ${alpha(theme.palette.divider, 0.4)}` }}>
                  {/* Rationale Context */}
                  <Box sx={{ mt: 1.5, p: 1.25, borderRadius: '8px', bgcolor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', border: `1px solid ${alpha(theme.palette.divider, 0.5)}` }}>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: 'primary.main', display: 'block', mb: 0.25 }}>
                      🔍 {t('audit:interview.rationaleTitle', 'Why the interviewer asks this:')}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.45 }}>
                      {q.rationale}
                    </Typography>
                  </Box>

                  {/* STAR Strategy Framework */}
                  <Box sx={{ mt: 1.75 }}>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.primary', display: 'block', mb: 1 }}>
                      ⭐ {t('audit:interview.starTitle', 'Recommended Response Strategy (STAR Formula):')}
                    </Typography>

                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 1 }}>
                      <Box sx={{ pl: 1.25, borderLeft: `2.5px solid ${theme.palette.info.main}` }}>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: 'info.main', display: 'block' }}>
                          S — {t('audit:interview.situation', 'Situation (Context):')}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {q.starStrategy.situation}
                        </Typography>
                      </Box>

                      <Box sx={{ pl: 1.25, borderLeft: `2.5px solid ${theme.palette.warning.main}` }}>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: 'warning.main', display: 'block' }}>
                          T — {t('audit:interview.task', 'Task (Challenge):')}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {q.starStrategy.task}
                        </Typography>
                      </Box>

                      <Box sx={{ pl: 1.25, borderLeft: `2.5px solid ${theme.palette.primary.main}` }}>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: 'primary.main', display: 'block' }}>
                          A — {t('audit:interview.action', 'Action (What You Did):')}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {q.starStrategy.action}
                        </Typography>
                      </Box>

                      <Box sx={{ pl: 1.25, borderLeft: `2.5px solid ${theme.palette.success.main}` }}>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: 'success.main', display: 'block' }}>
                          R — {t('audit:interview.result', 'Result (Quantifiable Impact):')}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {q.starStrategy.result}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  {/* Sample Answer Outline */}
                  {q.sampleAnswerOutline && (
                    <Box sx={{ mt: 1.5, pt: 1.5, borderTop: `1px dashed ${alpha(theme.palette.divider, 0.6)}` }}>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', display: 'block', mb: 0.25 }}>
                        🗣️ {t('audit:interview.speakingOutline', 'Key Speaking Points:')}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic', lineHeight: 1.45 }}>
                        "{q.sampleAnswerOutline}"
                      </Typography>
                    </Box>
                  )}
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </>
      )}

      {/* Snackbar Feedback */}
      <Snackbar
        open={Boolean(snackbar)}
        autoHideDuration={2500}
        onClose={() => setSnackbar(null)}
        message={snackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
};
