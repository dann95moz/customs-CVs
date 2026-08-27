import React from 'react';
import {
  Paper,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  useTheme,
} from '@mui/material';
import PsychologyRoundedIcon from '@mui/icons-material/PsychologyRounded';
import PublicRoundedIcon from '@mui/icons-material/PublicRounded';
import KeyRoundedIcon from '@mui/icons-material/KeyRounded';
import { AVAILABLE_AI_MODELS } from '../../../core/ai-service';

export interface AiModelSelectorProps {
  selectedModelId: string;
  onSelectModel: (modelId: string) => void;
  disabled?: boolean;
}

/**
 * Component for selecting AI inference model from available models catalog.
 * Principle: Single Responsibility (S) - manages AI model selection UI.
 */
export const AiModelSelector: React.FC<AiModelSelectorProps> = ({
  selectedModelId,
  onSelectModel,
  disabled = false,
}) => {
  const theme = useTheme();
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
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
        <PsychologyRoundedIcon color="secondary" />
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            2. Artificial Intelligence Engine
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Public models are ready to use with zero setup or API keys.
          </Typography>
        </Box>
      </Box>

      <FormControl fullWidth size="small">
        <InputLabel id="ai-model-select-label">Select AI Model</InputLabel>
        <Select
          labelId="ai-model-select-label"
          value={selectedModelId}
          label="Select AI Model"
          disabled={disabled}
          onChange={(e) => onSelectModel(e.target.value)}
        >
          {AVAILABLE_AI_MODELS.map((m) => (
            <MenuItem key={m.id} value={m.id}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {m.isFree ? <PublicRoundedIcon color="success" fontSize="small" /> : <KeyRoundedIcon color="warning" fontSize="small" />}
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {m.name}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
                  — {m.description}
                </Typography>
              </Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Alert
        severity="info"
        variant="outlined"
        sx={{
          borderRadius: '10px',
          fontSize: '0.82rem',
          py: 0.5,
        }}
      >
        Currently using <strong>{currentModel.name}</strong>. {currentModel.isFree ? 'Zero setup, free public model.' : 'Requires your custom API key in Settings.'}
      </Alert>
    </Paper>
  );
};
