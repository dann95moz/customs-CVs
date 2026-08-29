import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  TextField,
  Chip,
  Paper,
  Divider,
  ToggleButton,
  ToggleButtonGroup,
  LinearProgress,
  useTheme,
  alpha
} from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ColorLensRoundedIcon from '@mui/icons-material/ColorLensRounded';
import { useTranslation } from 'react-i18next';
import { PaletteId, FontFamilyId, SpacingDensity, PageFormat, DesignFormattingPanelProps } from '../../../types';
import { getAllPalettes } from '../../../constants/palettes';

export type { DesignFormattingPanelProps };

export const DesignFormattingPanel: React.FC<DesignFormattingPanelProps> = ({
  customColor,
  onCustomColorChange,
  palette,
  onSelectPalette,
  fontFamily,
  onFontFamilyChange,
  spacingDensity,
  onSpacingDensityChange,
  pageFormat = 'a4',
  onPageFormatChange,
  onAutoFit,
  sheetHeight,
  a4PagePx,
  estimatedPages,
  onClose,
}) => {
  const { t } = useTranslation(['preview', 'common']);
  const muiTheme = useTheme();
  const palettes = getAllPalettes();

  return (
    <Box sx={{ p: 2.5 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary' }}>
          {t('preview:panels.design.title', 'Design & Formatting')}
        </Typography>
        <IconButton size="small" onClick={onClose}>
          <CloseRoundedIcon />
        </IconButton>
      </Box>

      {/* Section 1: Brand Color Picker */}
      <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 0.5 }}>
        {t('preview:panels.design.primaryColor', 'Accent Color')}
      </Typography>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5, lineHeight: 1.4 }}>
        {t('preview:panels.design.subtitle', 'Customize typography, spacing, and styling tokens')}
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
        <Box
          component="label"
          sx={{
            width: 38,
            height: 38,
            borderRadius: '8px',
            bgcolor: customColor,
            cursor: 'pointer',
            flexShrink: 0,
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid rgba(0,0,0,0.15)',
            boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
            transition: 'transform 0.15s ease',
            '&:hover': { transform: 'scale(1.06)' }
          }}
        >
          <input
            type="color"
            value={customColor}
            onChange={(e) => {
              onCustomColorChange(e.target.value);
              onSelectPalette('custom');
            }}
            style={{ opacity: 0, position: 'absolute', width: '100%', height: '100%', cursor: 'pointer' }}
          />
          <ColorLensRoundedIcon sx={{ fontSize: 20, color: '#ffffff', filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))' }} />
        </Box>
        <TextField
          size="small"
          value={customColor}
          onChange={(e) => {
            onCustomColorChange(e.target.value);
            onSelectPalette('custom');
          }}
          placeholder="#1d4ed8"
          sx={{ flex: 1 }}
          slotProps={{
            htmlInput: {
              style: { fontFamily: 'monospace', fontWeight: 700, fontSize: '0.85rem' }
            }
          }}
        />
        {palette === 'custom' && (
          <Chip label="Custom Active" color="primary" size="small" sx={{ fontWeight: 700, fontSize: '0.7rem' }} />
        )}
      </Box>

      {/* Curated Accent Palettes */}
      <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', display: 'block', mb: 1, textTransform: 'uppercase', letterSpacing: 0.5 }}>
        {t('preview:panels.templates.palette', 'Color Palette')}
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8, maxHeight: 180, overflowY: 'auto', pr: 0.5, mb: 2.5 }}>
        {palettes.map((p) => {
          const isSelected = palette === p.id;
          return (
            <Paper
              key={p.id}
              variant="outlined"
              onClick={() => {
                onSelectPalette(p.id);
                onCustomColorChange(p.primaryColor);
              }}
              sx={{
                p: 1,
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 1.2,
                borderColor: isSelected ? 'primary.main' : 'divider',
                bgcolor: isSelected ? alpha(muiTheme.palette.primary.main, 0.08) : 'background.paper',
                transition: 'all 0.15s ease',
                '&:hover': { borderColor: 'primary.main' }
              }}
            >
              <Box
                sx={{
                  width: 22,
                  height: 22,
                  borderRadius: '50%',
                  bgcolor: p.previewColor,
                  flexShrink: 0,
                  border: '1.5px solid rgba(0,0,0,0.1)',
                }}
              />
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="caption" sx={{ fontWeight: 800, display: 'block', color: 'text.primary', fontSize: '0.78rem' }}>
                  {p.name}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.65rem', display: 'block', lineHeight: 1.1 }} noWrap>
                  {p.description}
                </Typography>
              </Box>
            </Paper>
          );
        })}
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Section 2: Typography Selection */}
      <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 0.5 }}>
        {t('preview:panels.design.fontFamily', 'Font Family')}
      </Typography>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.2, lineHeight: 1.4 }}>
        ATS-safe typography calibrated for executive clarity.
      </Typography>

      <ToggleButtonGroup
        value={fontFamily}
        exclusive
        onChange={(_, val) => val && onFontFamilyChange(val as FontFamilyId)}
        size="small"
        fullWidth
        sx={{ mb: 2.5 }}
      >
        <ToggleButton value="inter" sx={{ fontSize: '0.72rem', fontWeight: 600, py: 0.6 }}>
          Modern Sans
        </ToggleButton>
        <ToggleButton value="outfit" sx={{ fontSize: '0.72rem', fontWeight: 600, py: 0.6 }}>
          Display
        </ToggleButton>
        <ToggleButton value="serif" sx={{ fontSize: '0.72rem', fontWeight: 600, py: 0.6 }}>
          Serif
        </ToggleButton>
        <ToggleButton value="mono" sx={{ fontSize: '0.72rem', fontWeight: 600, py: 0.6 }}>
          Mono
        </ToggleButton>
      </ToggleButtonGroup>

      <Divider sx={{ my: 2 }} />

      {/* Section 3: Spacing & Content Density */}
      <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 0.5 }}>
        {t('preview:panels.design.sectionSpacing', 'Section Spacing')}
      </Typography>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.2, lineHeight: 1.4 }}>
        Adjust padding and line height to guarantee optimal fit.
      </Typography>

      <ToggleButtonGroup
        value={spacingDensity}
        exclusive
        onChange={(_, val) => val && onSpacingDensityChange(val as SpacingDensity)}
        size="small"
        fullWidth
        sx={{ mb: 2.5 }}
      >
        <ToggleButton value="compact" sx={{ fontSize: '0.72rem', fontWeight: 700, py: 0.6 }}>
          Compact (1 Page)
        </ToggleButton>
        <ToggleButton value="standard" sx={{ fontSize: '0.72rem', fontWeight: 600, py: 0.6 }}>
          Standard
        </ToggleButton>
        <ToggleButton value="spacious" sx={{ fontSize: '0.72rem', fontWeight: 600, py: 0.6 }}>
          Spacious
        </ToggleButton>
      </ToggleButtonGroup>

      <Divider sx={{ my: 2 }} />

      {/* Section 4: Page Paper Format */}
      <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 0.5 }}>
        {t('preview:panels.design.pageFormat', 'Paper Format')}
      </Typography>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.2, lineHeight: 1.4 }}>
        Select standard international A4 or North American Letter/Legal.
      </Typography>

      <ToggleButtonGroup
        value={pageFormat}
        exclusive
        onChange={(_, val) => val && onPageFormatChange && onPageFormatChange(val as PageFormat)}
        size="small"
        fullWidth
        sx={{ mb: 2.5 }}
      >
        <ToggleButton value="a4" sx={{ fontSize: '0.72rem', fontWeight: 700, py: 0.6 }}>
          A4 (210×297)
        </ToggleButton>
        <ToggleButton value="letter" sx={{ fontSize: '0.72rem', fontWeight: 700, py: 0.6 }}>
          Letter (8.5×11")
        </ToggleButton>
        <ToggleButton value="legal" sx={{ fontSize: '0.72rem', fontWeight: 700, py: 0.6 }}>
          Legal (8.5×14")
        </ToggleButton>
      </ToggleButtonGroup>

      <Divider sx={{ my: 2 }} />

      {/* Section 5: Page Budget & Scale Meter */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
          {t('preview:toolbar.pageFit', 'Page Budget & Scale')}
        </Typography>
        {onAutoFit && (
          <Chip
            label="⚡ Auto-Fit"
            size="small"
            color={estimatedPages > 1 ? 'warning' : 'primary'}
            onClick={onAutoFit}
            clickable
            sx={{ fontWeight: 800, height: 22, fontSize: '0.7rem' }}
          />
        )}
      </Box>
      <Paper variant="outlined" sx={{ p: 1.5, borderRadius: '8px' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
          <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>Paper Standard:</Typography>
          <Typography variant="caption" sx={{ fontWeight: 700 }}>{pageFormat.toUpperCase()} ({a4PagePx}px)</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
          <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>Rendered Height:</Typography>
          <Typography variant="caption" sx={{ fontWeight: 700 }}>{sheetHeight}px / {a4PagePx}px</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>Page Status:</Typography>
          <Typography variant="caption" sx={{ fontWeight: 800, color: estimatedPages === 1 ? '#10b981' : '#f59e0b' }}>
            {estimatedPages === 1 ? 'Perfect 1 Page ✓' : `${estimatedPages} Pages`}
          </Typography>
        </Box>

        <LinearProgress
          variant="determinate"
          value={Math.min(100, Math.round((sheetHeight / a4PagePx) * 100))}
          color={estimatedPages === 1 ? 'success' : 'warning'}
          sx={{ height: 6, borderRadius: 3 }}
        />
        <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.66rem', mt: 0.5, display: 'block', textAlign: 'right' }}>
          {Math.round((sheetHeight / a4PagePx) * 100)}% of 1 {pageFormat.toUpperCase()} Page
        </Typography>
      </Paper>
    </Box>
  );
};
