import React, { useState } from 'react';
import {
  Paper,
  Box,
  Button,
  ButtonGroup,
  Chip,
  IconButton,
  Tooltip,
  Divider,
  Select,
  MenuItem,
  Menu,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  useTheme,
  alpha
} from '@mui/material';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import StyleRoundedIcon from '@mui/icons-material/StyleRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import BookmarkBorderRoundedIcon from '@mui/icons-material/BookmarkBorderRounded';
import PictureAsPdfRoundedIcon from '@mui/icons-material/PictureAsPdfRounded';
import PrintRoundedIcon from '@mui/icons-material/PrintRounded';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import ArrowDropDownRoundedIcon from '@mui/icons-material/ArrowDropDownRounded';
import FormatBoldRoundedIcon from '@mui/icons-material/FormatBoldRounded';
import FormatItalicRoundedIcon from '@mui/icons-material/FormatItalicRounded';
import HighlightRoundedIcon from '@mui/icons-material/HighlightRounded';
import BoltRoundedIcon from '@mui/icons-material/BoltRounded';
import AspectRatioRoundedIcon from '@mui/icons-material/AspectRatioRounded';
import { useTranslation } from 'react-i18next';
import { StepPreviewToolbarProps, PageFormat } from '../../../types';
import { useCvLiveEdit } from './CvLiveEditContext';
import { PAGE_FORMAT_CONFIGS } from '../../../theme/dimensions';

export type { StepPreviewToolbarProps };

