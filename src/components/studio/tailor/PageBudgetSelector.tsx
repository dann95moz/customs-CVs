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
        height: '100%',
        boxSizing: 'border-box',
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

      <Stack direction="column" spacing={1.5} sx={{ flex: 1, justifyContent: 'center' }}>
        <ButtonBase
          onClick={() => onPageBudgetChange(1)}
          sx={{
            width: '100%',
            p: 1.75,
            borderRadius: '12px',
            textAlign: 'left',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 1.5,
            border: '2px solid',
            borderColor: pageBudget === 1 ? theme.palette.primary.main : theme.palette.divider,
            bgcolor: pageBudget === 1 ? alpha(theme.palette.primary.main, isDark ? 0.12 : 0.05) : 'transparent',
            transition: 'all 0.2s ease',
            '&:hover': {
              borderColor: pageBudget === 1 ? theme.palette.primary.main : alpha(theme.palette.primary.main, 0.4),
              bgcolor: pageBudget === 1 ? alpha(theme.palette.primary.main, isDark ? 0.14 : 0.07) : alpha(theme.palette.action.hover, 0.04),
            },
          }}
        >
          <Box sx={{ color: pageBudget === 1 ? theme.palette.primary.main : theme.palette.text.disabled, mt: 0.25 }}>
            {pageBudget === 1 ? <RadioButtonCheckedRoundedIcon /> : <RadioButtonUncheckedRoundedIcon />}
          </Box>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, mb: 0.5 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                1 Page (A4 Standard)
              </Typography>
              <Chip
                label="Recommended"
                size="small"
                color="primary"
                sx={{ height: 20, fontSize: '0.68rem', fontWeight: 700 }}
              />
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', lineHeight: 1.45 }}>
              Ideal for 30-second recruiter scans. Prioritizes highest-impact metrics and Google XYZ accomplishments.
            </Typography>
          </Box>
        </ButtonBase>

        <ButtonBase
          onClick={() => onPageBudgetChange(2)}
          sx={{
            width: '100%',
            p: 1.75,
            borderRadius: '12px',
            textAlign: 'left',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 1.5,
            border: '2px solid',
            borderColor: pageBudget === 2 ? theme.palette.primary.main : theme.palette.divider,
            bgcolor: pageBudget === 2 ? alpha(theme.palette.primary.main, isDark ? 0.12 : 0.05) : 'transparent',
            transition: 'all 0.2s ease',
            '&:hover': {
              borderColor: pageBudget === 2 ? theme.palette.primary.main : alpha(theme.palette.primary.main, 0.4),
              bgcolor: pageBudget === 2 ? alpha(theme.palette.primary.main, isDark ? 0.14 : 0.07) : alpha(theme.palette.action.hover, 0.04),
            },
          }}
        >
          <Box sx={{ color: pageBudget === 2 ? theme.palette.primary.main : theme.palette.text.disabled, mt: 0.25 }}>
            {pageBudget === 2 ? <RadioButtonCheckedRoundedIcon /> : <RadioButtonUncheckedRoundedIcon />}
          </Box>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, mb: 0.5 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                2 Pages (Extended)
              </Typography>
              <Chip
                label="Senior / Lead"
                size="small"
                variant="outlined"
                sx={{ height: 20, fontSize: '0.68rem', fontWeight: 600 }}
              />
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', lineHeight: 1.45 }}>
              For directors, tech leads, or specialists with 8–10+ years of deep technical track records and publications.
            </Typography>
          </Box>
        </ButtonBase>
      </Stack>
    </Paper>
  );
};
