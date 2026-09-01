import React, { useState } from 'react';
import {
  Paper,
  Box,
  Typography,
  Chip,
  IconButton,
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  alpha,
} from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import ArchiveRoundedIcon from '@mui/icons-material/ArchiveRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useTranslation } from 'react-i18next';
import { KanbanColumnProps } from '../../../types';
import { getLocalizedColumnTitle } from '../../../utils/kanbanUtils';
import { KanbanCard } from './KanbanCard';

export const KanbanColumnComponent: React.FC<KanbanColumnProps> = ({
  column,
  applications,
  savedVersions,
  onMoveApplication,
  onLoadVersionInStudio,
  onSetAttachedVersion,
  onArchiveApplication,
  onDeleteApplication,
  onDownloadPdf,
  isDownloadingPdfId,
  onEditColumn,
  onDeleteColumn,
  onArchiveColumn,
  onQuickAdd,
}) => {
  const { t } = useTranslation(['history', 'common']);
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: {
      type: 'column',
      column,
    },
  });

  const columnColor = column.color || theme.palette.primary.main;

  const handleOpenMenu = (e: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor(e.currentTarget);
  };

  const handleCloseMenu = () => {
    setMenuAnchor(null);
  };

  return (
    <Paper
      ref={setNodeRef}
      variant="outlined"
      sx={{
        width: { xs: '260px', sm: '290px', md: '320px' },
        minWidth: { xs: '260px', sm: '290px', md: '320px' },
        maxHeight: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '16px',
        boxSizing: 'border-box',
        bgcolor: isOver
          ? alpha(columnColor, isDark ? 0.12 : 0.05)
          : isDark
          ? 'rgba(255, 255, 255, 0.02)'
          : 'rgba(248, 250, 252, 0.8)',
        borderColor: isOver ? columnColor : theme.palette.divider,
        transition: 'background-color 0.2s ease, border-color 0.2s ease',
        flexShrink: 0,
      }}
    >
      {/* Column Header */}
      <Box
        sx={{
          p: 1.5,
          px: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.7)}`,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, minWidth: 0 }}>
          <Box
            sx={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              bgcolor: columnColor,
              boxShadow: `0 0 8px ${alpha(columnColor, 0.6)}`,
            }}
          />
          <Typography
            variant="subtitle1"
            noWrap
            sx={{
              fontWeight: 800,
              fontSize: '0.9rem',
              color: 'text.primary',
            }}
          >
            {getLocalizedColumnTitle(column, t)}
          </Typography>
          <Chip
            label={applications.length}
            size="small"
            sx={{
              height: 20,
              fontSize: '0.7rem',
              fontWeight: 700,
              bgcolor: alpha(columnColor, 0.12),
              color: columnColor,
              borderRadius: '6px',
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
          <IconButton
            size="small"
            onClick={() => onQuickAdd(column.id)}
            sx={{ p: 0.5, color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
            title={t('history:column.quickAdd', 'Add application to this stage')}
          >
            <AddRoundedIcon fontSize="small" />
          </IconButton>

          <IconButton
            size="small"
            onClick={handleOpenMenu}
            sx={{ p: 0.5, color: 'text.secondary' }}
          >
            <MoreVertRoundedIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      {/* Column Content / Sortable Droppable Container */}
      <Box
        sx={{
          p: 1.25,
          display: 'flex',
          flexDirection: 'column',
          gap: 1.25,
          overflowY: 'auto',
          flex: 1,
          minHeight: 180,
        }}
      >
        <SortableContext
          items={applications.map((a) => a.id)}
          strategy={verticalListSortingStrategy}
        >
          {applications.map((app) => {
            const attachedVersion = savedVersions.find((v) => v.id === app.appliedVersionId);
            const allMatchingVersions = savedVersions.filter(
              (v) => v.companyName.toLowerCase().trim() === app.companyName.toLowerCase().trim()
            );

            return (
              <KanbanCard
                key={app.id}
                application={app}
                attachedVersion={attachedVersion}
                allMatchingVersions={allMatchingVersions.length > 0 ? allMatchingVersions : (attachedVersion ? [attachedVersion] : [])}
                onLoadInStudio={onLoadVersionInStudio}
                onSetAttachedVersion={onSetAttachedVersion}
                onArchive={onArchiveApplication}
                onDelete={onDeleteApplication}
                onDownloadPdf={onDownloadPdf}
                isDownloadingPdf={isDownloadingPdfId === attachedVersion?.id}
              />
            );
          })}
        </SortableContext>

        {applications.length === 0 && (
          <Box
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '12px',
              border: `1.5px dashed ${alpha(theme.palette.divider, 0.8)}`,
              color: 'text.secondary',
              height: '100%',
              minHeight: 140,
              textAlign: 'center',
            }}
          >
            <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.disabled', mb: 1 }}>
              {t('history:column.empty', 'No applications in this stage')}
            </Typography>
            <Button
              size="small"
              variant="text"
              startIcon={<AddRoundedIcon sx={{ fontSize: 14 }} />}
              onClick={() => onQuickAdd(column.id)}
              sx={{ fontSize: '0.72rem', textTransform: 'none', color: columnColor }}
            >
              {t('history:column.add', '+ Add application')}
            </Button>
          </Box>
        )}
      </Box>

      {/* Column Action Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleCloseMenu}
        slotProps={{
          paper: {
            sx: {
              minWidth: 190,
            },
          },
        }}

      >
        <MenuItem
          onClick={() => {
            handleCloseMenu();
            onEditColumn(column);
          }}
          sx={{ fontSize: '0.8rem' }}
        >
          <ListItemIcon>
            <EditRoundedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary={t('history:column.edit', 'Edit Stage Name / Color')} />
        </MenuItem>

        {applications.length > 0 && (
          <MenuItem
            onClick={() => {
              handleCloseMenu();
              onArchiveColumn(column.id);
            }}
            sx={{ fontSize: '0.8rem' }}
          >
            <ListItemIcon>
              <ArchiveRoundedIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary={t('history:column.archiveAll', 'Archive All in Stage')} />
          </MenuItem>
        )}

        <MenuItem
          onClick={() => {
            handleCloseMenu();
            onDeleteColumn(column.id);
          }}
          sx={{ fontSize: '0.8rem', color: 'error.main' }}
        >
          <ListItemIcon>
            <DeleteOutlineRoundedIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText primary={t('history:column.delete', 'Delete Stage')} />
        </MenuItem>
      </Menu>
    </Paper>
  );
};
