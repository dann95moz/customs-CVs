import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Chip,
  Button,
  ButtonGroup,
  TextField,
  InputAdornment,
  useTheme,
  alpha,
} from '@mui/material';
import BusinessRoundedIcon from '@mui/icons-material/BusinessRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import ViewKanbanRoundedIcon from '@mui/icons-material/ViewKanbanRounded';
import Inventory2RoundedIcon from '@mui/icons-material/Inventory2Rounded';
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded';
import LayersRoundedIcon from '@mui/icons-material/LayersRounded';
import TrackChangesRoundedIcon from '@mui/icons-material/TrackChangesRounded';
import EmojiEventsRoundedIcon from '@mui/icons-material/EmojiEventsRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { useTranslation } from 'react-i18next';
import { ApplicationsStatsHeaderProps } from '../../../types';

export const ApplicationsStatsHeader: React.FC<ApplicationsStatsHeaderProps> = ({
  totalActiveApplications,
  totalInterviews,
  totalOffers,
  totalArchived,
  avgMatchScore,
  searchQuery,
  onSearchChange,
  onTrackNewApplication,
  onStartNewResume,
  activeView,
  onViewChange,
  savedVersionsCount,
}) => {
  const { t } = useTranslation(['history', 'common']);
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* Top Banner */}
      <Paper
        sx={{
          p: { xs: 2, md: 2.5 },
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'flex-start', md: 'center' },
          justifyContent: 'space-between',
          gap: 2,
          border: `1px solid ${theme.palette.divider}`,
          bgcolor: isDark ? 'rgba(16, 22, 35, 0.8)' : '#ffffff',
          borderRadius: '16px',
        }}
      >
        <Box>
          <Chip
            icon={<BusinessRoundedIcon sx={{ fontSize: '16px !important' }} />}
            label={t('history:badge', 'Application Tracker')}
            size="small"
            color="primary"
            variant="outlined"
            sx={{ mb: 1, fontWeight: 700 }}
          />
          <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.5 }}>
            {t('history:title', 'Job Applications Kanban Studio')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('history:subtitle', 'Track real job submissions with linked CV versions across customized recruitment stages.')}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, flexWrap: 'wrap' }}>
          {/* Track Application (Only show in header if there is at least 1 active application) */}
          {totalActiveApplications > 0 && (
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddRoundedIcon />}
              onClick={onTrackNewApplication}
              sx={{ fontWeight: 700, whiteSpace: 'nowrap', px: 2 }}
            >
              {t('history:actions.trackApp', '+ Track Application')}
            </Button>
          )}

          {/* New Tailored Resume in Wizard */}
          <Button
            variant={totalActiveApplications > 0 ? 'outlined' : 'contained'}
            color={totalActiveApplications > 0 ? 'inherit' : 'primary'}
            startIcon={<AutoAwesomeRoundedIcon />}
            onClick={onStartNewResume}
            sx={{ fontWeight: 700, whiteSpace: 'nowrap', px: 2 }}
          >
            {t('history:newApplication', 'Tailor New CV')}
          </Button>
        </Box>
      </Paper>

      {/* Metrics Summary Strip (Only visible when there is at least 1 active application) */}
      {totalActiveApplications > 0 && (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(4, 1fr)' },
            gap: 1.5,
          }}
        >
        {/* Active Applications */}
        <Paper
          sx={{
            p: 1.75,
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            border: `1px solid ${theme.palette.divider}`,
            bgcolor: 'background.paper',
            borderRadius: '12px',
          }}
        >
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '10px',
              bgcolor: alpha(theme.palette.primary.main, 0.12),
              color: theme.palette.primary.main,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <LayersRoundedIcon sx={{ fontSize: 20 }} />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="caption" color="text.secondary" noWrap sx={{ textTransform: 'uppercase', fontWeight: 700, fontSize: '0.68rem' }}>
              {t('history:stats.applied', 'Active Applications')}
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.1 }}>
              {totalActiveApplications}
            </Typography>
          </Box>
        </Paper>

        {/* Interviews & Tests */}
        <Paper
          sx={{
            p: 1.75,
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            border: `1px solid ${theme.palette.divider}`,
            bgcolor: 'background.paper',
            borderRadius: '12px',
          }}
        >
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '10px',
              bgcolor: alpha(theme.palette.secondary.main, 0.12),
              color: theme.palette.secondary.main,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <TrackChangesRoundedIcon sx={{ fontSize: 20 }} />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="caption" color="text.secondary" noWrap sx={{ textTransform: 'uppercase', fontWeight: 700, fontSize: '0.68rem' }}>
              {t('history:stats.interviews', 'In Interview')}
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 800, color: 'secondary.main', lineHeight: 1.1 }}>
              {totalInterviews}
            </Typography>
          </Box>
        </Paper>

        {/* Offers */}
        <Paper
          sx={{
            p: 1.75,
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            border: `1px solid ${theme.palette.divider}`,
            bgcolor: 'background.paper',
            borderRadius: '12px',
          }}
        >
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '10px',
              bgcolor: alpha(theme.palette.success.main, 0.12),
              color: theme.palette.success.main,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <EmojiEventsRoundedIcon sx={{ fontSize: 20 }} />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="caption" color="text.secondary" noWrap sx={{ textTransform: 'uppercase', fontWeight: 700, fontSize: '0.68rem' }}>
              {t('history:stats.offers', 'Offers Received')}
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 800, color: 'success.main', lineHeight: 1.1 }}>
              {totalOffers}
            </Typography>
          </Box>
        </Paper>

        {/* Avg Match Score */}
        <Paper
          sx={{
            p: 1.75,
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            border: `1px solid ${theme.palette.divider}`,
            bgcolor: 'background.paper',
            borderRadius: '12px',
          }}
        >
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '10px',
              bgcolor: alpha(theme.palette.warning.main, 0.12),
              color: theme.palette.warning.main,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <AutoAwesomeRoundedIcon sx={{ fontSize: 20 }} />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="caption" color="text.secondary" noWrap sx={{ textTransform: 'uppercase', fontWeight: 700, fontSize: '0.68rem' }}>
              {t('history:stats.avgMatch', 'Avg. Match')}
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 800, color: 'warning.main', lineHeight: 1.1 }}>
              {avgMatchScore > 0 ? `${avgMatchScore}%` : '—'}
            </Typography>
          </Box>
        </Paper>
      </Box>
      )}

      {/* Control Strip: View Tabs (Board / Archived / All Versions) + Search Input */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'stretch', sm: 'center' },
          justifyContent: 'space-between',
          gap: 1.5,
        }}
      >
        {/* Segmented View Switcher */}
        <ButtonGroup size="small" variant="outlined">
          <Button
            variant={activeView === 'board' ? 'contained' : 'outlined'}
            onClick={() => onViewChange('board')}
            startIcon={<ViewKanbanRoundedIcon sx={{ fontSize: 16 }} />}
            sx={{ fontWeight: 700, fontSize: '0.78rem', px: 1.5 }}
          >
            {t('history:views.board', 'Active Board')} ({totalActiveApplications})
          </Button>

          <Button
            variant={activeView === 'archived' ? 'contained' : 'outlined'}
            onClick={() => onViewChange('archived')}
            startIcon={<Inventory2RoundedIcon sx={{ fontSize: 16 }} />}
            sx={{ fontWeight: 700, fontSize: '0.78rem', px: 1.5 }}
          >
            {t('history:views.archived', 'Archived')} ({totalArchived})
          </Button>

          <Button
            variant={activeView === 'versions' ? 'contained' : 'outlined'}
            onClick={() => onViewChange('versions')}
            startIcon={<HistoryRoundedIcon sx={{ fontSize: 16 }} />}
            sx={{ fontWeight: 700, fontSize: '0.78rem', px: 1.5 }}
          >
            {t('history:views.allVersions', 'CV Versions History')} ({savedVersionsCount})
          </Button>
        </ButtonGroup>

        {/* Filter Search Input (Only show when there are items to filter in the active database) */}
        {(totalActiveApplications > 0 || totalArchived > 0 || savedVersionsCount > 0 || searchQuery.length > 0) && (
          <TextField
            size="small"
            placeholder={t('history:searchPlaceholder', 'Filter by company name or target role...')}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRoundedIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              },
            }}
            sx={{ maxWidth: { sm: 320 }, width: { xs: '100%', sm: 'auto' } }}
          />
        )}
      </Box>
    </Box>
  );
};
