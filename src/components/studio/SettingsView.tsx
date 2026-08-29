import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  useTheme,
  alpha
} from '@mui/material';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import DeleteSweepRoundedIcon from '@mui/icons-material/DeleteSweepRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded';
import { useTranslation } from 'react-i18next';
import { SettingsAiTab } from './settings/SettingsAiTab';
import { SettingsViewProps } from '../../types';
import { APP_LINKS } from '../../constants/links';

export type { SettingsViewProps };

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onSettingsChange,
  onResetDefaults,
}) => {
  const { t } = useTranslation(['settings', 'common']);
  const muiTheme = useTheme();
  const isDark = muiTheme.palette.mode === 'dark';

  return (
    <Box sx={{ width: '100%', maxWidth: 1200, mx: 'auto', p: { xs: 1.5, sm: 2, md: 3 }, display: 'flex', flexDirection: 'column', gap: { xs: 2, md: 3 }, boxSizing: 'border-box' }}>
      {/* Header Banner */}
      <Paper
        sx={{
          p: { xs: 2, sm: 2.5 },
          border: `1px solid ${muiTheme.palette.divider}`,
          bgcolor: 'background.paper',
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          width: '100%',
          boxSizing: 'border-box',
          borderRadius: '16px',
        }}
      >
        <Box
          sx={{
            width: 46,
            height: 46,
            borderRadius: '12px',
            bgcolor: alpha(muiTheme.palette.primary.main, 0.12),
            color: muiTheme.palette.primary.main,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <SettingsRoundedIcon fontSize="medium" />
        </Box>
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: 800, fontSize: { xs: '1.15rem', sm: '1.35rem' } }}>
            {t('settings:title', 'Settings & AI Configuration')}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
            {t('settings:subtitle', 'Configure your AI engine provider, model credentials, and generation parameters.')}
          </Typography>
        </Box>
      </Paper>

      {/* Main AI Configuration Panel */}
      <SettingsAiTab
        settings={settings}
        onSettingsChange={onSettingsChange}
      />

      {/* Open Source & Community Credit */}
      <Paper
        sx={{
          p: { xs: 1.75, sm: 2.5 },
          border: `1px solid ${isDark ? 'rgba(56, 189, 248, 0.22)' : 'rgba(2, 132, 199, 0.18)'}`,
          bgcolor: isDark ? 'rgba(16, 22, 35, 0.7)' : 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderRadius: '20px',
          boxShadow: isDark
            ? '0 12px 32px -4px rgba(0, 0, 0, 0.5), 0 0 20px rgba(56, 189, 248, 0.08)'
            : '0 8px 24px -4px rgba(15, 23, 42, 0.08), 0 0 16px rgba(2, 132, 199, 0.06)',
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'flex-start', sm: 'center' },
          justifyContent: 'space-between',
          gap: 2,
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, minWidth: 0, flex: 1 }}>
          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: isDark
                ? '0 4px 14px rgba(2, 132, 199, 0.45)'
                : '0 4px 12px rgba(2, 132, 199, 0.25)',
            }}
          >
            <StarRoundedIcon sx={{ fontSize: 24, color: '#ffffff' }} />
          </Box>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'text.primary', fontSize: { xs: '0.9rem', sm: '1rem' } }}>
              {t('common:footer.openSource', 'Open Source & Community')}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.78rem', sm: '0.875rem' } }}>
              {t('common:footer.craftedBy', 'Crafted by')} <strong>{APP_LINKS.AUTHOR_NAME}</strong> · {t('common:footer.communityNote', 'If CV Studio helped you land an interview, a star on GitHub helps more people find it.')}
            </Typography>
          </Box>
        </Box>

        <Button
          variant="contained"
          size="small"
          startIcon={<StarRoundedIcon sx={{ fontSize: 18 }} />}
          endIcon={<OpenInNewRoundedIcon sx={{ fontSize: 14 }} />}
          href={APP_LINKS.GITHUB_REPO}
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            flexShrink: 0,
            width: { xs: '100%', sm: 'auto' },
            fontWeight: 700,
            fontSize: '0.82rem',
            textTransform: 'none',
            px: 2.5,
            py: 0.9,
            background: isDark
              ? 'linear-gradient(135deg, #0284c7 0%, #1d4ed8 100%)'
              : 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
            color: '#ffffff',
            boxShadow: isDark
              ? '0 2px 12px rgba(2, 132, 199, 0.4)'
              : '0 2px 10px rgba(2, 132, 199, 0.25)',
            '&:hover': {
              background: isDark
                ? 'linear-gradient(135deg, #0369a1 0%, #1e40af 100%)'
                : 'linear-gradient(135deg, #0369a1 0%, #1d4ed8 100%)',
              boxShadow: isDark
                ? '0 4px 16px rgba(2, 132, 199, 0.55)'
                : '0 4px 14px rgba(2, 132, 199, 0.35)',
            },
          }}
        >
          {t('common:footer.giveStar', 'Give a star')}
        </Button>
      </Paper>

      {/* Danger Zone: Reset Workspace */}
      <Paper
        sx={{
          p: { xs: 1.75, sm: 2.25 },
          borderRadius: '16px',
          border: `1px solid ${alpha(muiTheme.palette.error.main, 0.3)}`,
          bgcolor: alpha(muiTheme.palette.error.main, isDark ? 0.04 : 0.02),
          display: 'flex',
          alignItems: { xs: 'flex-start', sm: 'center' },
          justifyContent: 'space-between',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 1.5,
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'error.main' }}>
            {t('settings:general.resetWorkspace', 'Reset Entire Workspace')}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
            {t('settings:general.resetConfirm', 'Permanently resets all draft texts, API keys, and configurations back to clean blank defaults.')}
          </Typography>
        </Box>

        <Button
          variant="outlined"
          color="error"
          size="small"
          startIcon={<DeleteSweepRoundedIcon />}
          onClick={onResetDefaults}
          sx={{ width: { xs: '100%', sm: 'auto' }, flexShrink: 0, fontWeight: 700 }}
        >
          {t('common:actions.reset', 'Reset Workspace')}
        </Button>
      </Paper>
    </Box>
  );
};
