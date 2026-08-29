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
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded';
import { useTranslation } from 'react-i18next';
import { GitHubStarToastProps } from '../../types';

export type { GitHubStarToastProps };

export const GitHubStarToast: React.FC<GitHubStarToastProps> = ({
  open,
  onClose,
  onStarClick,
}) => {
  const { t } = useTranslation(['common']);
  const muiTheme = useTheme();
  const isDark = muiTheme.palette.mode === 'dark';

  return (
    <Snackbar
      open={open}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      sx={{
        bottom: { xs: 16, sm: 24 },
        right: { xs: 16, sm: 24 },
        left: 'auto !important',
        zIndex: 1400,
        maxWidth: { xs: 'calc(100vw - 32px)', sm: 360 },
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 2,
          borderRadius: '16px',
          bgcolor: isDark ? 'rgba(16, 22, 35, 0.94)' : 'rgba(255, 255, 255, 0.96)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: `1px solid ${isDark ? 'rgba(56, 189, 248, 0.22)' : 'rgba(2, 132, 199, 0.18)'}`,
          boxShadow: isDark
            ? '0 16px 36px -4px rgba(0, 0, 0, 0.65), 0 0 24px rgba(56, 189, 248, 0.12)'
            : '0 12px 32px -4px rgba(15, 23, 42, 0.12), 0 0 20px rgba(2, 132, 199, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5,
          width: '100%',
          animation: 'toastCornerPopIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          '@keyframes toastCornerPopIn': {
            '0%': { transform: 'translateY(16px) scale(0.96)', opacity: 0 },
            '100%': { transform: 'translateY(0) scale(1)', opacity: 1 },
          },
        }}
      >
        {/* Header Row: Badge, Title & Close Button */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
            {/* Native Blue/Cyan Star Badge */}
            <Box
              sx={{
                width: 34,
                height: 34,
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                flexShrink: 0,
                boxShadow: isDark
                  ? '0 4px 12px rgba(2, 132, 199, 0.4)'
                  : '0 4px 12px rgba(2, 132, 199, 0.25)',
              }}
            >
              <StarRoundedIcon sx={{ fontSize: 20, color: '#f8fafc' }} />
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
              Enjoying your CV?
            </Typography>
          </Box>

          <Tooltip title={t('common:actions.close', 'Dismiss')}>
            <IconButton
              size="small"
              onClick={onClose}
              sx={{
                color: 'text.secondary',
                p: 0.5,
                borderRadius: '8px',
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

        {/* Content Description */}
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            fontSize: '0.8rem',
            lineHeight: 1.4,
          }}
        >
          If CV Studio helped you tailor your resume, a star on GitHub supports this free, private project!
        </Typography>

        {/* Action Row */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1, pt: 0.25 }}>
          <Button
            variant="text"
            size="small"
            onClick={onClose}
            sx={{
              fontWeight: 600,
              fontSize: '0.78rem',
              textTransform: 'none',
              borderRadius: '8px',
              px: 1.25,
              py: 0.5,
              color: 'text.secondary',
              '&:hover': {
                bgcolor: alpha(muiTheme.palette.text.primary, 0.06),
                color: 'text.primary',
              },
            }}
          >
            {t('common:actions.cancel', 'Maybe later')}
          </Button>

          <Button
            variant="contained"
            size="small"
            onClick={onStarClick}
            endIcon={<OpenInNewRoundedIcon sx={{ fontSize: 14 }} />}
            sx={{
              fontWeight: 700,
              fontSize: '0.8rem',
              textTransform: 'none',
              borderRadius: '8px',
              px: 1.5,
              py: 0.6,
              background: isDark
                ? 'linear-gradient(135deg, #0284c7 0%, #1d4ed8 100%)'
                : 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
              color: '#ffffff',
              boxShadow: isDark
                ? '0 2px 10px rgba(2, 132, 199, 0.4)'
                : '0 2px 10px rgba(2, 132, 199, 0.25)',
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
            Star on GitHub
          </Button>
        </Box>
      </Paper>
    </Snackbar>
  );
};
