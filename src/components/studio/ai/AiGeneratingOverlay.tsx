import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Stack,
  Chip,
  LinearProgress,
  Button,
  IconButton,
  Alert,
  useTheme,
  alpha
} from '@mui/material';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import ShieldRoundedIcon from '@mui/icons-material/ShieldRounded';
import HourglassTopRoundedIcon from '@mui/icons-material/HourglassTopRounded';
import SmartToyRoundedIcon from '@mui/icons-material/SmartToyRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import TerminalRoundedIcon from '@mui/icons-material/TerminalRounded';
import { useTranslation } from 'react-i18next';
import { useResumeStore } from '../../../store';

interface MilestoneStage {
  id: number;
  labelKey: string;
  defaultLabel: string;
}

const MILESTONES: MilestoneStage[] = [
  { id: 1, labelKey: 'target:progress.stage1', defaultLabel: 'Analyzing employer requirements & extracting ATS keywords' },
  { id: 2, labelKey: 'target:progress.stage2', defaultLabel: 'Synthesizing measurable achievements with Google XYZ formula' },
  { id: 3, labelKey: 'target:progress.stage3', defaultLabel: 'Calibrating document layout & page budget' },
  { id: 4, labelKey: 'target:progress.stage4', defaultLabel: 'Ensuring 100% authenticity & fidelity to your real career history' },
];

