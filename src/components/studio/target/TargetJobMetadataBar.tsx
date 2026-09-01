import React from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  InputAdornment,
  useTheme,
  alpha,
} from '@mui/material';

import BusinessRoundedIcon from '@mui/icons-material/BusinessRounded';
import BadgeRoundedIcon from '@mui/icons-material/BadgeRounded';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import { useTranslation } from 'react-i18next';

export interface TargetJobMetadataBarProps {
  companyName: string;
  onCompanyChange: (val: string) => void;
  onCompanyBlur: () => void;
  targetRole: string;
  onRoleChange: (val: string) => void;
  onRoleBlur: () => void;
  wordCount: number;
}

export const TargetJobMetadataBar: React.FC<TargetJobMetadataBarProps> = React.memo(({
  companyName,
  onCompanyChange,
  onCompanyBlur,
  targetRole,
  onRoleChange,
  onRoleBlur,
  wordCount,
}) => {
  const { t } = useTranslation(['target']);
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Paper
      sx={{
        p: { xs: 1.5, sm: 2 },
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 180px' },
        gap: 2,
        alignItems: 'center',
        border: `1px solid ${theme.palette.divider}`,
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: 1,
      }}
    >
      <TextField
        label={t('target:fields.company', 'Target Company Name')}
        placeholder={t('target:fields.companyPlaceholder', 'e.g. Google, Stripe, Vercel')}
        value={companyName}
        onChange={(e) => onCompanyChange(e.target.value)}
        onBlur={onCompanyBlur}
        size="small"
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <BusinessRoundedIcon fontSize="small" color="primary" />
              </InputAdornment>
            ),
          },
        }}
      />

      <TextField
        label={t('target:fields.role', 'Target Role / Job Title')}
        placeholder={t('target:fields.rolePlaceholder', 'e.g. Senior Frontend Engineer')}
        value={targetRole}
        onChange={(e) => onRoleChange(e.target.value)}
        onBlur={onRoleBlur}
        size="small"
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <BadgeRoundedIcon fontSize="small" color="secondary" />
              </InputAdornment>
            ),
          },
        }}
      />

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          p: 1,
          borderRadius: 1,
          bgcolor: alpha(theme.palette.text.primary, 0.03),
          border: `1px solid ${theme.palette.divider}`,
        }}
      >

        <DescriptionRoundedIcon fontSize="small" color="action" />
        <Box>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
            {t('target:fields.vacancyLength', 'Vacancy Length')}
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 700 }}>
            {wordCount} {t('target:fields.words', 'words')}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
});
