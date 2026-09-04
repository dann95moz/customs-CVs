import React from 'react';
import { Box, Typography } from '@mui/material';
import { MiniatureLayoutProps } from './types';

export const FormalLegalMiniature: React.FC<MiniatureLayoutProps> = ({ pal }) => {
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
        fontFamily: "'Merriweather', 'Georgia', serif",
        bgcolor: '#ffffff',
        userSelect: 'none',
        pointerEvents: 'none',
      }}
    >
      {/* Centered Formal Classical Header */}
      <Box sx={{ textAlign: 'center', borderBottom: `1.5px double ${pal.accentColor}`, pb: '3px', mb: '1.5px' }}>
        <Typography sx={{ fontFamily: "'Merriweather', 'Georgia', serif", fontSize: '5.2px', fontWeight: 800, color: pal.accentColor, letterSpacing: '0.8px', textTransform: 'uppercase', lineHeight: 1.1 }}>
          ELENA VÁSQUEZ
        </Typography>
        <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '3.4px', fontWeight: 600, color: '#475569', letterSpacing: '0.4px', textTransform: 'uppercase', mt: '0.5px' }}>
          PARTNER · CORPORATE LAW & GOVERNANCE
        </Typography>
        <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '2.8px', color: '#64748b', mt: '0.5px' }}>
          Madrid, Spain · +34 91 500 · elena@vasquez-law.com
        </Typography>
      </Box>

      {/* Bar Admissions / Practice Areas Section */}
      <Box sx={{ borderBottom: `0.5px solid ${pal.accentBorder}`, pb: '1px' }}>
        <Typography sx={{ fontFamily: "'Merriweather', 'Georgia', serif", fontSize: '3.8px', fontWeight: 700, color: pal.accentColor, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
          BAR ADMISSIONS & PRACTICE AREAS
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
        <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '3px', color: '#1e293b', lineHeight: 1.2 }}>
          <Box component="span" sx={{ color: pal.accentColor, fontWeight: 700, mr: '2px' }}>—</Box>
          Madrid Bar Association (Colegio de Abogados) · Admitted 2014
        </Typography>
        <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '3px', color: '#1e293b', lineHeight: 1.2 }}>
          <Box component="span" sx={{ color: pal.accentColor, fontWeight: 700, mr: '2px' }}>—</Box>
          Cross-Border M&A, Syndicated Financing & Antitrust Filings
        </Typography>
      </Box>

      {/* Experience Section */}
      <Box sx={{ borderBottom: `0.5px solid ${pal.accentBorder}`, pb: '1px', mt: '1px' }}>
        <Typography sx={{ fontFamily: "'Merriweather', 'Georgia', serif", fontSize: '3.8px', fontWeight: 700, color: pal.accentColor, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
          EXPERIENCE & CASEWORK
        </Typography>
      </Box>
      {/* Casework Item 1 */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <Typography sx={{ fontFamily: "'Merriweather', 'Georgia', serif", fontSize: '3.6px', fontWeight: 700, color: '#0f172a' }}>
            Garrigues & Asociados
          </Typography>
          <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '3px', color: '#64748b', fontStyle: 'italic' }}>
            2020 – Present
          </Typography>
        </Box>
        <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '3.2px', fontStyle: 'italic', color: '#475569' }}>
          Senior Associate · Corporate Governance
        </Typography>
        <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '2.9px', color: '#334155', lineHeight: 1.25 }}>
          <Box component="span" sx={{ color: pal.accentColor, fontWeight: 700, mr: '2px' }}>—</Box>
          Led legal counsel on $140M cross-border tech acquisition and regulatory filings.
        </Typography>
        <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '2.9px', color: '#334155', lineHeight: 1.25 }}>
          <Box component="span" sx={{ color: pal.accentColor, fontWeight: 700, mr: '2px' }}>—</Box>
          Advised Board of Directors on ESG compliance and shareholder covenants.
        </Typography>
      </Box>
      {/* Casework Item 2 */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1px', mt: '0.5px' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <Typography sx={{ fontFamily: "'Merriweather', 'Georgia', serif", fontSize: '3.6px', fontWeight: 700, color: '#0f172a' }}>
            Cuatrecasas
          </Typography>
          <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '3px', color: '#64748b', fontStyle: 'italic' }}>
            2016 – 2020
          </Typography>
        </Box>
        <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '2.9px', color: '#334155', lineHeight: 1.25 }}>
          <Box component="span" sx={{ color: pal.accentColor, fontWeight: 700, mr: '2px' }}>—</Box>
          Supervised legal due diligence for 18 venture capital rounds.
        </Typography>
      </Box>
    </Box>
  );
};
