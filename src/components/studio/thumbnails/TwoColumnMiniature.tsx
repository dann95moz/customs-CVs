import React from 'react';
import { Box, Typography } from '@mui/material';
import { MiniatureLayoutProps } from './types';

export const TwoColumnMiniature: React.FC<MiniatureLayoutProps> = ({ pal }) => {
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: '62% 38%', height: '100%', width: '100%', overflow: 'hidden', bgcolor: '#ffffff', userSelect: 'none', pointerEvents: 'none' }}>
      {/* Left Main */}
      <Box sx={{ p: '6px 5px', display: 'flex', flexDirection: 'column', gap: '2px', boxSizing: 'border-box' }}>
        <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '5.6px', fontWeight: 800, color: pal.accentColor, lineHeight: 1.1 }}>
          SOPHIA MARTÍNEZ
        </Typography>
        <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '3.5px', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>
          PRINCIPAL PRODUCT MANAGER
        </Typography>
        <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '2.8px', color: '#334155', lineHeight: 1.25, my: '1px' }}>
          Product strategist scaled B2B ARR from $5M to $48M.
        </Typography>

        <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '3.6px', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', borderBottom: '0.5px solid #e2e8f0', pb: '1px' }}>
          EXPERIENCE
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
          <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '3.3px', fontWeight: 700, color: '#0f172a' }}>
            Datadog — Group PM
          </Typography>
          <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '2.8px', color: '#334155', lineHeight: 1.2 }}>
            • Launched APM Next-Gen ($18M ARR Year 1).
          </Typography>
          <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '2.8px', color: '#334155', lineHeight: 1.2 }}>
            • Grew enterprise adoption +64% in 9 months.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1px', mt: '0.5px' }}>
          <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '3.3px', fontWeight: 700, color: '#0f172a' }}>
            Shopify — Senior PM
          </Typography>
          <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '2.8px', color: '#334155', lineHeight: 1.2 }}>
            • Built Merchant API for 450k developers.
          </Typography>
        </Box>
      </Box>

      {/* Right Solid Colored Sidebar */}
      <Box sx={{ background: pal.sidebarBg || pal.accentColor, p: '6px 4px', display: 'flex', flexDirection: 'column', gap: '2.5px', color: '#ffffff', boxSizing: 'border-box' }}>
        {/* Geometric Emblem */}
        <Box sx={{ width: '13px', height: '13px', bgcolor: '#ffffff', borderRadius: '2px', margin: '0 auto 1.5px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Box sx={{ width: '6px', height: '6px', transform: 'rotate(45deg)', bgcolor: pal.accentColor }} />
        </Box>
        <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '2.7px', color: 'rgba(255,255,255,0.95)', textAlign: 'center' }}>
          Berlin · sophia@pm.io
        </Typography>

        <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '3.3px', fontWeight: 800, color: '#ffffff', textTransform: 'uppercase', borderBottom: '0.5px solid rgba(255,255,255,0.3)', pb: '1px', mt: '1px' }}>
          CORE SKILLS
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
          <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '2.7px', color: 'rgba(255,255,255,0.9)' }}>
            • Product Strategy
          </Typography>
          <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '2.7px', color: 'rgba(255,255,255,0.9)' }}>
            • SQL & Analytics
          </Typography>
          <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '2.7px', color: 'rgba(255,255,255,0.9)' }}>
            • Enterprise B2B SaaS
          </Typography>
        </Box>

        <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '3.3px', fontWeight: 800, color: '#ffffff', textTransform: 'uppercase', borderBottom: '0.5px solid rgba(255,255,255,0.3)', pb: '1px', mt: '1px' }}>
          EDUCATION
        </Typography>
        <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '2.6px', color: 'rgba(255,255,255,0.85)' }}>
          BSc Computer Science, TU Munich
        </Typography>
      </Box>
    </Box>
  );
};
