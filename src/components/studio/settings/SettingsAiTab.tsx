import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Chip,
  Radio,
  RadioGroup,
  FormControlLabel,
  TextField,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  ButtonGroup,
  Button,
  useTheme,
  alpha
} from '@mui/material';
import BoltRoundedIcon from '@mui/icons-material/BoltRounded';
import KeyRoundedIcon from '@mui/icons-material/KeyRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import { AIProviderId, AIProviderSettings, SettingsAiTabProps } from '../../../types';
import { AVAILABLE_AI_MODELS } from '../../../core/ai-service';

export type { SettingsAiTabProps };

/**
 * Tab panel for configuring AI providers, API keys, and model parameters.
 * Supports Simple Mode (Free Instant AI) vs Advanced Mode (Custom API Keys).
 */
export const SettingsAiTab: React.FC<SettingsAiTabProps> = ({
  settings,
  onSettingsChange,
}) => {
  const muiTheme = useTheme();
  const isDark = muiTheme.palette.mode === 'dark';
  const [showKey, setShowKey] = useState(false);
  const [configMode, setConfigMode] = useState<'simple' | 'advanced'>(
    settings.provider === 'free-pollinations' ? 'simple' : 'advanced'
  );

  const handleProviderChange = (provider: AIProviderId) => {
    const defaultModel = AVAILABLE_AI_MODELS.find(m => m.provider === provider)?.id || 'gemini-3.6-flash';
    onSettingsChange({
      ...settings,
      provider,
      model: defaultModel
    });
  };

  const handleSwitchToSimple = () => {
    setConfigMode('simple');
    handleProviderChange('free-pollinations');
  };

  const handleSwitchToAdvanced = () => {
    setConfigMode('advanced');
    if (settings.provider === 'free-pollinations') {
      handleProviderChange('gemini');
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Mode Switcher */}
      <Paper
        sx={{
          p: 2,
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'flex-start', sm: 'center' },
          justifyContent: 'space-between',
          gap: 2,
          border: `1px solid ${muiTheme.palette.divider}`,
          bgcolor: 'background.paper',
        }}
      >
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            AI Configuration Mode
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Choose between instant zero-setup AI or your own custom API keys.
          </Typography>
        </Box>

        <ButtonGroup size="small" variant="outlined">
          <Button
            variant={configMode === 'simple' ? 'contained' : 'outlined'}
            startIcon={<AutoAwesomeRoundedIcon />}
            onClick={handleSwitchToSimple}
            sx={{ fontWeight: 600, fontSize: '0.8rem' }}
          >
            Simple Mode (Free AI)
          </Button>
          <Button
            variant={configMode === 'advanced' ? 'contained' : 'outlined'}
            startIcon={<TuneRoundedIcon />}
            onClick={handleSwitchToAdvanced}
            sx={{ fontWeight: 600, fontSize: '0.8rem' }}
          >
            Advanced (Custom Key)
          </Button>
        </ButtonGroup>
      </Paper>

      {configMode === 'simple' ? (
        <Paper
          sx={{
            p: 3,
            border: `1px solid ${muiTheme.palette.divider}`,
            bgcolor: 'background.paper',
            borderRadius: '12px',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: '10px',
                bgcolor: alpha(muiTheme.palette.success.main, 0.12),
                color: muiTheme.palette.success.main,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <AutoAwesomeRoundedIcon />
            </Box>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Free Instant AI Active
                </Typography>
                <Chip label="Zero Setup Required" size="small" color="success" sx={{ fontWeight: 700, height: 20, fontSize: '0.7rem' }} />
              </Box>
              <Typography variant="body2" color="text.secondary">
                You are ready to tailor resumes immediately. No API keys, sign-ups, or credit cards needed.
              </Typography>
            </Box>
          </Box>
        </Paper>
      ) : (
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
                Select AI Provider
              </Typography>
            </Box>

            <RadioGroup
              value={settings.provider}
              onChange={(e) => handleProviderChange(e.target.value as AIProviderId)}
              sx={{ gap: 1.5 }}
            >
              {/* Gemini */}
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
                          Google Gemini
                        </Typography>
                        <Chip label="Recommended" size="small" color="primary" sx={{ height: 18, fontSize: '0.68rem', fontWeight: 700 }} />
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        Fast and accurate with Gemini 3.6 / 3.7 models.
                      </Typography>
                    </Box>
                  }
                />
              </Paper>

              {/* Groq */}
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
                          Groq (Ultra-Fast)
                        </Typography>
                        <Chip label="High Speed" size="small" color="warning" sx={{ height: 18, fontSize: '0.68rem', fontWeight: 700 }} />
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        Llama 3.3 70B &amp; DeepSeek R1 running on ultra-fast hardware.
                      </Typography>
                    </Box>
                  }
                />
              </Paper>

              {/* OpenAI */}
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
                        OpenAI
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        GPT-4o and o3-mini models.
                      </Typography>
                    </Box>
                  }
                />
              </Paper>

              {/* Claude */}
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
                        Anthropic Claude
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Claude 3.7 Sonnet &amp; 3.5 Sonnet reasoning.
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
                API Key &amp; Parameters
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
                  🔒 Keys are stored securely in your browser&apos;s private local storage.
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
                Creativity &amp; Precision: {(typeof settings.temperature === 'number' ? settings.temperature : 0.15).toFixed(2)}
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
    </Box>
  );
};
