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
import { useTranslation } from 'react-i18next';
import { PreviewQualityAuditPanelProps } from '../../../types';

export type { PreviewQualityAuditPanelProps };

export const PreviewQualityAuditPanel: React.FC<PreviewQualityAuditPanelProps> = ({
  overallScore,
  matchScore,
  companyName,
  onOpenFullAudit,
  onClose,
}) => {
  const { t } = useTranslation(['audit', 'common', 'gap']);

  return (
    <Box sx={{ p: 2.5 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary' }}>
          {t('audit:title', 'Quality & Health')}
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
          {t('audit:score', 'ATS & Executive Score')}
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#10b981', my: 0.5 }}>
          {overallScore} / 10.0
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          {matchScore}% {t('gap:matchScore', 'Match')} {companyName ? `• ${companyName}` : ''}
        </Typography>
      </Paper>

      <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1 }}>
        {t('audit:atsCheck.title', 'Verification Checks')}
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography sx={{ color: '#10b981', fontSize: '1rem' }}>✓</Typography>
          <Typography variant="caption" sx={{ fontWeight: 600 }}>{t('audit:xyz.title', 'Google XYZ Impact Formula')}</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography sx={{ color: '#10b981', fontSize: '1rem' }}>✓</Typography>
          <Typography variant="caption" sx={{ fontWeight: 600 }}>{t('audit:atsCheck.description', '100% ATS Parser Safe Typography')}</Typography>
        </Box>
      </Box>

      <Button
        variant="outlined"
        size="small"
        fullWidth
        startIcon={<AssessmentRoundedIcon />}
        onClick={onOpenFullAudit}
      >
        {t('audit:title', 'Open Full Audit Dashboard')}
      </Button>
    </Box>
  );
};
