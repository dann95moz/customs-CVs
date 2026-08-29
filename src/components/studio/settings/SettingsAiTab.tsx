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
  CircularProgress,
  Alert,
  AlertTitle,
  useTheme,
  alpha
} from '@mui/material';
import BoltRoundedIcon from '@mui/icons-material/BoltRounded';
import KeyRoundedIcon from '@mui/icons-material/KeyRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import LaptopRoundedIcon from '@mui/icons-material/LaptopRounded';
import CloudQueueRoundedIcon from '@mui/icons-material/CloudQueueRounded';
import TerminalRoundedIcon from '@mui/icons-material/TerminalRounded';
import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded';
import { AIProviderId, AIProviderSettings, SettingsAiTabProps } from '../../../types';
import { AVAILABLE_AI_MODELS, testAIConnection } from '../../../core/ai-service';

export type { SettingsAiTabProps };

/**
 * Tab panel for configuring AI providers, Local AI, API keys, and model parameters.
 */
export const SettingsAiTab: React.FC<SettingsAiTabProps> = ({
  settings,
  onSettingsChange,
}) => {
  const muiTheme = useTheme();
  const isDark = muiTheme.palette.mode === 'dark';
  const [showKey, setShowKey] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string; detectedModels?: string[] } | null>(null);

  const isLocal = settings.provider === 'local';

  const handleProviderChange = (provider: AIProviderId) => {
    let defaultModel = 'gemini-3.6-flash';
    let defaultEndpoint = settings.customEndpoint;

    if (provider === 'local') {
      defaultModel = 'llama3.2';
      defaultEndpoint = defaultEndpoint || 'http://localhost:11434/v1';
    } else if (provider === 'groq') {
      defaultModel = 'llama-3.3-70b-versatile';
    } else if (provider === 'openai') {
      defaultModel = 'gpt-4o';
    } else if (provider === 'claude') {
      defaultModel = 'claude-3-7-sonnet-latest';
    } else if (provider === 'openrouter') {
      defaultModel = 'openrouter-free';
    } else if (provider === 'custom') {
      defaultModel = 'custom-endpoint';
      defaultEndpoint = defaultEndpoint || 'http://localhost:8000/v1';
    }

    onSettingsChange({
      ...settings,
      provider,
      model: defaultModel,
      customEndpoint: defaultEndpoint,
    });
    setTestResult(null);
  };

  const handleLocalPreset = (type: 'ollama' | 'lm-studio' | 'custom') => {
    let endpoint = 'http://localhost:11434/v1';
    let model = 'llama3.2';

    if (type === 'lm-studio') {
      endpoint = 'http://localhost:1234/v1';
      model = 'local-model';
    } else if (type === 'custom') {
      endpoint = settings.customEndpoint || 'http://localhost:8080/v1';
      model = settings.model || 'local-model';
    }

    onSettingsChange({
      ...settings,
      provider: 'local',
      localServerType: type,
      customEndpoint: endpoint,
      model,
    });
    setTestResult(null);
  };

  const handleRunTest = async () => {
    setTestingConnection(true);
    setTestResult(null);
    try {
      const result = await testAIConnection(settings);
      setTestResult(result);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setTestResult({ success: false, message: `Unexpected error during test: ${msg}` });
    } finally {
      setTestingConnection(false);
    }
  };

  const currentModels = AVAILABLE_AI_MODELS.filter(m => m.provider === settings.provider);

  const getKeyHelperLink = () => {
    switch (settings.provider) {
      case 'gemini':
        return { label: 'Get free key at Google AI Studio', url: 'https://aistudio.google.com/app/apikey' };
      case 'groq':
        return { label: 'Get free key at Groq Console', url: 'https://console.groq.com/keys' };
      case 'openai':
        return { label: 'OpenAI API Keys dashboard', url: 'https://platform.openai.com/api-keys' };
      case 'claude':
        return { label: 'Anthropic Console dashboard', url: 'https://console.anthropic.com/settings/keys' };
      case 'openrouter':
        return { label: 'OpenRouter Keys dashboard', url: 'https://openrouter.ai/keys' };
      default:
        return null;
    }
  };

  const keyHelper = getKeyHelperLink();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Overview Status Bar */}
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
          borderRadius: '16px',
        }}
      >
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              Active AI Engine: {isLocal ? 'Local AI Server' : settings.provider.toUpperCase()}
            </Typography>
            <Chip
              icon={isLocal ? <LaptopRoundedIcon /> : <CloudQueueRoundedIcon />}
              label={isLocal ? 'Offline & Private' : (settings.apiKey ? 'Key Configured' : 'API Key Required')}
              size="small"
              color={isLocal ? 'secondary' : (settings.apiKey ? 'success' : 'warning')}
              sx={{ height: 22, fontSize: '0.7rem', fontWeight: 700 }}
            />
          </Box>
          <Typography variant="caption" color="text.secondary">
            Configured model: <strong>{settings.model}</strong>
          </Typography>
        </Box>

        <Button
          variant="outlined"
          size="small"
          color={isLocal ? 'secondary' : 'primary'}
          startIcon={testingConnection ? <CircularProgress size={14} color="inherit" /> : <BoltRoundedIcon />}
          onClick={handleRunTest}
          disabled={testingConnection}
          sx={{ fontWeight: 700, fontSize: '0.8rem', px: 2.25 }}
        >
          {testingConnection ? 'Testing...' : 'Test Connection'}
        </Button>
      </Paper>

      {/* Test Result Alert */}
      {testResult && (
        <Alert
          severity={testResult.success ? 'success' : 'warning'}
          sx={{ borderRadius: '12px' }}
          onClose={() => setTestResult(null)}
        >
          <AlertTitle sx={{ fontWeight: 700 }}>
            {testResult.success ? 'Connection Successful' : 'Connection Issue Detected'}
          </AlertTitle>
          <Typography variant="body2">{testResult.message}</Typography>
          {testResult.detectedModels && testResult.detectedModels.length > 0 && (
            <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 0.5, flexWrap: 'wrap' }}>
              <Typography variant="caption" sx={{ fontWeight: 700 }}>
                Detected Models:
              </Typography>
              {testResult.detectedModels.slice(0, 6).map((dm) => (
                <Chip
                  key={dm}
                  label={dm}
                  size="small"
                  clickable
                  onClick={() => onSettingsChange({ ...settings, model: dm })}
                  color={settings.model === dm ? 'secondary' : 'default'}
                  sx={{ height: 20, fontSize: '0.68rem', fontWeight: 600 }}
                />
              ))}
            </Box>
          )}
        </Alert>
      )}

      {/* 2-Column Provider & Credentials Layout */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 3 }}>
        {/* Active AI Provider */}
        <Paper
          sx={{
            p: 3,
            border: `1px solid ${muiTheme.palette.divider}`,
            bgcolor: 'background.paper',
            borderRadius: '16px',
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
            {/* Local AI */}
            <Paper
              variant="outlined"
              sx={{
                p: 1.5,
                borderRadius: '14px',
                borderColor: settings.provider === 'local' ? muiTheme.palette.secondary.main : muiTheme.palette.divider,
                bgcolor: settings.provider === 'local' ? alpha(muiTheme.palette.secondary.main, isDark ? 0.08 : 0.04) : 'transparent',
                transition: 'all 0.15s ease',
              }}
            >
              <FormControlLabel
                value="local"
                control={<Radio color="secondary" size="small" />}
                label={
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        Local AI (Ollama / LM Studio)
                      </Typography>
                      <Chip label="100% Free &amp; Offline" size="small" color="secondary" sx={{ height: 18, fontSize: '0.68rem', fontWeight: 700 }} />
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      Run locally on your PC without external network dependency.
                    </Typography>
                  </Box>
                }
              />
            </Paper>

            {/* Gemini */}
            <Paper
              variant="outlined"
              sx={{
                p: 1.5,
                borderRadius: '14px',
                borderColor: settings.provider === 'gemini' ? muiTheme.palette.primary.main : muiTheme.palette.divider,
                bgcolor: settings.provider === 'gemini' ? alpha(muiTheme.palette.primary.main, isDark ? 0.08 : 0.04) : 'transparent',
                transition: 'all 0.15s ease',
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
                      Fast and accurate with free key from Google AI Studio.
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
                borderRadius: '14px',
                borderColor: settings.provider === 'groq' ? muiTheme.palette.primary.main : muiTheme.palette.divider,
                bgcolor: settings.provider === 'groq' ? alpha(muiTheme.palette.primary.main, isDark ? 0.08 : 0.04) : 'transparent',
                transition: 'all 0.15s ease',
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
                borderRadius: '14px',
                borderColor: settings.provider === 'openai' ? muiTheme.palette.primary.main : muiTheme.palette.divider,
                bgcolor: settings.provider === 'openai' ? alpha(muiTheme.palette.primary.main, isDark ? 0.08 : 0.04) : 'transparent',
                transition: 'all 0.15s ease',
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
                borderRadius: '14px',
                borderColor: settings.provider === 'claude' ? muiTheme.palette.primary.main : muiTheme.palette.divider,
                bgcolor: settings.provider === 'claude' ? alpha(muiTheme.palette.primary.main, isDark ? 0.08 : 0.04) : 'transparent',
                transition: 'all 0.15s ease',
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

            {/* OpenRouter */}
            <Paper
              variant="outlined"
              sx={{
                p: 1.5,
                borderRadius: '14px',
                borderColor: settings.provider === 'openrouter' ? muiTheme.palette.primary.main : muiTheme.palette.divider,
                bgcolor: settings.provider === 'openrouter' ? alpha(muiTheme.palette.primary.main, isDark ? 0.08 : 0.04) : 'transparent',
                transition: 'all 0.15s ease',
              }}
            >
              <FormControlLabel
                value="openrouter"
                control={<Radio size="small" />}
                label={
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      OpenRouter / Custom Remote Proxy
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Multi-model gateway or custom base URL.
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
            borderRadius: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: 2.5,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <KeyRoundedIcon color="secondary" />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {isLocal ? 'Local Server Parameters' : 'API Key & Parameters'}
            </Typography>
          </Box>

          {isLocal ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', display: 'block', mb: 1 }}>
                  Preset Server:
                </Typography>
                <ButtonGroup size="small" variant="outlined" sx={{ width: '100%' }}>
                  <Button
                    fullWidth
                    variant={(settings.localServerType === 'ollama' || !settings.localServerType) ? 'contained' : 'outlined'}
                    color="secondary"
                    onClick={() => handleLocalPreset('ollama')}
                  >
                    Ollama (11434)
                  </Button>
                  <Button
                    fullWidth
                    variant={settings.localServerType === 'lm-studio' ? 'contained' : 'outlined'}
                    color="secondary"
                    onClick={() => handleLocalPreset('lm-studio')}
                  >
                    LM Studio (1234)
                  </Button>
                  <Button
                    fullWidth
                    variant={settings.localServerType === 'custom' ? 'contained' : 'outlined'}
                    color="secondary"
                    onClick={() => handleLocalPreset('custom')}
                  >
                    Custom URL
                  </Button>
                </ButtonGroup>
              </Box>

              <TextField
                fullWidth
                size="small"
                label="Local Endpoint URL"
                value={settings.customEndpoint || 'http://localhost:11434/v1'}
                onChange={(e) => onSettingsChange({ ...settings, customEndpoint: e.target.value })}
              />

              <Paper
                variant="outlined"
                sx={{
                  p: 1.5,
                  borderRadius: '8px',
                  bgcolor: isDark ? alpha(muiTheme.palette.secondary.main, 0.05) : '#f8fafc',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.5 }}>
                  <TerminalRoundedIcon fontSize="small" color="secondary" />
                  <Typography variant="caption" sx={{ fontWeight: 700 }}>
                    Ollama CORS Startup Command:
                  </Typography>
                </Box>
                <Typography variant="caption" sx={{ fontFamily: 'monospace', color: muiTheme.palette.secondary.main, display: 'block' }}>
                  OLLAMA_ORIGINS=&quot;*&quot; ollama serve
                </Typography>
              </Paper>
            </Box>
          ) : (
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
              {keyHelper && (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 0.75 }}>
                  <Typography variant="caption" color="text.secondary">
                    🔒 Key stored securely in your browser&apos;s private local storage.
                  </Typography>
                  <Button
                    size="small"
                    variant="text"
                    href={keyHelper.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    endIcon={<OpenInNewRoundedIcon sx={{ fontSize: '13px !important' }} />}
                    sx={{ fontSize: '0.72rem', py: 0, textTransform: 'none' }}
                  >
                    {keyHelper.label}
                  </Button>
                </Box>
              )}
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
              {currentModels.map(m => (
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
    </Box>
  );
};
