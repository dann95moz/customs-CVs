import React, { useState } from 'react';
import { Box, Typography, Button, Stack, Collapse, IconButton } from '@mui/material';
import BoltRoundedIcon from '@mui/icons-material/BoltRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import { useTranslation } from 'react-i18next';
import { AuditSectionCardProps } from '../../../types';
import {
  getLocalizedSectionName,
  getLocalizedStatus,
  getLocalizedComment,
  getLocalizedAuditRecommendation,
} from '../../../utils/auditUtils';

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
          <h4 className="metric-section-name" style={{ margin: 0 }}>
            {getLocalizedSectionName(section.sectionName, t)}
          </h4>
          <span className="metric-status-tag" style={{ margin: 0 }}>
            {getLocalizedStatus(section.status, t)}
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
          <p className="metric-comment">{getLocalizedComment(section, t)}</p>

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
            <Box
              className="metric-action-box"
              sx={{
                bgcolor: (th) => (th.palette.mode === 'dark' ? 'rgba(56, 189, 248, 0.08)' : 'rgba(56, 189, 248, 0.05)'),
                borderRadius: 'inherit',
                p: 1.5,
              }}
            >
              <Typography
                component="span"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.75,
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  mb: 1,
                  color: 'text.primary',
                }}
              >
                <AutoAwesomeRoundedIcon sx={{ fontSize: 16, color: 'primary.main' }} /> {t('audit:actionLevers', 'Strategic Levers to Reach 10/10')}:
              </Typography>
              <Stack spacing={1.5}>
                {section.actionToTen.map((a, i) => {
                  const localizedAction = getLocalizedAuditRecommendation(section, t) || a;
                  return (
                    <Box key={i} sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Typography variant="body2" sx={{ fontSize: '0.82rem', color: 'text.secondary' }}>
                        {localizedAction}
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
                      }}
                    >
                      {getActionButtonLabel(a)}
                    </Button>
                  </Box>
                );
              })}
            </Stack>
            </Box>
          )}
        </div>
      </Collapse>
    </div>
  );
};
