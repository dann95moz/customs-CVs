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
        zIndex: (theme) => theme.zIndex.snackbar,
        maxWidth: { xs: 'calc(100vw - 32px)', sm: 360 },
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 2,
          borderRadius: 2,
          bgcolor: (theme) => alpha(theme.palette.background.paper, 0.96),
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: (theme) => `1px solid ${alpha(theme.palette.primary.main, isDark ? 0.25 : 0.2)}`,
          boxShadow: (theme) => theme.shadows[8],
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
                borderRadius: (theme) => `${theme.shape.borderRadius}px`,
                background: (theme) =>
                  `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'common.white',
                flexShrink: 0,
                boxShadow: (theme) => `0 4px 12px ${alpha(theme.palette.primary.main, 0.35)}`,
              }}
            >
              <StarRoundedIcon sx={{ fontSize: 20, color: 'common.white' }} />
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
              {t('common:footer.toastTitle', 'Enjoying your CV?')}
            </Typography>
          </Box>

          <Tooltip title={t('common:actions.close', 'Dismiss')}>
            <IconButton
              size="small"
              onClick={onClose}
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

        {/* Content Description */}
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            fontSize: '0.8rem',
            lineHeight: 1.4,
          }}
        >
          {t('common:footer.communityNote', 'If CV Studio helped you land an interview, a star on GitHub helps more people find it.')}
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
            color="primary"
            size="small"
            onClick={onStarClick}
            endIcon={<OpenInNewRoundedIcon sx={{ fontSize: 14 }} />}
            sx={{
              fontWeight: 700,
              fontSize: '0.8rem',
              textTransform: 'none',
              px: 1.5,
              py: 0.6,
            }}
          >
            {t('common:footer.giveStar', 'Give a star')}
          </Button>
        </Box>
      </Paper>
    </Snackbar>
  );
};
