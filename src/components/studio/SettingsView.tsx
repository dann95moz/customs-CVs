import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Tabs,
  Tab,
  Button,
  useTheme,
  alpha
} from '@mui/material';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import PsychologyRoundedIcon from '@mui/icons-material/PsychologyRounded';
import ShieldRoundedIcon from '@mui/icons-material/ShieldRounded';
import DeleteSweepRoundedIcon from '@mui/icons-material/DeleteSweepRounded';
import { AIProviderSettings } from '../../types/cv';
import { DEFAULT_RULES } from '../../core/ai-service';
import { SettingsAiTab } from './settings/SettingsAiTab';
import { SettingsRulesTab } from './settings/SettingsRulesTab';
import { SettingsViewProps } from '../../types';

export type { SettingsViewProps };

/**
 * Settings view orchestrator managing AI credentials, synthesis rules, and danger zone resets.
 * Principle: Single Responsibility (S) - delegates tab content to modular tab components.
 */
export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onSettingsChange,
  rules,
  onRulesChange,
  onResetDefaults,
}) => {
  const muiTheme = useTheme();
  const isDark = muiTheme.palette.mode === 'dark';
  const [activeTab, setActiveTab] = useState<'ai' | 'rules'>('ai');

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: { xs: 2, md: 3 }, display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Header Banner */}
      <Paper
        sx={{
          p: 2.5,
          border: `1px solid ${muiTheme.palette.divider}`,
          bgcolor: 'background.paper',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'flex-start', md: 'center' },
          justifyContent: 'space-between',
          gap: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: '12px',
              bgcolor: alpha(muiTheme.palette.primary.main, 0.12),
              color: muiTheme.palette.primary.main,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <SettingsRoundedIcon />
          </Box>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>
              Studio Settings &amp; AI Configuration
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage your AI inference engine, API credentials, and resume synthesis rules.
            </Typography>
          </Box>
        </Box>

        <Tabs
          value={activeTab}
          onChange={(_, val) => setActiveTab(val)}
          sx={{
            minHeight: 40,
            bgcolor: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)',
            borderRadius: '10px',
            p: 0.5,
          }}
        >
          <Tab
            value="ai"
            icon={<PsychologyRoundedIcon fontSize="small" />}
            iconPosition="start"
            label="AI &amp; API Keys"
          />
          <Tab
            value="rules"
            icon={<ShieldRoundedIcon fontSize="small" />}
            iconPosition="start"
            label="Synthesis Rules"
          />
        </Tabs>
      </Paper>

      {/* Tab Panels */}
      {activeTab === 'ai' && (
        <SettingsAiTab
          settings={settings}
          onSettingsChange={onSettingsChange}
        />
      )}

      {activeTab === 'rules' && (
        <SettingsRulesTab
          rules={rules}
          onRulesChange={onRulesChange}
          defaultRules={DEFAULT_RULES}
        />
      )}

      {/* Danger Zone */}
      <Paper
        sx={{
          p: 2,
          border: `1px solid ${alpha(muiTheme.palette.error.main, 0.3)}`,
          bgcolor: alpha(muiTheme.palette.error.main, isDark ? 0.04 : 0.02),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 1.5,
        }}
      >
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'error.main' }}>
            Reset Workspace &amp; Clear Local Storage
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Permanently resets all draft texts, API keys, and configurations back to clean blank defaults.
          </Typography>
        </Box>

        <Button
          variant="outlined"
          color="error"
          size="small"
          startIcon={<DeleteSweepRoundedIcon />}
          onClick={onResetDefaults}
        >
          Reset Workspace
        </Button>
      </Paper>
    </Box>
  );
};
