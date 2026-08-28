import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Chip,
  ButtonBase,
  useTheme,
  alpha
} from '@mui/material';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import WorkRoundedIcon from '@mui/icons-material/WorkRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import PictureAsPdfRoundedIcon from '@mui/icons-material/PictureAsPdfRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
import { WizardStep, WizardStepperProps, StepMeta } from '../../types';

export type { WizardStepperProps, StepMeta };

const STEPS: StepMeta[] = [
  {
    id: 'profile',
    number: 1,
    label: 'Candidate Profile',
    shortLabel: 'Profile',
    subtitle: 'Career history & skills',
    icon: <PersonRoundedIcon fontSize="small" />
  },
  {
    id: 'target',
    number: 2,
    label: 'Target Vacancy',
    shortLabel: 'Target Job',
    subtitle: 'Job description & tailoring',
    icon: <WorkRoundedIcon fontSize="small" />
  },
  {
    id: 'preview',
    number: 3,
    label: 'Live CV & PDF Export',
    shortLabel: 'CV & PDF',
    subtitle: 'Preview & download PDF',
    icon: <PictureAsPdfRoundedIcon fontSize="small" />
  }
];

export const WizardStepper: React.FC<WizardStepperProps> = ({
  currentStep,
  onSelectStep,
  hasMasterData,
  hasTargetJob,
  hasGeneratedCv
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

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

  const currentStepIndex = STEPS.findIndex(s => s.id === currentStep);

  return (
    <Paper
      elevation={0}
      className="no-print wizard-stepper"
      sx={{
        borderBottom: `1px solid ${theme.palette.divider}`,
        bgcolor: 'background.paper',
        py: 1,
        px: { xs: 1.5, md: 3 },
        position: 'sticky',
        top: 0,
        zIndex: 20,
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: { xs: 'flex-start', sm: 'center' },
          width: '100%',
          maxWidth: 1200,
          mx: 'auto',
          gap: { xs: 1, sm: 1.5, md: 2 },
          overflowX: 'auto',
          py: 0.5,
          '&::-webkit-scrollbar': { display: 'none' },
          scrollbarWidth: 'none',
        }}
      >
        {STEPS.map((step, index) => {
          const isActive = step.id === currentStep;
          const isCompleted = isStepComplete(step.id) && step.id !== currentStep;
          const isPassed = index < currentStepIndex;

          return (
            <React.Fragment key={step.id}>
              <ButtonBase
                onClick={() => onSelectStep(step.id)}
                sx={{
                  flex: { xs: '0 0 auto', sm: 1 },
                  maxWidth: { sm: 270 },
                  minWidth: { xs: 140, sm: 180, md: 210 },
                  p: { xs: 0.85, sm: 1.15 },
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.25,
                  textAlign: 'left',
                  border: '1px solid',
                  borderColor: isActive
                    ? theme.palette.primary.main
                    : isCompleted
                    ? alpha(theme.palette.success.main, 0.4)
                    : isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
                  bgcolor: isActive
                    ? alpha(theme.palette.primary.main, isDark ? 0.12 : 0.08)
                    : isCompleted
                    ? alpha(theme.palette.success.main, isDark ? 0.08 : 0.04)
                    : 'transparent',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    bgcolor: isActive
                      ? alpha(theme.palette.primary.main, isDark ? 0.18 : 0.12)
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
                    width: 38,
                    height: 38,
                    borderRadius: '10px',
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
                  }}
                >
                  {isCompleted ? (
                    <CheckCircleRoundedIcon sx={{ fontSize: 20 }} />
                  ) : (
                    step.icon
                  )}
                </Box>

                {/* Step Texts */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.25 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: isActive ? 700 : 600,
                        color: isActive
                          ? theme.palette.primary.main
                          : theme.palette.text.primary,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {step.label}
                    </Typography>

                    {isActive && (
                      <Chip
                        label={`Step ${step.number}`}
                        size="small"
                        color="primary"
                        sx={{
                          height: 18,
                          fontSize: '0.68rem',
                          fontWeight: 700,
                          '& .MuiChip-label': { px: 0.8 },
                        }}
                      />
                    )}
                    {isCompleted && (
                      <Chip
                        label="Done"
                        size="small"
                        color="success"
                        sx={{
                          height: 18,
                          fontSize: '0.68rem',
                          fontWeight: 700,
                          '& .MuiChip-label': { px: 0.8 },
                        }}
                      />
                    )}
                  </Box>

                  <Typography
                    variant="caption"
                    sx={{
                      color: theme.palette.text.secondary,
                      display: { xs: 'none', sm: 'block' },
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
              {index < STEPS.length - 1 && (
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
    </Paper>
  );
};
