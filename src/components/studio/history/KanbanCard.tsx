import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Box,
  Typography,
  Chip,
  Button,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  CircularProgress,
  Select,
  FormControl,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  useTheme,
  alpha,
} from '@mui/material';
import BusinessRoundedIcon from '@mui/icons-material/BusinessRounded';
import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded';
import LaunchRoundedIcon from '@mui/icons-material/LaunchRounded';
import PictureAsPdfRoundedIcon from '@mui/icons-material/PictureAsPdfRounded';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import ArchiveRoundedIcon from '@mui/icons-material/ArchiveRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import DragIndicatorRoundedIcon from '@mui/icons-material/DragIndicatorRounded';
import LayersRoundedIcon from '@mui/icons-material/LayersRounded';
import MonetizationOnRoundedIcon from '@mui/icons-material/MonetizationOnRounded';
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded';
import NotesRoundedIcon from '@mui/icons-material/NotesRounded';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useTranslation } from 'react-i18next';
import { KanbanCardProps, GeneratedCvVersion } from '../../../types';
import { getPaletteConfig } from '../../../constants/palettes';
import { formatLocalizedDate } from '../../../utils/dateUtils';

export const KanbanCard: React.FC<KanbanCardProps> = ({
  application,
  attachedVersion,
  allMatchingVersions,
  onLoadInStudio,
  onSetAttachedVersion,
  onArchive,
  onDelete,
  onDownloadPdf,
  isDownloadingPdf = false,
  isDraggingOverlay = false,
}) => {
  const { t, i18n } = useTranslation(['history', 'common', 'gap', 'audit', 'preview', 'target']);
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: application.id,
    data: {
      type: 'card',
      application,
    },
    disabled: isDraggingOverlay,
  });

  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.35 : 1,
    cursor: isDraggingOverlay ? 'grabbing' : 'default',
  };

  const palConfig = getPaletteConfig(attachedVersion?.palette || 'corporate-blue');

  const formatDate = (isoString?: string) =>
    formatLocalizedDate(isoString, i18n.language || 'en', {
      day: '2-digit',
      month: 'short',
    });

  const handleOpenMenu = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setMenuAnchor(e.currentTarget);
  };

  const handleCloseMenu = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setMenuAnchor(null);
  };

  // Find version index for label
  const attachedVersionIndex = allMatchingVersions.findIndex((v) => v.id === application.appliedVersionId);
  const versionDisplayNumber = attachedVersionIndex !== -1 ? allMatchingVersions.length - attachedVersionIndex : 1;

  return (
    <div ref={setNodeRef} style={style}>
      <Card
        variant="outlined"
        sx={{
          borderRadius: '14px',
          bgcolor: 'background.paper',
          border: `1px solid ${isDraggingOverlay ? theme.palette.primary.main : theme.palette.divider}`,
          boxShadow: isDraggingOverlay
            ? '0 12px 32px rgba(0,0,0,0.25)'
            : '0 2px 8px rgba(0,0,0,0.03)',
          transition: 'border-color 0.15s ease, box-shadow 0.15s ease, transform 0.15s ease',
          '&:hover': {
            borderColor: 'primary.main',
            boxShadow: `0 4px 16px ${alpha(theme.palette.primary.main, 0.1)}`,
          },
        }}
      >
        <CardContent sx={{ p: 1.75, pb: 1 }}>
          {/* Top Row: Drag Handle + Company + Menu */}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1, mb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
              {/* Drag Handle */}
              <Box
                {...attributes}
                {...listeners}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  color: 'text.disabled',
                  cursor: isDraggingOverlay ? 'grabbing' : 'grab',
                  p: 0.25,
                  borderRadius: '4px',
                  '&:hover': { color: 'text.primary', bgcolor: alpha(theme.palette.text.primary, 0.05) },
                }}
              >
                <DragIndicatorRoundedIcon sx={{ fontSize: 18 }} />
              </Box>

              {/* Company Logo Icon */}
              <Box
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: '8px',
                  bgcolor: alpha(palConfig.accentColor || theme.palette.primary.main, 0.12),
                  color: palConfig.accentColor || theme.palette.primary.main,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <BusinessRoundedIcon sx={{ fontSize: 16 }} />
              </Box>

              <Typography
                variant="subtitle2"
                noWrap
                sx={{
                  fontWeight: 800,
                  fontSize: '0.88rem',
                  lineHeight: 1.2,
                  color: 'text.primary',
                }}
                title={application.companyName}
              >
                {application.companyName}
              </Typography>
            </Box>

            {/* More Menu */}
            <IconButton
              size="small"
              onClick={handleOpenMenu}
              sx={{ p: 0.25, color: 'text.secondary', flexShrink: 0 }}
            >
              <MoreVertRoundedIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Box>

          {/* Target Role */}
          <Typography
            variant="body2"
            sx={{
              fontWeight: 700,
              fontSize: '0.8rem',
              color: 'text.secondary',
              mb: 1.25,
              display: '-webkit-box',
              WebkitLineClamp: 1,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
            title={application.targetRole}
          >
            {application.targetRole}
          </Typography>

          {/* Badges: Match Score & Attached Version Dropdown */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, flexWrap: 'wrap', mb: 1 }}>
            <Chip
              label={`${application.matchScore || attachedVersion?.matchScore || 92}% ${t('gap:matchScore', 'Match')}`}
              size="small"
              color="success"
              sx={{ height: 22, fontSize: '0.7rem', fontWeight: 700 }}
            />

            {/* Attached Version Switcher Dropdown */}
            {allMatchingVersions.length > 1 ? (
              <FormControl size="small" sx={{ minWidth: 100 }}>
                <Select
                  value={application.appliedVersionId}
                  onChange={(e) => onSetAttachedVersion(application.id, e.target.value)}
                  size="small"
                  sx={{
                    height: 22,
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    borderRadius: '6px',
                    bgcolor: alpha(theme.palette.primary.main, 0.06),
                    '& .MuiSelect-select': { py: 0.2, px: 0.8 },
                  }}
                >
                  {allMatchingVersions.map((v, i) => (
                    <MenuItem key={v.id} value={v.id} sx={{ fontSize: '0.72rem', fontWeight: 600 }}>
                      v{allMatchingVersions.length - i} • {v.matchScore}% Match ({formatDate(v.createdAt)})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : (
              <Chip
                icon={<LayersRoundedIcon sx={{ fontSize: '12px !important' }} />}
                label={`v${versionDisplayNumber} • ${attachedVersion?.theme || 'modern'}`}
                size="small"
                variant="outlined"
                sx={{ height: 22, fontSize: '0.68rem', fontWeight: 600 }}
              />
            )}
          </Box>

          {/* Optional Meta: Salary, Location, Notes indicator */}
          {(application.salary || application.location || application.notes) && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mb: 1, color: 'text.secondary' }}>
              {application.salary && (
                <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.25, fontSize: '0.68rem', fontWeight: 600 }}>
                  <MonetizationOnRoundedIcon sx={{ fontSize: 13, color: 'success.main' }} />
                  {application.salary}
                </Typography>
              )}
              {application.location && (
                <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.25, fontSize: '0.68rem' }}>
                  <LocationOnRoundedIcon sx={{ fontSize: 13 }} />
                  {application.location}
                </Typography>
              )}
              {application.notes && (
                <Tooltip title={application.notes}>
                  <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.25, fontSize: '0.68rem', cursor: 'pointer' }}>
                    <NotesRoundedIcon sx={{ fontSize: 13, color: 'primary.main' }} />
                    {t('history:card.notes', 'Notes')}
                  </Typography>
                </Tooltip>
              )}
            </Box>
          )}

          {/* Date applied */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 0.5 }}>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontSize: '0.68rem' }}>
              <CalendarTodayRoundedIcon sx={{ fontSize: 11 }} /> {formatDate(application.appliedDate || application.createdAt)}
            </Typography>
          </Box>
        </CardContent>

        {/* Card Actions: View in Studio + PDF */}
        <CardActions
          sx={{
            p: 1,
            px: 1.5,
            pt: 0.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: `1px solid ${alpha(theme.palette.divider, 0.6)}`,
            bgcolor: isDark ? 'rgba(255,255,255,0.015)' : 'rgba(0,0,0,0.01)',
          }}
        >
          <Button
            size="small"
            variant="text"
            color="primary"
            startIcon={<LaunchRoundedIcon sx={{ fontSize: 14 }} />}
            onClick={(e) => {
              e.stopPropagation();
              onLoadInStudio(application.appliedVersionId);
            }}
            sx={{
              fontWeight: 700,
              fontSize: '0.72rem',
              p: 0.4,
              px: 1,
              borderRadius: '6px',
              textTransform: 'none',
            }}
          >
            {t('history:card.openInStudio', 'View & Edit')}
          </Button>

          {attachedVersion && (
            <Tooltip title={t('history:card.downloadPdfTip', 'Direct PDF Download')}>
              <span>
                <IconButton
                  size="small"
                  disabled={isDownloadingPdf}
                  onClick={(e) => {
                    e.stopPropagation();
                    onDownloadPdf(attachedVersion);
                  }}
                  sx={{
                    p: 0.5,
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: '6px',
                    '&:hover': {
                      borderColor: 'primary.main',
                      color: 'primary.main',
                      bgcolor: alpha(theme.palette.primary.main, 0.08),
                    },
                  }}
                >
                  {isDownloadingPdf ? (
                    <CircularProgress size={13} color="inherit" />
                  ) : (
                    <PictureAsPdfRoundedIcon sx={{ fontSize: 15 }} />
                  )}
                </IconButton>
              </span>
            </Tooltip>
          )}
        </CardActions>
      </Card>

      {/* Context Menu for Actions */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => handleCloseMenu()}
        slotProps={{
          paper: {
            sx: {
              minWidth: 180,
            },
          },
        }}

      >
        <MenuItem
          onClick={(e) => {
            handleCloseMenu(e);
            onLoadInStudio(application.appliedVersionId);
          }}
          sx={{ fontSize: '0.8rem' }}
        >
          <ListItemIcon>
            <LaunchRoundedIcon fontSize="small" color="primary" />
          </ListItemIcon>
          <ListItemText primary={t('history:card.openInStudio', 'View in Studio')} />
        </MenuItem>

        <MenuItem
          onClick={(e) => {
            handleCloseMenu(e);
            onArchive(application.id);
          }}
          sx={{ fontSize: '0.8rem' }}
        >
          <ListItemIcon>
            <ArchiveRoundedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary={t('history:card.archive', 'Archive Application')} />
        </MenuItem>

        <MenuItem
          onClick={(e) => {
            handleCloseMenu(e);
            setIsDeleteDialogOpen(true);
          }}
          sx={{ fontSize: '0.8rem', color: 'error.main' }}
        >
          <ListItemIcon>
            <DeleteOutlineRoundedIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText primary={t('history:card.delete', 'Delete Card')} />
        </MenuItem>
      </Menu>

      {/* Delete Card Confirmation Dialog */}
      <Dialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        maxWidth="xs"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              borderRadius: '16px',
              p: 1,
              bgcolor: 'background.paper',
            },
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 800, pb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
          <DeleteOutlineRoundedIcon color="error" />
          {t('history:deleteDialog.title', 'Delete Application?')}
        </DialogTitle>
        <DialogContent sx={{ pb: 1 }}>
          <DialogContentText sx={{ fontSize: '0.88rem', color: 'text.secondary' }}>
            {t(
              'history:deleteDialog.message',
              'Are you sure you want to delete this application for {{company}}? This action is permanent and cannot be undone.',
              { company: application.companyName }
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 2, pb: 1.5, gap: 1 }}>
          <Button
            onClick={() => setIsDeleteDialogOpen(false)}
            color="inherit"
            variant="outlined"
            size="small"
            sx={{ fontWeight: 700 }}
          >
            {t('common:actions.cancel', 'Cancel')}
          </Button>
          <Button
            onClick={() => {
              setIsDeleteDialogOpen(false);
              onDelete(application.id);
            }}
            color="error"
            variant="contained"
            size="small"
            startIcon={<DeleteOutlineRoundedIcon />}
            sx={{ fontWeight: 700 }}
          >
            {t('common:actions.delete', 'Delete Permanently')}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
