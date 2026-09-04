import React from 'react';
import { Box, Typography } from '@mui/material';
import { MiniatureLayoutProps } from './types';

export const ExecutiveMiniature: React.FC<MiniatureLayoutProps> = ({ pal }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', overflow: 'hidden', bgcolor: '#ffffff', userSelect: 'none', pointerEvents: 'none' }}>
      {/* Full-width Top Banner */}
      <Box sx={{ background: pal.headerBg || pal.accentColor, p: '5px 6px 4px', textAlign: 'center', flexShrink: 0, color: '#ffffff' }}>
        <Box
          sx={{
            width: '12px',
            height: '12px',
            border: '1px solid rgba(255,255,255,0.85)',
            borderRadius: '2px',
            margin: '0 auto 2px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography sx={{ fontSize: '5.5px', color: '#ffffff', fontWeight: 800, lineHeight: 1, fontFamily: "'Inter', sans-serif" }}>
            DC
          </Typography>
        </Box>
        <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '5.4px', fontWeight: 800, letterSpacing: '0.6px', textTransform: 'uppercase', color: '#ffffff', lineHeight: 1.1 }}>
          DAVID CHEN
        </Typography>
        <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '3.4px', fontWeight: 600, color: 'rgba(255,255,255,0.92)', textTransform: 'uppercase', mt: '0.5px' }}>
          CHIEF OPERATING OFFICER · VP OPERATIONS
        </Typography>
        <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '2.7px', color: 'rgba(255,255,255,0.75)', mt: '0.5px' }}>
          Zurich, CH · +41 79 · david.chen@executive.com
        </Typography>
      </Box>

      {/* 2-Column Body */}
      <Box sx={{ display: 'grid', gridTemplateColumns: '60% 40%', gap: '4px', p: '5px 5px', flex: 1, boxSizing: 'border-box' }}>
        {/* Left Main */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '3.6px', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', borderBottom: `0.5px solid ${pal.accentBorder}`, pb: '1px' }}>
            EXECUTIVE LEADERSHIP
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
            <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '3.3px', fontWeight: 700, color: '#0f172a' }}>
              Novartis — Global VP Ops
            </Typography>
            <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '2.8px', color: '#334155', lineHeight: 1.2 }}>
              • Managed $240M P&L across 8 European facilities.
            </Typography>
            <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '2.8px', color: '#334155', lineHeight: 1.2 }}>
              • Expanded operating margin +4.8% via automation.
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1px', mt: '1px' }}>
            <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '3.3px', fontWeight: 700, color: '#0f172a' }}>
              Roche — Director Supply Chain
            </Typography>
            <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '2.8px', color: '#334155', lineHeight: 1.2 }}>
              • Directed operational merger of 4,200 FTEs.
            </Typography>
          </Box>
        </Box>

        {/* Right Column */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2px', borderLeft: '0.5px solid #e2e8f0', pl: '3.5px' }}>
          <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '3.4px', fontWeight: 800, color: pal.accentColor, textTransform: 'uppercase', borderBottom: `0.5px solid ${pal.accentBorder}`, pb: '1px' }}>
            GOVERNANCE & BOARDS
          </Typography>
          <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '2.8px', color: '#334155', lineHeight: 1.2 }}>
            • Non-Exec Board Member, MedTech EU
          </Typography>

          <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '3.4px', fontWeight: 800, color: pal.accentColor, textTransform: 'uppercase', borderBottom: `0.5px solid ${pal.accentBorder}`, pb: '1px', mt: '1px' }}>
            CORE EXPERTISE
          </Typography>
          <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '2.7px', color: '#475569', lineHeight: 1.25 }}>
            P&L · M&A · Scale · Global Governance · ESG Strategy
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
