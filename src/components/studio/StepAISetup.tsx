import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  ButtonGroup,
  Chip,
  RadioGroup,
  Radio,
  FormControlLabel,
  TextField,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  CircularProgress,
  Alert,
  AlertTitle,
  useTheme,
  alpha
} from '@mui/material';
import PsychologyRoundedIcon from '@mui/icons-material/PsychologyRounded';
import LaptopRoundedIcon from '@mui/icons-material/LaptopRounded';
import CloudQueueRoundedIcon from '@mui/icons-material/CloudQueueRounded';
import KeyRoundedIcon from '@mui/icons-material/KeyRounded';
import BoltRoundedIcon from '@mui/icons-material/BoltRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import TerminalRoundedIcon from '@mui/icons-material/TerminalRounded';
import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded';
import { AIProviderId, StepAISetupProps } from '../../types';
import { AVAILABLE_AI_MODELS, testAIConnection } from '../../core/ai-service';

export type { StepAISetupProps };

export const StepAISetup: React.FC<StepAISetupProps> = ({
  settings,
  onSettingsChange,
  onNextStep,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const [showKey, setShowKey] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string; detectedModels?: string[] } | null>(null);
  const [customModelInput, setCustomModelInput] = useState(settings.model || '');

  const isLocal = settings.provider === 'local';

  const handleProviderSelect = (provider: AIProviderId) => {
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

  const currentProviderModels = AVAILABLE_AI_MODELS.filter(m => m.provider === settings.provider);

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
    <Box
      sx={{
        flex: 1,
        height: '100%',
        overflowY: 'auto',
        p: { xs: 1.5, sm: 2, md: 3 },
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 1200,
          display: 'flex',
          flexDirection: 'column',
          gap: 2.5,
        }}
      >
        {/* Header Hero Banner */}
        <Paper
          sx={{
            p: { xs: 2, sm: 2.5, md: 3 },
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { xs: 'flex-start', md: 'center' },
            justifyContent: 'space-between',
            gap: 2,
            background: isDark
              ? 'linear-gradient(135deg, rgba(16, 22, 35, 0.9) 0%, rgba(21, 29, 46, 0.95) 100%)'
              : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: '16px',
          }}
        >
          <Box sx={{ maxWidth: 850 }}>
            <Chip
              icon={<PsychologyRoundedIcon sx={{ fontSize: '16px !important' }} />}
              label="Step 1 of 4 • AI Engine Setup"
              size="small"
              color="primary"
              variant="outlined"
              sx={{ mb: 1, fontWeight: 700 }}
            />
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.5 }}>
              Configure Your AI Synthesis Engine
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Select between a <strong>Local AI model</strong> (100% offline &amp; private on your computer) or your preferred <strong>Cloud AI API</strong> (Google Gemini, Groq, OpenAI, Claude).
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <Chip
              icon={isLocal ? <LaptopRoundedIcon /> : <CloudQueueRoundedIcon />}
              label={isLocal ? 'Local AI Active' : `${settings.provider.toUpperCase()} Active`}
              color={isLocal ? 'secondary' : 'primary'}
              sx={{ fontWeight: 700, py: 0.5, height: 28 }}
            />
          </Box>
        </Paper>

        {/* Main Two-Column Setup Area */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: '380px 1fr' },
            gap: 2.5,
            alignItems: 'start',
          }}
        >
          {/* Left Column: AI Provider Selection */}
          <Paper
            sx={{
              p: { xs: 2, sm: 2.5 },
              border: `1px solid ${theme.palette.divider}`,
              bgcolor: 'background.paper',
              borderRadius: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <BoltRoundedIcon color="primary" />
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                1. Select AI Provider
              </Typography>
            </Box>

            <RadioGroup
              value={settings.provider}
              onChange={(e) => handleProviderSelect(e.target.value as AIProviderId)}
              sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}
            >
              {/* Local AI Option */}
              <Paper
                variant="outlined"
                sx={{
                  p: 1.5,
                  borderRadius: '12px',
                  cursor: 'pointer',
                  borderColor: settings.provider === 'local' ? theme.palette.secondary.main : theme.palette.divider,
                  bgcolor: settings.provider === 'local' ? alpha(theme.palette.secondary.main, isDark ? 0.12 : 0.06) : 'transparent',
                  transition: 'all 0.15s ease',
                  '&:hover': { borderColor: theme.palette.secondary.main },
                }}
                onClick={() => handleProviderSelect('local')}
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
                        <Chip label="100% Free &amp; Private" size="small" color="secondary" sx={{ height: 18, fontSize: '0.65rem', fontWeight: 700 }} />
                      </Box>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.25 }}>
                        Runs offline on your machine with zero cloud dependencies.
                      </Typography>
                    </Box>
                  }
                  sx={{ width: '100%', m: 0 }}
                />
              </Paper>

              {/* Google Gemini */}
              <Paper
                variant="outlined"
                sx={{
                  p: 1.5,
                  borderRadius: '12px',
                  cursor: 'pointer',
                  borderColor: settings.provider === 'gemini' ? theme.palette.primary.main : theme.palette.divider,
                  bgcolor: settings.provider === 'gemini' ? alpha(theme.palette.primary.main, isDark ? 0.12 : 0.06) : 'transparent',
                  transition: 'all 0.15s ease',
                  '&:hover': { borderColor: theme.palette.primary.main },
                }}
                onClick={() => handleProviderSelect('gemini')}
              >
                <FormControlLabel
                  value="gemini"
                  control={<Radio color="primary" size="small" />}
                  label={
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                          Google Gemini
                        </Typography>
                        <Chip label="Recommended" size="small" color="primary" sx={{ height: 18, fontSize: '0.65rem', fontWeight: 700 }} />
                      </Box>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.25 }}>
                        Ultra-fast with Gemini 3.6 / 3.7 models (Free key from AI Studio).
                      </Typography>
                    </Box>
                  }
                  sx={{ width: '100%', m: 0 }}
                />
              </Paper>

              {/* Groq */}
              <Paper
                variant="outlined"
                sx={{
                  p: 1.5,
                  borderRadius: '12px',
                  cursor: 'pointer',
                  borderColor: settings.provider === 'groq' ? theme.palette.warning.main : theme.palette.divider,
                  bgcolor: settings.provider === 'groq' ? alpha(theme.palette.warning.main, isDark ? 0.12 : 0.06) : 'transparent',
                  transition: 'all 0.15s ease',
                  '&:hover': { borderColor: theme.palette.warning.main },
                }}
                onClick={() => handleProviderSelect('groq')}
              >
                <FormControlLabel
                  value="groq"
                  control={<Radio color="warning" size="small" />}
                  label={
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                          Groq (Ultra-Fast)
                        </Typography>
                        <Chip label="High Speed" size="small" color="warning" sx={{ height: 18, fontSize: '0.65rem', fontWeight: 700 }} />
                      </Box>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.25 }}>
                        Llama 3.3 70B &amp; DeepSeek R1 on dedicated Groq LPUs.
                      </Typography>
                    </Box>
                  }
                  sx={{ width: '100%', m: 0 }}
                />
              </Paper>

              {/* OpenAI */}
              <Paper
                variant="outlined"
                sx={{
                  p: 1.5,
                  borderRadius: '12px',
                  cursor: 'pointer',
                  borderColor: settings.provider === 'openai' ? theme.palette.info.main : theme.palette.divider,
                  bgcolor: settings.provider === 'openai' ? alpha(theme.palette.info.main, isDark ? 0.12 : 0.06) : 'transparent',
                  transition: 'all 0.15s ease',
                  '&:hover': { borderColor: theme.palette.info.main },
                }}
                onClick={() => handleProviderSelect('openai')}
              >
                <FormControlLabel
                  value="openai"
                  control={<Radio color="info" size="small" />}
                  label={
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        OpenAI
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.25 }}>
                        GPT-4o, GPT-4o Mini &amp; o3-mini models.
                      </Typography>
                    </Box>
                  }
                  sx={{ width: '100%', m: 0 }}
                />
              </Paper>

              {/* Claude */}
              <Paper
                variant="outlined"
                sx={{
                  p: 1.5,
                  borderRadius: '12px',
                  cursor: 'pointer',
                  borderColor: settings.provider === 'claude' ? theme.palette.error.main : theme.palette.divider,
                  bgcolor: settings.provider === 'claude' ? alpha(theme.palette.error.main, isDark ? 0.12 : 0.06) : 'transparent',
                  transition: 'all 0.15s ease',
                  '&:hover': { borderColor: theme.palette.error.main },
                }}
                onClick={() => handleProviderSelect('claude')}
              >
                <FormControlLabel
                  value="claude"
                  control={<Radio color="error" size="small" />}
                  label={
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        Anthropic Claude
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.25 }}>
                        Claude 3.7 Sonnet &amp; 3.5 Sonnet hybrid reasoning.
                      </Typography>
                    </Box>
                  }
                  sx={{ width: '100%', m: 0 }}
                />
              </Paper>

              {/* OpenRouter & Custom */}
              <Paper
                variant="outlined"
                sx={{
                  p: 1.5,
                  borderRadius: '12px',
                  cursor: 'pointer',
                  borderColor: settings.provider === 'openrouter' || settings.provider === 'custom' ? theme.palette.text.primary : theme.palette.divider,
                  bgcolor: settings.provider === 'openrouter' || settings.provider === 'custom' ? alpha(theme.palette.text.primary, 0.04) : 'transparent',
                  transition: 'all 0.15s ease',
                }}
                onClick={() => handleProviderSelect('openrouter')}
              >
                <FormControlLabel
                  value="openrouter"
                  control={<Radio size="small" />}
                  label={
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        OpenRouter / Custom Remote Proxy
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.25 }}>
                        Multi-model API gateway or private server.
                      </Typography>
                    </Box>
                  }
                  sx={{ width: '100%', m: 0 }}
                />
              </Paper>
            </RadioGroup>
          </Paper>

          {/* Right Column: Provider Configuration & Connection Tester */}
          <Paper
            sx={{
              p: { xs: 2, sm: 2.5, md: 3 },
              border: `1px solid ${theme.palette.divider}`,
              bgcolor: 'background.paper',
              borderRadius: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: 2.5,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <KeyRoundedIcon color={isLocal ? 'secondary' : 'primary'} />
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  2. {isLocal ? 'Local Server Parameters' : `${settings.provider.toUpperCase()} API Configuration`}
                </Typography>
              </Box>

              <Button
                variant="outlined"
                size="small"
                color={isLocal ? 'secondary' : 'primary'}
                startIcon={testingConnection ? <CircularProgress size={14} color="inherit" /> : <BoltRoundedIcon />}
                onClick={handleRunTest}
                disabled={testingConnection}
                sx={{ fontWeight: 700, borderRadius: '8px', fontSize: '0.78rem' }}
              >
                {testingConnection ? 'Testing Connection...' : 'Test Connection'}
              </Button>
            </Box>

            {/* Test Result Feedback Banner */}
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
                      Available Local Models:
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

            {/* LOCAL AI SPECIFIC SETTINGS */}
            {isLocal ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {/* Local Preset Server Buttons */}
                <Box>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', display: 'block', mb: 1 }}>
                    Local AI Server Type:
                  </Typography>
                  <ButtonGroup size="small" variant="outlined" sx={{ width: '100%' }}>
                    <Button
                      fullWidth
                      variant={(settings.localServerType === 'ollama' || !settings.localServerType) ? 'contained' : 'outlined'}
                      color="secondary"
                      onClick={() => handleLocalPreset('ollama')}
                      sx={{ fontWeight: 700 }}
                    >
                      Ollama (Port 11434)
                    </Button>
                    <Button
                      fullWidth
                      variant={settings.localServerType === 'lm-studio' ? 'contained' : 'outlined'}
                      color="secondary"
                      onClick={() => handleLocalPreset('lm-studio')}
                      sx={{ fontWeight: 700 }}
                    >
                      LM Studio (Port 1234)
                    </Button>
                    <Button
                      fullWidth
                      variant={settings.localServerType === 'custom' ? 'contained' : 'outlined'}
                      color="secondary"
                      onClick={() => handleLocalPreset('custom')}
                      sx={{ fontWeight: 700 }}
                    >
                      Custom Port / LAN
                    </Button>
                  </ButtonGroup>
                </Box>

                {/* Local Endpoint Input */}
                <TextField
                  fullWidth
                  size="small"
                  label="Local API Endpoint URL"
                  value={settings.customEndpoint || 'http://localhost:11434/v1'}
                  onChange={(e) => onSettingsChange({ ...settings, customEndpoint: e.target.value })}
                  placeholder="http://localhost:11434/v1"
                  helperText="Standard OpenAI-compatible local completions endpoint."
                />

                {/* Local Model Selector / Custom Model */}
                <FormControl fullWidth size="small">
                  <InputLabel id="local-model-select-label">Local Model</InputLabel>
                  <Select
                    labelId="local-model-select-label"
                    value={settings.model}
                    label="Local Model"
                    onChange={(e) => onSettingsChange({ ...settings, model: e.target.value })}
                  >
                    {currentProviderModels.map((m) => (
                      <MenuItem key={m.id} value={m.id}>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                          <Typography variant="body2" sx={{ fontWeight: 700 }}>
                            {m.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {m.description}
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {settings.model === 'custom-local-model' && (
                  <TextField
                    fullWidth
                    size="small"
                    label="Exact Local Model Name"
                    placeholder="e.g. llama3.2:latest, deepseek-r1:14b, qwen2.5-coder:7b"
                    value={customModelInput}
                    onChange={(e) => {
                      setCustomModelInput(e.target.value);
                      onSettingsChange({ ...settings, model: e.target.value });
                    }}
                    helperText="Enter the exact tag name as shown in 'ollama list' or LM Studio."
                  />
                )}

                {/* Local AI Setup & CORS Helper Box */}
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    borderRadius: '12px',
                    bgcolor: isDark ? alpha(theme.palette.secondary.main, 0.05) : alpha(theme.palette.secondary.main, 0.03),
                    borderColor: alpha(theme.palette.secondary.main, 0.2),
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TerminalRoundedIcon color="secondary" fontSize="small" />
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      Quick Tips for Local AI Setup
                    </Typography>
                  </Box>

                  <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.5 }}>
                    <strong>1. Ollama CORS Requirement:</strong> Browser requests need CORS enabled. Start Ollama with:
                  </Typography>
                  <Paper
                    sx={{
                      p: 1,
                      bgcolor: isDark ? '#090d16' : '#f1f5f9',
                      borderRadius: '6px',
                      fontFamily: 'monospace',
                      fontSize: '0.78rem',
                      color: theme.palette.secondary.main,
                    }}
                  >
                    OLLAMA_ORIGINS=&quot;*&quot; ollama serve
                  </Paper>

                  <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.5, mt: 0.5 }}>
                    <strong>2. LM Studio:</strong> In the Local Server tab, toggle <em>&quot;Enable CORS&quot;</em> and press <em>&quot;Start Server&quot;</em>.
                  </Typography>
                </Paper>
              </Box>
            ) : (
              /* CLOUD AI SPECIFIC SETTINGS */
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {/* API Key Input */}
                <Box>
                  <TextField
                    fullWidth
                    size="small"
                    label={`${settings.provider.toUpperCase()} API Key`}
                    type={showKey ? 'text' : 'password'}
                    placeholder={`Paste your ${settings.provider} API key here...`}
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
                        🔒 Key stored privately in your browser storage.
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

                {/* Active Model Select */}
                <FormControl fullWidth size="small">
                  <InputLabel id="cloud-model-select-label">Active Model</InputLabel>
                  <Select
                    labelId="cloud-model-select-label"
                    value={settings.model}
                    label="Active Model"
                    onChange={(e) => onSettingsChange({ ...settings, model: e.target.value })}
                  >
                    {currentProviderModels.map((m) => (
                      <MenuItem key={m.id} value={m.id}>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                          <Typography variant="body2" sx={{ fontWeight: 700 }}>
                            {m.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {m.description}
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {settings.provider === 'custom' && (
                  <TextField
                    fullWidth
                    size="small"
                    label="Custom Endpoint Base URL"
                    placeholder="https://my-proxy.internal.domain/v1"
                    value={settings.customEndpoint || ''}
                    onChange={(e) => onSettingsChange({ ...settings, customEndpoint: e.target.value })}
                  />
                )}
              </Box>
            )}

            {/* Common Temperature Slider */}
            <Box sx={{ pt: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  Creativity &amp; Precision: {(typeof settings.temperature === 'number' ? settings.temperature : 0.15).toFixed(2)}
                </Typography>
                <Chip
                  label={(settings.temperature || 0.15) <= 0.2 ? 'Zero Hallucinations' : 'Creative Framing'}
                  size="small"
                  color={(settings.temperature || 0.15) <= 0.2 ? 'success' : 'default'}
                  sx={{ height: 20, fontSize: '0.68rem', fontWeight: 700 }}
                />
              </Box>
              <Slider
                value={typeof settings.temperature === 'number' ? settings.temperature : 0.15}
                min={0.0}
                max={1.0}
                step={0.05}
                onChange={(_, val) => onSettingsChange({ ...settings, temperature: val as number })}
                valueLabelDisplay="auto"
              />
              <Typography variant="caption" color="text.secondary">
                Recommended: 0.10 – 0.20 for strict factual accuracy following your candidate dossier.
              </Typography>
            </Box>
          </Paper>
        </Box>

        {/* Navigation Footer */}
        <Paper
          sx={{
            p: 1.5,
            px: 2.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            border: `1px solid ${theme.palette.divider}`,
            bgcolor: 'background.paper',
            borderRadius: '12px',
            flexWrap: 'wrap',
            gap: 1.5,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CheckCircleRoundedIcon color={isLocal || settings.apiKey ? 'success' : 'action'} />
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {isLocal
                ? 'Local AI configured • Ready to tailor resumes without API keys'
                : (settings.apiKey ? `${settings.provider.toUpperCase()} ready` : 'Tip: Enter your API key above or test your connection')}
            </Typography>
          </Box>

          <Button
            variant="contained"
            color="primary"
            endIcon={<ArrowForwardRoundedIcon />}
            onClick={onNextStep}
            sx={{
              fontWeight: 800,
              px: 3.5,
              py: 1,
              borderRadius: '10px',
              boxShadow: isDark ? '0 4px 14px rgba(2, 132, 199, 0.4)' : '0 4px 14px rgba(2, 132, 199, 0.25)',
            }}
          >
            Continue to Candidate Profile (Step 2)
          </Button>
        </Paper>
      </Box>
    </Box>
  );
};