export const AiGeneratingOverlay: React.FC = () => {
  const { t } = useTranslation(['target', 'common', 'settings']);
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const isGenerating = useResumeStore((s) => s.isGenerating);
  const companyName = useResumeStore((s) => s.companyName);
  const targetRole = useResumeStore((s) => s.targetRole);
  const generationStage = useResumeStore((s) => s.generationStage);
  const generationProgress = useResumeStore((s) => s.generationProgress);
  const generationStep = useResumeStore((s) => s.generationStep);
  const streamedWords = useResumeStore((s) => s.streamedWords);
  const streamedSnippet = useResumeStore((s) => s.streamedSnippet);
  const activeModelName = useResumeStore((s) => s.activeModelName);
  const generationError = useResumeStore((s) => s.generationError);
  const handleGenerate = useResumeStore((s) => s.handleGenerate);
  const cancelGeneration = useResumeStore((s) => s.cancelGeneration);
  const setActiveTab = useResumeStore((s) => s.setActiveTab);

  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);

  useEffect(() => {
    if (!isGenerating || generationError) {
      if (!isGenerating) setElapsedSeconds(0);
      return;
    }

    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [isGenerating, generationError]);

  if (!isGenerating) return null;

  const hasError = Boolean(generationError);

  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        zIndex: theme.zIndex.modal + 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: isDark ? 'rgba(7, 11, 20, 0.88)' : 'rgba(248, 250, 252, 0.92)',
        backdropFilter: 'blur(16px)',
        p: { xs: 2, sm: 3 },
        animation: 'fadeIn 0.25s ease-in-out'
      }}
    >
      <Paper
        elevation={8}
        sx={{
          position: 'relative',
          width: '100%',
          maxWidth: 600,
          p: { xs: 3, sm: 4 },
          borderRadius: 4,
          border: `1.5px solid ${alpha(hasError ? theme.palette.error.main : theme.palette.primary.main, isDark ? 0.4 : 0.25)}`,
          bgcolor: isDark ? 'background.paper' : '#ffffff',
          boxShadow: isDark
            ? `0 24px 64px rgba(0, 0, 0, 0.8), 0 0 40px ${alpha(hasError ? theme.palette.error.main : theme.palette.primary.main, 0.2)}`
            : `0 24px 64px rgba(2, 132, 199, 0.16)`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: 2.5
        }}
      >
        {/* Close / Cancel Button */}
        <IconButton
          size="small"
          onClick={cancelGeneration}
          title={t('common:actions.cancel', 'Cancel')}
          aria-label={t('common:actions.cancel', 'Cancel')}
          sx={{
            position: 'absolute',
            top: 14,
            right: 14,
            color: 'text.secondary',
            '&:hover': {
              color: 'text.primary',
              bgcolor: alpha(theme.palette.error.main, 0.1)
            }
          }}
        >
          <CloseRoundedIcon sx={{ fontSize: 20 }} />
        </IconButton>

        {/* Animated AI Pulse Icon */}
        <Box sx={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
          <Box
            sx={{
              position: 'absolute',
              width: 80,
              height: 80,
              borderRadius: '50%',
              bgcolor: alpha(hasError ? theme.palette.error.main : theme.palette.primary.main, 0.15),
              animation: hasError ? 'none' : 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
            }}
          />
          <CircularProgress
            size={64}
            thickness={3.5}
            variant={hasError ? 'determinate' : undefined}
            value={hasError ? 100 : undefined}
            sx={{ color: hasError ? theme.palette.error.main : theme.palette.primary.main }}
          />
          <AutoAwesomeRoundedIcon
            sx={{
              position: 'absolute',
              fontSize: 28,
              color: hasError ? theme.palette.error.main : theme.palette.primary.main
            }}
          />
        </Box>

        {/* Title & Target Details */}
        <Box sx={{ maxWidth: '100%' }}>
          {/* Live Telemetry Badges */}
          <Stack
            direction="row"
            spacing={1}
            sx={{
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: 0.8,
              mb: 1.5
            }}
          >
            <Chip
              icon={<HourglassTopRoundedIcon sx={{ fontSize: '13px !important' }} />}
              label={`${t('target:progress.synthesizing', 'AI Tailoring in Progress')} • ${elapsedSeconds}s`}
              size="small"
              color={hasError ? 'error' : 'primary'}
              variant="outlined"
              sx={{ fontWeight: 700, fontSize: '0.74rem' }}
            />
            {activeModelName && (
              <Chip
                icon={<SmartToyRoundedIcon sx={{ fontSize: '13px !important' }} />}
                label={activeModelName}
                size="small"
                variant="outlined"
                sx={{
                  fontWeight: 600,
                  fontSize: '0.74rem',
                  borderColor: alpha(theme.palette.divider, 0.8),
                  bgcolor: alpha(theme.palette.primary.main, 0.04)
                }}
              />
            )}
            {streamedWords > 0 && !hasError && (
              <Chip
                label={`⚡ ${streamedWords} ${t('target:fields.words', 'words')}`}
                size="small"
                color="success"
                variant="outlined"
                sx={{ fontWeight: 700, fontSize: '0.74rem' }}
              />
            )}
          </Stack>

          <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: '-0.02em', mb: 0.5 }}>
            {hasError
              ? t('target:progress.errorTitle', 'Synthesis Encountered an Issue')
              : t('target:progress.modalTitle', 'Crafting Your High-Impact Resume')}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
            {targetRole || 'Target Role'} {companyName ? `@ ${companyName}` : ''}
          </Typography>
        </Box>

        {/* Error Alert Box with Action Buttons */}
        {hasError ? (
          <Box sx={{ width: '100%', textAlign: 'left' }}>
            <Alert severity="error" variant="outlined" sx={{ borderRadius: 2, mb: 2, fontSize: '0.85rem' }}>
              {generationError}
            </Alert>
            <Stack direction="row" spacing={1.5} sx={{ justifyContent: 'center' }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<RefreshRoundedIcon />}
                onClick={() => handleGenerate()}
                sx={{ fontWeight: 700, textTransform: 'none' }}
              >
                {t('target:progress.tryAgain', 'Retry Synthesis')}
              </Button>
              <Button
                variant="outlined"
                color="inherit"
                startIcon={<SettingsRoundedIcon />}
                onClick={() => {
                  cancelGeneration();
                  setActiveTab('settings');
                }}
                sx={{ fontWeight: 600, textTransform: 'none' }}
              >
                {t('target:modal.title', 'Configure AI Provider')}
              </Button>
            </Stack>
          </Box>
        ) : (
          <>
            {/* Real Progress Bar with Percentage */}
            <Box sx={{ width: '100%' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.8 }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.75rem' }}>
                  {generationStep || t('target:progress.title', 'Synthesizing Tailored Resume with AI...')}
                </Typography>
                <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 800, fontSize: '0.75rem' }}>
                  {Math.max(10, Math.min(100, Math.round(generationProgress)))}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={Math.max(10, Math.min(100, generationProgress))}
                sx={{
                  width: '100%',
                  height: 7,
                  borderRadius: 4,
                  bgcolor: alpha(theme.palette.primary.main, 0.12),
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 4,
                    transition: 'transform 0.4s ease'
                  }
                }}
              />
            </Box>

            {/* Real Milestone Checklist driven by pipeline stages */}
            <Stack spacing={1.2} sx={{ width: '100%', textAlign: 'left' }}>
              {MILESTONES.map((step) => {
                const isDone = generationStage > step.id;
                const isCurrent = generationStage === step.id;

                return (
                  <Box
                    key={step.id}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      p: 1.1,
                      px: 1.6,
                      borderRadius: 2,
                      bgcolor: isCurrent
                        ? alpha(theme.palette.primary.main, isDark ? 0.14 : 0.08)
                        : isDone
                        ? alpha(theme.palette.success.main, isDark ? 0.08 : 0.05)
                        : 'transparent',
                      border: `1px solid ${
                        isCurrent
                          ? alpha(theme.palette.primary.main, 0.35)
                          : isDone
                          ? alpha(theme.palette.success.main, 0.25)
                          : 'transparent'
                      }`,
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {isDone ? (
                      <CheckCircleRoundedIcon sx={{ fontSize: 18, color: theme.palette.success.main, flexShrink: 0 }} />
                    ) : isCurrent ? (
                      <CircularProgress size={16} thickness={5} sx={{ color: theme.palette.primary.main, flexShrink: 0 }} />
                    ) : (
                      <Box
                        sx={{
                          width: 16,
                          height: 16,
                          borderRadius: '50%',
                          border: `2px solid ${theme.palette.divider}`,
                          flexShrink: 0
                        }}
                      />
                    )}
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: '0.82rem',
                        fontWeight: isCurrent ? 700 : isDone ? 600 : 400,
                        color: isCurrent
                          ? theme.palette.primary.main
                          : isDone
                          ? 'text.primary'
                          : 'text.secondary',
                        opacity: isDone || isCurrent ? 1 : 0.65
                      }}
                    >
                      {t(step.labelKey, step.defaultLabel)}
                    </Typography>
                  </Box>
                );
              })}
            </Stack>

            {/* Live Streaming Snippet Box */}
            {streamedSnippet && (
              <Box
                sx={{
                  width: '100%',
                  textAlign: 'left',
                  p: 1.25,
                  px: 1.5,
                  borderRadius: 2,
                  bgcolor: isDark ? 'rgba(0, 0, 0, 0.45)' : 'rgba(241, 245, 249, 0.8)',
                  border: `1px solid ${alpha(theme.palette.divider, 0.6)}`,
                  fontFamily: 'monospace',
                  fontSize: '0.74rem',
                  color: 'text.secondary',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <TerminalRoundedIcon sx={{ fontSize: 14, color: theme.palette.primary.main, flexShrink: 0 }} />
                <Typography
                  component="span"
                  sx={{
                    fontFamily: 'monospace',
                    fontSize: '0.74rem',
                    color: 'text.secondary',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    flexGrow: 1
                  }}
                >
                  {streamedSnippet.replace(/[\r\n]+/g, ' ')}
                </Typography>
                <Box
                  component="span"
                  sx={{
                    display: 'inline-block',
                    width: 6,
                    height: 12,
                    bgcolor: theme.palette.primary.main,
                    animation: 'pulse 1s infinite'
                  }}
                />
              </Box>
            )}

            {/* Safeguard Guarantee Badge & Cancel Action */}
            <Stack
              direction="row"
              spacing={1.5}
              sx={{
                width: '100%',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.8,
                  p: 0.8,
                  px: 1.6,
                  borderRadius: '999px',
                  bgcolor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
                  border: `1px solid ${theme.palette.divider}`
                }}
              >
                <ShieldRoundedIcon sx={{ fontSize: 15, color: theme.palette.success.main }} />
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.72rem' }}>
                  {t('common:safeguard.guarantee', '100% Authentic: Always faithful to your real career history')}
                </Typography>
              </Box>

              <Button
                size="small"
                color="inherit"
                onClick={cancelGeneration}
                sx={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  color: 'text.secondary',
                  '&:hover': { color: 'error.main' }
                }}
              >
                {t('common:actions.cancel', 'Cancel')}
              </Button>
            </Stack>
          </>
        )}
      </Paper>
    </Box>
  );
};
