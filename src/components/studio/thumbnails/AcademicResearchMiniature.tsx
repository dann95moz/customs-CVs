import React from 'react';
import { Box, Typography } from '@mui/material';
import { MiniatureLayoutProps } from './types';

export const AcademicResearchMiniature: React.FC<MiniatureLayoutProps> = ({ pal }) => {
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: '36% 64%', height: '100%', width: '100%', overflow: 'hidden', bgcolor: '#ffffff', userSelect: 'none', pointerEvents: 'none' }}>
      {/* Dark Slate Left Sidebar */}
      <Box sx={{ bgcolor: '#1e293b', p: '5px 4px', display: 'flex', flexDirection: 'column', gap: '2px', color: '#ffffff', boxSizing: 'border-box' }}>
        {/* Circular Avatar Monogram */}
        <Box
          sx={{
            width: '13px',
            height: '13px',
            borderRadius: '50%',
            border: '1px solid rgba(255,255,255,0.6)',
            bgcolor: 'rgba(255,255,255,0.1)',
            margin: '0 auto 1.5px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography sx={{ fontSize: '5.2px', color: '#ffffff', fontWeight: 800, fontFamily: "'Inter', sans-serif", lineHeight: 1 }}>
            CW
          </Typography>
        </Box>
        <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '2.6px', color: '#cbd5e1', textAlign: 'center' }}>
          ETH Zurich · cw@ethz.ch
        </Typography>

        <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '3.2px', fontWeight: 800, color: '#f8fafc', textTransform: 'uppercase', borderBottom: '0.5px solid rgba(255,255,255,0.2)', pb: '0.5px', mt: '1px' }}>
          RESEARCH FOCUS
        </Typography>
        <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '2.6px', color: 'rgba(255,255,255,0.85)', lineHeight: 1.2 }}>
          Deep Learning · Symbolic AI · Quantum Alignment
        </Typography>

        <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '3.2px', fontWeight: 800, color: '#f8fafc', textTransform: 'uppercase', borderBottom: '0.5px solid rgba(255,255,255,0.2)', pb: '0.5px', mt: '1px' }}>
          METRICS
        </Typography>
        <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '2.6px', color: 'rgba(255,255,255,0.85)', lineHeight: 1.2 }}>
          h-index: 24 · 3,800+ Cites · 18 Papers
        </Typography>
      </Box>

      {/* Right Column with Soft Header Banner */}
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Soft Header Banner */}
        <Box sx={{ bgcolor: pal.accentLight, p: '4px 5px', borderBottom: `0.5px solid ${pal.accentBorder}` }}>
          <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontSize: '5.2px', fontWeight: 800, color: pal.accentColor, lineHeight: 1.1 }}>
            DR. CLARA WEISS, PH.D.
          </Typography>
          <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '3.2px', fontWeight: 600, color: '#334155', textTransform: 'uppercase', mt: '0.5px' }}>
            ASSOCIATE PROFESSOR · COMPUTER SCIENCE
          </Typography>
        </Box>

        {/* Body */}
        <Box sx={{ p: '4px 5px', display: 'flex', flexDirection: 'column', gap: '1.5px', flex: 1, boxSizing: 'border-box' }}>
          <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontSize: '3.4px', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', borderBottom: '0.5px solid #e2e8f0', pb: '0.5px' }}>
            ACADEMIC APPOINTMENTS
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
            <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontSize: '3.1px', fontWeight: 700, color: '#0f172a' }}>
              ETH Zurich — Associate Professor
            </Typography>
            <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '2.7px', color: '#475569', lineHeight: 1.2 }}>
              • PI of Scalable Reasoning Lab (12 Ph.D. researchers).
            </Typography>
            <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '2.7px', color: '#475569', lineHeight: 1.2 }}>
              • Keynote Speaker at NeurIPS 2024 & ICML.
            </Typography>
          </Box>

          <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontSize: '3.4px', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', borderBottom: '0.5px solid #e2e8f0', pb: '0.5px', mt: '1px' }}>
            GRANTS & HONORS
          </Typography>
          <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '2.7px', color: '#475569', lineHeight: 1.2 }}>
            • ERC Horizon 2020 (€1.8M PI) · 2 US Patents
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
