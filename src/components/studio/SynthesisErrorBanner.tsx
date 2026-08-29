import React from 'react';
import { Box, Alert, AlertTitle, Button, Stack, useTheme } from '@mui/material';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import { useResumeStore } from '../../store';

export const SynthesisErrorBanner: React.FC = () => {
  const theme = useTheme();
  const generationError = useResumeStore((s) => s.generationError);
  const setGenerationError = useResumeStore((s) => s.setGenerationError);
  const setActiveTab = useResumeStore((s) => s.setActiveTab);


  if (!generationError) return null;

  return (
    <Box sx={{ p: { xs: 1.5, sm: 2 }, pb: 0, maxWidth: 1200, mx: 'auto', width: '100%' }}>
      <Alert
        severity="error"
        variant="filled"
        onClose={() => setGenerationError(null)}
        sx={{
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(239, 68, 68, 0.25)',
          alignItems: 'center',
          '& .MuiAlert-message': { width: '100%' }
        }}
      >
        <AlertTitle sx={{ fontWeight: 800, mb: 0.25 }}>AI Synthesis Error</AlertTitle>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' }, justifyContent: 'space-between', gap: 1.5, mt: 0.5 }}>
          <Box sx={{ fontSize: '0.85rem', lineHeight: 1.45 }}>
            {generationError}
          </Box>
          <Stack direction="row" spacing={1} sx={{ flexShrink: 0 }}>
            <Button
              size="small"
              variant="contained"
              color="inherit"
              startIcon={<SettingsRoundedIcon />}
              onClick={() => {
                setGenerationError(null);
                setActiveTab('settings');
              }}
              sx={{
                bgcolor: '#ffffff',
                color: theme.palette.error.dark,
                fontWeight: 700,
                fontSize: '0.75rem',
                '&:hover': { bgcolor: '#f1f5f9' },
              }}
            >
              Open AI Settings
            </Button>
          </Stack>
        </Box>
      </Alert>
    </Box>
  );
};
