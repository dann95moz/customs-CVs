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

export interface SummarySectionProps {
  isExpanded: boolean;
  onToggle: (event: React.SyntheticEvent, isExpanded: boolean) => void;
  summary: string;
  onSummaryChange: (val: string) => void;
}

/**
 * Section for candidate executive summary and career pitch.
 * Principle: Single Responsibility (S) - focuses exclusively on career narrative.
 */
export const SummarySection: React.FC<SummarySectionProps> = ({
  isExpanded,
  onToggle,
  summary,
  onSummaryChange,
}) => {
  const theme = useTheme();

  return (
    <Accordion
      expanded={isExpanded}
      onChange={onToggle}
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
            2. Career Trajectory &amp; Executive Pitch
          </Typography>
          <Chip label="Natural Narrative" size="small" variant="outlined" sx={{ height: 20, fontSize: '0.7rem' }} />
        </Box>
      </AccordionSummary>
      <AccordionDetails sx={{ pt: 1, pb: 3 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
          Write freely about your career trajectory, core technical domain, architectural capabilities, and high-level engineering achievements. The AI uses this narrative to build targeted executive hooks.
        </Typography>
        <TextField
          multiline
          rows={4}
          variant="outlined"
          size="small"
          value={summary || ''}
          onChange={(e) => onSummaryChange(e.target.value)}
          placeholder="Senior Frontend Engineer with 6+ years of experience specialized in architecting high-throughput web applications, microfrontends, and design systems using TypeScript and React..."
          fullWidth
        />
      </AccordionDetails>
    </Accordion>
  );
};
