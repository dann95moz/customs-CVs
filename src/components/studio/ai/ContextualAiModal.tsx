import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  IconButton,
  useTheme,
  alpha,
} from '@mui/material';
import KeyRoundedIcon from '@mui/icons-material/KeyRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { useTranslation } from 'react-i18next';
import { ContextualAiModalProps, AIProviderSettings } from '../../../types';
import { AiConfigForm } from './AiConfigForm';

export type { ContextualAiModalProps };

/**
 * Contextual "Just-in-Time" AI Key Setup Modal.
 * Appears when the user attempts to tailor a resume without a configured AI provider/key.
 * Reuses the unified AiConfigForm component so all providers, options, and i18n are 100% synchronized.
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

  const [localSettings, setLocalSettings] = useState<AIProviderSettings>(settings);

  // Sync local settings when modal opens
  React.useEffect(() => {
    if (open) {
      setLocalSettings(settings);
    }
  }, [open, settings]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveAndGenerate(localSettings);
  };

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
          <IconButton size="small" onClick={onClose} aria-label={t('common:actions.close', 'Close')}>
            <CloseRoundedIcon fontSize="small" />
          </IconButton>
        </Box>

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
            {t('settings:providers.aiSetupModalTitle', 'AI Engine & Key Setup')}
          </Typography>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5, lineHeight: 1.55 }}>
          {t('settings:providers.subtitle', 'Select between completely free local offline models or high-speed cloud APIs.')}
        </Typography>

        {/* Unified AI Configuration Form */}
        <AiConfigForm
          settings={localSettings}
          onSettingsChange={setLocalSettings}
          layout="modal"
          showTestButton={false}
          showSubmitButton={true}
          submitLabel={t('target:actions.tailorNow', 'Tailor Resume Now')}
          onSubmit={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  );
};
