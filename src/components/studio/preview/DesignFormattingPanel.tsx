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
import { PaletteId, FontFamilyId, SpacingDensity } from '../../../types/cv';
import { getAllPalettes } from '../../../constants/palettes';

export interface DesignFormattingPanelProps {
  customColor: string;
  onCustomColorChange: (hex: string) => void;
  palette: PaletteId;
  onSelectPalette: (id: PaletteId) => void;
  fontFamily: FontFamilyId;
  onFontFamilyChange: (font: FontFamilyId) => void;
  spacingDensity: SpacingDensity;
  onSpacingDensityChange: (density: SpacingDensity) => void;
  sheetHeight: number;
  a4PagePx: number;
  estimatedPages: number;
  onClose: () => void;
}

/**
 * Slide-out panel for brand colors, typography, density, and page budget calculation.
 * Principle: Single Responsibility (S) - controls document styling options and length calibration.
 */
export const DesignFormattingPanel: React.FC<DesignFormattingPanelProps> = ({
  customColor,
  onCustomColorChange,
  palette,
  onSelectPalette,
  fontFamily,
  onFontFamilyChange,
  spacingDensity,
  onSpacingDensityChange,
  sheetHeight,
  a4PagePx,
  estimatedPages,
  onClose,
}) => {
  const muiTheme = useTheme();
  const palettes = getAllPalettes();

  return (
    <Box sx={{ p: 2.5 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary' }}>
          Design &amp; formatting
        </Typography>
        <IconButton size="small" onClick={onClose}>
          <CloseRoundedIcon />
        </IconButton>
      </Box>

      {/* Section 1: Brand Color Picker */}
      <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 0.5 }}>
        Brand Color &amp; Custom HEX
      </Typography>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5, lineHeight: 1.4 }}>
        Dynamically styles headers, sidebars, monogram badges, lines and pills.
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
        Or Choose a Curated Palette
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
        Document Typography
      </Typography>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.2, lineHeight: 1.4 }}>
        ATS-safe font families calibrated for executive clarity.
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
        Content Spacing &amp; Density
      </Typography>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.2, lineHeight: 1.4 }}>
        Adjust padding and line height to guarantee a strict 1-page fit.
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

      {/* Section 4: Page Budget & Scale Meter */}
      <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1 }}>
        Page Budget &amp; Scale
      </Typography>
      <Paper variant="outlined" sx={{ p: 1.5, borderRadius: '8px' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
          <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>Target Format:</Typography>
          <Typography variant="caption" sx={{ fontWeight: 700 }}>A4 Standard (1 Page)</Typography>
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
          {Math.round((sheetHeight / a4PagePx) * 100)}% of 1 A4 Page
        </Typography>
      </Paper>
    </Box>
  );
};
