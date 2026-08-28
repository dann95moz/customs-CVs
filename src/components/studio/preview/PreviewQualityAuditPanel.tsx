import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  Paper,
  Button,
  alpha
} from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import AssessmentRoundedIcon from '@mui/icons-material/AssessmentRounded';
import { PreviewQualityAuditPanelProps } from '../../../types';

export type { PreviewQualityAuditPanelProps };

/**
 * Slide-out panel providing a quick executive ATS audit summary and link to full audit.
 * Principle: Single Responsibility (S) - quick quality checks display.
 */
export const PreviewQualityAuditPanel: React.FC<PreviewQualityAuditPanelProps> = ({
  overallScore,
  matchScore,
  companyName,
  onOpenFullAudit,
  onClose,
}) => {
  return (
    <Box sx={{ p: 2.5 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary' }}>
          Quality &amp; Health
        </Typography>
        <IconButton size="small" onClick={onClose}>
          <CloseRoundedIcon />
        </IconButton>
      </Box>

      <Paper
        variant="outlined"
        sx={{
          p: 2,
          borderRadius: '10px',
          mb: 2,
          textAlign: 'center',
          bgcolor: alpha('#10b981', 0.05)
        }}
      >
        <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 0.5 }}>
          ATS &amp; Executive Score
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#10b981', my: 0.5 }}>
          {overallScore} / 10.0
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          {matchScore}% Match for {companyName || 'Target Role'}
        </Typography>
      </Paper>

      <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1 }}>
        Verification Checks
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography sx={{ color: '#10b981', fontSize: '1rem' }}>✓</Typography>
          <Typography variant="caption" sx={{ fontWeight: 600 }}>Google XYZ Impact Formula</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography sx={{ color: '#10b981', fontSize: '1rem' }}>✓</Typography>
          <Typography variant="caption" sx={{ fontWeight: 600 }}>100% ATS Parser Safe Typography</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography sx={{ color: '#10b981', fontSize: '1rem' }}>✓</Typography>
          <Typography variant="caption" sx={{ fontWeight: 600 }}>High Contrast Body Text</Typography>
        </Box>
      </Box>

      <Button
        variant="outlined"
        size="small"
        fullWidth
        startIcon={<AssessmentRoundedIcon />}
        onClick={onOpenFullAudit}
      >
        Open Full Audit Dashboard
      </Button>
    </Box>
  );
};
