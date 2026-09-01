import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  Chip,
  ButtonBase,
  IconButton,
  useTheme,
  alpha
} from '@mui/material';
import PsychologyRoundedIcon from '@mui/icons-material/PsychologyRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import WorkRoundedIcon from '@mui/icons-material/WorkRounded';
import PictureAsPdfRoundedIcon from '@mui/icons-material/PictureAsPdfRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded';
import { useTranslation } from 'react-i18next';
import { WizardStep, WizardStepperProps, StepMeta } from '../../types';

export type { WizardStepperProps, StepMeta };

export const WizardStepper: React.FC<WizardStepperProps> = ({
  currentStep,
  onSelectStep,
  hasMasterData,
  hasTargetJob,
  hasGeneratedCv
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const { t } = useTranslation(['profile', 'common']);
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeStepRef = useRef<HTMLButtonElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 6);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 6);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [checkScroll]);

  // Auto-scroll active step into center on mobile without causing window overflow
  useEffect(() => {
    if (activeStepRef.current && scrollRef.current) {
      const container = scrollRef.current;
      const target = activeStepRef.current;
      const left = target.offsetLeft - (container.clientWidth / 2) + (target.clientWidth / 2);
      container.scrollTo({
        left: Math.max(0, left),
        behavior: 'smooth',
      });
    }
    setTimeout(checkScroll, 350);
  }, [currentStep, checkScroll]);

  const steps: StepMeta[] = [
    {
      id: 'profile',
      number: 1,
      label: t('profile:stepper.profileLabel', 'Candidate Profile'),
      shortLabel: t('profile:stepper.profileShortLabel', 'Profile'),
      subtitle: t('profile:stepper.profileSubtitle', 'Career history & skills'),
      icon: <PersonRoundedIcon fontSize="small" />
    },
    {
      id: 'target',
      number: 2,
      label: t('profile:stepper.targetLabel', 'Target Vacancy'),
      shortLabel: t('profile:stepper.targetShortLabel', 'Target Job'),
      subtitle: t('profile:stepper.targetSubtitle', 'Job posting & tailoring'),
      icon: <WorkRoundedIcon fontSize="small" />
    },
    {
      id: 'preview',
      number: 3,
      label: t('profile:stepper.previewLabel', 'Live CV & PDF Export'),
      shortLabel: t('profile:stepper.previewShortLabel', 'CV & PDF'),
      subtitle: t('profile:stepper.previewSubtitle', 'Preview & download PDF'),
      icon: <PictureAsPdfRoundedIcon fontSize="small" />
    }
  ];


  const isStepComplete = (stepId: WizardStep): boolean => {
    switch (stepId) {
      case 'profile':
        return hasMasterData;
      case 'target':
        return hasTargetJob;
      case 'preview':
        return hasGeneratedCv;
      default:
        return false;
    }
  };

  const currentStepIndex = steps.findIndex(s => s.id === currentStep);

  const scrollByAmount = (amount: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  return (
    <Paper
      elevation={0}
      className="no-print wizard-stepper"
      sx={{
        borderBottom: `1px solid ${theme.palette.divider}`,
        bgcolor: 'background.paper',
        py: 0.75,
        px: { xs: 0.5, md: 3 },
        position: 'sticky',
        top: 0,
        zIndex: 20,
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Box sx={{ position: 'relative', width: '100%', maxWidth: 1200, mx: 'auto', display: 'flex', alignItems: 'center' }}>
        {/* Left Fade & Arrow Indicator */}
        {canScrollLeft && (
          <Box
            onClick={() => scrollByAmount(-180)}
            sx={{
              display: 'flex',
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: { xs: 32, sm: 44 },
              alignItems: 'center',
              justifyContent: 'flex-start',
              pl: 0.5,
              background: `linear-gradient(to right, ${theme.palette.background.paper} 60%, transparent)`,
              zIndex: 10,
              cursor: 'pointer',
            }}
          >
            <ArrowBackIosRoundedIcon sx={{ fontSize: 13, color: 'primary.main', ml: 0.25 }} />
          </Box>
        )}

        {/* Scrollable Stepper Row */}
        <Box
          ref={scrollRef}
          onScroll={checkScroll}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: { xs: 'flex-start', sm: 'center' },
            width: '100%',
            gap: { xs: 0.75, sm: 1.5, md: 2 },
            overflowX: 'auto',
            py: 0.5,
            px: { xs: 1.5, sm: 0 },
            '&::-webkit-scrollbar': { display: 'none' },
            scrollbarWidth: 'none',
            scrollBehavior: 'smooth',
          }}
        >
        {steps.map((step, index) => {
          const isActive = step.id === currentStep;
          const isCompleted = isStepComplete(step.id) && step.id !== currentStep;
          const isPassed = index < currentStepIndex;

          return (
            <React.Fragment key={step.id}>
              <ButtonBase
                ref={isActive ? activeStepRef : undefined}
                onClick={() => onSelectStep(step.id)}
                sx={{
                  flex: { xs: '0 0 auto', sm: 1 },
                  maxWidth: { sm: 270 },
                  minWidth: { xs: 'auto', sm: 160, md: 200 },
                  p: { xs: 0.6, sm: 1 },
                  px: { xs: 1, sm: 1.75 },
                  borderRadius: '9999px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: { xs: 0.75, sm: 1.25 },
                  textAlign: 'left',
                  border: '1px solid',
                  borderColor: isActive
                    ? theme.palette.primary.main
                    : isCompleted
                    ? alpha(theme.palette.success.main, 0.4)
                    : isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
                  bgcolor: isActive
                    ? alpha(theme.palette.primary.main, isDark ? 0.14 : 0.08)
                    : isCompleted
                    ? alpha(theme.palette.success.main, isDark ? 0.08 : 0.04)
                    : 'transparent',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    bgcolor: isActive
                      ? alpha(theme.palette.primary.main, isDark ? 0.2 : 0.12)
                      : alpha(theme.palette.text.primary, 0.04),
                    borderColor: isActive
                      ? theme.palette.primary.main
                      : alpha(theme.palette.primary.main, 0.5),
                  },
                }}
              >
                {/* Step Icon Badge */}
                <Box
                  sx={{
                    width: { xs: 28, sm: 36 },
                    height: { xs: 28, sm: 36 },
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    bgcolor: isActive
                      ? theme.palette.primary.main
                      : isCompleted
                      ? theme.palette.success.main
                      : isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.05)',
                    color: isActive || isCompleted
                      ? '#ffffff'
                      : theme.palette.text.secondary,
                    boxShadow: isActive
                      ? `0 2px 8px ${alpha(theme.palette.primary.main, 0.4)}`
                      : 'none',
                    transition: 'all 0.2s ease',
                    '& svg': {
                      fontSize: { xs: 16, sm: 20 },
                    },
                  }}
                >
                  {isCompleted ? (
                    <CheckCircleRoundedIcon />
                  ) : (
                    step.icon
                  )}
                </Box>

                {/* Step Texts */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.25 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: isActive ? 700 : 600,
                        fontSize: { xs: '0.75rem', sm: '0.85rem' },
                        color: isActive
                          ? theme.palette.primary.main
                          : theme.palette.text.primary,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                        {step.label}
                      </Box>
                      <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>
                        {step.shortLabel || step.label}
                      </Box>
                    </Typography>

                    {isActive && (
                      <Chip
                        label={t('common:status.step', { number: step.number, defaultValue: `Step ${step.number}` })}
                        size="small"
                        color="primary"
                        sx={{
                          height: 16,
                          fontSize: '0.62rem',
                          fontWeight: 700,
                          '& .MuiChip-label': { px: 0.6 },
                        }}
                      />
                    )}
                    {isCompleted && (
                      <Chip
                        label={t('common:actions.done', 'Done')}
                        size="small"
                        color="success"
                        sx={{
                          height: 16,
                          fontSize: '0.62rem',
                          fontWeight: 700,
                          '& .MuiChip-label': { px: 0.6 },
                        }}
                      />
                    )}
                  </Box>

                  <Typography
                    variant="caption"
                    sx={{
                      color: theme.palette.text.secondary,
                      display: { xs: 'none', md: 'block' },
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      fontSize: '0.75rem',
                    }}
                  >
                    {step.subtitle}
                  </Typography>
                </Box>
              </ButtonBase>

              {/* Separator Chevron */}
              {index < steps.length - 1 && (
                <ArrowForwardIosRoundedIcon
                  sx={{
                    fontSize: 13,
                    color: isPassed
                      ? theme.palette.primary.main
                      : alpha(theme.palette.text.disabled, 0.35),
                    flexShrink: 0,
                    display: { xs: 'none', lg: 'block' },
                  }}
                />
              )}
            </React.Fragment>
          );
        })}
        </Box>

        {/* Right Fade & Arrow Indicator */}
        {canScrollRight && (
          <Box
            onClick={() => scrollByAmount(180)}
            sx={{
              display: 'flex',
              position: 'absolute',
              right: 0,
              top: 0,
              bottom: 0,
              width: { xs: 32, sm: 44 },
              alignItems: 'center',
              justifyContent: 'flex-end',
              pr: 0.5,
              background: `linear-gradient(to left, ${theme.palette.background.paper} 60%, transparent)`,
              zIndex: 10,
              cursor: 'pointer',
            }}
          >
            <ArrowForwardIosRoundedIcon sx={{ fontSize: 13, color: 'primary.main', mr: 0.25 }} />
          </Box>
        )}
      </Box>
    </Paper>
  );
};
