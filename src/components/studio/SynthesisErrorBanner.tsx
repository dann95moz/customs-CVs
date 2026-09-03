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

export interface SynthesisErrorBannerProps {
  error: string | null;
  onDismiss: () => void;
  onOpenSettings?: () => void;
}

export const SynthesisErrorBanner: React.FC<SynthesisErrorBannerProps> = React.memo(({
  error,
  onDismiss,
  onOpenSettings,
}) => {
  const { t } = useTranslation(['common', 'settings']);
  const muiTheme = useTheme();
  const isDark = muiTheme.palette.mode === 'dark';

  if (!error) return null;

  return (
    <Snackbar
      open={Boolean(error)}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      sx={{
        bottom: { xs: 16, sm: 24 },
        left: { xs: 16, sm: 24 },
        right: 'auto !important',
        zIndex: (theme) => theme.zIndex.snackbar,
        maxWidth: { xs: 'calc(100vw - 32px)', sm: 400 },
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 2.25,
          borderRadius: 2,
          bgcolor: 'background.paper',
          border: `1px solid ${alpha(muiTheme.palette.error.main, 0.3)}`,
          boxShadow: 8,
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
                bgcolor: alpha(muiTheme.palette.error.main, isDark ? 0.2 : 0.1),
                border: `1px solid ${alpha(muiTheme.palette.error.main, 0.3)}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'error.main',
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
              onClick={onDismiss}
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
          {error}
        </Typography>

        {/* Action Row */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1, pt: 0.25 }}>
          <Button
            variant="text"
            size="small"
            onClick={onDismiss}
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

          {onOpenSettings && (
            <Button
              variant="contained"
              color="primary"
              size="small"
              startIcon={<SettingsRoundedIcon sx={{ fontSize: 15 }} />}
              onClick={onOpenSettings}
              sx={{
                fontWeight: 700,
                fontSize: '0.8rem',
                textTransform: 'none',
                px: 1.75,
                py: 0.6,
              }}
            >
              {t('common:nav.settings', 'Open AI Settings')}
            </Button>
          )}
        </Box>
      </Paper>

    </Snackbar>
  );
});
