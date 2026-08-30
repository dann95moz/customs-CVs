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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  useTheme,
  alpha
} from '@mui/material';
import BusinessRoundedIcon from '@mui/icons-material/BusinessRounded';
import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded';
import LaunchRoundedIcon from '@mui/icons-material/LaunchRounded';
import FileDownloadRoundedIcon from '@mui/icons-material/FileDownloadRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import { useTranslation } from 'react-i18next';
import { GeneratedCvVersion, ApplicationCardProps } from '../../../types';
import { getPaletteConfig } from '../../../constants/palettes';

import PictureAsPdfRoundedIcon from '@mui/icons-material/PictureAsPdfRounded';
import CircularProgress from '@mui/material/CircularProgress';
import Tooltip from '@mui/material/Tooltip';
import ButtonGroup from '@mui/material/ButtonGroup';

export type { ApplicationCardProps };

/**
 * Extracts a clean, executive summary snippet from the CV markdown.
 */
function extractSummaryExcerpt(cvMarkdown?: string): string {
  if (!cvMarkdown) return '';

  // 1. Try to extract content under ## Professional Summary / Resumen / Pitch
  const sectionMatch = cvMarkdown.match(/##\s*[^#\n]*(?:SUMMARY|RESUMEN|PROFILE|PERFIL|PITCH)[^\n]*\n+([\s\S]*?)(?=\n+##|\n+---|$)/i);
  let text = '';
  if (sectionMatch && sectionMatch[1]) {
    text = sectionMatch[1].trim();
  } else {
    // 2. Fallback: get first non-header, non-contact paragraph
    const lines = cvMarkdown.split('\n');
    const contentLines: string[] = [];
    let started = false;
    for (const line of lines) {
      const trimmed = line.trim();
      if (!started && (trimmed.startsWith('#') || trimmed.startsWith('**') || trimmed.includes('@') || trimmed.includes('http') || trimmed.startsWith('---'))) {
        continue;
      }
      if (trimmed) {
        started = true;
        if (trimmed.startsWith('#')) break;
        contentLines.push(trimmed);
      } else if (started) {
        break;
      }
    }
    text = contentLines.join(' ');
  }

  // 3. Clean any markdown formatting (headers, bold, italic, links, bullets)
  return text
    .replace(/^#+\s+/gm, '')
    .replace(/^[-*•]\s+/gm, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

export const ApplicationCard: React.FC<ApplicationCardProps> = ({
  version,
  onLoad,
  onDelete,
  onDownload,
  onDownloadPdf,
  onTrack,
  isDownloadingPdf = false,
}) => {
  const { t, i18n } = useTranslation(['history', 'common', 'gap', 'audit', 'preview', 'target']);
  const theme = useTheme();
  const palConfig = getPaletteConfig(version.palette);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString(i18n.language || 'en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return isoString;
    }
  };

  const summaryExcerpt = extractSummaryExcerpt(version.cvMarkdown);

  return (
    <>
      <Card
        variant="outlined"
        sx={{
          borderRadius: '16px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          transition: 'all 0.2s ease',
          '&:hover': {
            borderColor: 'primary.main',
            boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.12)}`,
            transform: 'translateY(-2px)'
          }
        }}
      >
        <CardContent sx={{ p: 2.5 }}>
          {/* Header: Company & Date */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: '10px',
                  bgcolor: alpha(palConfig.accentColor || theme.palette.primary.main, 0.15),
                  color: palConfig.accentColor || theme.palette.primary.main,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <BusinessRoundedIcon fontSize="small" />
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
                  {version.companyName || t('target:fields.company', 'Target Company')}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <CalendarTodayRoundedIcon sx={{ fontSize: 11 }} /> {formatDate(version.createdAt)}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {onTrack && (
                <Tooltip title={t('history:card.trackVersion', 'Track Application')}>
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => onTrack(version)}
                    sx={{
                      bgcolor: alpha(theme.palette.primary.main, 0.08),
                      '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.16) },
                    }}
                  >
                    <AddRoundedIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
              <Tooltip title={t('history:card.delete', 'Delete Version')}>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => setIsDeleteDialogOpen(true)}
                  sx={{ opacity: 0.7, '&:hover': { opacity: 1 } }}
                >
                  <DeleteOutlineRoundedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          {/* Target Role */}
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.primary', mb: 1.5 }}>
            {version.targetRole || t('target:fields.role', 'Specialist Role')}
          </Typography>

          {/* Badges: Match Score, Quality, Theme */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1.5 }}>
            <Chip
              label={`${version.matchScore || 92}% ${t('gap:matchScore', 'Match')}`}
              size="small"
              color="success"
              sx={{ fontWeight: 700, fontSize: '0.72rem' }}
            />
            <Chip
              label={`${t('audit:score', 'Score')}: ${version.qualityScore || 9.0}/10`}
              size="small"
              color="primary"
              variant="outlined"
              sx={{ fontWeight: 700, fontSize: '0.72rem' }}
            />
            <Chip
              label={`${version.pageBudget || 1} ${t('preview:toolbar.page', 'Page')}`}
              size="small"
              variant="outlined"
              sx={{ fontSize: '0.72rem' }}
            />
            <Chip
              label={version.theme || 'modern-tech'}
              size="small"
              sx={{ fontSize: '0.72rem', bgcolor: alpha(palConfig.accentColor || '#38bdf8', 0.1), color: palConfig.accentColor }}
            />
          </Box>

          {/* Tailored Professional Summary Excerpt */}
          {summaryExcerpt && (
            <Box sx={{ mt: 1, p: 1.25, borderRadius: '8px', bgcolor: alpha(theme.palette.text.primary, 0.03), border: `1px solid ${alpha(theme.palette.divider, 0.6)}` }}>
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

        <CardActions sx={{ p: 1.5, px: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
          <Button
            size="small"
            variant="contained"
            color="primary"
            startIcon={<LaunchRoundedIcon />}
            onClick={() => onLoad(version.id)}
            sx={{ fontWeight: 700, fontSize: '0.76rem', flex: { xs: '1 1 auto', sm: '0 0 auto' } }}
          >
            {t('history:card.openInStudio', 'View & Edit in Studio')}
          </Button>

          <ButtonGroup size="small" variant="outlined" color="inherit" sx={{ flexShrink: 0 }}>
            {onDownloadPdf && (
              <Tooltip title={t('history:card.downloadPdfTip', 'Direct PDF Download (1-Click)')}>
                <Button
                  onClick={() => onDownloadPdf(version)}
                  disabled={isDownloadingPdf}
                  startIcon={
                    isDownloadingPdf ? (
                      <CircularProgress size={13} color="inherit" />
                    ) : (
                      <PictureAsPdfRoundedIcon sx={{ fontSize: '15px !important' }} />
                    )
                  }
                  sx={{
                    fontWeight: 700,
                    fontSize: '0.73rem',
                    px: 1,
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                    borderColor: theme.palette.divider,
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.12),
                      borderColor: 'primary.main',
                      color: 'primary.main'
                    }
                  }}
                >
                  PDF
                </Button>
              </Tooltip>
            )}

            <Tooltip title={t('history:card.downloadMdTip', 'Download Raw Markdown (.md)')}>
              <Button
                startIcon={<FileDownloadRoundedIcon sx={{ fontSize: '15px !important' }} />}
                onClick={() => onDownload(version)}
                sx={{ fontSize: '0.73rem', px: 0.9 }}
              >
                .MD
              </Button>
            </Tooltip>
          </ButtonGroup>
        </CardActions>
      </Card>

      {/* Delete Confirmation Dialog */}
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
          {t('history:deleteDialog.title', 'Delete CV Version?')}
        </DialogTitle>
        <DialogContent sx={{ pb: 1 }}>
          <DialogContentText sx={{ fontSize: '0.88rem', color: 'text.secondary' }}>
            {t(
              'history:deleteDialog.message',
              'Are you sure you want to delete this tailored CV for {{company}}? This action is permanent and cannot be undone.',
              { company: version.companyName || t('target:fields.company', 'Target Company') }
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 2, pb: 1.5, gap: 1 }}>
          <Button
            onClick={() => setIsDeleteDialogOpen(false)}
            color="inherit"
            variant="outlined"
            size="small"
            sx={{ fontWeight: 700, borderRadius: '8px' }}
          >
            {t('common:actions.cancel', 'Cancel')}
          </Button>
          <Button
            onClick={() => {
              setIsDeleteDialogOpen(false);
              onDelete(version.id);
            }}
            color="error"
            variant="contained"
            size="small"
            startIcon={<DeleteOutlineRoundedIcon />}
            sx={{ fontWeight: 700, borderRadius: '8px' }}
          >
            {t('common:actions.delete', 'Delete Permanently')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
