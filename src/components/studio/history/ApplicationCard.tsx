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
  Divider,
  Menu,
  MenuItem,
  Tooltip,
  Checkbox,
  CircularProgress,
  useTheme,
  alpha
} from '@mui/material';
import BusinessRoundedIcon from '@mui/icons-material/BusinessRounded';
import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded';
import LaunchRoundedIcon from '@mui/icons-material/LaunchRounded';
import FileDownloadRoundedIcon from '@mui/icons-material/FileDownloadRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import PictureAsPdfRoundedIcon from '@mui/icons-material/PictureAsPdfRounded';
import ViewKanbanRoundedIcon from '@mui/icons-material/ViewKanbanRounded';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import { useTranslation } from 'react-i18next';
import { ApplicationCardProps } from '../../../types';
import { getPaletteConfig } from '../../../constants/palettes';
import { extractSummaryExcerpt } from '../../../core/parser';
import { formatLocalizedDate } from '../../../utils/dateUtils';
import { useCopyToClipboard } from '../../../hooks/useCopyToClipboard';
import { ConfirmDeleteDialog } from '../common/ConfirmDeleteDialog';


export type { ApplicationCardProps };

export const ApplicationCard: React.FC<ApplicationCardProps> = ({
  version,
  onLoad,
  onDelete,
  onDownload,
  onDownloadPdf,
  onTrack,
  isDownloadingPdf = false,
  selectionMode = false,
  isSelected = false,
  onToggleSelect,
  isLinkedToActiveApp = false,
  activeAppName,
}) => {
  const { t, i18n } = useTranslation(['history', 'common', 'gap', 'audit', 'preview', 'target']);
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const palConfig = getPaletteConfig(version.palette);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [downloadMenuAnchor, setDownloadMenuAnchor] = useState<null | HTMLElement>(null);
  const [moreMenuAnchor, setMoreMenuAnchor] = useState<null | HTMLElement>(null);
  const { copy } = useCopyToClipboard();

  const formattedDate = formatLocalizedDate(version.createdAt, i18n.language || 'en', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const summaryExcerpt = extractSummaryExcerpt(version.cvMarkdown);

  return (
    <>
      <Card
        variant="outlined"
        onClick={selectionMode ? () => onToggleSelect?.(version.id) : undefined}
        sx={{
          borderRadius: 2,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          transition: 'all 0.2s ease',
          cursor: selectionMode ? 'pointer' : 'default',
          borderColor: isSelected
            ? 'primary.main'
            : isLinkedToActiveApp
            ? alpha(theme.palette.info.main, 0.4)
            : undefined,
          bgcolor: isSelected
            ? alpha(theme.palette.primary.main, isDark ? 0.14 : 0.04)
            : 'background.paper',
          boxShadow: isSelected
            ? `0 0 0 2px ${alpha(theme.palette.primary.main, 0.25)}`
            : undefined,
          position: 'relative',
          '&:hover': {
            borderColor: isSelected ? 'primary.main' : 'primary.light',
            boxShadow: isSelected
              ? `0 4px 20px ${alpha(theme.palette.primary.main, 0.2)}`
              : `0 4px 20px ${alpha(theme.palette.primary.main, 0.12)}`,
            transform: 'translateY(-2px)',
          },
        }}
      >
        <CardContent sx={{ p: 2.5 }}>
          {/* Header: Company, Date & Selection / Action controls */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, minWidth: 0, flex: 1 }}>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: (theme) => `${theme.shape.borderRadius}px`,
                  bgcolor: alpha(palConfig.accentColor || theme.palette.primary.main, 0.15),
                  color: palConfig.accentColor || theme.palette.primary.main,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <BusinessRoundedIcon fontSize="small" />
              </Box>
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography variant="h6" noWrap sx={{ fontWeight: 800, lineHeight: 1.2 }}>
                  {version.companyName || t('target:fields.company', 'Target Company')}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <CalendarTodayRoundedIcon sx={{ fontSize: 11 }} /> {formattedDate}
                </Typography>
              </Box>
            </Box>

            {/* Selection Checkbox (In Selection Mode) OR More Options Menu (In Normal Mode) */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexShrink: 0, ml: 1 }}>
              {selectionMode ? (
                <Checkbox
                  checked={isSelected}
                  onChange={(e) => {
                    e.stopPropagation();
                    onToggleSelect?.(version.id);
                  }}
                  color="primary"
                  size="small"
                  aria-label={`Select CV version for ${version.companyName}`}
                  sx={{ p: 0.5 }}
                />
              ) : (
                <>
                  <Tooltip title={t('common:actions.options', 'Opciones')}>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        setMoreMenuAnchor(e.currentTarget);
                      }}
                      sx={{
                        color: 'text.secondary',
                        p: 0.5,
                        '&:hover': {
                          color: 'text.primary',
                          bgcolor: alpha(theme.palette.text.primary, 0.06),
                        },
                      }}
                    >
                      <MoreVertRoundedIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                  </Tooltip>

                  {/* Header More Options Menu */}
                  <Menu
                    anchorEl={moreMenuAnchor}
                    open={Boolean(moreMenuAnchor)}
                    onClose={() => setMoreMenuAnchor(null)}
                    slotProps={{
                      paper: {
                        sx: {
                          minWidth: 190,
                          py: 0.5,
                        },
                      },
                    }}
                  >
                    {onTrack && (
                      <MenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          setMoreMenuAnchor(null);
                          onTrack(version);
                        }}
                        sx={{ fontSize: '0.82rem', fontWeight: 600, gap: 1.25, py: 1 }}
                      >
                        <AddRoundedIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                        <span>{t('history:card.trackVersion', 'Rastrear en Kanban')}</span>
                      </MenuItem>
                    )}
                    <MenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        setMoreMenuAnchor(null);
                        setIsDeleteDialogOpen(true);
                      }}
                      sx={{ fontSize: '0.82rem', fontWeight: 600, gap: 1.25, py: 1, color: 'error.main' }}
                    >
                      <DeleteOutlineRoundedIcon sx={{ fontSize: 18, color: 'error.main' }} />
                      <span>{t('common:actions.delete', 'Eliminar')}</span>
                    </MenuItem>
                  </Menu>
                </>
              )}
            </Box>
          </Box>

          {/* Target Role */}
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.primary', mb: 1.5 }}>
            {version.targetRole || t('target:fields.role', 'Specialist Role')}
          </Typography>

          {/* Badges: Kanban Link, Match Score, Quality, Theme */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1.5 }}>
            {isLinkedToActiveApp && (
              <Tooltip title={t('history:card.linkedTooltip', 'Linked to an active application card in your Kanban pipeline')}>
                <Chip
                  icon={<ViewKanbanRoundedIcon sx={{ fontSize: '14px !important' }} />}
                  label={t('history:card.linkedToApp', 'Kanban Active')}
                  size="small"
                  color="info"
                  variant="outlined"
                  sx={{ fontWeight: 700, fontSize: '0.72rem' }}
                />
              </Tooltip>
            )}
            {Boolean(version.matchScore) && (
              <Chip
                label={`${version.matchScore}% ${t('gap:matchScore', 'Match')}`}
                size="small"
                color="success"
                sx={{ fontWeight: 700, fontSize: '0.72rem' }}
              />
            )}
            {Boolean(version.qualityScore) && (
              <Chip
                label={`${t('audit:score', 'Score')}: ${version.qualityScore}/10`}
                size="small"
                color="primary"
                variant="outlined"
                sx={{ fontWeight: 700, fontSize: '0.72rem' }}
              />
            )}
            <Chip
              label={`${version.pageBudget || 1} ${t('preview:toolbar.page', 'Page')}`}
              size="small"
              variant="outlined"
              sx={{ fontSize: '0.72rem' }}
            />
            <Chip
              label={version.theme || 'modern-tech'}
              size="small"
              sx={{ fontSize: '0.72rem', bgcolor: alpha(palConfig.accentColor || theme.palette.primary.main, 0.1), color: palConfig.accentColor || theme.palette.primary.main }}
            />
          </Box>

          {/* Tailored Professional Summary Excerpt */}
          {summaryExcerpt && (
            <Box sx={{ mt: 1, p: 1.25, borderRadius: (theme) => `${theme.shape.borderRadius}px`, bgcolor: alpha(theme.palette.text.primary, 0.03), border: `1px solid ${alpha(theme.palette.divider, 0.6)}` }}>
              <Typography
                variant="caption"
                sx={{
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  lineHeight: 1.45,
                  color: 'text.secondary',
                  fontSize: '0.74rem',
                }}
              >
                {summaryExcerpt}
              </Typography>
            </Box>
          )}
        </CardContent>

        <Divider />

        <CardActions
          sx={{
            p: 1.5,
            px: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 1,
            flexWrap: 'nowrap',
          }}
        >
          {/* Primary Action */}
          <Button
            size="small"
            variant="contained"
            color="primary"
            startIcon={<LaunchRoundedIcon sx={{ fontSize: 16 }} />}
            onClick={(e) => {
              e.stopPropagation();
              onLoad(version.id);
            }}
            sx={{
              fontWeight: 700,
              fontSize: '0.78rem',
              py: 0.6,
              px: 1.75,
              whiteSpace: 'nowrap',
              flex: { xs: '1 1 auto', sm: '0 0 auto' },
            }}
          >
            {t('history:card.openInStudio', 'View & Edit in Studio')}
          </Button>

          {/* Single Download Icon Button with Tooltip and Arrow */}
          <Tooltip title={t('history:card.downloadOptions', 'Descargar / Exportar')}>
            <Button
              size="small"
              variant="outlined"
              color="inherit"
              onClick={(e) => {
                e.stopPropagation();
                setDownloadMenuAnchor(e.currentTarget);
              }}
              endIcon={<KeyboardArrowDownRoundedIcon sx={{ fontSize: 15, ml: -0.25 }} />}
              sx={{
                minWidth: 'auto',
                px: 1.25,
                py: 0.6,
                borderColor: theme.palette.divider,
                color: 'text.secondary',
                flexShrink: 0,
                '&:hover': {
                  borderColor: 'primary.main',
                  color: 'primary.main',
                  bgcolor: alpha(theme.palette.primary.main, 0.08),
                },
              }}
            >
              {isDownloadingPdf ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <FileDownloadRoundedIcon sx={{ fontSize: 17 }} />
              )}
            </Button>
          </Tooltip>

          {/* Download Dropdown Menu */}
          <Menu
            anchorEl={downloadMenuAnchor}
            open={Boolean(downloadMenuAnchor)}
            onClose={() => setDownloadMenuAnchor(null)}
            slotProps={{
              paper: {
                sx: {
                  minWidth: 180,
                  py: 0.5,
                },
              },
            }}

          >
            {onDownloadPdf && (
              <MenuItem
                disabled={isDownloadingPdf}
                onClick={(e) => {
                  e.stopPropagation();
                  setDownloadMenuAnchor(null);
                  onDownloadPdf(version);
                }}
                sx={{ fontSize: '0.82rem', fontWeight: 600, gap: 1.25, py: 1 }}
              >
                <PictureAsPdfRoundedIcon sx={{ fontSize: 18, color: 'error.main' }} />
                <span>{t('history:card.downloadPdf', 'Descargar PDF')}</span>
              </MenuItem>
            )}
            <MenuItem
              onClick={(e) => {
                e.stopPropagation();
                setDownloadMenuAnchor(null);
                onDownload(version);
              }}
              sx={{ fontSize: '0.82rem', fontWeight: 600, gap: 1.25, py: 1 }}
            >
              <FileDownloadRoundedIcon sx={{ fontSize: 18, color: 'primary.main' }} />
              <span>{t('history:card.downloadMd', 'Descargar Markdown (.md)')}</span>
            </MenuItem>
            <MenuItem
              onClick={(e) => {
                e.stopPropagation();
                setDownloadMenuAnchor(null);
                copy(version.cvMarkdown);
              }}
              sx={{ fontSize: '0.82rem', fontWeight: 600, gap: 1.25, py: 1 }}
            >
              <ContentCopyRoundedIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
              <span>{t('common:actions.copy', 'Copiar Contenido')}</span>
            </MenuItem>
          </Menu>
        </CardActions>
      </Card>


      {/* Delete Confirmation Dialog */}
      <ConfirmDeleteDialog
        open={isDeleteDialogOpen}
        onCancel={() => setIsDeleteDialogOpen(false)}
        onConfirm={() => {
          setIsDeleteDialogOpen(false);
          onDelete(version.id);
        }}
        title={t('history:deleteDialog.title', 'Delete CV Version?')}
        message={t(
          'history:deleteDialog.message',
          'Are you sure you want to delete this tailored CV for {{company}}? This action is permanent and cannot be undone.',
          { company: version.companyName || t('target:fields.company', 'Target Company') }
        )}
        warningMessage={
          isLinkedToActiveApp
            ? t(
                'history:deleteDialog.linkedWarning',
                'This CV version is currently attached to an active application on your Kanban board.'
              )
            : undefined
        }
        confirmLabel={t('common:actions.delete', 'Delete Permanently')}
        cancelLabel={t('common:actions.cancel', 'Cancel')}
      />
    </>
  );
};

