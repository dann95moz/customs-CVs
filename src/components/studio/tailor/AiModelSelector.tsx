import React from 'react';
import {
  Paper,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  useTheme,
  alpha
} from '@mui/material';
import PsychologyRoundedIcon from '@mui/icons-material/PsychologyRounded';
import LaptopRoundedIcon from '@mui/icons-material/LaptopRounded';
import KeyRoundedIcon from '@mui/icons-material/KeyRounded';
import CloudQueueRoundedIcon from '@mui/icons-material/CloudQueueRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import { useTranslation } from 'react-i18next';
import { AVAILABLE_AI_MODELS } from '../../../core/ai-service';
import { AiModelSelectorProps } from '../../../types';

export type { AiModelSelectorProps };

export const AiModelSelector: React.FC<AiModelSelectorProps> = ({
  selectedModelId,
  onSelectModel,
  disabled = false,
  apiKey,
}) => {
  const { t } = useTranslation(['target', 'settings', 'common']);
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const currentModel = AVAILABLE_AI_MODELS.find(m => m.id === selectedModelId) || AVAILABLE_AI_MODELS[0];

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
        <PsychologyRoundedIcon color="secondary" />
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            {t('settings:providers.title', 'AI Engine Selection')}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {t('settings:providers.subtitle', 'Choose the AI model used to synthesize and tailor your resume.')}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, flex: 1, justifyContent: 'center' }}>
        <FormControl fullWidth size="small">
          <InputLabel id="ai-model-select-label">{t('settings:providers.selectProvider', 'Select AI Model')}</InputLabel>
          <Select
            labelId="ai-model-select-label"
            value={selectedModelId}
            label={t('settings:providers.selectProvider', 'Select AI Model')}
            disabled={disabled}
            onChange={(e) => onSelectModel(e.target.value)}
            renderValue={(selectedId) => {
              const model = AVAILABLE_AI_MODELS.find(m => m.id === selectedId) || currentModel;
              return (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, overflow: 'hidden' }}>
                  {model.provider === 'local' ? (
                    <LaptopRoundedIcon color="secondary" sx={{ fontSize: 18, flexShrink: 0 }} />
                  ) : model.requiresKey ? (
                    <KeyRoundedIcon color="warning" sx={{ fontSize: 18, flexShrink: 0 }} />
                  ) : (
                    <CloudQueueRoundedIcon color="primary" sx={{ fontSize: 18, flexShrink: 0 }} />
                  )}
                  <Typography variant="body2" noWrap sx={{ fontWeight: 700, textOverflow: 'ellipsis', overflow: 'hidden' }}>
                    {model.name}
                  </Typography>
                </Box>
              );
            }}
          >
            {AVAILABLE_AI_MODELS.map((m) => (
              <MenuItem key={m.id} value={m.id} sx={{ py: 1.25 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, width: '100%' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {m.provider === 'local' ? (
                      <LaptopRoundedIcon color="secondary" sx={{ fontSize: 18, flexShrink: 0 }} />
                    ) : m.requiresKey ? (
                      <KeyRoundedIcon color="warning" sx={{ fontSize: 18, flexShrink: 0 }} />
                    ) : (
                      <CloudQueueRoundedIcon color="primary" sx={{ fontSize: 18, flexShrink: 0 }} />
                    )}
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {m.name}
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary" sx={{ pl: 3.25, display: 'block' }}>
                    {m.description}
                  </Typography>
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Model Spec & Status Details Box */}
        <Paper
          variant="outlined"
          sx={{
            p: 1.75,
            borderRadius: '12px',
            bgcolor: isDark ? alpha(theme.palette.secondary.main, 0.05) : alpha(theme.palette.secondary.main, 0.03),
            borderColor: alpha(theme.palette.secondary.main, 0.2),
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, flexWrap: 'wrap' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <Chip
                label={currentModel.provider.toUpperCase()}
                size="small"
                color={currentModel.provider === 'local' ? 'secondary' : 'primary'}
                variant="outlined"
                sx={{ height: 20, fontSize: '0.65rem', fontWeight: 800, letterSpacing: 0.5 }}
              />
              <Typography variant="caption" sx={{ fontWeight: 700 }}>
                {currentModel.name.split('(')[0].trim()}
              </Typography>
            </Box>
            <Chip
              icon={currentModel.provider === 'local' ? <LaptopRoundedIcon sx={{ fontSize: '14px !important' }} /> : <KeyRoundedIcon sx={{ fontSize: '14px !important' }} />}
              label={currentModel.provider === 'local' ? 'Offline Local' : (apiKey ? 'Key Configured' : 'API Key Required')}
              size="small"
              color={currentModel.provider === 'local' ? 'secondary' : (apiKey ? 'info' : 'warning')}
              sx={{ height: 20, fontSize: '0.68rem', fontWeight: 700 }}
            />
          </Box>

          <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.45, display: 'block' }}>
            {currentModel.description}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, pt: 0.25 }}>
            <AutoAwesomeRoundedIcon color="secondary" sx={{ fontSize: 14 }} />
            <Typography variant="caption" sx={{ fontSize: '0.7rem', color: theme.palette.secondary.main, fontWeight: 600 }}>
              Calibrated for Google XYZ achievement synthesis &amp; ATS keyword alignment
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Paper>
  );
};
