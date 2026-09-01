import React from 'react';
import {
  Box,
  Typography,
  TextField,
  useTheme
} from '@mui/material';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import { useTranslation } from 'react-i18next';
import { SummarySectionProps } from '../../../types';

export type { SummarySectionProps };

export const SummarySection: React.FC<SummarySectionProps> = React.memo(({
  summary,
  onSummaryChange
}) => {
  const { t } = useTranslation(['profile', 'common']);
  const theme = useTheme();

  const wordsCount = React.useMemo(() => {
    return summary ? summary.trim().split(/\s+/).filter(Boolean).length : 0;
  }, [summary]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: { xs: 1.5, sm: 2.5 } }}>
      {/* Header Info */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <DescriptionRoundedIcon color="primary" sx={{ fontSize: 20 }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 800, fontSize: '0.98rem' }}>
            {t('profile:sections.summary.title', 'Resumen Profesional')}
          </Typography>
        </Box>

        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
          {wordsCount} {wordsCount === 1 ? 'palabra' : 'palabras'} (ideal: 40–90)
        </Typography>
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.86rem', lineHeight: 1.5 }}>
        {t('profile:sections.summary.label', 'Resumen ejecutivo y propuesta de valor.')}
      </Typography>

      <TextField
        multiline
        minRows={5}
        maxRows={10}
        variant="outlined"
        size="small"
        value={summary || ''}
        onChange={(e) => onSummaryChange(e.target.value)}
        placeholder={t(
          'profile:sections.summary.placeholder',
          'Escribe 3-4 oraciones de alto impacto destacando tu experiencia técnica principal, fortalezas de arquitectura y trayectoria cuantitativa...'
        )}
        fullWidth
        sx={{
          '& .MuiOutlinedInput-root': {
            fontSize: '0.88rem',
            lineHeight: 1.55
          }
        }}
      />

    </Box>
  );
});
