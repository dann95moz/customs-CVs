import React, { useState } from 'react';
import { Box, Typography, Button, Stack, Collapse, IconButton } from '@mui/material';
import BoltRoundedIcon from '@mui/icons-material/BoltRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import { useTranslation } from 'react-i18next';
import { AuditSectionResult, AuditSectionCardProps } from '../../../types';

export type { AuditSectionCardProps };

export const AuditSectionCard: React.FC<AuditSectionCardProps> = ({
  section,
  scoreColor,
  onExecuteAction,
  getActionButtonLabel,
  isExpanded: controlledExpanded,
  onToggle: controlledToggle,
}) => {
  const { t } = useTranslation(['audit', 'common']);
  const [internalExpanded, setInternalExpanded] = useState(false);
  const isExpanded = controlledExpanded !== undefined ? controlledExpanded : internalExpanded;
  const toggleExpanded = controlledToggle || (() => setInternalExpanded(prev => !prev));

  return (
    <div className={`audit-metric-card ${isExpanded ? 'expanded' : 'collapsed'}`}>
      <div 
        className="card-top-row"
        onClick={toggleExpanded}
        style={{ cursor: 'pointer', userSelect: 'none' }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleExpanded(); } }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 0 }}>
          <h4 className="metric-section-name" style={{ margin: 0 }}>{section.sectionName}</h4>
          <span className="metric-status-tag" style={{ margin: 0 }}>
            {section.status}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
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
          <IconButton 
            size="small" 
            sx={{ 
              p: 0.5, 
              transform: isExpanded ? 'rotate(180deg)' : 'none', 
              transition: 'transform 0.2s ease' 
            }}
          >
            <ExpandMoreRoundedIcon fontSize="small" />
          </IconButton>
        </div>
      </div>

      <Collapse in={isExpanded} timeout="auto" unmountOnExit>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingTop: 10 }}>
          <p className="metric-comment">{section.comment}</p>

          {section.identifiedGaps && section.identifiedGaps.length > 0 && (
            <div className="metric-gaps-box">
              <span className="gaps-title">⚠️ {t('audit:gapIdentified', 'Identified Gap')}:</span>
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
                <AutoAwesomeRoundedIcon sx={{ fontSize: 16, color: '#0284c7' }} /> {t('audit:actionLevers', 'Strategic Levers to Reach 10/10')}:
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
                      onClick={(e) => {
                        e.stopPropagation();
                        onExecuteAction(a, section.sectionName);
                      }}
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
      </Collapse>
    </div>
  );
};
