import React from 'react';
import {
  Paper,
  Box,
  Typography,
  Button,
  useTheme,
} from '@mui/material';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';

export interface SettingsRulesTabProps {
  rules: string;
  onRulesChange: (rules: string) => void;
  defaultRules: string;
}

/**
 * Tab panel for editing AI synthesis guidelines & rules.
 * Principle: Single Responsibility (S) - manages rules markdown editing.
 */
export const SettingsRulesTab: React.FC<SettingsRulesTabProps> = ({
  rules,
  onRulesChange,
  defaultRules,
}) => {
  const muiTheme = useTheme();
  const isDark = muiTheme.palette.mode === 'dark';

  return (
    <Paper
      sx={{
        p: 3,
        border: `1px solid ${muiTheme.palette.divider}`,
        bgcolor: 'background.paper',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1.5 }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            AI Synthesis Guidelines &amp; SSOT Rules (rules.md)
          </Typography>
          <Typography variant="body2" color="text.secondary">
            These core instructions govern how the AI aligns bullets, formats XYZ metrics, and preserves zero hallucination.
          </Typography>
        </Box>

        <Button
          variant="outlined"
          size="small"
          startIcon={<RefreshRoundedIcon />}
          onClick={() => onRulesChange(defaultRules)}
        >
          Reset to Defaults
        </Button>
      </Box>

      <textarea
        value={rules}
        onChange={(e) => onRulesChange(e.target.value)}
        spellCheck={false}
        style={{
          width: '100%',
          minHeight: 400,
          padding: '16px',
          borderRadius: '12px',
          border: `1px solid ${muiTheme.palette.divider}`,
          backgroundColor: isDark ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.02)',
          color: isDark ? '#f8fafc' : '#0f172a',
          fontFamily: "'JetBrains Mono', Consolas, monospace",
          fontSize: '0.86rem',
          lineHeight: 1.6,
          resize: 'vertical',
        }}
      />
    </Paper>
  );
};
