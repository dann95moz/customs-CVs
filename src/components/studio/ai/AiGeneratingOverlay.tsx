import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Stack,
  Chip,
  LinearProgress,
  useTheme,
  alpha
} from '@mui/material';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import ShieldRoundedIcon from '@mui/icons-material/ShieldRounded';
import HourglassTopRoundedIcon from '@mui/icons-material/HourglassTopRounded';
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
  const { t } = useTranslation(['target', 'common']);
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const isGenerating = useResumeStore((s) => s.isGenerating);
  const companyName = useResumeStore((s) => s.companyName);
  const targetRole = useResumeStore((s) => s.targetRole);
  const generationStep = useResumeStore((s) => s.generationStep);

  const [activeStage, setActiveStage] = useState<number>(1);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);

  useEffect(() => {
    if (!isGenerating) {
      setActiveStage(1);
      setElapsedSeconds(0);
      return;
    }

    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    const stageInterval = setInterval(() => {
      setActiveStage((prev) => (prev < MILESTONES.length ? prev + 1 : prev));
    }, 3200);

    return () => {
      clearInterval(timer);
      clearInterval(stageInterval);
    };
  }, [isGenerating]);

  if (!isGenerating) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: isDark ? 'rgba(7, 11, 20, 0.88)' : 'rgba(248, 250, 252, 0.9)',
        backdropFilter: 'blur(16px)',
        p: { xs: 2, sm: 3 },
        animation: 'fadeIn 0.3s ease-in-out'
      }}
    >
      <Paper
        elevation={8}
        sx={{
          width: '100%',
          maxWidth: 580,
          p: { xs: 3, sm: 4.5 },
          borderRadius: '24px',
          border: `1.5px solid ${alpha(theme.palette.primary.main, isDark ? 0.4 : 0.25)}`,
          bgcolor: isDark ? 'rgba(15, 23, 42, 0.95)' : '#ffffff',
          boxShadow: isDark
            ? `0 24px 64px rgba(0, 0, 0, 0.8), 0 0 40px ${alpha(theme.palette.primary.main, 0.2)}`
            : `0 24px 64px rgba(2, 132, 199, 0.18)`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: 3
        }}
      >
        {/* Animated AI Pulse Icon */}
        <Box sx={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
          <Box
            sx={{
              position: 'absolute',
              width: 84,
              height: 84,
              borderRadius: '50%',
              bgcolor: alpha(theme.palette.primary.main, 0.15),
              animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
            }}
          />
          <CircularProgress
            size={68}
            thickness={3.5}
            sx={{ color: theme.palette.primary.main }}
          />
          <AutoAwesomeRoundedIcon
            sx={{
              position: 'absolute',
              fontSize: 30,
              color: theme.palette.primary.main
            }}
          />
        </Box>

        {/* Title & Target Details */}
        <Box sx={{ maxWidth: '100%' }}>
          <Chip
            icon={<HourglassTopRoundedIcon sx={{ fontSize: '13px !important' }} />}
            label={`${t('target:progress.synthesizing', 'AI Tailoring in Progress')} • ${elapsedSeconds}s`}
            size="small"
            color="primary"
            variant="outlined"
            sx={{ fontWeight: 700, mb: 1.5, fontSize: '0.75rem' }}
          />
          <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: '-0.02em', mb: 0.5 }}>
            {t('target:progress.modalTitle', 'Crafting Your High-Impact Resume')}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
            {targetRole || 'Target Role'} {companyName ? `@ ${companyName}` : ''}
          </Typography>
        </Box>

        <LinearProgress
          sx={{
            width: '100%',
            height: 6,
            borderRadius: 3,
            bgcolor: alpha(theme.palette.primary.main, 0.15)
          }}
        />

        {/* Milestone Steps with Ticks */}
        <Stack spacing={1.5} sx={{ width: '100%', textAlign: 'left' }}>
          {MILESTONES.map((step) => {
            const isDone = activeStage > step.id;
            const isCurrent = activeStage === step.id;

            return (
              <Box
                key={step.id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  p: 1.25,
                  px: 1.75,
                  borderRadius: '10px',
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
                    fontSize: '0.84rem',
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

        {/* Safeguard Guarantee Badge */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            p: 1.25,
            px: 2,
            borderRadius: '999px',
            bgcolor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
            border: `1px solid ${theme.palette.divider}`
          }}
        >
          <ShieldRoundedIcon sx={{ fontSize: 16, color: theme.palette.success.main }} />
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.75rem' }}>
            {t('common:safeguard.guarantee', '100% Authentic: Always faithful to your real career history')}
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};
