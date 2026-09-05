import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Chip,
  Stack,
  useTheme,
  alpha,
} from '@mui/material';
import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded';
import FormatListBulletedRoundedIcon from '@mui/icons-material/FormatListBulletedRounded';
import CloudUploadRoundedIcon from '@mui/icons-material/CloudUploadRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import { useTranslation } from 'react-i18next';

export interface MasterDataChoiceViewProps {
  onSelectFreeText: () => void;
  onSelectGuided: () => void;
  onLoadSample: () => void;
  onUploadFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
  openFileDialog: () => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  isProcessing?: boolean;
}

/**
 * Step 1: Onboarding Choice View (Dumb Presentational Component)
 * Clean, frictionless entrance allowing the candidate to choose their preferred input mode.
 */
export const MasterDataChoiceView: React.FC<MasterDataChoiceViewProps> = React.memo(({
  onSelectFreeText,
  onSelectGuided,
  onLoadSample,
  onUploadFile,
  openFileDialog,
  fileInputRef,
  isProcessing = false,
}) => {
  const { t } = useTranslation(['profile', 'common']);
  const theme = useTheme();

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 860,
        mx: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: { xs: 3, sm: 6 },
        px: { xs: 2, sm: 3 },
      }}
    >
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.md,.markdown,.txt"
        style={{ display: 'none' }}
        onChange={onUploadFile}
      />

      {/* Header Banner */}
      <Box sx={{ textAlign: 'center', mb: { xs: 3, sm: 5 } }}>
        <Chip
          icon={<AutoAwesomeRoundedIcon sx={{ fontSize: 16 }} />}
          label={t('profile:choice.badge', 'Step 1 of 3 • Career Profile')}
          size="small"
          color="primary"
          variant="outlined"
          sx={{ mb: 1.5, fontWeight: 700 }}
        />
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1.5, letterSpacing: '-0.02em' }}>
          {t('profile:choice.title', 'How would you like to start your profile?')}
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 620, mx: 'auto' }}>
          {t(
            'profile:choice.subtitle',
            'Choose the input method that best matches your workflow. Everything is processed 100% locally and privately.'
          )}
        </Typography>
      </Box>

      {/* 2 Decision Cards Grid */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: { xs: 2.5, sm: 3 },
          width: '100%',
          mb: 4,
        }}
      >
        {/* Card 1: Fast Mode / Free Text & Notes */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2.5, sm: 3.5 },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            border: `1.5px solid ${alpha(theme.palette.primary.main, 0.25)}`,
            borderRadius: 2,
            bgcolor: alpha(theme.palette.primary.main, 0.02),
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              borderColor: theme.palette.primary.main,
              transform: 'translateY(-2px)',
              boxShadow: theme.shadows[3],
            },
          }}
        >
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: 1.5,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: 'primary.main',
                }}
              >
                <EditNoteRoundedIcon fontSize="medium" />
              </Box>
              <Chip
                label={t('profile:choice.recommendedChip', 'Recommended • Zero Friction')}
                size="small"
                color="primary"
                sx={{ fontWeight: 700, fontSize: '0.72rem' }}
              />
            </Box>

            <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
              {t('profile:choice.freeTextCardTitle', 'Paste Notes or Free Text')}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2, lineHeight: 1.6 }}>
              {t(
                'profile:choice.freeTextCardDesc',
                'Paste unformatted career notes, LinkedIn summary, or import an existing PDF/TXT. No formatting required—the AI structures everything automatically.'
              )}
            </Typography>

            {/* Quick Drop & Browse Area */}
            <Box
              onClick={openFileDialog}
              sx={{
                p: 2,
                mb: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 0.75,
                border: `1.5px dashed ${theme.palette.divider}`,
                borderRadius: 1.5,
                bgcolor: alpha(theme.palette.background.paper, 0.6),
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                  borderColor: theme.palette.primary.main,
                  bgcolor: alpha(theme.palette.primary.main, 0.04),
                },
              }}
            >
              <CloudUploadRoundedIcon color="primary" sx={{ fontSize: 26 }} />
              <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary', textAlign: 'center' }}>
                {t('profile:choice.dropOrBrowse', 'Drag & drop PDF, TXT or MD here, or click to browse')}
              </Typography>
            </Box>
          </Box>

          <Stack spacing={1.5}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={onSelectFreeText}
              endIcon={<ArrowForwardRoundedIcon />}
              fullWidth
              sx={{ fontWeight: 700 }}
            >
              {t('profile:choice.freeTextAction', 'Write or Paste Notes')}
            </Button>
          </Stack>
        </Paper>

        {/* Card 2: Step-by-Step / Guided Form */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2.5, sm: 3.5 },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            border: `1.5px solid ${theme.palette.divider}`,
            borderRadius: 2,
            bgcolor: 'background.paper',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              borderColor: 'text.primary',
              transform: 'translateY(-2px)',
              boxShadow: theme.shadows[3],
            },
          }}
        >
          <Box>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: 1.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: alpha(theme.palette.text.primary, 0.05),
                color: 'text.primary',
                mb: 2,
              }}
            >
              <FormatListBulletedRoundedIcon fontSize="medium" />
            </Box>

            <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
              {t('profile:choice.guidedCardTitle', 'Guided Step-by-Step Form')}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3, lineHeight: 1.6 }}>
              {t(
                'profile:choice.guidedCardDesc',
                'Build your profile section by section with dedicated inputs for personal info, work experience, categorized skills, and education from scratch.'
              )}
            </Typography>
          </Box>

          <Button
            variant="outlined"
            color="primary"
            size="large"
            onClick={onSelectGuided}
            endIcon={<ArrowForwardRoundedIcon />}
            fullWidth
            sx={{ fontWeight: 700 }}
          >
            {t('profile:choice.guidedAction', 'Open Guided Form')}
          </Button>
        </Paper>
      </Box>

      {/* Bottom Option: Sample Profile */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {t('profile:choice.sampleQuestion', 'Just testing?')}
        </Typography>
        <Button
          size="small"
          variant="text"
          color="primary"
          onClick={onLoadSample}
          startIcon={<AutoAwesomeRoundedIcon sx={{ fontSize: 16 }} />}
          sx={{ fontWeight: 700 }}
        >
          {t('profile:choice.loadSampleAction', 'Load Sample Profile')}
        </Button>
      </Box>
    </Box>
  );
});

MasterDataChoiceView.displayName = 'MasterDataChoiceView';
