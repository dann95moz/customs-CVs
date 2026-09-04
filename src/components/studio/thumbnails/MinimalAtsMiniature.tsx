import React from 'react';
import { Box, Typography } from '@mui/material';
import { MiniatureLayoutProps } from './types';

export const MinimalAtsMiniature: React.FC<MiniatureLayoutProps> = () => {
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
        fontFamily: "'Inter', -apple-system, sans-serif",
        bgcolor: '#ffffff',
        userSelect: 'none',
        pointerEvents: 'none',
      }}
    >
      {/* Pure Clean ATS Monochrome Header */}
      <Box sx={{ borderBottom: '1px solid #0f172a', pb: '3px', mb: '1px' }}>
        <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '5.6px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.1px', textTransform: 'uppercase', lineHeight: 1.1 }}>
          MARCUS VANCE
        </Typography>
        <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '3.6px', fontWeight: 700, color: '#334155', letterSpacing: '0.3px', textTransform: 'uppercase', mt: '0.5px' }}>
          SOLUTIONS ARCHITECT & CLOUD LEAD
        </Typography>
        <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '2.8px', color: '#475569', mt: '0.5px' }}>
          Austin, TX | (555) 349-2011 | marcus.vance@email.com | linkedin.com/in/mvance
        </Typography>
      </Box>

      {/* Professional Summary */}
      <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '2.9px', color: '#334155', lineHeight: 1.25 }}>
        Enterprise Solutions Architect with 10+ years optimizing multi-cloud architectures. Saved $2.4M in annual OpEx.
      </Typography>

      {/* Skills Section Title */}
      <Box sx={{ borderBottom: '0.5px solid #0f172a', pb: '1px', mt: '1px' }}>
        <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '3.8px', fontWeight: 800, color: '#0f172a', letterSpacing: '0.4px', textTransform: 'uppercase' }}>
          TECHNICAL SKILLS
        </Typography>
      </Box>
      <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '2.9px', color: '#1e293b', lineHeight: 1.2 }}>
        <Box component="span" sx={{ fontWeight: 700 }}>Cloud & DevOps: </Box>AWS (Solutions Architect Pro), GCP, Terraform, CI/CD
      </Typography>
      <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '2.9px', color: '#1e293b', lineHeight: 1.2 }}>
        <Box component="span" sx={{ fontWeight: 700 }}>Databases & Security: </Box>PostgreSQL, Redis, Kafka, SOC2, HIPAA, IAM
      </Typography>

      {/* Experience Section Title */}
      <Box sx={{ borderBottom: '0.5px solid #0f172a', pb: '1px', mt: '1px' }}>
        <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '3.8px', fontWeight: 800, color: '#0f172a', letterSpacing: '0.4px', textTransform: 'uppercase' }}>
          PROFESSIONAL EXPERIENCE
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '3.4px', fontWeight: 700, color: '#0f172a' }}>
            Oracle Cloud Infrastructure — Lead Architect
          </Typography>
          <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '2.8px', color: '#475569' }}>
            2021 – Present
          </Typography>
        </Box>
        <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '2.9px', color: '#334155', lineHeight: 1.25 }}>
          • Directed 14-engineer squad migrating 120+ mission-critical services.
        </Typography>
        <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '2.9px', color: '#334155', lineHeight: 1.25 }}>
          • Achieved 99.995% SLA availability across regulated enterprise tiers.
        </Typography>
      </Box>
    </Box>
  );
};
