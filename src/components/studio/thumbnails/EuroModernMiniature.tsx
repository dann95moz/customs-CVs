import React from 'react';
import { Box, Typography } from '@mui/material';
import { MiniatureLayoutProps } from './types';

export const EuroModernMiniature: React.FC<MiniatureLayoutProps> = ({ pal }) => {
  return (
    <Box
      sx={{
        height: '100%',
        width: '100%',
        display: 'grid',
        gridTemplateColumns: '32% 68%',
        boxSizing: 'border-box',
        fontFamily: "'Inter', sans-serif",
        bgcolor: '#ffffff',
        userSelect: 'none',
        pointerEvents: 'none',
      }}
    >
      {/* Sidebar */}
      <Box sx={{ bgcolor: '#f1f5f9', p: '5px 4px', borderRight: '0.5px solid #cbd5e1', display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: '1px' }}>
          <Box sx={{ width: '16px', height: '16px', borderRadius: '50%', bgcolor: '#cbd5e1', border: `1.5px solid ${pal.accentColor}` }} />
        </Box>
        <Typography sx={{ fontSize: '2.6px', fontWeight: 800, color: pal.accentColor, textTransform: 'uppercase', borderBottom: '0.5px solid #cbd5e1', pb: '0.5px' }}>
          DETAILS
        </Typography>
        <Typography sx={{ fontSize: '2.3px', color: '#475569' }}>
          Berlin, Germany
        </Typography>
        <Typography sx={{ fontSize: '2.6px', fontWeight: 800, color: pal.accentColor, textTransform: 'uppercase', borderBottom: '0.5px solid #cbd5e1', pb: '0.5px', mt: '1px' }}>
          LANGUAGES
        </Typography>
        <Typography sx={{ fontSize: '2.3px', color: '#1e293b', fontWeight: 600 }}>
          German · Native
        </Typography>
        <Typography sx={{ fontSize: '2.3px', color: '#1e293b', fontWeight: 600 }}>
          English · C1
        </Typography>
      </Box>

      {/* Main */}
      <Box sx={{ p: '5px 6px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <Typography sx={{ fontSize: '4.8px', fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>
          LUKAS SCHMIDT
        </Typography>
        <Typography sx={{ fontSize: '2.8px', fontWeight: 700, color: pal.accentColor }}>
          LEAD SYSTEMS ARCHITECT
        </Typography>
        <Typography sx={{ fontSize: '2.8px', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', borderBottom: '0.5px solid #e2e8f0', pb: '0.5px', mt: '1px' }}>
          EXPERIENCE
        </Typography>
        <Typography sx={{ fontSize: '2.6px', fontWeight: 700, color: '#0f172a' }}>
          SAP SE — Lead Engineer (2020 – Present)
        </Typography>
        <Typography sx={{ fontSize: '2.3px', color: '#475569', lineHeight: 1.2 }}>
          • Built distributed microservices handling 250M daily API events.
        </Typography>
      </Box>
    </Box>
  );
};
