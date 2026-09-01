import React from 'react';
import {
  Box,
  Typography,
  TextField,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useTheme,
} from '@mui/material';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import { useTranslation } from 'react-i18next';
import { SummarySectionProps } from '../../../types';

export type { SummarySectionProps };

export const SummarySection: React.FC<SummarySectionProps> = React.memo(({
  isExpanded,
  onToggle,
  summary,
  onSummaryChange,
}) => {
  const { t } = useTranslation(['profile', 'common']);
  const theme = useTheme();

  return (
    <Accordion
      expanded={isExpanded}
      onChange={onToggle}
      slotProps={{ transition: { unmountOnExit: true } }}
      sx={{
        borderRadius: '12px !important',
        border: `1px solid ${theme.palette.divider}`,
        overflow: 'hidden',
        '&:before': { display: 'none' },
      }}
    >
      <AccordionSummary expandIcon={<ExpandMoreRoundedIcon />}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <DescriptionRoundedIcon color="primary" />
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            {t('profile:sections.summary.title', '2. Professional Summary')}
          </Typography>
          {Boolean(summary && summary.trim()) && (
            <Chip label={t('common:badge.added', 'Added')} size="small" color="success" variant="outlined" sx={{ height: 20, fontSize: '0.7rem' }} />
          )}
        </Box>
      </AccordionSummary>
      <AccordionDetails sx={{ pt: 1, pb: 3 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
          {t('profile:sections.summary.label', 'A short summary of your background, core strengths, and key specializations.')}
        </Typography>
        <TextField
          multiline
          rows={4}
          variant="outlined"
          size="small"
          value={summary || ''}
          onChange={(e) => onSummaryChange(e.target.value)}
          placeholder={t('profile:sections.summary.placeholder', 'Senior Frontend Engineer with 6+ years of experience specialized in architecting high-throughput web applications...')}
          fullWidth
        />
      </AccordionDetails>
    </Accordion>
  );
});
