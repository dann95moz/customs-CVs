import React from 'react';
import {
  Paper,
  Box,
  Button,
  ButtonGroup,
  Chip,
  IconButton,
  Tooltip,
  Divider,
  useTheme,
  alpha
} from '@mui/material';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import TrackChangesRoundedIcon from '@mui/icons-material/TrackChangesRounded';
import CompareArrowsRoundedIcon from '@mui/icons-material/CompareArrowsRounded';
import StyleRoundedIcon from '@mui/icons-material/StyleRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import BookmarkBorderRoundedIcon from '@mui/icons-material/BookmarkBorderRounded';
import PictureAsPdfRoundedIcon from '@mui/icons-material/PictureAsPdfRounded';
import { useTranslation } from 'react-i18next';
import { PreviewViewMode, StepPreviewToolbarProps } from '../../../types';

export type { PreviewViewMode, StepPreviewToolbarProps };

export const StepPreviewToolbar: React.FC<StepPreviewToolbarProps> = ({
  viewMode,
  onViewModeChange,
  activeTemplateName,
  onOpenTemplates,
  isEditingMarkdown,
  onToggleMarkdown,
  onSaveAndExitMarkdown,
  onSaveVersion,
  savedSuccess,
  onReTailor,
  isGenerating,
  onDownloadPdf,
}) => {
  const { t } = useTranslation(['preview', 'common']);
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Paper
      elevation={0}
      className="no-print preview-top-toolbar"
      sx={{
        py: 1,
        px: 2.5,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 1.5,
        borderBottom: `1px solid ${theme.palette.divider}`,
        bgcolor: 'background.paper',
        zIndex: 20,
      }}
    >
      {/* Left: View Mode Switcher (Tailored vs. Generic vs. Compare) */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
        <ButtonGroup size="small" variant="outlined" sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.03)' : '#ffffff' }}>
          <Button
            variant={viewMode === 'tailored' ? 'contained' : 'outlined'}
            onClick={() => onViewModeChange('tailored')}
            startIcon={<AutoAwesomeRoundedIcon />}
            sx={{ fontWeight: 700, fontSize: { xs: '0.72rem', sm: '0.78rem' }, px: { xs: 1, sm: 1.5 } }}
          >
            <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>{t('preview:panels.comparison.tailoredCv', 'Tailored CV')}</Box>
            <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>{t('preview:panels.comparison.tailoredCv', 'Tailored')}</Box>
          </Button>
          <Button
            variant={viewMode === 'generic' ? 'contained' : 'outlined'}
            onClick={() => onViewModeChange('generic')}
            startIcon={<TrackChangesRoundedIcon />}
            sx={{ fontWeight: 600, fontSize: { xs: '0.72rem', sm: '0.78rem' }, px: { xs: 1, sm: 1.5 } }}
          >
            <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>{t('preview:panels.comparison.masterProfile', 'Base Profile')}</Box>
            <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>Base</Box>
          </Button>
          <Button
            variant={viewMode === 'compare' ? 'contained' : 'outlined'}
            onClick={() => onViewModeChange('compare')}
            startIcon={<CompareArrowsRoundedIcon />}
            color="secondary"
            sx={{ fontWeight: 700, fontSize: { xs: '0.72rem', sm: '0.78rem' }, px: { xs: 1, sm: 1.5 } }}
          >
            <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>{t('preview:navRail.compare', 'Comparison')}</Box>
            <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>{t('preview:navRail.compare', 'Compare')}</Box>
          </Button>
        </ButtonGroup>

        {/* Active Template & Palette Indicator */}
        <Chip
          icon={<StyleRoundedIcon sx={{ fontSize: '14px !important' }} />}
          label={activeTemplateName}
          size="small"
          variant="outlined"
          onClick={onOpenTemplates}
          sx={{ fontWeight: 700, fontSize: '0.72rem', cursor: 'pointer', display: { xs: 'none', md: 'inline-flex' } }}
        />
      </Box>

      {/* Right: Quick Tools + Action Buttons */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
        {!isEditingMarkdown ? (
          <Tooltip title={t('common:actions.edit', 'Edit Markdown')}>
            <IconButton
              onClick={onToggleMarkdown}
              size="small"
              sx={{
                border: `1.5px solid ${theme.palette.divider}`,
                p: 0.75,
                bgcolor: isDark ? 'rgba(255,255,255,0.05)' : '#ffffff',
                color: 'text.primary',
                transition: 'all 0.15s ease',
                '&:hover': {
                  borderColor: 'primary.main',
                  bgcolor: alpha(theme.palette.primary.main, 0.08),
                  color: 'primary.main',
                }
              }}
            >
              <EditRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title={t('common:actions.save', 'Save & Return to Sheet')}>
            <IconButton
              onClick={onSaveAndExitMarkdown}
              size="small"
              color="primary"
              sx={{
                border: `1.5px solid ${theme.palette.primary.main}`,
                p: 0.75,
                bgcolor: alpha(theme.palette.primary.main, 0.12),
                color: 'primary.main',
                transition: 'all 0.15s ease',
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, 0.22),
                  transform: 'scale(1.05)',
                }
              }}
            >
              <SaveRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}

        <Divider orientation="vertical" flexItem sx={{ mx: 0.25, height: 24, my: 'auto', display: { xs: 'none', sm: 'block' } }} />

        <Button
          size="small"
          variant="outlined"
          color="inherit"
          startIcon={<BookmarkBorderRoundedIcon />}
          onClick={onSaveVersion}
          sx={{ fontSize: { xs: '0.72rem', sm: '0.78rem' }, fontWeight: 600, display: { xs: 'none', sm: 'inline-flex' } }}
        >
          {savedSuccess ? t('common:actions.done', 'Saved!') : t('common:actions.save', 'Save Version')}
        </Button>

        <Button
          size="small"
          variant="outlined"
          color="primary"
          startIcon={<AutoAwesomeRoundedIcon />}
          onClick={onReTailor}
          disabled={isGenerating}
          sx={{ fontSize: { xs: '0.72rem', sm: '0.78rem' }, fontWeight: 700, display: { xs: 'none', md: 'inline-flex' } }}
        >
          {isGenerating ? t('target:actions.tailoring', 'Synthesizing...') : t('target:actions.tailorNow', 'Re-Tailor')}
        </Button>

        <Button
          size="small"
          variant="contained"
          color="primary"
          startIcon={<PictureAsPdfRoundedIcon />}
          onClick={onDownloadPdf}
          sx={{ fontWeight: 800, fontSize: { xs: '0.75rem', sm: '0.78rem' }, px: { xs: 1.5, sm: 2 } }}
        >
          {t('preview:toolbar.exportPdf', 'PDF Export')}
        </Button>
      </Box>
    </Paper>
  );
};