export const StepPreviewToolbar: React.FC<StepPreviewToolbarProps> = ({
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
  onPrintPdf,
  isExportingPdf = false,
  pageFormat = 'a4',
  onPageFormatChange,
  isOverflowing = false,
  onAutoFit,
}) => {
  const { t } = useTranslation(['preview', 'common']);
  const liveEdit = useCvLiveEdit();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const [pdfMenuAnchor, setPdfMenuAnchor] = useState<null | HTMLElement>(null);

  const handleOpenPdfMenu = (e: React.MouseEvent<HTMLElement>) => {
    setPdfMenuAnchor(e.currentTarget);
  };

  const handleClosePdfMenu = () => {
    setPdfMenuAnchor(null);
  };

  return (
    <Paper
      elevation={0}
      className="no-print preview-top-toolbar"
      sx={{
        py: 1,
        px: { xs: 1.5, sm: 2.5 },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'nowrap',
        gap: 1.5,
        borderBottom: `1px solid ${theme.palette.divider}`,
        bgcolor: 'background.paper',
        zIndex: 20,
      }}
    >
      {/* Left: Live Document Text Formatting Tools + Active Template & Format */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
        {/* Active Template & Palette Indicator */}
        <Chip
          icon={<StyleRoundedIcon sx={{ fontSize: '14px !important' }} />}
          label={activeTemplateName}
          size="small"
          variant="outlined"
          onClick={onOpenTemplates}
          sx={{
            fontWeight: 700,
            fontSize: '0.72rem',
            cursor: 'pointer',
            display: { xs: isEditingMarkdown ? 'inline-flex' : 'none', sm: 'inline-flex' },
            '&:hover': {
              borderColor: 'primary.main',
              bgcolor: alpha(theme.palette.primary.main, 0.08),
            }
          }}
        />

        {/* Page Format Selector (A4 / Letter / Legal) */}
        {!isEditingMarkdown && onPageFormatChange && (
          <Select
            size="small"
            value={pageFormat}
            onChange={(e) => onPageFormatChange(e.target.value as PageFormat)}
            startAdornment={<AspectRatioRoundedIcon sx={{ fontSize: 14, mr: 0.5, color: 'text.secondary' }} />}
            sx={{
              height: 28,
              fontSize: '0.72rem',
              fontWeight: 700,
              bgcolor: isDark ? 'rgba(255,255,255,0.04)' : '#ffffff',
              borderRadius: '8px',
              display: { xs: 'none', md: 'inline-flex' },
              '& .MuiSelect-select': { py: 0.25, px: 1, display: 'flex', alignItems: 'center', gap: 0.5 }
            }}
          >
            <MenuItem value="a4" sx={{ fontSize: '0.75rem', fontWeight: 600 }}>
              {PAGE_FORMAT_CONFIGS.a4.shortLabel} (210×297mm)
            </MenuItem>
            <MenuItem value="letter" sx={{ fontSize: '0.75rem', fontWeight: 600 }}>
              {PAGE_FORMAT_CONFIGS.letter.shortLabel} (8.5×11")
            </MenuItem>
            <MenuItem value="legal" sx={{ fontSize: '0.75rem', fontWeight: 600 }}>
              {PAGE_FORMAT_CONFIGS.legal.shortLabel} (8.5×14")
            </MenuItem>
          </Select>
        )}

        {/* Magic 1-Page Auto-Fit Button */}
        {!isEditingMarkdown && onAutoFit && (
          <Tooltip title={t('preview:toolbar.autoFitTooltip', 'Auto-Fit to 1 Page: Automatically recalibrates spacing and density to snap resume perfectly to 1 page.')}>
            <Button
              size="small"
              variant={isOverflowing ? 'contained' : 'outlined'}
              color={isOverflowing ? 'warning' : 'inherit'}
              startIcon={<BoltRoundedIcon sx={{ fontSize: '15px !important' }} />}
              onClick={onAutoFit}
              sx={{
                height: 28,
                fontSize: '0.72rem',
                fontWeight: 800,
                px: 1.2,
                borderRadius: '8px',
                display: { xs: 'none', sm: 'inline-flex' },
                animation: isOverflowing ? 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' : 'none',
                boxShadow: isOverflowing ? '0 0 12px rgba(245, 158, 11, 0.4)' : 'none'
              }}
            >
              {t('preview:toolbar.autoFit', 'Auto-Fit 1 Page')}
            </Button>
          </Tooltip>
        )}

        {/* Live Document Text Formatting Tools */}
        {!isEditingMarkdown && (
          <ButtonGroup size="small" variant="outlined" sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.03)' : '#ffffff', flexShrink: 0 }}>
            <Tooltip title={t('preview:toolbar.formatBold', 'Bold Selected Text (Ctrl+B)')}>
              <IconButton
                size="small"
                onClick={() => liveEdit?.formatSelection('bold')}
                sx={{
                  borderRadius: '6px',
                  p: 0.6,
                  color: 'text.primary',
                  '&:hover': { color: 'primary.main', bgcolor: alpha(theme.palette.primary.main, 0.1) }
                }}
              >
                <FormatBoldRoundedIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>
            <Tooltip title={t('preview:toolbar.formatItalic', 'Italic Selected Text (Ctrl+I)')}>
              <IconButton
                size="small"
                onClick={() => liveEdit?.formatSelection('italic')}
                sx={{
                  borderRadius: '6px',
                  p: 0.6,
                  color: 'text.primary',
                  '&:hover': { color: 'primary.main', bgcolor: alpha(theme.palette.primary.main, 0.1) }
                }}
              >
                <FormatItalicRoundedIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>
            <Tooltip title={t('preview:toolbar.formatHighlight', 'Highlight Keyword (++)')}>
              <IconButton
                size="small"
                onClick={() => liveEdit?.formatSelection('highlight')}
                sx={{
                  borderRadius: '6px',
                  p: 0.6,
                  color: 'text.primary',
                  '&:hover': { color: 'primary.main', bgcolor: alpha(theme.palette.primary.main, 0.1) }
                }}
              >
                <HighlightRoundedIcon sx={{ fontSize: 17 }} />
              </IconButton>
            </Tooltip>
          </ButtonGroup>
        )}
      </Box>

      {/* Right: Quick Tools + Action Buttons */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
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

        {/* Direct PDF Export Split Button */}
        <ButtonGroup
          variant="contained"
          color="primary"
          size="small"
          sx={{
            boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.35)}`,
            '& .MuiButtonGroup-grouped': { borderColor: alpha('#ffffff', 0.2) }
          }}
        >
          <Button
            onClick={onDownloadPdf}
            disabled={isExportingPdf}
            startIcon={
              isExportingPdf ? (
                <CircularProgress size={15} color="inherit" />
              ) : (
                <PictureAsPdfRoundedIcon />
              )
            }
            sx={{ fontWeight: 800, fontSize: { xs: '0.72rem', sm: '0.78rem' }, px: { xs: 1.2, sm: 1.8 }, whiteSpace: 'nowrap' }}
          >
            <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
              {isExportingPdf ? t('preview:toolbar.generatingPdf', 'Generating PDF...') : t('preview:toolbar.downloadPdfDirect', 'Download PDF')}
            </Box>
            <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>
              {isExportingPdf ? '...' : t('preview:toolbar.exportPdfShort', 'PDF')}
            </Box>
          </Button>
          <Button
            size="small"
            onClick={handleOpenPdfMenu}
            sx={{ px: 0.5, minWidth: '28px' }}
          >
            <ArrowDropDownRoundedIcon />
          </Button>
        </ButtonGroup>

        {/* PDF Export Options Dropdown Menu */}
        <Menu
          anchorEl={pdfMenuAnchor}
          open={Boolean(pdfMenuAnchor)}
          onClose={handleClosePdfMenu}
          slotProps={{
            paper: {
              sx: {
                borderRadius: '12px',
                mt: 0.5,
                minWidth: 230,
                boxShadow: isDark ? '0 12px 32px rgba(0,0,0,0.7)' : '0 12px 32px rgba(0,0,0,0.12)'
              }
            }
          }}
        >
          <MenuItem
            onClick={() => {
              handleClosePdfMenu();
              onDownloadPdf();
            }}
          >
            <ListItemIcon>
              <DownloadRoundedIcon fontSize="small" color="primary" />
            </ListItemIcon>
            <ListItemText
              primary={t('preview:toolbar.directPdfItem', 'Direct PDF Download')}
              secondary={t('preview:toolbar.directPdfDesc', '1-Click instant file download')}
              slotProps={{
                primary: { sx: { fontSize: '0.82rem', fontWeight: 700 } },
                secondary: { sx: { fontSize: '0.7rem' } }
              }}
            />
          </MenuItem>

          {onPrintPdf && (
            <MenuItem
              onClick={() => {
                handleClosePdfMenu();
                onPrintPdf();
              }}
            >
              <ListItemIcon>
                <PrintRoundedIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary={t('preview:toolbar.printPdfItem', 'Print via Browser')}
                secondary={t('preview:toolbar.printPdfDesc', 'System print window (Ctrl+P)')}
                slotProps={{
                  primary: { sx: { fontSize: '0.82rem', fontWeight: 600 } },
                  secondary: { sx: { fontSize: '0.7rem' } }
                }}
              />
            </MenuItem>
          )}
        </Menu>
      </Box>
    </Paper>
  );
};
