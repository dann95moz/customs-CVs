import React from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  Tabs,
  Tab,
  Button,
  ButtonGroup,
  IconButton,
  Tooltip,
  Chip,
  useTheme,
  alpha,
} from '@mui/material';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import AssessmentRoundedIcon from '@mui/icons-material/AssessmentRounded';
import TrackChangesRoundedIcon from '@mui/icons-material/TrackChangesRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import PictureAsPdfRoundedIcon from '@mui/icons-material/PictureAsPdfRounded';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import BusinessRoundedIcon from '@mui/icons-material/BusinessRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import { useThemeMode } from '../../theme/ThemeContext';
import { useResumeStore } from '../../store';
import { StudioTab } from '../../types/cv';
import { Icon } from '../Icons';
import { APP_LINKS } from '../../constants/links';
import { LanguageSelector } from './LanguageSelector';
import { useTranslation } from 'react-i18next';

export const StudioNavbar: React.FC = () => {
  const { mode, toggleThemeMode } = useThemeMode();
  const { t } = useTranslation('common');
  const muiTheme = useTheme();
  const isDark = muiTheme.palette.mode === 'dark';

  const activeTab = useResumeStore((s) => s.activeTab);
  const setActiveTab = useResumeStore((s) => s.setActiveTab);
  const activeApplicationsCount = useResumeStore((s) => (s.applications || []).filter((a) => !a.isArchived).length);
  const savedVersionsCount = useResumeStore((s) => s.savedVersions.length);
  const displayBadgeCount = activeApplicationsCount > 0 ? activeApplicationsCount : savedVersionsCount;


  return (
    <AppBar
      position="sticky"
      elevation={0}
      className="no-print studio-navbar"
      sx={{
        bgcolor: 'background.paper',
        borderBottom: `1px solid ${muiTheme.palette.divider}`,
        color: 'text.primary',
        zIndex: 30,
        overflow: 'hidden',
      }}
    >
      <Toolbar
        variant="dense"
        disableGutters
        sx={{
          px: { xs: 1, sm: 2, md: 3 },
          minHeight: { xs: 52, sm: 56 },
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: { xs: 1, sm: 2 },
          overflowX: 'auto',
          overflowY: 'hidden',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
          width: '100%',
        }}
      >
        {/* Brand Logo & Name */}
        <Tooltip title={t('nav.viewOverview', 'View Product Overview & Guide')}>
          <Box
            onClick={() => setActiveTab('landing')}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: { xs: 0.75, sm: 1.25 },
              cursor: 'pointer',
              userSelect: 'none',
              flexShrink: 0,
              transition: 'transform 0.15s ease',
              '&:hover': {
                transform: 'scale(1.02)',
              },
            }}
          >
            <Box
              sx={{
                width: { xs: 28, sm: 32 },
                height: { xs: 28, sm: 32 },
                borderRadius: 1,
                bgcolor: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'primary.contrastText',
                boxShadow: 1,
              }}
            >
              <AutoAwesomeRoundedIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />
            </Box>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 800,
                letterSpacing: '-0.02em',
                color: 'text.primary',
                display: { xs: 'none', md: 'block' },
              }}
            >
              CV Studio
            </Typography>
          </Box>
        </Tooltip>


        {/* Primary Navigation Tabs with Smooth Horizontal Touch Slide */}
        <Tabs
          value={activeTab === 'landing' ? false : activeTab}
          onChange={(_, val: StudioTab) => setActiveTab(val)}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{
            minHeight: { xs: 44, sm: 48 },
            flex: { xs: '1 1 auto', sm: '0 1 auto' },
            minWidth: 0,
            mx: { xs: 0.25, sm: 1 },
            '& .MuiTabs-scroller': {
              overflowX: 'auto !important',
              WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'none',
              '&::-webkit-scrollbar': { display: 'none' },
            },
            '& .MuiTabs-flexContainer': {
              display: 'flex',
              flexWrap: 'nowrap',
              gap: { xs: 0.25, sm: 0.5 },
            },
            '& .MuiTabs-indicator': {
              height: 3,
              borderRadius: '3px 3px 0 0',
            },
            '& .MuiTab-root': {
              minHeight: { xs: 44, sm: 48 },
              minWidth: { xs: 52, sm: 80, md: 110 },
              px: { xs: 0.75, sm: 1.25, md: 2 },
              py: { xs: 0.5, sm: 1 },
              fontSize: { xs: '0.72rem', sm: '0.82rem' },
              fontWeight: 600,
              textTransform: 'none',
              whiteSpace: 'nowrap',
              gap: { xs: 0.5, sm: 0.75 },
            },
          }}
        >
          <Tab
            value="wizard"
            icon={<AutoAwesomeRoundedIcon sx={{ fontSize: { xs: 15, sm: 18 } }} />}
            iconPosition="start"
            label={
              <>
                <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                  {t('nav.resumeStudio', 'Resume Studio')}
                </Box>
                <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>
                  {t('nav.studio', 'Studio')}
                </Box>
              </>
            }
          />
          <Tab
            value="history"
            icon={<BusinessRoundedIcon sx={{ fontSize: { xs: 15, sm: 18 } }} />}
            iconPosition="start"
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                  {t('nav.myApplications', 'My Applications')}
                </Box>
                <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>
                  {t('nav.applicationsShort', 'Apps')}
                </Box>
                {displayBadgeCount > 0 && (
                  <Chip
                    label={displayBadgeCount}
                    size="small"
                    color="primary"
                    sx={{
                      height: 16,
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      '& .MuiChip-label': { px: 0.5 },
                    }}
                  />
                )}
              </Box>
            }
          />
          <Tab
            value="settings"
            icon={<SettingsRoundedIcon sx={{ fontSize: { xs: 15, sm: 18 } }} />}
            iconPosition="start"
            label={
              <>
                <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                  {t('nav.settingsAndAi', 'Settings & AI')}
                </Box>
                <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>
                  {t('nav.settingsShort', 'Settings')}
                </Box>
              </>
            }
          />
        </Tabs>

        {/* Quick Actions, Language Selector & Theme Switcher */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 0.75, md: 1 }, flexShrink: 0 }}>
          {/* Prominent Language Selector */}
          <LanguageSelector variant="navbar" />

          {/* GitHub Star Link */}
          <Tooltip title={t('nav.starGithub', 'Star on GitHub ⭐')}>
            <IconButton
              component="a"
              href={APP_LINKS.GITHUB_REPO}
              target="_blank"
              rel="noopener noreferrer"
              size="small"
              sx={{
                p: { xs: 0.5, sm: 0.75 },
                border: `1px solid ${muiTheme.palette.divider}`,
                color: 'text.secondary',
                bgcolor: alpha(muiTheme.palette.text.primary, 0.04),
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: alpha(muiTheme.palette.text.primary, 0.08),
                  color: 'primary.main',
                  borderColor: alpha(muiTheme.palette.primary.main, 0.5),
                },
              }}
            >
              <Icon type="github" size={15} style={{ margin: 0 }} />
            </IconButton>
          </Tooltip>

          {/* Dark / Light Mode Toggle */}
          <Tooltip title={t('nav.switchTheme', { mode: mode === 'dark' ? t('nav.light', 'Light') : t('nav.dark', 'Dark'), defaultValue: `Switch to ${mode === 'dark' ? 'Light' : 'Dark'} mode` })}>
            <IconButton
              onClick={toggleThemeMode}
              size="small"
              sx={{
                p: { xs: 0.5, sm: 0.75 },
                border: `1px solid ${muiTheme.palette.divider}`,
                color: mode === 'dark' ? 'warning.main' : 'primary.main',
                bgcolor: alpha(muiTheme.palette.text.primary, 0.04),
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: alpha(muiTheme.palette.text.primary, 0.08),
                },
              }}
            >
              {mode === 'dark' ? (
                <LightModeRoundedIcon sx={{ fontSize: { xs: 17, sm: 19 } }} />
              ) : (
                <DarkModeRoundedIcon sx={{ fontSize: { xs: 17, sm: 19 } }} />
              )}
            </IconButton>
          </Tooltip>
        </Box>

      </Toolbar>
    </AppBar>
  );
};
