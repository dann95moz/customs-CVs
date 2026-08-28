import React from 'react';
import { Box, Typography, useTheme, alpha } from '@mui/material';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import { ThemeId, PaletteId, TemplateThumbnailMiniatureProps } from '../../types';
import { getPaletteConfig } from '../../constants/palettes';

export type { TemplateThumbnailMiniatureProps };

export const TemplateThumbnailMiniature: React.FC<TemplateThumbnailMiniatureProps> = ({
  themeId,
  paletteId,
  customColor,
  name,
  category,
  isSelected,
  onClick,
}) => {
  const muiTheme = useTheme();
  const isDark = muiTheme.palette.mode === 'dark';
  const pal = getPaletteConfig(paletteId, customColor);

  const renderMiniLayout = () => {
    switch (themeId) {
      case 'executive':
        // Corporate Top Banner (Photo 2): Top colored banner with monogram box, 2 columns below
        return (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', overflow: 'hidden' }}>
            {/* Full-width Top Banner */}
            <div style={{ background: pal.headerBg || pal.accentColor, padding: '5px 4px 4px', textAlign: 'center', flexShrink: 0 }}>
              <div style={{ width: '10px', height: '10px', border: '1px solid rgba(255,255,255,0.85)', borderRadius: '1px', margin: '0 auto 2px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '5px', color: '#ffffff', fontWeight: 800, lineHeight: 1 }}>DC</span>
              </div>
              <div style={{ height: '3px', width: '55%', background: '#ffffff', borderRadius: '1px', margin: '0 auto 1.5px' }} />
              <div style={{ height: '1.5px', width: '35%', background: 'rgba(255,255,255,0.7)', borderRadius: '1px', margin: '0 auto' }} />
            </div>
            {/* 2-Column Body Below */}
            <div style={{ display: 'grid', gridTemplateColumns: '62% 38%', gap: '4px', padding: '5px 4px', flex: 1 }}>
              {/* Left Main */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <div style={{ height: '2px', width: '45%', background: '#0f172a' }} />
                <div style={{ height: '1.2px', width: '98%', background: '#94a3b8' }} />
                <div style={{ height: '1.2px', width: '90%', background: '#94a3b8', marginBottom: '2px' }} />

                <div style={{ height: '2px', width: '55%', background: '#0f172a' }} />
                <div style={{ height: '1.2px', width: '96%', background: '#94a3b8' }} />
                <div style={{ height: '1.2px', width: '92%', background: '#94a3b8' }} />
                <div style={{ height: '1.2px', width: '85%', background: '#94a3b8' }} />
              </div>
              {/* Right Side */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', borderLeft: '0.5px solid #e2e8f0', paddingLeft: '3px' }}>
                <div style={{ height: '1.5px', width: '80%', background: pal.accentColor }} />
                <div style={{ height: '1.2px', width: '90%', background: '#64748b' }} />
                <div style={{ height: '1.2px', width: '75%', background: '#64748b', marginBottom: '2px' }} />

                <div style={{ height: '1.5px', width: '70%', background: '#0f172a' }} />
                <div style={{ height: '1.2px', width: '85%', background: '#64748b' }} />
                <div style={{ height: '1.2px', width: '80%', background: '#64748b' }} />
              </div>
            </div>
          </div>
        );

      case 'two-column':
        // Modern Contrast Sidebar (Photo 3): Solid colored right sidebar with white emblem
        return (
          <div style={{ display: 'grid', gridTemplateColumns: '62% 38%', height: '100%', width: '100%', overflow: 'hidden' }}>
            {/* Left Main Content */}
            <div style={{ padding: '6px 5px', display: 'flex', flexDirection: 'column', gap: '2.5px' }}>
              <div style={{ height: '4px', width: '75%', background: pal.accentColor, borderRadius: '1px', marginBottom: '1px' }} />
              <div style={{ height: '2px', width: '45%', background: '#475569', borderRadius: '1px', marginBottom: '3px' }} />
              
              <div style={{ height: '2px', width: '45%', background: '#0f172a' }} />
              <div style={{ height: '1.2px', width: '98%', background: '#94a3b8' }} />
              <div style={{ height: '1.2px', width: '90%', background: '#94a3b8', marginBottom: '2px' }} />

              <div style={{ height: '2px', width: '50%', background: '#0f172a' }} />
              <div style={{ height: '1.2px', width: '96%', background: '#94a3b8' }} />
              <div style={{ height: '1.2px', width: '90%', background: '#94a3b8' }} />
              <div style={{ height: '1.2px', width: '82%', background: '#94a3b8' }} />
            </div>
            {/* Right Solid Colored Sidebar */}
            <div style={{ background: pal.sidebarBg || pal.accentColor, padding: '6px 4px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
              {/* White Square Emblem */}
              <div style={{ width: '12px', height: '12px', background: '#ffffff', borderRadius: '1.5px', margin: '0 auto 3px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '6px', height: '6px', transform: 'rotate(45deg)', background: pal.accentColor }} />
              </div>
              <div style={{ height: '1.5px', width: '85%', background: '#ffffff', margin: '0 auto 1px' }} />
              <div style={{ height: '1.2px', width: '70%', background: 'rgba(255,255,255,0.7)', margin: '0 auto 3px' }} />
              
              <div style={{ height: '1.5px', width: '80%', background: '#ffffff', margin: '0 auto 1px' }} />
              <div style={{ height: '1px', width: '90%', background: 'rgba(255,255,255,0.7)', margin: '0 auto 1px' }} />
              <div style={{ height: '1px', width: '85%', background: 'rgba(255,255,255,0.7)', margin: '0 auto 1px' }} />
              <div style={{ height: '1px', width: '75%', background: 'rgba(255,255,255,0.7)', margin: '0 auto 1px' }} />
            </div>
          </div>
        );

      case 'designer-uiux':
        // Editorial Pastel Card (Photo 4): Top-left pastel card with name/contacts
        return (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', padding: '5px 4px', gap: '4px', overflow: 'hidden' }}>
            {/* Top Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '38% 62%', gap: '4px', alignItems: 'start' }}>
              {/* Pastel Tinted Card */}
              <div style={{ background: pal.badgeBg || pal.accentLight, border: `0.5px solid ${pal.accentBorder}`, borderRadius: '2px', padding: '3px 2.5px' }}>
                <div style={{ height: '3px', width: '80%', background: '#0f172a', borderRadius: '1px', marginBottom: '1.5px' }} />
                <div style={{ height: '1.5px', width: '60%', background: '#475569', marginBottom: '2px' }} />
                <div style={{ height: '0.8px', background: 'rgba(0,0,0,0.1)', marginBottom: '2px' }} />
                <div style={{ height: '1px', width: '85%', background: '#64748b', marginBottom: '1px' }} />
                <div style={{ height: '1px', width: '75%', background: '#64748b' }} />
              </div>
              {/* Top Summary */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5px', paddingTop: '1px' }}>
                <div style={{ height: '2px', width: '50%', background: '#0f172a' }} />
                <div style={{ height: '1.2px', width: '98%', background: '#94a3b8' }} />
                <div style={{ height: '1.2px', width: '92%', background: '#94a3b8' }} />
                <div style={{ height: '1.2px', width: '85%', background: '#94a3b8' }} />
              </div>
            </div>
            {/* Bottom 2 Columns */}
            <div style={{ display: 'grid', gridTemplateColumns: '38% 62%', gap: '4px', flex: 1 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <div style={{ height: '1.8px', width: '60%', background: '#0f172a' }} />
                <div style={{ height: '1.2px', width: '85%', background: '#64748b' }} />
                <div style={{ height: '1.2px', width: '80%', background: '#64748b' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <div style={{ height: '1.8px', width: '50%', background: '#0f172a' }} />
                <div style={{ height: '1.2px', width: '96%', background: '#94a3b8' }} />
                <div style={{ height: '1.2px', width: '90%', background: '#94a3b8' }} />
              </div>
            </div>
          </div>
        );

      case 'academic-research':
        // Executive Dual-Tone (Photo 5): Dark slate left sidebar with monogram avatar, top-right soft banner
        return (
          <div style={{ display: 'grid', gridTemplateColumns: '36% 64%', height: '100%', width: '100%', overflow: 'hidden' }}>
            {/* Dark Slate Left Sidebar */}
            <div style={{ background: '#1e293b', padding: '6px 4px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
              <div style={{ width: '14px', height: '14px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.1)', margin: '0 auto 3px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '6px', color: '#ffffff', fontWeight: 800 }}>DC</span>
              </div>
              <div style={{ height: '1.2px', width: '80%', background: '#f8fafc', margin: '0 auto 1px' }} />
              <div style={{ height: '1px', width: '85%', background: 'rgba(255,255,255,0.6)', margin: '0 auto 1px' }} />
              <div style={{ height: '1px', width: '75%', background: 'rgba(255,255,255,0.6)', margin: '0 auto 3px' }} />
              
              <div style={{ height: '1.2px', width: '70%', background: '#f8fafc', margin: '0 auto 1px' }} />
              <div style={{ height: '1px', width: '85%', background: 'rgba(255,255,255,0.6)', margin: '0 auto 1px' }} />
              <div style={{ height: '1px', width: '80%', background: 'rgba(255,255,255,0.6)', margin: '0 auto' }} />
            </div>
            {/* Right Column with Soft Header Banner */}
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ background: pal.accentLight, padding: '4px 5px', borderBottom: `0.5px solid ${pal.accentBorder}` }}>
                <div style={{ height: '3.5px', width: '65%', background: pal.accentColor, borderRadius: '1px', marginBottom: '1.5px' }} />
                <div style={{ height: '1.5px', width: '40%', background: '#475569' }} />
              </div>
              <div style={{ padding: '5px 5px', display: 'flex', flexDirection: 'column', gap: '2px', flex: 1 }}>
                <div style={{ height: '2px', width: '45%', background: '#0f172a' }} />
                <div style={{ height: '1.2px', width: '98%', background: '#94a3b8' }} />
                <div style={{ height: '1.2px', width: '90%', background: '#94a3b8', marginBottom: '2px' }} />
                <div style={{ height: '2px', width: '50%', background: '#0f172a' }} />
                <div style={{ height: '1.2px', width: '95%', background: '#94a3b8' }} />
                <div style={{ height: '1.2px', width: '88%', background: '#94a3b8' }} />
              </div>
            </div>
          </div>
        );

      case 'formal-legal':
        return (
          <div style={{ padding: '7px 8px', height: '100%', display: 'flex', flexDirection: 'column', gap: '3px' }}>
            <div style={{ textAlign: 'center', borderBottom: `1.5px double ${pal.accentColor}`, paddingBottom: '3px', marginBottom: '3px' }}>
              <div style={{ height: '4px', width: '60px', background: pal.accentColor, margin: '0 auto 2px', borderRadius: '0.5px' }} />
              <div style={{ height: '2px', width: '38px', background: '#475569', margin: '0 auto 1.5px' }} />
              <div style={{ height: '1.5px', width: '50px', background: '#94a3b8', margin: '0 auto' }} />
            </div>
            <div style={{ borderBottom: `0.5px solid ${pal.accentBorder}`, paddingBottom: '1px' }}>
              <div style={{ height: '2.5px', width: '48px', background: pal.accentColor }} />
            </div>
            <div style={{ height: '1.5px', width: '98%', background: '#475569' }} />
            <div style={{ height: '1.5px', width: '90%', background: '#475569', marginBottom: '2px' }} />
            <div style={{ borderBottom: `0.5px solid ${pal.accentBorder}`, paddingBottom: '1px' }}>
              <div style={{ height: '2.5px', width: '52px', background: pal.accentColor }} />
            </div>
            <div style={{ height: '1.5px', width: '96%', background: '#475569' }} />
            <div style={{ height: '1.5px', width: '92%', background: '#475569' }} />
          </div>
        );

      case 'minimal-ats':
        return (
          <div style={{ padding: '7px 8px', height: '100%', display: 'flex', flexDirection: 'column', gap: '2.5px' }}>
            <div style={{ borderBottom: '0.8px solid #0f172a', paddingBottom: '3px', marginBottom: '3px' }}>
              <div style={{ height: '4px', width: '52px', background: '#0f172a', marginBottom: '2px' }} />
              <div style={{ height: '2px', width: '34px', background: '#334155', marginBottom: '1.5px' }} />
              <div style={{ height: '1.5px', width: '46px', background: '#64748b' }} />
            </div>
            <div style={{ height: '2.5px', width: '38px', background: '#0f172a' }} />
            <div style={{ height: '1.5px', width: '98%', background: '#334155' }} />
            <div style={{ height: '1.5px', width: '88%', background: '#334155', marginBottom: '2px' }} />
            <div style={{ height: '2.5px', width: '42px', background: '#0f172a' }} />
            <div style={{ height: '1.5px', width: '96%', background: '#334155' }} />
            <div style={{ height: '1.5px', width: '90%', background: '#334155' }} />
          </div>
        );

      case 'modern-tech':
      default:
        return (
          <div style={{ padding: '7px 7px', height: '100%', display: 'flex', flexDirection: 'column', gap: '3px' }}>
            <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '3px', marginBottom: '2px' }}>
              <div style={{ height: '4.5px', width: '54px', background: '#0f172a', borderRadius: '1px', marginBottom: '2px' }} />
              <div style={{ height: '2px', width: '36px', background: pal.accentColor, borderRadius: '1px' }} />
            </div>
            <div style={{ display: 'flex', gap: '2px', marginBottom: '2px' }}>
              <div style={{ height: '2.5px', width: '14px', background: pal.badgeBg, borderRadius: '1px' }} />
              <div style={{ height: '2.5px', width: '18px', background: pal.badgeBg, borderRadius: '1px' }} />
              <div style={{ height: '2.5px', width: '12px', background: pal.badgeBg, borderRadius: '1px' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
              <div style={{ width: '2px', height: '3.5px', background: pal.accentColor, borderRadius: '0.5px' }} />
              <div style={{ height: '2.5px', width: '38px', background: '#0f172a' }} />
            </div>
            <div style={{ height: '1.5px', width: '98%', background: '#64748b' }} />
            <div style={{ height: '1.5px', width: '86%', background: '#64748b', marginBottom: '2px' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
              <div style={{ width: '2px', height: '3.5px', background: pal.accentColor, borderRadius: '0.5px' }} />
              <div style={{ height: '2.5px', width: '42px', background: '#0f172a' }} />
            </div>
            <div style={{ height: '1.5px', width: '94%', background: '#64748b' }} />
            <div style={{ height: '1.5px', width: '88%', background: '#64748b' }} />
          </div>
        );
    }
  };

  return (
    <Box
      onClick={onClick}
      sx={{
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 0.75,
        p: 0.5,
        borderRadius: '10px',
        transition: 'all 0.18s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
        }
      }}
    >
      {/* Miniature Sheet Canvas Card */}
      <Box
        sx={{
          width: '100%',
          aspectRatio: '1 / 1.414',
          bgcolor: '#ffffff',
          borderRadius: '6px',
          overflow: 'hidden',
          position: 'relative',
          border: isSelected
            ? `2.5px solid ${muiTheme.palette.primary.main}`
            : `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : '#e2e8f0'}`,
          boxShadow: isSelected
            ? `0 0 0 2px ${alpha(muiTheme.palette.primary.main, 0.25)}, 0 6px 16px rgba(0,0,0,0.15)`
            : '0 2px 8px rgba(0,0,0,0.06)',
          transition: 'all 0.18s ease',
          '&:hover': {
            borderColor: muiTheme.palette.primary.main,
            boxShadow: `0 6px 18px ${alpha(muiTheme.palette.primary.main, 0.2)}`,
          }
        }}
      >
        {/* Render Miniature Layout */}
        {renderMiniLayout()}

        {/* Selected Checkmark Badge */}
        {isSelected && (
          <Box
            sx={{
              position: 'absolute',
              top: 5,
              right: 5,
              bgcolor: 'primary.main',
              color: '#ffffff',
              borderRadius: '50%',
              width: 18,
              height: 18,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
            }}
          >
            <CheckCircleRoundedIcon sx={{ fontSize: 16 }} />
          </Box>
        )}
      </Box>

      {/* Template Name & Category */}
      <Box sx={{ width: '100%', textAlign: 'center' }}>
        <Typography
          variant="caption"
          sx={{
            fontWeight: isSelected ? 800 : 600,
            fontSize: '0.76rem',
            color: isSelected ? 'primary.main' : 'text.primary',
            display: 'block',
            lineHeight: 1.2,
          }}
        >
          {name}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            fontSize: '0.66rem',
            color: 'text.secondary',
            display: 'block',
            mt: 0.25,
            lineHeight: 1.1,
          }}
        >
          {category}
        </Typography>
      </Box>
    </Box>
  );
};
