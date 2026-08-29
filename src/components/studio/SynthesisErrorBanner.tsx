import React from 'react';
import {
  Snackbar,
  Paper,
  Box,
  Typography,
  Button,
  IconButton,
  Tooltip,
  useTheme,
  alpha,
} from '@mui/material';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';
import { useTranslation } from 'react-i18next';
import { useResumeStore } from '../../store';

export const SynthesisErrorBanner: React.FC = () => {
  const { t } = useTranslation(['common', 'settings']);
  const muiTheme = useTheme();
  const isDark = muiTheme.palette.mode === 'dark';
  const generationError = useResumeStore((s) => s.generationError);
  const setGenerationError = useResumeStore((s) => s.setGenerationError);
  const setActiveTab = useResumeStore((s) => s.setActiveTab);

  if (!generationError) return null;

  return (
    <Snackbar
      open={Boolean(generationError)}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      sx={{
        bottom: { xs: 16, sm: 24 },
        left: { xs: 16, sm: 24 },
        right: 'auto !important',
        zIndex: 1400,
        maxWidth: { xs: 'calc(100vw - 32px)', sm: 400 },
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 2.25,
          borderRadius: '20px',
          bgcolor: isDark ? 'rgba(16, 22, 35, 0.94)' : 'rgba(255, 255, 255, 0.96)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: `1px solid ${isDark ? 'rgba(239, 68, 68, 0.28)' : 'rgba(239, 68, 68, 0.22)'}`,
          boxShadow: isDark
            ? '0 16px 36px -4px rgba(0, 0, 0, 0.65), 0 0 20px rgba(239, 68, 68, 0.1)'
            : '0 12px 32px -4px rgba(15, 23, 42, 0.12), 0 0 20px rgba(239, 68, 68, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5,
          width: '100%',
          animation: 'errorToastPopIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          '@keyframes errorToastPopIn': {
            '0%': { transform: 'translateY(16px) scale(0.96)', opacity: 0 },
            '100%': { transform: 'translateY(0) scale(1)', opacity: 1 },
          },
        }}
      >
        {/* Header Row */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
            <Box
              sx={{
                width: 34,
                height: 34,
                borderRadius: '50%',
                background: isDark
                  ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.25) 0%, rgba(185, 28, 28, 0.35) 100%)'
                  : 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
                border: `1px solid ${isDark ? 'rgba(239, 68, 68, 0.4)' : 'rgba(239, 68, 68, 0.3)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: isDark ? '#f87171' : '#dc2626',
                flexShrink: 0,
              }}
            >
              <ErrorOutlineRoundedIcon sx={{ fontSize: 20 }} />
            </Box>

            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 700,
                fontSize: '0.875rem',
                color: 'text.primary',
                lineHeight: 1.2,
              }}
            >
              {t('common:status.error', 'AI Generation Notice')}
            </Typography>
          </Box>

          <Tooltip title={t('common:actions.close', 'Dismiss')}>
            <IconButton
              size="small"
              onClick={() => setGenerationError(null)}
              sx={{
                color: 'text.secondary',
                p: 0.5,
                mt: -0.5,
                mr: -0.5,
                '&:hover': {
                  bgcolor: alpha(muiTheme.palette.text.primary, 0.08),
                  color: 'text.primary',
                },
              }}
            >
              <CloseRoundedIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Error Details */}
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            fontSize: '0.8rem',
            lineHeight: 1.4,
            maxHeight: 80,
            overflowY: 'auto',
          }}
        >
          {generationError}
        </Typography>

        {/* Action Row */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1, pt: 0.25 }}>
          <Button
            variant="text"
            size="small"
            onClick={() => setGenerationError(null)}
            sx={{
              fontWeight: 600,
              fontSize: '0.78rem',
              textTransform: 'none',
              px: 1.5,
              py: 0.5,
              color: 'text.secondary',
              '&:hover': {
                bgcolor: alpha(muiTheme.palette.text.primary, 0.06),
                color: 'text.primary',
              },
            }}
          >
            {t('common:actions.cancel', 'Dismiss')}
          </Button>

          <Button
            variant="contained"
            size="small"
            startIcon={<SettingsRoundedIcon sx={{ fontSize: 15 }} />}
            onClick={() => {
              setGenerationError(null);
              setActiveTab('settings');
            }}
            sx={{
              fontWeight: 700,
              fontSize: '0.8rem',
              textTransform: 'none',
              px: 1.75,
              py: 0.6,
              background: isDark
                ? 'linear-gradient(135deg, #0284c7 0%, #1d4ed8 100%)'
                : 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
              color: '#ffffff',
              boxShadow: isDark
                ? '0 2px 10px rgba(2, 132, 199, 0.4)'
                : '0 2px 8px rgba(2, 132, 199, 0.25)',
              '&:hover': {
                background: isDark
                  ? 'linear-gradient(135deg, #0369a1 0%, #1e40af 100%)'
                  : 'linear-gradient(135deg, #0369a1 0%, #1d4ed8 100%)',
                boxShadow: isDark
                  ? '0 4px 14px rgba(2, 132, 199, 0.5)'
                  : '0 4px 14px rgba(2, 132, 199, 0.35)',
              },
            }}
          >
            {t('common:nav.settings', 'Open AI Settings')}
          </Button>
        </Box>
      </Paper>
    </Snackbar>
  );
};
