import React from 'react';
import { Box, Typography, Chip, useTheme, alpha } from '@mui/material';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import { ThemeId, PaletteId } from '../../types/cv';
import { getPaletteConfig } from '../../constants/palettes';

interface TemplateThumbnailMiniatureProps {
  themeId: ThemeId;
  paletteId: PaletteId;
  name: string;
  category: string;
  isSelected: boolean;
  onClick: () => void;
}

export const TemplateThumbnailMiniature: React.FC<TemplateThumbnailMiniatureProps> = ({
  themeId,
  paletteId,
  name,
  category,
  isSelected,
  onClick,
}) => {
  const muiTheme = useTheme();
  const isDark = muiTheme.palette.mode === 'dark';
  const pal = getPaletteConfig(paletteId);

  const renderMiniLayout = () => {
    switch (themeId) {
      case 'two-column':
        return (
          <div style={{ display: 'flex', height: '100%', width: '100%', overflow: 'hidden' }}>
            {/* Left Sidebar */}
            <div style={{ width: '36%', background: pal.accentColor, padding: '7px 5px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
              <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: 'rgba(255,255,255,0.3)', margin: '0 auto 3px' }} />
              <div style={{ height: '3px', width: '85%', background: '#ffffff', borderRadius: '1px', margin: '0 auto' }} />
              <div style={{ height: '2px', width: '65%', background: 'rgba(255,255,255,0.7)', borderRadius: '1px', margin: '0 auto 5px' }} />
              
              <div style={{ height: '2.5px', width: '75%', background: 'rgba(255,255,255,0.9)', margin: '0 auto 1px' }} />
              <div style={{ height: '1.5px', width: '90%', background: 'rgba(255,255,255,0.5)', margin: '0 auto 1px' }} />
              <div style={{ height: '1.5px', width: '80%', background: 'rgba(255,255,255,0.5)', margin: '0 auto 1px' }} />
              <div style={{ height: '1.5px', width: '85%', background: 'rgba(255,255,255,0.5)', margin: '0 auto 4px' }} />

              <div style={{ height: '2.5px', width: '75%', background: 'rgba(255,255,255,0.9)', margin: '0 auto 1px' }} />
              <div style={{ height: '1.5px', width: '85%', background: 'rgba(255,255,255,0.5)', margin: '0 auto 1px' }} />
              <div style={{ height: '1.5px', width: '80%', background: 'rgba(255,255,255,0.5)', margin: '0 auto' }} />
            </div>
            {/* Right Main Content */}
            <div style={{ flex: 1, padding: '7px 6px', display: 'flex', flexDirection: 'column', gap: '2.5px' }}>
              <div style={{ height: '4px', width: '65%', background: '#0f172a', borderRadius: '1px' }} />
              <div style={{ height: '2px', width: '45%', background: pal.accentColor, borderRadius: '1px', marginBottom: '3px' }} />
              
              <div style={{ height: '2.5px', width: '40%', background: '#0f172a' }} />
              <div style={{ height: '1.5px', width: '98%', background: '#94a3b8' }} />
              <div style={{ height: '1.5px', width: '92%', background: '#94a3b8' }} />
              <div style={{ height: '1.5px', width: '85%', background: '#94a3b8', marginBottom: '3px' }} />

              <div style={{ height: '2.5px', width: '40%', background: '#0f172a' }} />
              <div style={{ height: '1.5px', width: '96%', background: '#94a3b8' }} />
              <div style={{ height: '1.5px', width: '90%', background: '#94a3b8' }} />
              <div style={{ height: '1.5px', width: '82%', background: '#94a3b8' }} />
            </div>
          </div>
        );

      case 'designer-uiux':
        return (
          <div style={{ padding: '8px 7px', height: '100%', display: 'flex', flexDirection: 'column', gap: '3px' }}>
            {/* Header with Title Pill */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '3px', marginBottom: '2px' }}>
              <div>
                <div style={{ height: '4.5px', width: '55px', background: '#0f172a', borderRadius: '1px', marginBottom: '2px' }} />
                <div style={{ height: '2.5px', width: '38px', background: pal.accentColor, borderRadius: '6px' }} />
              </div>
              <div style={{ width: '13px', height: '13px', borderRadius: '50%', background: pal.badgeBg, border: `1px solid ${pal.accentBorder}` }} />
            </div>
            {/* Skill tags */}
            <div style={{ display: 'flex', gap: '2px', marginBottom: '2px' }}>
              <div style={{ height: '3px', width: '15px', background: pal.badgeBg, borderRadius: '4px', border: `0.5px solid ${pal.accentBorder}` }} />
              <div style={{ height: '3px', width: '18px', background: pal.badgeBg, borderRadius: '4px', border: `0.5px solid ${pal.accentBorder}` }} />
              <div style={{ height: '3px', width: '14px', background: pal.badgeBg, borderRadius: '4px', border: `0.5px solid ${pal.accentBorder}` }} />
            </div>
            {/* Sections */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
              <div style={{ width: '2.5px', height: '2.5px', borderRadius: '50%', background: pal.accentColor }} />
              <div style={{ height: '2.5px', width: '40px', background: '#0f172a' }} />
            </div>
            <div style={{ height: '1.5px', width: '98%', background: '#cbd5e1' }} />
            <div style={{ height: '1.5px', width: '88%', background: '#cbd5e1', marginBottom: '2px' }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
              <div style={{ width: '2.5px', height: '2.5px', borderRadius: '50%', background: pal.accentColor }} />
              <div style={{ height: '2.5px', width: '45px', background: '#0f172a' }} />
            </div>
            <div style={{ height: '1.5px', width: '96%', background: '#cbd5e1' }} />
            <div style={{ height: '1.5px', width: '90%', background: '#cbd5e1' }} />
            <div style={{ height: '1.5px', width: '84%', background: '#cbd5e1' }} />
          </div>
        );

      case 'formal-legal':
        return (
          <div style={{ padding: '8px 9px', height: '100%', display: 'flex', flexDirection: 'column', gap: '3px' }}>
            {/* Centered formal header with double border */}
            <div style={{ textAlign: 'center', borderBottom: `1.5px double ${pal.accentColor}`, paddingBottom: '3px', marginBottom: '3px' }}>
              <div style={{ height: '4px', width: '60px', background: pal.accentColor, margin: '0 auto 2px', borderRadius: '0.5px' }} />
              <div style={{ height: '2px', width: '38px', background: '#475569', margin: '0 auto 1.5px' }} />
              <div style={{ height: '1.5px', width: '50px', background: '#94a3b8', margin: '0 auto' }} />
            </div>
            {/* Formal small-caps sections */}
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
            <div style={{ height: '1.5px', width: '84%', background: '#475569' }} />
          </div>
        );

      case 'executive':
        return (
          <div style={{ padding: '8px 8px', height: '100%', display: 'flex', flexDirection: 'column', gap: '3px' }}>
            {/* Centered serif header with solid accent underline */}
            <div style={{ textAlign: 'center', borderBottom: `2px solid ${pal.accentColor}`, paddingBottom: '3px', marginBottom: '3px' }}>
              <div style={{ height: '4.5px', width: '64px', background: pal.accentColor, margin: '0 auto 2px' }} />
              <div style={{ height: '2px', width: '40px', background: '#334155', margin: '0 auto 1.5px' }} />
              <div style={{ height: '1.5px', width: '52px', background: '#64748b', margin: '0 auto' }} />
            </div>
            {/* Narrative sections */}
            <div style={{ height: '2.5px', width: '42px', background: '#0f172a' }} />
            <div style={{ height: '1.5px', width: '98%', background: '#64748b' }} />
            <div style={{ height: '1.5px', width: '90%', background: '#64748b', marginBottom: '2px' }} />

            <div style={{ height: '2.5px', width: '48px', background: '#0f172a' }} />
            <div style={{ height: '1.5px', width: '96%', background: '#64748b' }} />
            <div style={{ height: '1.5px', width: '88%', background: '#64748b' }} />
            <div style={{ height: '1.5px', width: '82%', background: '#64748b' }} />
          </div>
        );

      case 'academic-research':
        return (
          <div style={{ padding: '8px 7px', height: '100%', display: 'flex', flexDirection: 'column', gap: '3px' }}>
            {/* Scholarly header */}
            <div style={{ borderBottom: `1.5px solid ${pal.accentColor}`, paddingBottom: '3px', marginBottom: '3px' }}>
              <div style={{ height: '4.5px', width: '58px', background: pal.accentColor, marginBottom: '2px' }} />
              <div style={{ height: '2px', width: '38px', background: '#334155', marginBottom: '1.5px' }} />
              <div style={{ height: '1.5px', width: '48px', background: '#64748b' }} />
            </div>
            {/* Publications & credentials */}
            <div style={{ height: '2.5px', width: '48px', background: pal.accentColor }} />
            <div style={{ height: '1.5px', width: '98%', background: '#64748b' }} />
            <div style={{ height: '1.5px', width: '88%', background: '#64748b', marginBottom: '2px' }} />

            <div style={{ height: '2.5px', width: '54px', background: pal.accentColor }} />
            <div style={{ height: '1.5px', width: '95%', background: '#64748b' }} />
            <div style={{ height: '1.5px', width: '90%', background: '#64748b' }} />
            <div style={{ height: '1.5px', width: '82%', background: '#64748b' }} />
          </div>
        );

      case 'minimal-ats':
        return (
          <div style={{ padding: '8px 8px', height: '100%', display: 'flex', flexDirection: 'column', gap: '2.5px' }}>
            {/* Ultra-clean monochrome ATS layout */}
            <div style={{ borderBottom: '0.8px solid #0f172a', paddingBottom: '3px', marginBottom: '3px' }}>
              <div style={{ height: '4px', width: '52px', background: '#0f172a', marginBottom: '2px' }} />
              <div style={{ height: '2px', width: '34px', background: '#334155', marginBottom: '1.5px' }} />
              <div style={{ height: '1.5px', width: '46px', background: '#64748b' }} />
            </div>
            {/* Clean text lines */}
            <div style={{ height: '2.5px', width: '38px', background: '#0f172a' }} />
            <div style={{ height: '1.5px', width: '98%', background: '#334155' }} />
            <div style={{ height: '1.5px', width: '88%', background: '#334155', marginBottom: '2px' }} />

            <div style={{ height: '2.5px', width: '42px', background: '#0f172a' }} />
            <div style={{ height: '1.5px', width: '96%', background: '#334155' }} />
            <div style={{ height: '1.5px', width: '90%', background: '#334155' }} />
            <div style={{ height: '1.5px', width: '84%', background: '#334155' }} />
          </div>
        );

      case 'modern-tech':
      default:
        return (
          <div style={{ padding: '8px 7px', height: '100%', display: 'flex', flexDirection: 'column', gap: '3px' }}>
            {/* Linear tech header */}
            <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '3px', marginBottom: '2px' }}>
              <div style={{ height: '4.5px', width: '54px', background: '#0f172a', borderRadius: '1px', marginBottom: '2px' }} />
              <div style={{ height: '2px', width: '36px', background: pal.accentColor, borderRadius: '1px' }} />
            </div>
            {/* Tech badges bar */}
            <div style={{ display: 'flex', gap: '2px', marginBottom: '2px' }}>
              <div style={{ height: '2.5px', width: '14px', background: pal.badgeBg, borderRadius: '1px' }} />
              <div style={{ height: '2.5px', width: '18px', background: pal.badgeBg, borderRadius: '1px' }} />
              <div style={{ height: '2.5px', width: '12px', background: pal.badgeBg, borderRadius: '1px' }} />
            </div>
            {/* Content blocks */}
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
