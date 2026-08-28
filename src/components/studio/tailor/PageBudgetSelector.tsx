import React from 'react';
import {
  Paper,
  Box,
  Typography,
  Chip,
  Stack,
  ButtonBase,
  useTheme,
  alpha
} from '@mui/material';
import LayersRoundedIcon from '@mui/icons-material/LayersRounded';
import RadioButtonUncheckedRoundedIcon from '@mui/icons-material/RadioButtonUncheckedRounded';
import RadioButtonCheckedRoundedIcon from '@mui/icons-material/RadioButtonCheckedRounded';
import { PageBudgetSelectorProps } from '../../../types';

export type { PageBudgetSelectorProps };

/**
 * Component for selecting target resume page length (1 Page vs. 2 Pages).
 * Principle: Single Responsibility (S) - focuses exclusively on page budget selection.
 */
export const PageBudgetSelector: React.FC<PageBudgetSelectorProps> = ({
  pageBudget,
  onPageBudgetChange,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Paper
      sx={{
        p: 2.5,
        border: `1px solid ${theme.palette.divider}`,
        bgcolor: 'background.paper',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
        <LayersRoundedIcon color="primary" />
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            1. Resume Length (Page Budget)
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Select the target length calibrated to your career seniority.
          </Typography>
        </Box>
      </Box>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
        <ButtonBase
          onClick={() => onPageBudgetChange(1)}
          sx={{
            flex: 1,
            p: 2,
            borderRadius: '12px',
            textAlign: 'left',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            border: '2px solid',
            borderColor: pageBudget === 1 ? theme.palette.primary.main : theme.palette.divider,
            bgcolor: pageBudget === 1 ? alpha(theme.palette.primary.main, isDark ? 0.12 : 0.06) : 'transparent',
            transition: 'all 0.2s ease',
          }}
        >
          <Box sx={{ width: '100%', mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
              1 Page (A4 Standard)
            </Typography>
            <Chip label="Recommended" size="small" color="primary" sx={{ height: 20, fontSize: '0.68rem', fontWeight: 700 }} />
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 1.5 }}>
            Ideal for 30-second recruiter scans. Focuses on your highest-impact metrics.
          </Typography>
          <Box sx={{ alignSelf: 'flex-end', color: pageBudget === 1 ? theme.palette.primary.main : theme.palette.text.disabled }}>
            {pageBudget === 1 ? <RadioButtonCheckedRoundedIcon /> : <RadioButtonUncheckedRoundedIcon />}
          </Box>
        </ButtonBase>

        <ButtonBase
          onClick={() => onPageBudgetChange(2)}
          sx={{
            flex: 1,
            p: 2,
            borderRadius: '12px',
            textAlign: 'left',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            border: '2px solid',
            borderColor: pageBudget === 2 ? theme.palette.primary.main : theme.palette.divider,
            bgcolor: pageBudget === 2 ? alpha(theme.palette.primary.main, isDark ? 0.12 : 0.06) : 'transparent',
            transition: 'all 0.2s ease',
          }}
        >
          <Box sx={{ width: '100%', mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
              2 Pages (Extended)
            </Typography>
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 1.5 }}>
            For directors, tech leads, or specialists with 8-10+ years of deep technical track records.
          </Typography>
          <Box sx={{ alignSelf: 'flex-end', color: pageBudget === 2 ? theme.palette.primary.main : theme.palette.text.disabled }}>
            {pageBudget === 2 ? <RadioButtonCheckedRoundedIcon /> : <RadioButtonUncheckedRoundedIcon />}
          </Box>
        </ButtonBase>
      </Stack>
    </Paper>
  );
};
