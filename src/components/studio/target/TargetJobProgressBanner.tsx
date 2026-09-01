import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Chip,
  CircularProgress,
  LinearProgress,
  useTheme,
  alpha,
} from '@mui/material';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import { useTranslation } from 'react-i18next';

export interface TargetJobProgressBannerProps {
  isGenerating: boolean;
  generationStep?: string;
}

export const TargetJobProgressBanner: React.FC<TargetJobProgressBannerProps> = React.memo(({
  isGenerating,
  generationStep,
}) => {
  const { t } = useTranslation(['target', 'common']);
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  if (!isGenerating) return null;

  return (
    <Paper
      sx={{
        p: { xs: 2, sm: 2.5 },
        borderRadius: 2,
        border: `1.5px solid ${theme.palette.primary.main}`,
        bgcolor: isDark ? alpha(theme.palette.primary.main, 0.12) : alpha(theme.palette.primary.main, 0.05),
        boxShadow: 4,
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
      }}
    >

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <CircularProgress size={28} thickness={4} color="primary" />
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'text.primary' }}>
            {t('target:progress.title', 'Synthesizing Tailored Resume with AI...')}
          </Typography>
          <Typography variant="body2" sx={{ color: theme.palette.primary.main, fontWeight: 600 }}>
            {generationStep || t('target:progress.defaultStep', 'Highlighting your real competencies and XYZ achievements...')}
          </Typography>
        </Box>
        <Chip
          icon={<AutoAwesomeRoundedIcon sx={{ fontSize: '14px !important' }} />}
          label={t('common:status.inProgress', 'In Progress')}
          color="primary"
          size="small"
          sx={{ fontWeight: 700 }}
        />
      </Box>
      <LinearProgress
        variant="indeterminate"
        sx={{
          borderRadius: 4,
          height: 6,
          bgcolor: isDark ? alpha(theme.palette.primary.main, 0.2) : alpha(theme.palette.primary.main, 0.1),
        }}
      />
    </Paper>
  );
});
