import React from 'react';
import { Box, Typography, useTheme, alpha } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { RADIUS_TOKENS } from '../../../theme/dimensions';

export interface AuditScoreHeroProps {
  score: number;
}

export const AuditScoreHero: React.FC<AuditScoreHeroProps> = React.memo(({ score }) => {
  const { t } = useTranslation(['audit']);
  const theme = useTheme();

  const getScoreStatusLabel = (s: number) => {
    if (s >= 8.5) return 'Executive Ready';
    if (s >= 7.0) return 'Competitive';
    return 'Needs Polish';
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
      <Box
        sx={{
          width: 48,
          height: 48,
          borderRadius: RADIUS_TOKENS.lg,
          bgcolor: alpha(theme.palette.success.main, 0.15),
          border: `1.5px solid ${theme.palette.success.main}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 900, color: theme.palette.success.main }}>
          {score}
        </Typography>
      </Box>
      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
          {t('audit:score', 'Quality Score')}: {getScoreStatusLabel(score)}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', lineHeight: 1.4 }}>
          {t('audit:atsCheck.description', 'Calibrated across Google XYZ formulas & ATS scan rules.')}
        </Typography>
      </Box>
    </Box>
  );
});
