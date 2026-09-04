import React from 'react';
import { Box, Typography } from '@mui/material';
import { MiniatureLayoutProps } from './types';

export const DesignerUiuxMiniature: React.FC<MiniatureLayoutProps> = ({ pal }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', p: '5px 5px', gap: '3px', overflow: 'hidden', bgcolor: '#ffffff', boxSizing: 'border-box', userSelect: 'none', pointerEvents: 'none' }}>
      {/* Top Grid with Floating Tinted Pastel Card */}
      <Box sx={{ display: 'grid', gridTemplateColumns: '40% 60%', gap: '4px', alignItems: 'start' }}>
        {/* Pastel Tinted Card */}
        <Box sx={{ bgcolor: pal.badgeBg || pal.accentLight, border: `0.5px solid ${pal.accentBorder}`, borderRadius: '3px', p: '3.5px 3px' }}>
          <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontSize: '4.8px', fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>
            LIAM NGUYEN
          </Typography>
          <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontSize: '3.2px', fontWeight: 700, color: pal.accentColor, mt: '0.5px' }}>
            LEAD PRODUCT DESIGNER
          </Typography>
          <Box sx={{ height: '0.5px', bgcolor: 'rgba(0,0,0,0.1)', my: '1.5px' }} />
          <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '2.6px', color: '#475569' }}>
            liam.design · Stockholm, SE
          </Typography>
        </Box>
        {/* Top Summary */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
          <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontSize: '3.4px', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.3px' }}>
            DESIGN PHILOSOPHY
          </Typography>
          <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '2.8px', color: '#475569', lineHeight: 1.25 }}>
            Human-centered leader crafting multi-modal systems, tokens, and micro-interactions for 10M+ users.
          </Typography>
        </Box>
      </Box>

      {/* Bottom 2 Columns */}
      <Box sx={{ display: 'grid', gridTemplateColumns: '40% 60%', gap: '4px', flex: 1 }}>
        {/* Left Column */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1.5px' }}>
          <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontSize: '3.3px', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase' }}>
            DESIGN SYSTEMS
          </Typography>
          <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '2.7px', color: '#64748b', lineHeight: 1.2 }}>
            Figma Tokens, Storybook, Swift UI, Framer Motion, WCAG AAA
          </Typography>
          <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontSize: '3.3px', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', mt: '1px' }}>
            AWARDS
          </Typography>
          <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '2.6px', color: '#64748b', lineHeight: 1.2 }}>
            • Red Dot: Best of Best 2024
          </Typography>
        </Box>

        {/* Right Column */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1.5px' }}>
          <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontSize: '3.4px', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', borderBottom: '0.5px solid #e2e8f0', pb: '0.5px' }}>
            DESIGN LEADERSHIP
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
            <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontSize: '3.2px', fontWeight: 700, color: '#0f172a' }}>
              Spotify — Staff Product Designer
            </Typography>
            <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '2.8px', color: '#475569', lineHeight: 1.2 }}>
              • Led global Audio UI redesign on iOS & Android.
            </Typography>
            <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '2.8px', color: '#475569', lineHeight: 1.2 }}>
              • Unified token system across 60+ squads.
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
