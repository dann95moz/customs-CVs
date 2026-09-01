import React from 'react';
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Chip,
  Button,
  Tooltip,
  useTheme,
  alpha
} from '@mui/material';

import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import CodeRoundedIcon from '@mui/icons-material/CodeRounded';
import WorkRoundedIcon from '@mui/icons-material/WorkRounded';
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded';
import TranslateRoundedIcon from '@mui/icons-material/TranslateRounded';
import RocketLaunchRoundedIcon from '@mui/icons-material/RocketLaunchRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import { useTranslation } from 'react-i18next';
import { CustomSection } from '../../../types/cv';
import { getPresetIcon } from './CustomSectionPanel';

export type ProfileSectionKey =
  | 'personal'
  | 'summary'
  | 'skills'
  | 'experience'
  | 'education'
  | 'languages'
  | 'projects'
  | string;

export interface ProfileSectionMeta {
  key: ProfileSectionKey;
  labelKey?: string;
  defaultLabel: string;
  icon: React.ReactElement;
  count?: number;
  isComplete?: boolean;
}

export interface ProfileNavRailProps {
  activeSection: ProfileSectionKey;
  onSectionChange: (section: ProfileSectionKey) => void;
  sectionCounts: {
    personalComplete: boolean;
    summaryComplete: boolean;
    skillsCount: number;
    experienceCount: number;
    educationCount: number;
    languagesCount: number;
    projectsCount: number;
  };
  customSections?: CustomSection[];
  onAddSectionClick?: () => void;
}


