import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Tabs,
  Tab,
  Button,
  TextField,
  Slider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Radio,
  RadioGroup,
  FormControlLabel,
  InputAdornment,
  IconButton,
  Alert,
  Divider,
  Stack,
  Chip,
  ButtonGroup,
  useTheme,
  alpha
} from '@mui/material';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import PsychologyRoundedIcon from '@mui/icons-material/PsychologyRounded';
import ShieldRoundedIcon from '@mui/icons-material/ShieldRounded';
import PaletteRoundedIcon from '@mui/icons-material/PaletteRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import DeleteSweepRoundedIcon from '@mui/icons-material/DeleteSweepRounded';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import BoltRoundedIcon from '@mui/icons-material/BoltRounded';
import KeyRoundedIcon from '@mui/icons-material/KeyRounded';
import { useThemeMode } from '../../theme/ThemeContext';
import {
  AVAILABLE_AI_MODELS,
  AIProviderSettings,
  DEFAULT_RULES
} from '../../core/ai-service';

interface SettingsViewProps {
  settings: AIProviderSettings;
  onSettingsChange: (settings: AIProviderSettings) => void;
  rules: string;
  onRulesChange: (rules: string) => void;
  onResetDefaults: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onSettingsChange,
  rules,
  onRulesChange,
  onResetDefaults
}) => {
  const muiTheme = useTheme();
  const isDark = muiTheme.palette.mode === 'dark';
  const { mode, setThemeMode } = useThemeMode();

  const [showKey, setShowKey] = useState(false);
  const [activeTab, setActiveTab] = useState<'ai' | 'rules' | 'appearance'>('ai');

  const handleProviderChange = (provider: any) => {
    const defaultModelForProvider = AVAILABLE_AI_MODELS.find(m => m.provider === provider)?.id || 'gemini-3.6-flash';
    onSettingsChange({
      ...settings,
      provider,
      model: defaultModelForProvider
    });
  };

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
              Studio Settings & AI Configuration
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage your AI inference engine, API credentials, theme appearance, and resume synthesis rules.
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
            label="AI & API Keys"
          />
          <Tab
            value="rules"
            icon={<ShieldRoundedIcon fontSize="small" />}
            iconPosition="start"
            label="Synthesis Rules"
          />
          <Tab
            value="appearance"
            icon={<PaletteRoundedIcon fontSize="small" />}
            iconPosition="start"
            label="Appearance"
          />
        </Tabs>
      </Paper>

      {/* TAB 1: AI & API KEYS */}
      {activeTab === 'ai' && (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 3 }}>
          {/* Active AI Provider */}
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
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <BoltRoundedIcon color="primary" />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Active AI Provider
              </Typography>
            </Box>

            <RadioGroup
              value={settings.provider}
              onChange={(e) => handleProviderChange(e.target.value)}
              sx={{ gap: 1.5 }}
            >
              <Paper
                variant="outlined"
                sx={{
                  p: 1.5,
                  borderRadius: '12px',
                  borderColor: settings.provider === 'free-pollinations' ? muiTheme.palette.primary.main : muiTheme.palette.divider,
                  bgcolor: settings.provider === 'free-pollinations' ? alpha(muiTheme.palette.primary.main, isDark ? 0.08 : 0.04) : 'transparent',
                }}
              >
                <FormControlLabel
                  value="free-pollinations"
                  control={<Radio size="small" />}
                  label={
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                          Free Public AI (No API Key Required)
                        </Typography>
                        <Chip label="100% Free" size="small" color="success" sx={{ height: 18, fontSize: '0.68rem', fontWeight: 700 }} />
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        Ready to use immediately with zero sign-up or credit card.
                      </Typography>
                    </Box>
                  }
                />
              </Paper>

              <Paper
                variant="outlined"
                sx={{
                  p: 1.5,
                  borderRadius: '12px',
                  borderColor: settings.provider === 'gemini' ? muiTheme.palette.primary.main : muiTheme.palette.divider,
                  bgcolor: settings.provider === 'gemini' ? alpha(muiTheme.palette.primary.main, isDark ? 0.08 : 0.04) : 'transparent',
                }}
              >
                <FormControlLabel
                  value="gemini"
                  control={<Radio size="small" />}
                  label={
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                          Google Gemini (BYOK)
                        </Typography>
                        <Chip label="Recommended" size="small" color="primary" sx={{ height: 18, fontSize: '0.68rem', fontWeight: 700 }} />
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        Fastest Google AI API with Gemini 3.6/3.5/3.7 models.
                      </Typography>
                    </Box>
                  }
                />
              </Paper>

              <Paper
                variant="outlined"
                sx={{
                  p: 1.5,
                  borderRadius: '12px',
                  borderColor: settings.provider === 'groq' ? muiTheme.palette.primary.main : muiTheme.palette.divider,
                  bgcolor: settings.provider === 'groq' ? alpha(muiTheme.palette.primary.main, isDark ? 0.08 : 0.04) : 'transparent',
                }}
              >
                <FormControlLabel
                  value="groq"
                  control={<Radio size="small" />}
                  label={
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                          Groq LPU (BYOK)
                        </Typography>
                        <Chip label="Ultra Fast" size="small" color="warning" sx={{ height: 18, fontSize: '0.68rem', fontWeight: 700 }} />
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        Llama 3.3 70B & DeepSeek R1 running on lightning-fast LPUs.
                      </Typography>
                    </Box>
                  }
                />
              </Paper>

              <Paper
                variant="outlined"
                sx={{
                  p: 1.5,
                  borderRadius: '12px',
                  borderColor: settings.provider === 'openai' ? muiTheme.palette.primary.main : muiTheme.palette.divider,
                  bgcolor: settings.provider === 'openai' ? alpha(muiTheme.palette.primary.main, isDark ? 0.08 : 0.04) : 'transparent',
                }}
              >
                <FormControlLabel
                  value="openai"
                  control={<Radio size="small" />}
                  label={
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        OpenAI (BYOK)
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        GPT-4o, GPT-4o-mini, and o3-mini models.
                      </Typography>
                    </Box>
                  }
                />
              </Paper>

              <Paper
                variant="outlined"
                sx={{
                  p: 1.5,
                  borderRadius: '12px',
                  borderColor: settings.provider === 'claude' ? muiTheme.palette.primary.main : muiTheme.palette.divider,
                  bgcolor: settings.provider === 'claude' ? alpha(muiTheme.palette.primary.main, isDark ? 0.08 : 0.04) : 'transparent',
                }}
              >
                <FormControlLabel
                  value="claude"
                  control={<Radio size="small" />}
                  label={
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        Anthropic Claude (BYOK)
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Claude 3.7 Sonnet & 3.5 Sonnet reasoning.
                      </Typography>
                    </Box>
                  }
                />
              </Paper>
            </RadioGroup>
          </Paper>

          {/* Credentials & Model Parameters */}
          <Paper
            sx={{
              p: 3,
              border: `1px solid ${muiTheme.palette.divider}`,
              bgcolor: 'background.paper',
              display: 'flex',
              flexDirection: 'column',
              gap: 2.5,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <KeyRoundedIcon color="secondary" />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Credentials & Parameters
              </Typography>
            </Box>

            {settings.provider !== 'free-pollinations' && (
              <Box>
                <TextField
                  fullWidth
                  label={`${settings.provider.toUpperCase()} API Key`}
                  type={showKey ? 'text' : 'password'}
                  placeholder={`Paste your ${settings.provider} API key...`}
                  value={settings.apiKey || ''}
                  onChange={(e) => onSettingsChange({ ...settings, apiKey: e.target.value })}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowKey(!showKey)} edge="end" size="small">
                            {showKey ? <VisibilityOffRoundedIcon fontSize="small" /> : <VisibilityRoundedIcon fontSize="small" />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.75, display: 'block' }}>
                  🔒 Keys are stored securely in your browser's private local storage.
                </Typography>
              </Box>
            )}

            <FormControl fullWidth size="small">
              <InputLabel id="active-model-select-label">Active Model</InputLabel>
              <Select
                labelId="active-model-select-label"
                value={settings.model}
                label="Active Model"
                onChange={(e) => onSettingsChange({ ...settings, model: e.target.value })}
              >
                {AVAILABLE_AI_MODELS.filter(m => m.provider === settings.provider).map(m => (
                  <MenuItem key={m.id} value={m.id}>
                    {m.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                Temperature / Creativity: {(typeof settings.temperature === 'number' ? settings.temperature : 0.15).toFixed(2)}
              </Typography>
              <Slider
                value={typeof settings.temperature === 'number' ? settings.temperature : 0.15}
                min={0.0}
                max={1.0}
                step={0.05}
                onChange={(_, val) => onSettingsChange({ ...settings, temperature: val as number })}
                valueLabelDisplay="auto"
              />
              <Typography variant="caption" color="text.secondary">
                Recommended: 0.10 – 0.20 for strict factual accuracy (Zero Hallucinations).
              </Typography>
            </Box>
          </Paper>
        </Box>
      )}

      {/* TAB 2: SYNTHESIS RULES */}
      {activeTab === 'rules' && (
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
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                AI Synthesis Guidelines & SSOT Rules (rules.md)
              </Typography>
              <Typography variant="body2" color="text.secondary">
                These core instructions govern how the AI aligns bullets, formats XYZ metrics, and preserves zero hallucination.
              </Typography>
            </Box>

            <Button
              variant="outlined"
              size="small"
              startIcon={<RefreshRoundedIcon />}
              onClick={() => onRulesChange(DEFAULT_RULES)}
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
      )}

      {/* TAB 3: APPEARANCE & THEMES */}
      {activeTab === 'appearance' && (
        <Paper
          sx={{
            p: 3,
            border: `1px solid ${muiTheme.palette.divider}`,
            bgcolor: 'background.paper',
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
          }}
        >
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 0.5 }}>
              Studio Appearance & Color Scheme
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Customize the look and feel of CV Studio Pro with Material You palettes.
            </Typography>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
            <Paper
              variant="outlined"
              onClick={() => setThemeMode('dark')}
              sx={{
                p: 2.5,
                borderRadius: '14px',
                cursor: 'pointer',
                border: '2px solid',
                borderColor: mode === 'dark' ? muiTheme.palette.primary.main : muiTheme.palette.divider,
                bgcolor: mode === 'dark' ? alpha(muiTheme.palette.primary.main, 0.08) : 'transparent',
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                transition: 'all 0.2s ease',
              }}
            >
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '12px',
                  bgcolor: '#111827',
                  color: '#38bdf8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                }}
              >
                <DarkModeRoundedIcon fontSize="large" />
              </Box>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  Dark Mode
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Deep tonal slate canvas, reduced eye strain, and high contrast.
                </Typography>
              </Box>
            </Paper>

            <Paper
              variant="outlined"
              onClick={() => setThemeMode('light')}
              sx={{
                p: 2.5,
                borderRadius: '14px',
                cursor: 'pointer',
                border: '2px solid',
                borderColor: mode === 'light' ? muiTheme.palette.primary.main : muiTheme.palette.divider,
                bgcolor: mode === 'light' ? alpha(muiTheme.palette.primary.main, 0.08) : 'transparent',
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                transition: 'all 0.2s ease',
              }}
            >
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '12px',
                  bgcolor: '#ffffff',
                  color: '#0284c7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                  border: '1px solid #e2e8f0',
                }}
              >
                <LightModeRoundedIcon fontSize="large" />
              </Box>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  Light Mode
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Crisp, clean executive aesthetic with maximum readability.
                </Typography>
              </Box>
            </Paper>
          </Box>
        </Paper>
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
        }}
      >
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'error.main' }}>
            Reset Workspace & Clear Local Storage
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
