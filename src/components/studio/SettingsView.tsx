import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Tabs,
  Tab,
  Button,
  useTheme,
  alpha
} from '@mui/material';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import PsychologyRoundedIcon from '@mui/icons-material/PsychologyRounded';
import ShieldRoundedIcon from '@mui/icons-material/ShieldRounded';
import LanguageRoundedIcon from '@mui/icons-material/LanguageRounded';
import DeleteSweepRoundedIcon from '@mui/icons-material/DeleteSweepRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded';
import { useTranslation } from 'react-i18next';
import { AIProviderSettings } from '../../types/cv';
import { DEFAULT_RULES } from '../../core/ai-service';
import { SettingsAiTab } from './settings/SettingsAiTab';
import { SettingsRulesTab } from './settings/SettingsRulesTab';
import { LanguageSelector } from './LanguageSelector';
import { SettingsViewProps } from '../../types';
import { APP_LINKS } from '../../constants/links';

export type { SettingsViewProps };

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onSettingsChange,
  rules,
  onRulesChange,
  onResetDefaults,
}) => {
  const { t } = useTranslation(['settings', 'common']);
  const muiTheme = useTheme();
  const isDark = muiTheme.palette.mode === 'dark';
  const [activeTab, setActiveTab] = useState<'ai' | 'rules' | 'general'>('ai');

  return (
    <Box sx={{ width: '100%', maxWidth: 1200, mx: 'auto', p: { xs: 1.5, sm: 2, md: 3 }, display: 'flex', flexDirection: 'column', gap: { xs: 2, md: 3 }, boxSizing: 'border-box' }}>
      {/* Header Banner */}
      <Paper
        sx={{
          p: { xs: 1.5, sm: 2.5 },
          border: `1px solid ${muiTheme.palette.divider}`,
          bgcolor: 'background.paper',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'stretch', md: 'center' },
          justifyContent: 'space-between',
          gap: 2,
          width: '100%',
          boxSizing: 'border-box',
          overflow: 'hidden',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              bgcolor: alpha(muiTheme.palette.primary.main, 0.12),
              color: muiTheme.palette.primary.main,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <SettingsRoundedIcon />
          </Box>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography variant="h5" sx={{ fontWeight: 800, fontSize: { xs: '1.15rem', sm: '1.4rem' } }}>
              {t('settings:title', 'Settings & AI Configuration')}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
              {t('settings:subtitle', 'Manage your AI providers, custom tailoring rules, and application preferences.')}
            </Typography>
          </Box>
        </Box>

        <Tabs
          value={activeTab}
          onChange={(_, val) => setActiveTab(val)}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{
            minHeight: 40,
            width: { xs: '100%', md: 'auto' },
            maxWidth: '100%',
            bgcolor: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)',
            borderRadius: '9999px',
            p: 0.5,
            border: `1px solid ${muiTheme.palette.divider}`,
            '& .MuiTabs-scroller': {
              overflowX: 'auto !important',
            },
            '& .MuiTabs-indicator': {
              display: 'none',
            },
            '& .MuiTab-root': {
              minHeight: 34,
              borderRadius: '9999px',
              px: { xs: 1.25, sm: 2 },
              py: 0.5,
              fontSize: { xs: '0.74rem', sm: '0.825rem' },
              fontWeight: 600,
              color: 'text.secondary',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              '&.Mui-selected': {
                bgcolor: 'primary.main',
                color: isDark ? '#041e2e' : '#ffffff',
                boxShadow: isDark
                  ? '0 2px 8px rgba(56, 189, 248, 0.35)'
                  : '0 2px 8px rgba(2, 132, 199, 0.25)',
              },
            },
          }}
        >
          <Tab
            value="ai"
            icon={<PsychologyRoundedIcon fontSize="small" />}
            iconPosition="start"
            label={t('settings:tabs.providers', 'AI Providers')}
          />
          <Tab
            value="rules"
            icon={<ShieldRoundedIcon fontSize="small" />}
            iconPosition="start"
            label={t('settings:tabs.rules', 'Prompt & ATS Rules')}
          />
          <Tab
            value="general"
            icon={<LanguageRoundedIcon fontSize="small" />}
            iconPosition="start"
            label={t('settings:tabs.general', 'General & Language')}
          />
        </Tabs>
      </Paper>

      {/* Tab Panels */}
      {activeTab === 'ai' && (
        <SettingsAiTab
          settings={settings}
          onSettingsChange={onSettingsChange}
        />
      )}

      {activeTab === 'rules' && (
        <SettingsRulesTab
          rules={rules}
          onRulesChange={onRulesChange}
          defaultRules={DEFAULT_RULES}
        />
      )}

      {activeTab === 'general' && (
        <Paper
          sx={{
            p: { xs: 1.75, sm: 2.5, md: 3 },
            border: `1px solid ${muiTheme.palette.divider}`,
            bgcolor: 'background.paper',
            borderRadius: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: 2.5,
            width: '100%',
            boxSizing: 'border-box',
            overflow: 'hidden',
          }}
        >
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 0.5, fontSize: { xs: '1rem', sm: '1.25rem' } }}>
              {t('settings:general.title', 'Application Preferences')}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
              {t('settings:general.languageHelp', 'Select the language used for navigation, instructions, and menus across CV Studio.')}
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'flex',
              alignItems: { xs: 'flex-start', sm: 'center' },
              justifyContent: 'space-between',
              p: 2,
              borderRadius: '12px',
              border: `1px solid ${muiTheme.palette.divider}`,
              bgcolor: isDark ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.01)',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2,
            }}
          >
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                {t('settings:general.language', 'App Display Language')}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {t('common:language.chooseLanguage', 'Select language')}
              </Typography>
            </Box>
            <LanguageSelector variant="full" />
          </Box>
        </Paper>
      )}

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
          overflow: 'hidden',
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
              {t('common:footer.craftedBy', 'Crafted by')} <strong>{APP_LINKS.AUTHOR_NAME}</strong> · {t('common:footer.privacyNote', 'All data remains in your browser storage.')}
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
          {t('common:nav.starGithub', 'Star on GitHub')}
        </Button>
      </Paper>

      {/* Danger Zone */}
      <Paper
        sx={{
          p: { xs: 1.5, sm: 2 },
          border: `1px solid ${alpha(muiTheme.palette.error.main, 0.3)}`,
          bgcolor: alpha(muiTheme.palette.error.main, isDark ? 0.04 : 0.02),
          display: 'flex',
          alignItems: { xs: 'flex-start', sm: 'center' },
          justifyContent: 'space-between',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 1.5,
          width: '100%',
          boxSizing: 'border-box',
          overflow: 'hidden',
        }}
      >
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'error.main' }}>
            {t('settings:general.resetWorkspace', 'Reset Workspace & Clear Local Storage')}
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
          sx={{ width: { xs: '100%', sm: 'auto' }, flexShrink: 0 }}
        >
          {t('common:actions.reset', 'Reset Workspace')}
        </Button>
      </Paper>
    </Box>
  );
};
