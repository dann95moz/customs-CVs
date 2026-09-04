import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Chip,
  Button,
  ButtonGroup,
  useTheme,
  alpha,
} from '@mui/material';
import BusinessRoundedIcon from '@mui/icons-material/BusinessRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import ViewKanbanRoundedIcon from '@mui/icons-material/ViewKanbanRounded';
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded';
import Inventory2RoundedIcon from '@mui/icons-material/Inventory2Rounded';
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded';
import LayersRoundedIcon from '@mui/icons-material/LayersRounded';
import TrackChangesRoundedIcon from '@mui/icons-material/TrackChangesRounded';
import EmojiEventsRoundedIcon from '@mui/icons-material/EmojiEventsRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { useTranslation } from 'react-i18next';
import { ApplicationsStatsHeaderProps } from '../../../types';
import { SearchBarWithClear } from '../../molecules';
import { RADIUS_TOKENS } from '../../../theme/dimensions';

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

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* Top Banner */}
      <Paper
        sx={{
          p: { xs: 1.5, sm: 2, md: 2.5 },
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'flex-start', md: 'center' },
          justifyContent: 'space-between',
          gap: 2,
          border: `1px solid ${theme.palette.divider}`,
          bgcolor: 'background.paper',
          borderRadius: RADIUS_TOKENS.lg,
          width: '100%',
          boxSizing: 'border-box',
          minWidth: 0,
        }}
      >
        <Box sx={{ minWidth: 0, width: '100%' }}>
          <Chip
            icon={<BusinessRoundedIcon sx={{ fontSize: '16px !important' }} />}
            label={t('history:badge', 'Application Tracker')}
            size="small"
            color="primary"
            variant="outlined"
            sx={{ mb: 1, fontWeight: 700 }}
          />
          <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.5, fontSize: { xs: '1.15rem', sm: '1.35rem', md: '1.5rem' } }}>
            {t('history:title', 'Job Applications Kanban Studio')}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
            {t('history:subtitle', 'Track real job submissions with linked CV versions across customized recruitment stages.')}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', width: { xs: '100%', md: 'auto' }, flexShrink: 0 }}>
          {/* Track Application (Only show in header if there is at least 1 active application) */}
          {totalActiveApplications > 0 && (
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddRoundedIcon />}
              onClick={onTrackNewApplication}
              sx={{ fontWeight: 700, fontSize: { xs: '0.78rem', sm: '0.84rem' }, whiteSpace: 'nowrap', px: 2, flex: { xs: '1 1 auto', sm: 'none' } }}
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
            sx={{ fontWeight: 700, fontSize: { xs: '0.78rem', sm: '0.84rem' }, whiteSpace: 'nowrap', px: 2, flex: { xs: '1 1 auto', sm: 'none' } }}
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
            gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' },
            gap: { xs: 1, sm: 1.5 },
            width: '100%',
            minWidth: 0,
            boxSizing: 'border-box',
          }}
        >
          {/* Active Applications */}
          <Paper
            sx={{
              p: { xs: 1.25, sm: 1.5, md: 1.75 },
              display: 'flex',
              alignItems: 'center',
              gap: { xs: 1, sm: 1.25, md: 1.5 },
              border: `1px solid ${theme.palette.divider}`,
              bgcolor: 'background.paper',
              borderRadius: RADIUS_TOKENS.md,
              minWidth: 0,
              boxSizing: 'border-box',
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                width: { xs: 32, sm: 36, md: 40 },
                height: { xs: 32, sm: 36, md: 40 },
                borderRadius: RADIUS_TOKENS.sm,
                bgcolor: alpha(theme.palette.primary.main, 0.12),
                color: theme.palette.primary.main,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <LayersRoundedIcon sx={{ fontSize: { xs: 16, sm: 18, md: 20 } }} />
            </Box>
            <Box sx={{ minWidth: 0, flex: 1, overflow: 'hidden' }}>
              <Typography
                variant="caption"
                color="text.secondary"
                noWrap
                sx={{
                  textTransform: 'uppercase',
                  fontWeight: 700,
                  fontSize: { xs: '0.62rem', sm: '0.68rem' },
                  display: 'block',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {t('history:stats.applied', 'Active Applications')}
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.1, fontSize: { xs: '0.95rem', sm: '1.15rem', md: '1.25rem' } }}>
                {totalActiveApplications}
              </Typography>
            </Box>
          </Paper>

          {/* Interviews & Tests */}
          <Paper
            sx={{
              p: { xs: 1.25, sm: 1.5, md: 1.75 },
              display: 'flex',
              alignItems: 'center',
              gap: { xs: 1, sm: 1.25, md: 1.5 },
              border: `1px solid ${theme.palette.divider}`,
              bgcolor: 'background.paper',
              borderRadius: RADIUS_TOKENS.md,
              minWidth: 0,
              boxSizing: 'border-box',
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                width: { xs: 32, sm: 36, md: 40 },
                height: { xs: 32, sm: 36, md: 40 },
                borderRadius: RADIUS_TOKENS.sm,
                bgcolor: alpha(theme.palette.secondary.main, 0.12),
                color: theme.palette.secondary.main,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <TrackChangesRoundedIcon sx={{ fontSize: { xs: 16, sm: 18, md: 20 } }} />
            </Box>
            <Box sx={{ minWidth: 0, flex: 1, overflow: 'hidden' }}>
              <Typography
                variant="caption"
                color="text.secondary"
                noWrap
                sx={{
                  textTransform: 'uppercase',
                  fontWeight: 700,
                  fontSize: { xs: '0.62rem', sm: '0.68rem' },
                  display: 'block',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {t('history:stats.interviews', 'In Interview')}
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, color: 'secondary.main', lineHeight: 1.1, fontSize: { xs: '0.95rem', sm: '1.15rem', md: '1.25rem' } }}>
                {totalInterviews}
              </Typography>
            </Box>
          </Paper>

          {/* Offers */}
          <Paper
            sx={{
              p: { xs: 1.25, sm: 1.5, md: 1.75 },
              display: 'flex',
              alignItems: 'center',
              gap: { xs: 1, sm: 1.25, md: 1.5 },
              border: `1px solid ${theme.palette.divider}`,
              bgcolor: 'background.paper',
              borderRadius: RADIUS_TOKENS.md,
              minWidth: 0,
              boxSizing: 'border-box',
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                width: { xs: 32, sm: 36, md: 40 },
                height: { xs: 32, sm: 36, md: 40 },
                borderRadius: RADIUS_TOKENS.sm,
                bgcolor: alpha(theme.palette.success.main, 0.12),
                color: theme.palette.success.main,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <EmojiEventsRoundedIcon sx={{ fontSize: { xs: 16, sm: 18, md: 20 } }} />
            </Box>
            <Box sx={{ minWidth: 0, flex: 1, overflow: 'hidden' }}>
              <Typography
                variant="caption"
                color="text.secondary"
                noWrap
                sx={{
                  textTransform: 'uppercase',
                  fontWeight: 700,
                  fontSize: { xs: '0.62rem', sm: '0.68rem' },
                  display: 'block',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {t('history:stats.offers', 'Offers Received')}
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, color: 'success.main', lineHeight: 1.1, fontSize: { xs: '0.95rem', sm: '1.15rem', md: '1.25rem' } }}>
                {totalOffers}
              </Typography>
            </Box>
          </Paper>

          {/* Avg Match Score */}
          <Paper
            sx={{
              p: { xs: 1.25, sm: 1.5, md: 1.75 },
              display: 'flex',
              alignItems: 'center',
              gap: { xs: 1, sm: 1.25, md: 1.5 },
              border: `1px solid ${theme.palette.divider}`,
              bgcolor: 'background.paper',
              borderRadius: RADIUS_TOKENS.md,
              minWidth: 0,
              boxSizing: 'border-box',
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                width: { xs: 32, sm: 36, md: 40 },
                height: { xs: 32, sm: 36, md: 40 },
                borderRadius: RADIUS_TOKENS.sm,
                bgcolor: alpha(theme.palette.warning.main, 0.12),
                color: theme.palette.warning.main,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <AutoAwesomeRoundedIcon sx={{ fontSize: { xs: 16, sm: 18, md: 20 } }} />
            </Box>
            <Box sx={{ minWidth: 0, flex: 1, overflow: 'hidden' }}>
              <Typography
                variant="caption"
                color="text.secondary"
                noWrap
                sx={{
                  textTransform: 'uppercase',
                  fontWeight: 700,
                  fontSize: { xs: '0.62rem', sm: '0.68rem' },
                  display: 'block',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {t('history:stats.avgMatch', 'Avg. Match')}
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, color: 'warning.main', lineHeight: 1.1, fontSize: { xs: '0.95rem', sm: '1.15rem', md: '1.25rem' } }}>
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
          width: '100%',
          minWidth: 0,
          boxSizing: 'border-box',
        }}
      >
        {/* Segmented View Switcher */}
        <Box
          sx={{
            width: { xs: '100%', sm: 'auto' },
            maxWidth: '100%',
            overflowX: 'auto',
            overflowY: 'hidden',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': { display: 'none' },
          }}
        >
          <ButtonGroup
            size="small"
            variant="outlined"
            sx={{
              width: { xs: '100%', sm: 'auto' },
              display: 'flex',
              whiteSpace: 'nowrap',
            }}
          >
            {/* Grid View */}
            <Button
              variant={activeView === 'grid' ? 'contained' : 'outlined'}
              onClick={() => onViewChange('grid')}
              startIcon={<GridViewRoundedIcon sx={{ fontSize: { xs: 14, sm: 16 } }} />}
              sx={{
                flex: { xs: 1, sm: 'none' },
                fontWeight: 700,
                fontSize: { xs: '0.68rem', sm: '0.78rem' },
                px: { xs: 0.5, sm: 1.5 },
                py: { xs: 0.6, sm: 0.8 },
              }}
            >
              <Box component="span" sx={{ display: { xs: 'none', md: 'inline' } }}>
                {t('history:views.grid', 'Applications Grid')}
              </Box>
              <Box component="span" sx={{ display: { xs: 'inline', md: 'none' } }}>
                {t('history:views.gridShort', 'Grid')}
              </Box>{' '}
              ({totalActiveApplications})
            </Button>

            {/* Board View */}
            <Button
              variant={activeView === 'board' ? 'contained' : 'outlined'}
              onClick={() => onViewChange('board')}
              startIcon={<ViewKanbanRoundedIcon sx={{ fontSize: { xs: 14, sm: 16 } }} />}
              sx={{
                flex: { xs: 1, sm: 'none' },
                fontWeight: 700,
                fontSize: { xs: '0.68rem', sm: '0.78rem' },
                px: { xs: 0.5, sm: 1.5 },
                py: { xs: 0.6, sm: 0.8 },
              }}
            >
              <Box component="span" sx={{ display: { xs: 'none', md: 'inline' } }}>
                {t('history:views.board', 'Active Board')}
              </Box>
              <Box component="span" sx={{ display: { xs: 'inline', md: 'none' } }}>
                {t('history:views.boardShort', 'Board')}
              </Box>{' '}
              ({totalActiveApplications})
            </Button>

            <Button
              variant={activeView === 'archived' ? 'contained' : 'outlined'}
              onClick={() => onViewChange('archived')}
              startIcon={<Inventory2RoundedIcon sx={{ fontSize: { xs: 14, sm: 16 } }} />}
              sx={{
                flex: { xs: 1, sm: 'none' },
                fontWeight: 700,
                fontSize: { xs: '0.68rem', sm: '0.78rem' },
                px: { xs: 0.5, sm: 1.5 },
                py: { xs: 0.6, sm: 0.8 },
              }}
            >
              <Box component="span" sx={{ display: { xs: 'none', md: 'inline' } }}>
                {t('history:views.archived', 'Archived')}
              </Box>
              <Box component="span" sx={{ display: { xs: 'inline', md: 'none' } }}>
                {t('history:views.archivedShort', 'Archived')}
              </Box>{' '}
              ({totalArchived})
            </Button>

            <Button
              variant={activeView === 'versions' ? 'contained' : 'outlined'}
              onClick={() => onViewChange('versions')}
              startIcon={<HistoryRoundedIcon sx={{ fontSize: { xs: 14, sm: 16 } }} />}
              sx={{
                flex: { xs: 1, sm: 'none' },
                fontWeight: 700,
                fontSize: { xs: '0.68rem', sm: '0.78rem' },
                px: { xs: 0.5, sm: 1.5 },
                py: { xs: 0.6, sm: 0.8 },
              }}
            >
              <Box component="span" sx={{ display: { xs: 'none', md: 'inline' } }}>
                {t('history:views.allVersions', 'CV Versions History')}
              </Box>
              <Box component="span" sx={{ display: { xs: 'inline', md: 'none' } }}>
                {t('history:views.versionsShort', 'Versions')}
              </Box>{' '}
              ({savedVersionsCount})
            </Button>
          </ButtonGroup>
        </Box>

        {/* Filter Search Input (Only show when there are items to filter in the active database) */}
        {(totalActiveApplications > 0 || totalArchived > 0 || savedVersionsCount > 0 || searchQuery.length > 0) && (
          <SearchBarWithClear
            size="small"
            placeholder={t('history:searchPlaceholder', 'Filter by company name or target role...')}
            value={searchQuery}
            onChange={onSearchChange}
            sx={{ maxWidth: { sm: 320 }, width: { xs: '100%', sm: 'auto' } }}
          />
        )}
      </Box>
    </Box>
  );
};
