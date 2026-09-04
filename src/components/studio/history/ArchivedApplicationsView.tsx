import React, { useState } from 'react';
import {
  Card,
  Box,
  Typography,
  Chip,
  Button,
  IconButton,
  Tooltip,
  Paper,
  CircularProgress,
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
import UnarchiveRoundedIcon from '@mui/icons-material/UnarchiveRounded';
import LaunchRoundedIcon from '@mui/icons-material/LaunchRounded';
import PictureAsPdfRoundedIcon from '@mui/icons-material/PictureAsPdfRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import Inventory2RoundedIcon from '@mui/icons-material/Inventory2Rounded';
import { useTranslation } from 'react-i18next';
import { ArchivedApplicationsViewProps, ApplicationItem, GeneratedCvVersion } from '../../../types';
import { getPaletteConfig } from '../../../constants/palettes';
import { formatLocalizedDate } from '../../../utils/dateUtils';
import { MatchScoreBadge } from '../../atoms';
import { RADIUS_TOKENS } from '../../../theme/dimensions';

export const ArchivedApplicationsView: React.FC<ArchivedApplicationsViewProps> = ({
  archivedApplications,
  savedVersions,
  searchQuery,
  onRestore,
  onDeletePermanently,
  onLoadInStudio,
  onDownloadPdf,
  isDownloadingPdfId,
}) => {
  const { t, i18n } = useTranslation(['history', 'common', 'gap']);
  const theme = useTheme();
  const [deletingApp, setDeletingApp] = useState<ApplicationItem | null>(null);

  const filteredArchived = archivedApplications.filter((app) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      app.companyName.toLowerCase().includes(q) ||
      app.targetRole.toLowerCase().includes(q) ||
      (app.notes && app.notes.toLowerCase().includes(q))
    );
  });

  const formatDate = (isoString?: string) =>
    formatLocalizedDate(isoString, i18n.language || 'en', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

  if (filteredArchived.length === 0) {
    return (
      <Paper
        variant="outlined"
        sx={{
          p: 6,
          textAlign: 'center',
          borderRadius: RADIUS_TOKENS.xl,
          borderStyle: 'dashed',
          bgcolor: 'background.paper',
        }}
      >
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            bgcolor: alpha(theme.palette.secondary.main, 0.1),
            color: theme.palette.secondary.main,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 1.5,
          }}
        >
          <Inventory2RoundedIcon fontSize="large" />
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 800 }}>
          {searchQuery
            ? t('history:archived.noMatch', 'No archived applications match your search')
            : t('history:archived.emptyTitle', 'Archive is Empty')}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 460, mx: 'auto', mt: 0.5 }}>
          {t(
            'history:archived.emptyDesc',
            'When you archive rejected or closed job applications from your Kanban board, they will be preserved here.'
          )}
        </Typography>
      </Paper>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      {filteredArchived.map((app: ApplicationItem) => {
        const attachedVersion: GeneratedCvVersion | undefined = savedVersions.find(
          (v) => v.id === app.appliedVersionId
        );
        const palConfig = getPaletteConfig(attachedVersion?.palette || 'corporate-blue');

        return (
          <Card
            key={app.id}
            variant="outlined"
            sx={{
              borderRadius: RADIUS_TOKENS.lg,
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'flex-start', sm: 'center' },
              justifyContent: 'space-between',
              p: 2,
              gap: 2,
              transition: 'border-color 0.15s ease',
              '&:hover': {
                borderColor: 'primary.main',
              },
            }}
          >
            {/* Left: Info */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
              <Box
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: RADIUS_TOKENS.md,
                  bgcolor: alpha(palConfig.accentColor || theme.palette.primary.main, 0.12),
                  color: palConfig.accentColor || theme.palette.primary.main,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <BusinessRoundedIcon fontSize="small" />
              </Box>

              <Box sx={{ minWidth: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                    {app.companyName}
                  </Typography>
                  {Boolean(app.matchScore || attachedVersion?.matchScore) && (
                    <MatchScoreBadge
                      score={app.matchScore || attachedVersion?.matchScore}
                    />
                  )}
                  <Chip
                    label={t('history:status.archived', 'Archived')}
                    size="small"
                    sx={{ height: 20, fontSize: '0.68rem', bgcolor: alpha(theme.palette.text.primary, 0.08) }}
                  />
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, mt: 0.25 }}>
                  {app.targetRole}
                </Typography>

                <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                  <CalendarTodayRoundedIcon sx={{ fontSize: 11 }} />{' '}
                  {t('history:archived.archivedOn', 'Archived on {{date}}', { date: formatDate(app.archivedAt || app.updatedAt) })}
                </Typography>
              </Box>
            </Box>

            {/* Right: Actions */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0, width: { xs: '100%', sm: 'auto' }, justifyContent: 'flex-end' }}>
              <Button
                size="small"
                variant="outlined"
                startIcon={<UnarchiveRoundedIcon />}
                onClick={() => onRestore(app.id)}
                sx={{ fontSize: '0.74rem', fontWeight: 700 }}
              >
                {t('history:archived.restore', 'Restore to Board')}
              </Button>

              <Button
                size="small"
                variant="text"
                color="primary"
                startIcon={<LaunchRoundedIcon />}
                onClick={() => onLoadInStudio(app.appliedVersionId)}
                sx={{ fontSize: '0.74rem', fontWeight: 700 }}
              >
                {t('history:card.openInStudio', 'View in Studio')}
              </Button>

              {attachedVersion && (
                <Tooltip title={t('history:card.downloadPdfTip', 'Direct PDF Download')}>
                  <span>
                    <IconButton
                      size="small"
                      disabled={isDownloadingPdfId === attachedVersion.id}
                      onClick={() => onDownloadPdf(attachedVersion)}
                      sx={{
                        p: 0.75,
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: RADIUS_TOKENS.md,
                      }}
                    >
                      {isDownloadingPdfId === attachedVersion.id ? (
                        <CircularProgress size={14} color="inherit" />
                      ) : (
                        <PictureAsPdfRoundedIcon sx={{ fontSize: 16 }} />
                      )}
                    </IconButton>
                  </span>
                </Tooltip>
              )}

              <Tooltip title={t('common:actions.delete', 'Delete Permanently')}>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => setDeletingApp(app)}
                  sx={{ p: 0.75 }}
                >
                  <DeleteOutlineRoundedIcon sx={{ fontSize: 17 }} />
                </IconButton>
              </Tooltip>
            </Box>
          </Card>
        );
      })}

      {/* Permanent Delete Confirmation Dialog */}
      <Dialog
        open={Boolean(deletingApp)}
        onClose={() => setDeletingApp(null)}
        maxWidth="xs"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              p: 1,
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
              { company: deletingApp?.companyName || '' }
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 2, pb: 1.5, gap: 1 }}>
          <Button
            onClick={() => setDeletingApp(null)}
            color="inherit"
            variant="outlined"
            size="small"
            sx={{ fontWeight: 700 }}
          >
            {t('common:actions.cancel', 'Cancel')}
          </Button>
          <Button
            onClick={() => {
              if (deletingApp) {
                onDeletePermanently(deletingApp.id);
                setDeletingApp(null);
              }
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
    </Box>
  );
};
