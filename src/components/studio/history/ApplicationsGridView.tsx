import React, { useMemo } from 'react';
import {
  Box,
  Paper,
  Typography,
  Chip,
  Button,
  IconButton,
  Tooltip,
  Card,
  CardContent,
  useTheme,
  alpha,
} from '@mui/material';
import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import SearchOffRoundedIcon from '@mui/icons-material/SearchOffRounded';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import ViewKanbanRoundedIcon from '@mui/icons-material/ViewKanbanRounded';
import { useTranslation } from 'react-i18next';
import { ApplicationsGridViewProps, ApplicationItem } from '../../../types';
import { getLocalizedColumnTitle } from '../../../utils/kanbanUtils';
import { ApplicationGridCard } from './ApplicationGridCard';
import { RADIUS_TOKENS } from '../../../theme/dimensions';

export const ApplicationsGridView: React.FC<ApplicationsGridViewProps> = ({
  applications,
  columns,
  savedVersions,
  searchQuery,
  selectedStageFilter,
  onStageFilterChange,
  onMoveToStage,
  onLoadVersionInStudio,
  onArchiveApplication,
  onDeleteApplication,
  onDownloadPdf,
  isDownloadingPdfId,
  onManageStages,
  onQuickAddApplication,
}) => {
  const { t } = useTranslation(['history', 'common']);
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  // Active (non-archived) applications
  const activeApps = useMemo(
    () => applications.filter((app) => !app.isArchived),
    [applications]
  );

  // Map each stage to count of active applications
  const stageCounts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const app of activeApps) {
      map[app.columnId] = (map[app.columnId] || 0) + 1;
    }
    return map;
  }, [activeApps]);

  // Filtered applications based on stage filter & search query
  const filteredApps = useMemo(() => {
    return activeApps.filter((app: ApplicationItem) => {
      // 1. Stage filter
      if (selectedStageFilter !== 'all' && app.columnId !== selectedStageFilter) {
        return false;
      }

      // 2. Search query filter
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase().trim();
      return (
        app.companyName.toLowerCase().includes(query) ||
        app.targetRole.toLowerCase().includes(query) ||
        (app.notes && app.notes.toLowerCase().includes(query)) ||
        (app.location && app.location.toLowerCase().includes(query))
      );
    });
  }, [activeApps, selectedStageFilter, searchQuery]);

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* 1. Quick Stage Filter Bar */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 1.25, sm: 1.5 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1.5,
          borderRadius: RADIUS_TOKENS.md,
          border: `1px solid ${theme.palette.divider}`,
          bgcolor: 'background.paper',
          overflowX: 'auto',
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
        }}
      >
        {/* Stage Filter Chips List */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.75,
            flexWrap: 'nowrap',
            minWidth: 0,
            overflowX: 'auto',
            py: 0.25,
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': { display: 'none' },
          }}
        >
          <FilterListRoundedIcon sx={{ fontSize: 18, color: 'text.secondary', ml: 0.5, mr: 0.25, flexShrink: 0 }} />

          {/* "All" Stage Chip */}
          <Chip
            label={t('history:filter.allStagesWithCount', 'All Stages ({{count}})', {
              count: activeApps.length,
            })}
            size="small"
            onClick={() => onStageFilterChange('all')}
            color={selectedStageFilter === 'all' ? 'primary' : 'default'}
            variant={selectedStageFilter === 'all' ? 'filled' : 'outlined'}
            sx={{
              fontWeight: 700,
              fontSize: '0.74rem',
              cursor: 'pointer',
              flexShrink: 0,
              height: 28,
            }}
          />

          {/* Individual Stage Chips */}
          {columns.map((col) => {
            const count = stageCounts[col.id] || 0;
            const isSelected = selectedStageFilter === col.id;
            const colColor = col.color || theme.palette.primary.main;

            return (
              <Chip
                key={col.id}
                icon={
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: colColor,
                      ml: '6px !important',
                      mr: '-4px !important',
                    }}
                  />
                }
                label={`${getLocalizedColumnTitle(col, t)} (${count})`}
                size="small"
                onClick={() => onStageFilterChange(isSelected ? 'all' : col.id)}
                variant={isSelected ? 'filled' : 'outlined'}
                sx={{
                  fontWeight: 700,
                  fontSize: '0.74rem',
                  cursor: 'pointer',
                  flexShrink: 0,
                  height: 28,
                  borderColor: isSelected ? colColor : alpha(colColor, 0.35),
                  bgcolor: isSelected
                    ? alpha(colColor, isDark ? 0.25 : 0.15)
                    : alpha(colColor, isDark ? 0.06 : 0.03),
                  color: isSelected ? (isDark ? '#fff' : colColor) : 'text.primary',
                  '&:hover': {
                    bgcolor: alpha(colColor, isDark ? 0.35 : 0.2),
                    borderColor: colColor,
                  },
                }}
              />
            );
          })}
        </Box>

        {/* Action Controls: Manage Stages */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexShrink: 0 }}>
          <Tooltip title={t('history:actions.manageStages', 'Manage Stages and Colors')} arrow>
            <Button
              size="small"
              variant="outlined"
              color="inherit"
              onClick={() => onManageStages()}
              startIcon={<SettingsRoundedIcon sx={{ fontSize: 14 }} />}
              sx={{
                fontSize: '0.72rem',
                fontWeight: 700,
                whiteSpace: 'nowrap',
                py: 0.5,
                px: 1.25,
              }}
            >
              <Box component="span" sx={{ display: { xs: 'none', md: 'inline' } }}>
                {t('history:actions.manageStages', 'Manage Stages')}
              </Box>
              <Box component="span" sx={{ display: { xs: 'inline', md: 'none' } }}>
                {t('history:actions.stagesShort', 'Stages')}
              </Box>
            </Button>
          </Tooltip>
        </Box>
      </Paper>

      {/* 2. Responsive Card Grid */}
      {filteredApps.length > 0 ? (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(auto-fill, minmax(310px, 1fr))',
              md: 'repeat(auto-fill, minmax(330px, 1fr))',
            },
            gap: { xs: 1.5, sm: 2 },
            width: '100%',
            boxSizing: 'border-box',
          }}
        >
          {filteredApps.map((app) => {
            const attachedVersion = app.appliedVersionId
              ? savedVersions.find((v) => v.id === app.appliedVersionId)
              : undefined;

            return (
              <ApplicationGridCard
                key={app.id}
                application={app}
                allColumns={columns}
                attachedVersion={attachedVersion}
                onLoadInStudio={onLoadVersionInStudio}
                onMoveToStage={onMoveToStage}
                onArchive={onArchiveApplication}
                onDelete={onDeleteApplication}
                onDownloadPdf={onDownloadPdf}
                isDownloadingPdf={Boolean(attachedVersion && isDownloadingPdfId === attachedVersion.id)}
                onManageStages={onManageStages}
              />
            );
          })}
        </Box>
      ) : (
        /* Empty / No Search Results State */
        <Card
          variant="outlined"
          sx={{
            p: { xs: 3, sm: 4.5 },
            width: '100%',
            textAlign: 'center',
            borderRadius: RADIUS_TOKENS.lg,
            bgcolor: 'background.paper',
            border: `1.5px dashed ${alpha(theme.palette.divider, 0.8)}`,
          }}
        >
          <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5, p: '0 !important' }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: RADIUS_TOKENS.md,
                bgcolor: alpha(theme.palette.text.secondary, 0.1),
                color: 'text.secondary',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {searchQuery || selectedStageFilter !== 'all' ? (
                <SearchOffRoundedIcon fontSize="medium" />
              ) : (
                <ViewKanbanRoundedIcon fontSize="medium" />
              )}
            </Box>

            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              {searchQuery || selectedStageFilter !== 'all'
                ? t('history:grid.noMatchingApps', 'No applications match your filter')
                : t('history:empty.title', 'No Applications Tracked Yet')}
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 440, lineHeight: 1.5 }}>
              {searchQuery || selectedStageFilter !== 'all'
                ? t(
                    'history:grid.noMatchingAppsDesc',
                    'Try selecting a different stage filter or clear your search terms to see more applications.'
                  )
                : t(
                    'history:empty.desc',
                    'Synthesize or save a tailored resume in Resume Studio, then track your recruitment pipeline here.'
                  )}
            </Typography>

            {searchQuery || selectedStageFilter !== 'all' ? (
              <Button
                variant="outlined"
                color="inherit"
                startIcon={<ClearRoundedIcon />}
                onClick={() => onStageFilterChange('all')}
                sx={{ mt: 1, fontWeight: 700 }}
              >
                {t('history:grid.clearFilters', 'Reset Stage Filter')}
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddRoundedIcon />}
                onClick={() => onQuickAddApplication()}
                sx={{ mt: 1, fontWeight: 700 }}
              >
                {t('history:actions.trackApp', 'Track Application')}
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </Box>
  );
};
