import React from 'react';
import {
  Paper,
  Box,
  Typography,
  Button,
  useTheme,
} from '@mui/material';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import { useTranslation } from 'react-i18next';
import { SettingsRulesTabProps } from '../../../types';

export type { SettingsRulesTabProps };

export const SettingsRulesTab: React.FC<SettingsRulesTabProps> = ({
  rules,
  onRulesChange,
  defaultRules,
}) => {
  const { t } = useTranslation(['settings', 'common']);
  const muiTheme = useTheme();
  const isDark = muiTheme.palette.mode === 'dark';

  return (
    <Paper
      sx={{
        p: { xs: 1.5, sm: 2.5, md: 3 },
        border: `1px solid ${muiTheme.palette.divider}`,
        bgcolor: 'background.paper',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        width: '100%',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1.5 }}>
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 800, fontSize: { xs: '1rem', sm: '1.25rem' } }}>
            {t('settings:rules.title', 'AI Synthesis Guidelines & SSOT Rules (rules.md)')}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
            {t('settings:rules.subtitle', 'Customize the system prompt and formatting instructions sent to the AI synthesizer.')}
          </Typography>
        </Box>

        <Button
          variant="outlined"
          size="small"
          startIcon={<RefreshRoundedIcon />}
          onClick={() => onRulesChange(defaultRules)}
          sx={{ width: { xs: '100%', sm: 'auto' } }}
        >
          {t('settings:rules.resetRules', 'Restore Default Rules')}
        </Button>
      </Box>

      <textarea
        value={rules}
        onChange={(e) => onRulesChange(e.target.value)}
        spellCheck={false}
        style={{
          width: '100%',
          boxSizing: 'border-box',
          minHeight: 400,
          padding: '14px',
          borderRadius: '12px',
          border: `1px solid ${muiTheme.palette.divider}`,
          backgroundColor: isDark ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.02)',
          color: isDark ? '#f8fafc' : '#0f172a',
          fontFamily: "'JetBrains Mono', Consolas, monospace",
          fontSize: '0.84rem',
          lineHeight: 1.6,
          resize: 'vertical',
        }}
      />
    </Paper>
  );
};
