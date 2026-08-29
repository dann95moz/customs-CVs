import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Collapse,
  RadioGroup,
  FormControlLabel,
  Radio,
  ButtonGroup,
  CircularProgress,
  Alert,
  useTheme,
  alpha,
} from '@mui/material';
import KeyRoundedIcon from '@mui/icons-material/KeyRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import ExpandLessRoundedIcon from '@mui/icons-material/ExpandLessRounded';
import LaptopRoundedIcon from '@mui/icons-material/LaptopRounded';
import BoltRoundedIcon from '@mui/icons-material/BoltRounded';
import { useTranslation } from 'react-i18next';
import { AIProviderId, AIProviderSettings, ContextualAiModalProps } from '../../../types';
import { testAIConnection } from '../../../core/ai-service';

export type { ContextualAiModalProps };

/**
 * Contextual "Just-in-Time" AI Key Setup Modal.
 * Appears when the user attempts to tailor a resume without a configured AI provider/key.
 * Defaults to Google Gemini (free, fast, no credit card required) with progressive disclosure for Local AI and alternative providers.
 */
export const ContextualAiModal: React.FC<ContextualAiModalProps> = ({
  open,
  onClose,
  settings,
  onSaveAndGenerate,
}) => {
  const { t } = useTranslation(['settings', 'target', 'common']);
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const [provider, setProvider] = useState<AIProviderId>(settings.provider || 'gemini');
  const [apiKey, setApiKey] = useState<string>(settings.apiKey || '');
  const [customEndpoint, setCustomEndpoint] = useState<string>(settings.customEndpoint || 'http://localhost:11434/v1');
  const [localServerType, setLocalServerType] = useState<'ollama' | 'lm-studio' | 'custom'>(settings.localServerType || 'ollama');
  const [showKey, setShowKey] = useState<boolean>(false);
  const [showOtherProviders, setShowOtherProviders] = useState<boolean>(false);
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const isLocal = provider === 'local';

  const handleProviderSelect = (newProvider: AIProviderId) => {
    setProvider(newProvider);
    setTestResult(null);
    if (newProvider === 'local') {
      setCustomEndpoint(settings.customEndpoint || 'http://localhost:11434/v1');
    }
  };

  const handleLocalPreset = (type: 'ollama' | 'lm-studio' | 'custom') => {
    setLocalServerType(type);
    if (type === 'ollama') {
      setCustomEndpoint('http://localhost:11434/v1');
    } else if (type === 'lm-studio') {
      setCustomEndpoint('http://localhost:1234/v1');
    }
    setTestResult(null);
  };

  const handleTestLocalConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const result = await testAIConnection({
        ...settings,
        provider: 'local',
        customEndpoint,
        localServerType,
        model: settings.model || 'llama3.2',
      });
      setTestResult(result);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setTestResult({ success: false, message: `Connection error: ${msg}` });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let defaultModel = settings.model;
    if (provider === 'gemini') defaultModel = defaultModel || 'gemini-3.6-flash';
    if (provider === 'local') defaultModel = defaultModel || 'llama3.2';
    if (provider === 'groq') defaultModel = defaultModel || 'llama-3.3-70b-versatile';
    if (provider === 'openai') defaultModel = defaultModel || 'gpt-4o';
    if (provider === 'claude') defaultModel = defaultModel || 'claude-3-7-sonnet-latest';
    if (provider === 'openrouter') defaultModel = defaultModel || 'openrouter-free';

    const updatedSettings: AIProviderSettings = {
      ...settings,
      provider,
      apiKey: isLocal ? '' : apiKey.trim(),
      customEndpoint: isLocal ? customEndpoint : settings.customEndpoint,
      localServerType: isLocal ? localServerType : settings.localServerType,
      model: defaultModel || 'gemini-3.6-flash',
    };

    onSaveAndGenerate(updatedSettings);
  };

  const canSubmit = isLocal ? true : apiKey.trim().length > 5;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: '20px',
            p: { xs: 1.5, sm: 2.5 },
            bgcolor: 'background.paper',
            border: `1px solid ${theme.palette.divider}`,
            boxShadow: isDark
              ? '0 24px 64px rgba(0, 0, 0, 0.8), 0 0 1px rgba(255, 255, 255, 0.15)'
              : '0 20px 50px rgba(0, 0, 0, 0.12)',
          },
        },
      }}
    >
      <DialogContent sx={{ p: { xs: 1, sm: 1.5 } }}>
        {/* Top Close Button */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 0.5 }}>
          <IconButton size="small" onClick={onClose} aria-label="Close modal">
            <CloseRoundedIcon fontSize="small" />
          </IconButton>
        </Box>

        <form onSubmit={handleSubmit}>
          {/* Hero Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: '12px',
                bgcolor: alpha(theme.palette.primary.main, 0.12),
                color: theme.palette.primary.main,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <KeyRoundedIcon sx={{ fontSize: 24 }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: '-0.02em', fontSize: '1.25rem' }}>
              {t('settings:providers.apiKey', 'AI Setup')}
            </Typography>
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.55 }}>
            {t('settings:providers.subtitle', 'Select between completely free local offline models or high-speed cloud APIs.')}
          </Typography>

          {/* Direct Link to Google AI Studio */}
          <Box sx={{ mb: 2 }}>
            <Button
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              variant="text"
              size="small"
              endIcon={<OpenInNewRoundedIcon sx={{ fontSize: '14px !important' }} />}
              sx={{
                px: 0,
                textTransform: 'none',
                fontWeight: 700,
                fontSize: '0.88rem',
                color: 'primary.main',
                '&:hover': {
                  bgcolor: 'transparent',
                  textDecoration: 'underline',
                },
              }}
            >
              Google AI Studio
            </Button>
          </Box>

          {/* Primary Key Input Field (for Gemini or selected cloud provider) */}
          {!isLocal ? (
            <Box sx={{ mb: 2.5 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.primary', display: 'block', mb: 0.75 }}>
                {t('settings:providers.apiKey', 'API Key')}
              </Typography>
              <TextField
                fullWidth
                size="medium"
                placeholder={provider === 'gemini' ? 'AIzaSy...' : t('settings:providers.apiKeyPlaceholder', 'Paste your API key...')}
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                autoFocus
                slotProps={{
                  input: {
                    sx: {
                      borderRadius: '12px',
                      fontFamily: 'monospace',
                      fontSize: '0.9rem',
                    },
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton size="small" onClick={() => setShowKey(!showKey)} edge="end">
                          {showKey ? <VisibilityOffRoundedIcon fontSize="small" /> : <VisibilityRoundedIcon fontSize="small" />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Box>
          ) : (
            <Box sx={{ mb: 2.5, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.primary', display: 'block' }}>
                Local AI Server
              </Typography>
              <ButtonGroup size="small" variant="outlined" sx={{ width: '100%' }}>
                <Button
                  fullWidth
                  variant={localServerType === 'ollama' ? 'contained' : 'outlined'}
                  color="secondary"
                  onClick={() => handleLocalPreset('ollama')}
                >
                  Ollama (11434)
                </Button>
                <Button
                  fullWidth
                  variant={localServerType === 'lm-studio' ? 'contained' : 'outlined'}
                  color="secondary"
                  onClick={() => handleLocalPreset('lm-studio')}
                >
                  LM Studio (1234)
                </Button>
                <Button
                  fullWidth
                  variant={localServerType === 'custom' ? 'contained' : 'outlined'}
                  color="secondary"
                  onClick={() => handleLocalPreset('custom')}
                >
                  Custom
                </Button>
              </ButtonGroup>

              <TextField
                fullWidth
                size="small"
                label={t('settings:providers.customEndpoint', 'Local Endpoint')}
                value={customEndpoint}
                onChange={(e) => setCustomEndpoint(e.target.value)}
                slotProps={{
                  input: { sx: { borderRadius: '10px', fontFamily: 'monospace' } },
                }}
              />

              <Button
                variant="outlined"
                size="small"
                color="secondary"
                startIcon={isTesting ? <CircularProgress size={14} color="inherit" /> : <BoltRoundedIcon />}
                onClick={handleTestLocalConnection}
                disabled={isTesting}
                sx={{ alignSelf: 'flex-start', textTransform: 'none', fontWeight: 700 }}
              >
                {isTesting ? t('settings:providers.testing', 'Testing Connection...') : t('settings:providers.testConnection', 'Test Connection')}
              </Button>
            </Box>
          )}

          {testResult && (
            <Alert severity={testResult.success ? 'success' : 'error'} sx={{ mb: 2, borderRadius: '10px' }}>
              {testResult.message}
            </Alert>
          )}

          {/* Primary Action Button */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            disabled={!canSubmit}
            startIcon={<BoltRoundedIcon />}
            sx={{
              py: 1.2,
              fontWeight: 700,
              fontSize: '0.95rem',
            }}
          >
            {t('target:actions.tailorNow', 'Tailor Resume Now')}
          </Button>

          {/* Accordion / Toggle for Alternative Providers */}
          <Box sx={{ mt: 2.5, textAlign: 'center' }}>
            <Button
              variant="text"
              size="small"
              onClick={() => setShowOtherProviders(!showOtherProviders)}
              endIcon={showOtherProviders ? <ExpandLessRoundedIcon /> : <ExpandMoreRoundedIcon />}
              sx={{
                textTransform: 'none',
                color: 'text.secondary',
                fontSize: '0.82rem',
                fontWeight: 600,
              }}
            >
              {t('settings:providers.selectProvider', 'Alternative AI Providers')}
            </Button>

            <Collapse in={showOtherProviders} sx={{ mt: 1.5, textAlign: 'left' }}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: '12px',
                  bgcolor: isDark ? alpha(theme.palette.background.default, 0.6) : '#f8fafc',
                  border: `1px solid ${theme.palette.divider}`,
                }}
              >
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', display: 'block', mb: 1 }}>
                  {t('settings:providers.selectProvider', 'Select Preferred AI Engine:')}
                </Typography>
                <RadioGroup
                  value={provider}
                  onChange={(e) => handleProviderSelect(e.target.value as AIProviderId)}
                  sx={{ gap: 0.75 }}
                >
                  <FormControlLabel
                    value="gemini"
                    control={<Radio size="small" />}
                    label={
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        Google Gemini (Recommended)
                      </Typography>
                    }
                  />
                  <FormControlLabel
                    value="local"
                    control={<Radio color="secondary" size="small" />}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                        <LaptopRoundedIcon fontSize="small" color="secondary" />
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          Local AI (Offline — Ollama / LM Studio)
                        </Typography>
                      </Box>
                    }
                  />
                  <FormControlLabel
                    value="groq"
                    control={<Radio size="small" />}
                    label={
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        Groq (Fast Cloud)
                      </Typography>
                    }
                  />
                  <FormControlLabel
                    value="openai"
                    control={<Radio size="small" />}
                    label={
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        OpenAI (GPT-4o)
                      </Typography>
                    }
                  />
                  <FormControlLabel
                    value="claude"
                    control={<Radio size="small" />}
                    label={
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        Anthropic Claude
                      </Typography>
                    }
                  />
                  <FormControlLabel
                    value="openrouter"
                    control={<Radio size="small" />}
                    label={
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        OpenRouter / Remote Proxy
                      </Typography>
                    }
                  />
                </RadioGroup>
              </Box>
            </Collapse>
          </Box>
        </form>
      </DialogContent>
    </Dialog>
  );
};
