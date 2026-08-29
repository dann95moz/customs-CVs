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

export const StudioNavbar: React.FC = () => {
  const { mode, toggleThemeMode } = useThemeMode();
  const muiTheme = useTheme();
  const isDark = muiTheme.palette.mode === 'dark';

  const activeTab = useResumeStore((s) => s.activeTab);
  const setActiveTab = useResumeStore((s) => s.setActiveTab);
  const savedVersionsCount = useResumeStore((s) => s.savedVersions.length);


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
      }}
    >
      <Toolbar
        variant="dense"
        disableGutters
        sx={{
          px: { xs: 1.5, md: 3 },
          minHeight: 56,
          display: 'flex',
          justifyContent: 'space-between',
          gap: 2,
        }}
      >
        {/* Brand Logo & Name */}
        <Tooltip title="View Product Overview & Guide">
          <Box
            onClick={() => setActiveTab('landing')}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.25,
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
                width: 32,
                height: 32,
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #0284c7 0%, #6366f1 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 2px 8px rgba(56, 189, 248, 0.3)',
              }}
            >
              <AutoAwesomeRoundedIcon sx={{ fontSize: 18 }} />
            </Box>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 800,
                letterSpacing: '-0.02em',
                background: 'linear-gradient(135deg, #38bdf8 0%, #a5b4fc 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: { xs: 'none', sm: 'block' },
              }}
            >
              CV Studio
            </Typography>
          </Box>
        </Tooltip>

        {/* Primary Navigation Tabs */}
        <Tabs
          value={activeTab === 'landing' ? false : activeTab}
          onChange={(_, val: StudioTab) => setActiveTab(val)}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{
            minHeight: 48,
            '& .MuiTabs-scroller': {
              overflowX: 'auto !important',
            },
            '& .MuiTabs-indicator': {
              height: 3,
              borderRadius: '3px 3px 0 0',
            },
            '& .MuiTab-root': {
              minHeight: 48,
              minWidth: { xs: 80, sm: 110, md: 130 },
              px: { xs: 1.25, sm: 2 },
              fontSize: { xs: '0.78rem', sm: '0.84rem' },
              fontWeight: 600,
              textTransform: 'none',
            },
          }}
        >
          <Tab
            value="wizard"
            icon={<AutoAwesomeRoundedIcon sx={{ fontSize: 18 }} />}
            iconPosition="start"
            label="Resume Studio"
          />
          <Tab
            value="history"
            icon={<BusinessRoundedIcon sx={{ fontSize: 18 }} />}
            iconPosition="start"
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <span>My Applications</span>
                {savedVersionsCount > 0 && (
                  <Chip
                    label={savedVersionsCount}
                    size="small"
                    color="primary"
                    sx={{ height: 18, fontSize: '0.68rem', fontWeight: 700 }}
                  />
                )}
              </Box>
            }
          />
          <Tab
            value="settings"
            icon={<SettingsRoundedIcon sx={{ fontSize: 18 }} />}
            iconPosition="start"
            label="Settings &amp; AI"
          />
        </Tabs>

        {/* Quick Actions & Theme Switcher */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
          {/* GitHub Star Link */}
          <Tooltip title="Star on GitHub ⭐">
            <IconButton
              component="a"
              href={APP_LINKS.GITHUB_REPO}
              target="_blank"
              rel="noopener noreferrer"
              size="small"
              sx={{
                p: 0.75,
                borderRadius: '10px',
                border: `1px solid ${muiTheme.palette.divider}`,
                color: 'text.secondary',
                bgcolor: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.03)',
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
                  color: 'primary.main',
                  borderColor: alpha(muiTheme.palette.primary.main, 0.5),
                },
              }}
            >
              <Icon type="github" size={16} style={{ margin: 0 }} />
            </IconButton>
          </Tooltip>

          {/* Dark / Light Mode Toggle */}
          <Tooltip title={`Switch to ${mode === 'dark' ? 'Light' : 'Dark'} mode`}>
            <IconButton
              onClick={toggleThemeMode}
              size="small"
              sx={{
                p: 0.75,
                borderRadius: '10px',
                border: `1px solid ${muiTheme.palette.divider}`,
                color: mode === 'dark' ? '#fbbf24' : '#0284c7',
                bgcolor: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.03)',
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
                },
              }}
            >
              {mode === 'dark' ? (
                <LightModeRoundedIcon fontSize="small" />
              ) : (
                <DarkModeRoundedIcon fontSize="small" />
              )}
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
