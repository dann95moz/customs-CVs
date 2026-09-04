import React from 'react';
import { Box, Typography, Tooltip, useTheme, alpha } from '@mui/material';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import { TemplateThumbnailMiniatureProps } from '../../types';
import { getPaletteConfig } from '../../constants/palettes';
import { MINIATURE_REGISTRY, getLayoutBadge, AcademicResearchMiniature } from './thumbnails';

export type { TemplateThumbnailMiniatureProps };

export const TemplateThumbnailMiniature: React.FC<TemplateThumbnailMiniatureProps> = ({
  themeId,
  paletteId,
  customColor,
  name,
  description,
  recommendedFor,
  icon,
  isSelected,
  onClick,
}) => {
  const muiTheme = useTheme();
  const isDark = muiTheme.palette.mode === 'dark';
  const pal = getPaletteConfig(paletteId, customColor);

  const MiniatureComponent = MINIATURE_REGISTRY[themeId] || AcademicResearchMiniature;

  const tooltipContent = recommendedFor
    ? `${name} — ${description || ''}\nIdeal for: ${recommendedFor}`
    : `${name} — ${description || ''}`;

  return (
    <Tooltip title={tooltipContent} arrow placement="top">
      <Box
        onClick={onClick}
        sx={{
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 0.75,
          p: 0.5,
          borderRadius: 2,
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-3px)',
          },
        }}
      >
        {/* Miniature Sheet Canvas Card */}
        <Box
          sx={{
            width: '100%',
            aspectRatio: '1 / 1.414',
            bgcolor: 'common.white',
            borderRadius: 1,
            overflow: 'hidden',
            position: 'relative',
            border: isSelected
              ? `2.5px solid ${muiTheme.palette.primary.main}`
              : `1px solid ${muiTheme.palette.divider}`,
            boxShadow: isSelected
              ? `0 0 0 2px ${alpha(muiTheme.palette.primary.main, 0.25)}, 0 8px 24px ${alpha(pal.accentColor, 0.25)}`
              : isDark
              ? '0 3px 10px rgba(0,0,0,0.4)'
              : '0 3px 10px rgba(0,0,0,0.07)',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              borderColor: muiTheme.palette.primary.main,
              boxShadow: `0 8px 24px ${alpha(pal.accentColor, 0.28)}`,
            },
          }}
        >
          {/* Render High-Fidelity Miniature Layout via Modular Registry */}
          <MiniatureComponent pal={pal} />

          {/* Selected Checkmark Badge */}
          {isSelected && (
            <Box
              sx={{
                position: 'absolute',
                top: 6,
                right: 6,
                bgcolor: 'primary.main',
                color: 'common.white',
                borderRadius: '50%',
                width: 20,
                height: 20,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.35)',
                zIndex: 3,
                animation: 'scaleIn 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                '@keyframes scaleIn': {
                  '0%': { transform: 'scale(0.5)', opacity: 0 },
                  '100%': { transform: 'scale(1)', opacity: 1 },
                },
              }}
            >
              <CheckCircleRoundedIcon sx={{ fontSize: 17 }} />
            </Box>
          )}
        </Box>

        {/* Template Name & Dynamic Layout Pill Badge */}
        <Box sx={{ width: '100%', textAlign: 'center' }}>
          <Typography
            variant="caption"
            sx={{
              fontWeight: isSelected ? 800 : 700,
              fontSize: '0.78rem',
              color: isSelected ? 'primary.main' : 'text.primary',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 0.5,
              lineHeight: 1.2,
            }}
          >
            {icon && <span>{icon}</span>}
            {name}
          </Typography>

          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              mt: 0.4,
              px: 0.9,
              py: 0.15,
              borderRadius: 9999,
              bgcolor: isSelected
                ? alpha(muiTheme.palette.primary.main, 0.1)
                : isDark
                ? 'rgba(255,255,255,0.06)'
                : 'rgba(0,0,0,0.05)',
              border: `1px solid ${
                isSelected
                  ? alpha(muiTheme.palette.primary.main, 0.3)
                  : isDark
                  ? 'rgba(255,255,255,0.1)'
                  : 'rgba(0,0,0,0.08)'
              }`,
            }}
          >
            <Typography
              variant="caption"
              sx={{
                fontSize: '0.64rem',
                fontWeight: 700,
                letterSpacing: '0.02em',
                color: isSelected ? 'primary.main' : 'text.secondary',
                lineHeight: 1.1,
              }}
            >
              {getLayoutBadge(themeId)}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Tooltip>
  );
};
