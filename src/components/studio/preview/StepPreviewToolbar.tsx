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

export type PreviewViewMode = 'tailored' | 'generic' | 'compare';

export interface StepPreviewToolbarProps {
  viewMode: PreviewViewMode;
  onViewModeChange: (mode: PreviewViewMode) => void;
  activeTemplateName: string;
  onOpenTemplates: () => void;
  isEditingMarkdown: boolean;
  onToggleMarkdown: () => void;
  onSaveAndExitMarkdown: () => void;
  onSaveVersion: () => void;
  savedSuccess: boolean;
  onReTailor: () => void;
  isGenerating: boolean;
  onDownloadPdf: () => void;
}

/**
 * Top control bar for Step 4 Preview workspace.
 * Principle: Single Responsibility (S) - focuses exclusively on user actions and view modes.
 */
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
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <ButtonGroup size="small" variant="outlined" sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.03)' : '#ffffff' }}>
          <Button
            variant={viewMode === 'tailored' ? 'contained' : 'outlined'}
            onClick={() => onViewModeChange('tailored')}
            startIcon={<AutoAwesomeRoundedIcon />}
            sx={{ fontWeight: 700, fontSize: '0.78rem' }}
          >
            Tailored CV (AI)
          </Button>
          <Button
            variant={viewMode === 'generic' ? 'contained' : 'outlined'}
            onClick={() => onViewModeChange('generic')}
            startIcon={<TrackChangesRoundedIcon />}
            sx={{ fontWeight: 600, fontSize: '0.78rem' }}
          >
            Base Profile (Generic)
          </Button>
          <Button
            variant={viewMode === 'compare' ? 'contained' : 'outlined'}
            onClick={() => onViewModeChange('compare')}
            startIcon={<CompareArrowsRoundedIcon />}
            color="secondary"
            sx={{ fontWeight: 700, fontSize: '0.78rem' }}
          >
            Side-by-Side Comparison
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

      {/* Right: Quick Tools + Pencil / Floppy Disk Switcher */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {!isEditingMarkdown ? (
          <Tooltip title="Edit Markdown">
            <IconButton
              onClick={onToggleMarkdown}
              size="small"
              sx={{
                border: `1.5px solid ${theme.palette.divider}`,
                borderRadius: '8px',
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
          <Tooltip title="Save & Return to Sheet">
            <IconButton
              onClick={onSaveAndExitMarkdown}
              size="small"
              color="primary"
              sx={{
                border: `1.5px solid ${theme.palette.primary.main}`,
                borderRadius: '8px',
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

        <Divider orientation="vertical" flexItem sx={{ mx: 0.5, height: 24, my: 'auto' }} />

        <Button
          size="small"
          variant="outlined"
          color="inherit"
          startIcon={<BookmarkBorderRoundedIcon />}
          onClick={onSaveVersion}
          sx={{ fontSize: '0.78rem', fontWeight: 600 }}
        >
          {savedSuccess ? 'Saved!' : 'Save Version'}
        </Button>

        <Button
          size="small"
          variant="outlined"
          color="primary"
          startIcon={<AutoAwesomeRoundedIcon />}
          onClick={onReTailor}
          disabled={isGenerating}
          sx={{ fontSize: '0.78rem', fontWeight: 700 }}
        >
          {isGenerating ? 'Synthesizing...' : 'Re-Tailor with AI'}
        </Button>

        <Button
          size="small"
          variant="contained"
          color="primary"
          startIcon={<PictureAsPdfRoundedIcon />}
          onClick={onDownloadPdf}
          sx={{ fontWeight: 800, fontSize: '0.78rem', px: 2 }}
        >
          Download PDF
        </Button>
      </Box>
    </Paper>
  );
};
