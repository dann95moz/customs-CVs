import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  useTheme,
  alpha
} from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import FormatPaintRoundedIcon from '@mui/icons-material/FormatPaintRounded';
import { ThemeId, PaletteId, TemplatesPanelProps } from '../../../types';
import { getAllPalettes } from '../../../constants/palettes';
import { getAllTemplates } from '../../../templates';
import { TemplateThumbnailMiniature } from '../TemplateThumbnailMiniature';

export type { TemplatesPanelProps };

/**
 * Slide-out panel for browsing and picking CV templates and accent palettes.
 * Principle: Single Responsibility (S) - dedicated template selection panel.
 */
export const TemplatesPanel: React.FC<TemplatesPanelProps> = ({
  theme,
  onSelectTheme,
  palette,
  onSelectPalette,
  customColor,
  onCustomColorChange,
  onClose,
}) => {
  const muiTheme = useTheme();
  const palettes = getAllPalettes();
  const allTemplates = getAllTemplates();

  return (
    <Box sx={{ p: 2.5 }}>
      {/* Header: Title + Close Button */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary', letterSpacing: -0.5 }}>
          Templates
        </Typography>
        <IconButton
          size="small"
          onClick={onClose}
          sx={{ color: 'text.secondary', '&:hover': { color: 'text.primary' } }}
        >
          <CloseRoundedIcon />
        </IconButton>
      </Box>

      {/* Circular Color Swatches Row at Top */}
      <Box sx={{ mb: 3 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.2,
            overflowX: 'auto',
            py: 0.5,
            px: 0.25,
            '&::-webkit-scrollbar': { height: 4 },
            '&::-webkit-scrollbar-thumb': { bgcolor: 'divider', borderRadius: 4 },
          }}
        >
          {/* Custom Color Swatch */}
          <Tooltip title={`Custom Brand Color (${customColor}) — Click to customize`}>
            <Box
              component="label"
              sx={{
                width: 26,
                height: 26,
                borderRadius: '50%',
                bgcolor: customColor,
                cursor: 'pointer',
                flexShrink: 0,
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: palette === 'custom'
                  ? `2.5px solid ${muiTheme.palette.primary.main}`
                  : '1.5px solid rgba(0,0,0,0.2)',
                boxShadow: palette === 'custom' ? `0 0 0 2px ${alpha(customColor, 0.4)}` : 'none',
                transform: palette === 'custom' ? 'scale(1.15)' : 'scale(1)',
                transition: 'all 0.15s ease',
                '&:hover': { transform: 'scale(1.22)' }
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
              <FormatPaintRoundedIcon sx={{ fontSize: 13, color: '#ffffff', filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.6))' }} />
            </Box>
          </Tooltip>

          {palettes.map((p) => {
            const isSelected = palette === p.id;
            return (
              <Tooltip key={p.id} title={`${p.name} — ${p.description}`}>
                <Box
                  onClick={() => {
                    onSelectPalette(p.id);
                    onCustomColorChange(p.primaryColor);
                  }}
                  sx={{
                    width: 26,
                    height: 26,
                    borderRadius: '50%',
                    bgcolor: p.previewColor,
                    cursor: 'pointer',
                    flexShrink: 0,
                    border: isSelected
                      ? `2.5px solid ${muiTheme.palette.primary.main}`
                      : '1.5px solid rgba(0,0,0,0.12)',
                    boxShadow: isSelected ? `0 0 0 2px ${alpha(p.previewColor, 0.4)}` : 'none',
                    transform: isSelected ? 'scale(1.15)' : 'scale(1)',
                    transition: 'all 0.15s ease',
                    '&:hover': { transform: 'scale(1.22)' }
                  }}
                />
              </Tooltip>
            );
          })}
        </Box>
      </Box>

      {/* Subtitle: All templates */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'text.primary' }}>
          All templates
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
          {allTemplates.length} designs
        </Typography>
      </Box>

      {/* 2-Column Grid of Miniature Template Preview Cards */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 1.75,
        }}
      >
        {allTemplates.map((t) => (
          <TemplateThumbnailMiniature
            key={t.id}
            themeId={t.id}
            paletteId={palette}
            customColor={palette === 'custom' ? customColor : undefined}
            name={t.name}
            category={t.category}
            isSelected={theme === t.id}
            onClick={() => onSelectTheme(t.id)}
          />
        ))}
      </Box>
    </Box>
  );
};
