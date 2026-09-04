import React from 'react';
import { Box, Typography } from '@mui/material';
import { MiniatureLayoutProps } from './types';

export const ModernTechMiniature: React.FC<MiniatureLayoutProps> = ({ pal }) => {
  return (
    <Box
      sx={{
        p: '7px 8px',
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '2.5px',
        boxSizing: 'border-box',
        fontFamily: "'Outfit', 'Inter', sans-serif",
        bgcolor: '#ffffff',
        userSelect: 'none',
        pointerEvents: 'none',
      }}
    >
      {/* Modern Tech Header */}
      <Box sx={{ borderBottom: '1px solid #e2e8f0', pb: '3px', mb: '1px' }}>
        <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontSize: '5.8px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.2px', textTransform: 'uppercase', lineHeight: 1.1 }}>
          ALEX RIVERA
        </Typography>
        <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontSize: '3.8px', fontWeight: 700, color: pal.accentColor, letterSpacing: '0.2px', mt: '0.5px' }}>
          STAFF CLOUD & INFRASTRUCTURE ARCHITECT
        </Typography>
        <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '2.8px', color: '#64748b', mt: '0.5px' }}>
          github.com/arivera · San Francisco, CA · alex@rivera.dev
        </Typography>
      </Box>

      {/* Monospace Tech Badges / Stack */}
      <Box sx={{ display: 'flex', gap: '2px', mb: '1px', flexWrap: 'wrap' }}>
        {['TypeScript', 'React 19', 'Kubernetes', 'Go / WASM'].map((tech) => (
          <Box
            key={tech}
            sx={{
              bgcolor: pal.badgeBg,
              color: pal.badgeText,
              border: `0.5px solid ${pal.accentBorder}`,
              borderRadius: '1.5px',
              px: '2.5px',
              py: '0.5px',
              fontSize: '2.8px',
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 700,
              lineHeight: 1.2,
            }}
          >
            {tech}
          </Box>
        ))}
      </Box>

      {/* Experience Section Title with Vertical Accent Pill */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '2.5px', borderBottom: '0.5px solid #e2e8f0', pb: '1px' }}>
        <Box sx={{ width: '2px', height: '5px', bgcolor: pal.accentColor, borderRadius: '1px', flexShrink: 0 }} />
        <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontSize: '4px', fontWeight: 800, color: '#0f172a', letterSpacing: '0.4px', textTransform: 'uppercase' }}>
          EXPERIENCE
        </Typography>
      </Box>

      {/* Experience Item 1 */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontSize: '3.6px', fontWeight: 700, color: '#0f172a' }}>
            Vercel · Lead Infrastructure
          </Typography>
          <Typography sx={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '2.8px', color: '#64748b' }}>
            2021 – Present
          </Typography>
        </Box>
        <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '2.9px', color: '#334155', lineHeight: 1.25 }}>
          <Box component="span" sx={{ color: pal.accentColor, fontWeight: 800, mr: '2px' }}>▪</Box>
          Architected multi-region edge mesh routing 45M req/day with zero downtime.
        </Typography>
        <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '2.9px', color: '#334155', lineHeight: 1.25 }}>
          <Box component="span" sx={{ color: pal.accentColor, fontWeight: 800, mr: '2px' }}>▪</Box>
          Reduced P99 latency by 38% via custom distributed WASM runtime.
        </Typography>
      </Box>

      {/* Experience Item 2 */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1px', mt: '0.5px' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontSize: '3.6px', fontWeight: 700, color: '#0f172a' }}>
            Stripe · Senior Systems Engineer
          </Typography>
          <Typography sx={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '2.8px', color: '#64748b' }}>
            2018 – 2021
          </Typography>
        </Box>
        <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '2.9px', color: '#334155', lineHeight: 1.25 }}>
          <Box component="span" sx={{ color: pal.accentColor, fontWeight: 800, mr: '2px' }}>▪</Box>
          Scaled distributed telemetry ingestion pipeline across 14 clusters.
        </Typography>
      </Box>
    </Box>
  );
};
