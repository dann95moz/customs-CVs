import React from 'react';
import { Box, Typography, Button, Stack } from '@mui/material';
import BoltRoundedIcon from '@mui/icons-material/BoltRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import { AuditSectionResult, AuditSectionCardProps } from '../../../types';

export type { AuditSectionCardProps };

/**
 * Card rendering diagnostic scores and action levers for an individual CV section.
 * Principle: Single Responsibility (S) - encapsulates section score card rendering.
 */
export const AuditSectionCard: React.FC<AuditSectionCardProps> = ({
  section,
  scoreColor,
  onExecuteAction,
  getActionButtonLabel,
}) => {
  return (
    <div className="audit-metric-card">
      <div className="card-top-row">
        <h4 className="metric-section-name">{section.sectionName}</h4>
        <div 
          className="metric-score-badge"
          style={{ 
            backgroundColor: `${scoreColor}22`, 
            color: scoreColor,
            borderColor: `${scoreColor}55`
          }}
        >
          {section.score} / 10.0
        </div>
      </div>

      <div className="metric-status-tag">
        {section.status}
      </div>

      <p className="metric-comment">{section.comment}</p>

      {section.identifiedGaps && section.identifiedGaps.length > 0 && (
        <div className="metric-gaps-box">
          <span className="gaps-title">⚠️ Identified Gap:</span>
          <ul className="gaps-list">
            {section.identifiedGaps.map((g, i) => (
              <li key={i}>{g}</li>
            ))}
          </ul>
        </div>
      )}

      {section.actionToTen && section.actionToTen.length > 0 && (
        <div className="metric-action-box" style={{ background: 'rgba(56, 189, 248, 0.05)', borderRadius: 8, padding: 12 }}>
          <span className="action-title" style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, marginBottom: 8 }}>
            <AutoAwesomeRoundedIcon sx={{ fontSize: 16, color: '#0284c7' }} /> Strategic Levers to Reach 10/10:
          </span>
          <Stack spacing={1.5}>
            {section.actionToTen.map((a, i) => (
              <Box key={i} sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="body2" sx={{ fontSize: '0.82rem', color: 'text.secondary' }}>
                  {a}
                </Typography>
                <Button
                  variant="contained"
                  size="small"
                  color="primary"
                  startIcon={<BoltRoundedIcon sx={{ fontSize: '15px !important' }} />}
                  onClick={() => onExecuteAction(a, section.sectionName)}
                  sx={{
                    alignSelf: 'flex-start',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    py: 0.5,
                    px: 1.5,
                    borderRadius: '8px'
                  }}
                >
                  {getActionButtonLabel(a)}
                </Button>
              </Box>
            ))}
          </Stack>
        </div>
      )}
    </div>
  );
};