export const ProfileNavRail: React.FC<ProfileNavRailProps> = ({
  activeSection,
  onSectionChange,
  sectionCounts,
  customSections = [],
  onAddSectionClick,
}) => {
  const { t } = useTranslation(['profile', 'common']);
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const standardSections: ProfileSectionMeta[] = [
    {
      key: 'personal',
      labelKey: 'profile:nav.personal',
      defaultLabel: 'Info personal',
      icon: <PersonRoundedIcon sx={{ fontSize: 18 }} />,
      isComplete: sectionCounts.personalComplete
    },
    {
      key: 'summary',
      labelKey: 'profile:nav.summary',
      defaultLabel: 'Resumen',
      icon: <DescriptionRoundedIcon sx={{ fontSize: 18 }} />,
      isComplete: sectionCounts.summaryComplete
    },
    {
      key: 'skills',
      labelKey: 'profile:nav.skills',
      defaultLabel: 'Habilidades',
      icon: <CodeRoundedIcon sx={{ fontSize: 18 }} />,
      count: sectionCounts.skillsCount
    },
    {
      key: 'experience',
      labelKey: 'profile:nav.experience',
      defaultLabel: 'Experiencia',
      icon: <WorkRoundedIcon sx={{ fontSize: 18 }} />,
      count: sectionCounts.experienceCount
    },
    {
      key: 'education',
      labelKey: 'profile:nav.education',
      defaultLabel: 'Educación',
      icon: <SchoolRoundedIcon sx={{ fontSize: 18 }} />,
      count: sectionCounts.educationCount
    },
    {
      key: 'languages',
      labelKey: 'profile:nav.languages',
      defaultLabel: 'Idiomas',
      icon: <TranslateRoundedIcon sx={{ fontSize: 18 }} />,
      count: sectionCounts.languagesCount
    },
    {
      key: 'projects',
      labelKey: 'profile:nav.projects',
      defaultLabel: 'Proyectos',
      icon: <RocketLaunchRoundedIcon sx={{ fontSize: 18 }} />,
      count: sectionCounts.projectsCount
    }
  ];

  const customSectionMetas: ProfileSectionMeta[] = (customSections || []).map((cs) => ({
    key: `custom_${cs.id}`,
    defaultLabel: cs.title,
    icon: getPresetIcon(cs.presetType, 18),
    count: cs.items?.length || 0,
  }));

  const allSections = [...standardSections, ...customSectionMetas];

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'row', md: 'column' },
        width: { xs: '100%', md: 220 },
        flexShrink: 0,
        borderRight: { xs: 'none', md: `1px solid ${theme.palette.divider}` },
        borderBottom: { xs: `1px solid ${theme.palette.divider}`, md: 'none' },
        bgcolor: isDark ? 'rgba(255, 255, 255, 0.015)' : 'rgba(0, 0, 0, 0.012)',
        overflowX: { xs: 'auto', md: 'visible' },
        py: { xs: 0.5, md: 1 },
        px: { xs: 0.5, md: 1 },
        gap: 0.5
      }}
    >
      <Tabs
        orientation="vertical"
        value={activeSection}
        onChange={(_e, val) => onSectionChange(val as ProfileSectionKey)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          display: { xs: 'none', md: 'flex' },
          '& .MuiTabs-indicator': {
            display: 'none'
          },
          '& .MuiTabs-flexContainer': {
            gap: '3px'
          }
        }}
      >
        {allSections.map((sec) => {
          const isActive = activeSection === sec.key;
          const displayLabel = sec.labelKey ? t(sec.labelKey, sec.defaultLabel) : sec.defaultLabel;
          return (
            <Tab
              key={sec.key}
              value={sec.key}
              label={
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    gap: 1.25
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, minWidth: 0, flex: 1 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: isActive ? 'primary.main' : 'text.secondary',
                        flexShrink: 0
                      }}
                    >
                      {sec.icon}
                    </Box>
                    <Typography
                      variant="body2"
                      noWrap
                      sx={{
                        fontWeight: isActive ? 700 : 500,
                        color: isActive ? 'primary.main' : 'text.primary',
                        fontSize: '0.86rem'
                      }}
                    >
                      {displayLabel}
                    </Typography>
                  </Box>

                  {/* Indicator: Checkmark if completed, or number badge */}
                  {sec.isComplete ? (
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'success.main',
                        fontSize: '0.85rem'
                      }}
                    >
                      <CheckRoundedIcon sx={{ fontSize: 16, fontWeight: 900 }} />
                    </Box>
                  ) : typeof sec.count === 'number' && sec.count > 0 ? (
                    <Chip
                      label={sec.count}
                      size="small"
                      color={isActive ? 'primary' : 'default'}
                      variant={isActive ? 'filled' : 'outlined'}
                      sx={{
                        height: 20,
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        px: 0.25
                      }}
                    />
                  ) : null}
                </Box>
              }
              sx={{
                minHeight: 40,
                py: 0.75,
                px: 1.5,
                borderRadius: '8px',
                textTransform: 'none',
                alignItems: 'stretch',
                bgcolor: isActive
                  ? isDark
                    ? alpha(theme.palette.primary.main, 0.15)
                    : alpha(theme.palette.primary.main, 0.08)
                  : 'transparent',
                '&:hover': {
                  bgcolor: isActive
                    ? isDark
                      ? alpha(theme.palette.primary.main, 0.2)
                      : alpha(theme.palette.primary.main, 0.12)
                    : isDark
                    ? 'rgba(255, 255, 255, 0.04)'
                    : 'rgba(0, 0, 0, 0.03)'
                },
                transition: 'all 0.15s ease-in-out'
              }}
            />
          );
        })}
      </Tabs>

      {/* Add Custom Section Action Button (Desktop) */}
      {onAddSectionClick && (
        <Box sx={{ display: { xs: 'none', md: 'block' }, pt: 1, px: 0.5 }}>
          <Button
            fullWidth
            size="small"
            variant="outlined"
            color="primary"
            startIcon={<AddCircleOutlineRoundedIcon sx={{ fontSize: 16 }} />}
            onClick={onAddSectionClick}
            sx={{
              borderStyle: 'dashed',
              textTransform: 'none',
              fontWeight: 700,
              fontSize: '0.8rem',
              py: 0.8,
              justifyContent: 'flex-start',
              px: 1.5,
              borderRadius: '8px',
            }}
          >
            {t('profile:customSections.addSectionBtn', 'Agregar Sección')}
          </Button>
        </Box>
      )}

      {/* Horizontal Tabs for Mobile View */}
      <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 0.5, width: '100%' }}>
        <Tabs
          orientation="horizontal"
          value={activeSection}
          onChange={(_e, val) => onSectionChange(val as ProfileSectionKey)}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{
            flex: 1,
            minHeight: 40,
            '& .MuiTabs-indicator': {
              borderRadius: '3px',
              height: 3
            }
          }}
        >
          {allSections.map((sec) => {
            const isActive = activeSection === sec.key;
            const displayLabel = sec.labelKey ? t(sec.labelKey, sec.defaultLabel) : sec.defaultLabel;
            return (
              <Tab
                key={sec.key}
                value={sec.key}
                icon={sec.icon}
                iconPosition="start"
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                    <span>{displayLabel}</span>
                    {sec.isComplete ? (
                      <CheckRoundedIcon sx={{ fontSize: 14, color: 'success.main' }} />
                    ) : typeof sec.count === 'number' && sec.count > 0 ? (
                      <Chip
                        label={sec.count}
                        size="small"
                        color={isActive ? 'primary' : 'default'}
                        sx={{ height: 18, fontSize: '0.68rem', px: 0 }}
                      />
                    ) : null}
                  </Box>
                }
                sx={{
                  minHeight: 38,
                  py: 0.5,
                  px: 1.25,
                  textTransform: 'none',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.8rem'
                }}
              />
            );
          })}
        </Tabs>

        {/* Add Section Action Button (Mobile) */}
        {onAddSectionClick && (
          <Box sx={{ px: 0.5 }}>
            <Tooltip title={t('profile:customSections.addSectionBtn', 'Agregar Sección')}>
              <Button
                size="small"
                variant="outlined"
                color="primary"
                startIcon={<AddCircleOutlineRoundedIcon sx={{ fontSize: 15 }} />}
                onClick={onAddSectionClick}
                sx={{
                  borderStyle: 'dashed',
                  textTransform: 'none',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  py: 0.4,
                  px: 1,
                  borderRadius: '8px',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                }}
              >
                {t('profile:customSections.addSectionBtnShort', 'Sección +')}
              </Button>
            </Tooltip>
          </Box>
        )}
      </Box>
    </Box>
  );
};

