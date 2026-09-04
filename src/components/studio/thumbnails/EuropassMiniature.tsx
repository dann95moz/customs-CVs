import React from 'react';
import { Box, Typography } from '@mui/material';
import { MiniatureLayoutProps } from './types';

export const EuropassMiniature: React.FC<MiniatureLayoutProps> = () => {
  return (
    <Box
      sx={{
        p: '5px 7px',
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '2px',
        boxSizing: 'border-box',
        fontFamily: "'Inter', sans-serif",
        bgcolor: '#ffffff',
        userSelect: 'none',
        pointerEvents: 'none',
      }}
    >
      {/* Europass Header */}
      <Box sx={{ borderBottom: '1.5px solid #0e4194', pb: '3px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography sx={{ fontSize: '2.5px', fontWeight: 800, color: '#0e4194', letterSpacing: '0.4px', textTransform: 'uppercase' }}>
            CURRICULUM VITAE · EUROPASS
          </Typography>
          <Typography sx={{ fontSize: '4.8px', fontWeight: 800, color: '#0e4194', lineHeight: 1.1 }}>
            MARCO ROSSI
          </Typography>
          <Typography sx={{ fontSize: '3px', fontWeight: 600, color: '#475569' }}>
            SENIOR SOFTWARE ENGINEER
          </Typography>
        </Box>
        <Box sx={{ width: '16px', height: '20px', borderRadius: '2px', bgcolor: '#e2e8f0', border: '1px solid #0e4194' }} />
      </Box>

      {/* Experience */}
      <Box sx={{ mt: '1px' }}>
        <Typography sx={{ fontSize: '3.2px', fontWeight: 800, color: '#0e4194', textTransform: 'uppercase', borderBottom: '0.5px solid #d4e2f4', pb: '0.5px' }}>
          WORK EXPERIENCE
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mt: '0.5px' }}>
          <Typography sx={{ fontSize: '2.8px', fontWeight: 700, color: '#0f172a' }}>
            Staff Engineer · Siemens AG
          </Typography>
          <Typography sx={{ fontSize: '2.4px', color: '#64748b' }}>
            2021 – Present
          </Typography>
        </Box>
        <Typography sx={{ fontSize: '2.5px', color: '#334155', lineHeight: 1.2 }}>
          • Architected IoT cloud gateway serving 1.2M devices with 99.99% uptime.
        </Typography>
      </Box>

      {/* Languages CEFR Grid */}
      <Box sx={{ mt: '1px' }}>
        <Typography sx={{ fontSize: '3.2px', fontWeight: 800, color: '#0e4194', textTransform: 'uppercase', borderBottom: '0.5px solid #d4e2f4', pb: '0.5px' }}>
          LANGUAGE SKILLS (CEFR)
        </Typography>
        <Box sx={{ display: 'flex', gap: '3px', mt: '1px' }}>
          <Box sx={{ bgcolor: '#e5effa', px: '3px', py: '0.5px', borderRadius: '2px', fontSize: '2.4px', fontWeight: 700, color: '#0e4194' }}>
            Italian: Native
          </Box>
          <Box sx={{ bgcolor: '#e5effa', px: '3px', py: '0.5px', borderRadius: '2px', fontSize: '2.4px', fontWeight: 700, color: '#0e4194' }}>
            English: C1
          </Box>
          <Box sx={{ bgcolor: '#e5effa', px: '3px', py: '0.5px', borderRadius: '2px', fontSize: '2.4px', fontWeight: 700, color: '#0e4194' }}>
            German: B2
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
