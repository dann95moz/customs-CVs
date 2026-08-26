import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Chip,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  LinearProgress,
  CircularProgress,
  Alert,
  ButtonBase,
  useTheme,
  alpha
} from '@mui/material';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import LayersRoundedIcon from '@mui/icons-material/LayersRounded';
import PsychologyRoundedIcon from '@mui/icons-material/PsychologyRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import BoltRoundedIcon from '@mui/icons-material/BoltRounded';
import RadioButtonUncheckedRoundedIcon from '@mui/icons-material/RadioButtonUncheckedRounded';
import RadioButtonCheckedRoundedIcon from '@mui/icons-material/RadioButtonCheckedRounded';
import KeyRoundedIcon from '@mui/icons-material/KeyRounded';
import PublicRoundedIcon from '@mui/icons-material/PublicRounded';
import TargetIcon from '@mui/icons-material/TrackChangesRounded';
import { 
  AVAILABLE_AI_MODELS, 
  AIProviderSettings 
} from '../../core/ai-service';

interface StepAITailorProps {
  candidateName: string;
  companyName: string;
  targetRole: string;
  pageBudget: 1 | 2;
  onPageBudgetChange: (val: 1 | 2) => void;
  providerSettings: AIProviderSettings;
  onSettingsChange: (settings: AIProviderSettings) => void;
  onGenerate: () => Promise<void>;
  isGenerating: boolean;
  generationStep: string;
  hasGeneratedCv: boolean;
  onPrevStep: () => void;
  onNextStep: () => void;
}

export const StepAITailor: React.FC<StepAITailorProps> = ({
  candidateName,
  companyName,
  targetRole,
  pageBudget,
  onPageBudgetChange,
  providerSettings,
  onSettingsChange,
  onGenerate,
  isGenerating,
  generationStep,
  hasGeneratedCv,
  onPrevStep,
  onNextStep
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const currentModel = AVAILABLE_AI_MODELS.find(m => m.id === providerSettings.model) || AVAILABLE_AI_MODELS[0];

  const handleModelSelect = (modelId: string) => {
    const selected = AVAILABLE_AI_MODELS.find(m => m.id === modelId);
    if (selected) {
      onSettingsChange({
        ...providerSettings,
        provider: selected.provider,
        model: selected.id
      });
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto', gap: 2.5, p: { xs: 1.5, md: 2.5 } }}>
      {/* Guiding Hero Banner */}
      <Paper
        sx={{
          p: { xs: 2, md: 2.5 },
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          background: isDark
            ? 'linear-gradient(135deg, rgba(16, 22, 35, 0.9) 0%, rgba(21, 29, 46, 0.95) 100%)'
            : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Box>
          <Chip
            icon={<AutoAwesomeRoundedIcon sx={{ fontSize: '16px !important' }} />}
            label="Step 3 of 4 • Intelligent AI Tailoring Studio"
            size="small"
            color="primary"
            variant="outlined"
            sx={{ mb: 1, fontWeight: 700 }}
          />
          <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.5 }}>
            Surgically Tailor Your Resume with AI
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 1000 }}>
            The AI cross-references your career history with the target vacancy requirements.
            <strong> It aligns your top achievements, embeds crucial keywords, and calibrates measurable outcomes</strong> (Google XYZ formula) to impress hiring managers and maximize ATS scores.
          </Typography>
        </Box>
      </Paper>

      {/* Target Application Overview */}
      <Paper
        sx={{
          p: 2,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'flex-start', md: 'center' },
          justifyContent: 'space-around',
          gap: 2,
          border: `1px solid ${theme.palette.divider}`,
          bgcolor: 'background.paper',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <TargetIcon color="primary" />
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
              Candidate
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              {candidateName || 'Your Name'}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <TargetIcon color="secondary" />
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
              Target Employer
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              {companyName || 'Employer Pending'}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <TargetIcon color="success" />
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
              Target Role
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              {targetRole || 'Role Pending'}
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Options Grid: Page Budget & AI Model */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
          gap: 2.5,
        }}
      >
        {/* 1. Resume Length Budget */}
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
            <LayersRoundedIcon color="primary" />
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                1. Resume Length (Page Budget)
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Select the target length calibrated to your career seniority.
              </Typography>
            </Box>
          </Box>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
            <ButtonBase
              onClick={() => onPageBudgetChange(1)}
              sx={{
                flex: 1,
                p: 2,
                borderRadius: '12px',
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                border: '2px solid',
                borderColor: pageBudget === 1 ? theme.palette.primary.main : theme.palette.divider,
                bgcolor: pageBudget === 1 ? alpha(theme.palette.primary.main, isDark ? 0.12 : 0.06) : 'transparent',
                transition: 'all 0.2s ease',
              }}
            >
              <Box sx={{ width: '100%', mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                  1 Page (A4 Standard)
                </Typography>
                <Chip label="Recommended" size="small" color="primary" sx={{ height: 20, fontSize: '0.68rem', fontWeight: 700 }} />
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 1.5 }}>
                Ideal for 30-second recruiter scans. Focuses on your highest-impact metrics.
              </Typography>
              <Box sx={{ alignSelf: 'flex-end', color: pageBudget === 1 ? theme.palette.primary.main : theme.palette.text.disabled }}>
                {pageBudget === 1 ? <RadioButtonCheckedRoundedIcon /> : <RadioButtonUncheckedRoundedIcon />}
              </Box>
            </ButtonBase>

            <ButtonBase
              onClick={() => onPageBudgetChange(2)}
              sx={{
                flex: 1,
                p: 2,
                borderRadius: '12px',
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                border: '2px solid',
                borderColor: pageBudget === 2 ? theme.palette.primary.main : theme.palette.divider,
                bgcolor: pageBudget === 2 ? alpha(theme.palette.primary.main, isDark ? 0.12 : 0.06) : 'transparent',
                transition: 'all 0.2s ease',
              }}
            >
              <Box sx={{ width: '100%', mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                  2 Pages (Extended)
                </Typography>
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 1.5 }}>
                For directors, tech leads, or specialists with 8-10+ years of deep technical track records.
              </Typography>
              <Box sx={{ alignSelf: 'flex-end', color: pageBudget === 2 ? theme.palette.primary.main : theme.palette.text.disabled }}>
                {pageBudget === 2 ? <RadioButtonCheckedRoundedIcon /> : <RadioButtonUncheckedRoundedIcon />}
              </Box>
            </ButtonBase>
          </Stack>
        </Paper>

        {/* 2. Artificial Intelligence Engine */}
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
              value={providerSettings.model}
              label="Select AI Model"
              disabled={isGenerating}
              onChange={(e) => handleModelSelect(e.target.value)}
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
      </Box>

      {/* Synthesis Launch Callout */}
      <Paper
        sx={{
          p: { xs: 2.5, md: 3 },
          border: `1px solid ${theme.palette.divider}`,
          bgcolor: isDark ? alpha(theme.palette.primary.main, 0.04) : alpha(theme.palette.primary.main, 0.02),
          borderRadius: '16px',
        }}
      >
        {isGenerating ? (
          <Box sx={{ py: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <CircularProgress size={32} color="primary" />
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                  Tailoring Your Resume in Progress...
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {generationStep || 'Analyzing vacancy specs and calibrating achievements...'}
                </Typography>
              </Box>
            </Box>
            <LinearProgress sx={{ borderRadius: 4, height: 8 }} />
          </Box>
        ) : (
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: { xs: 'flex-start', md: 'center' },
              justifyContent: 'space-between',
              gap: 2,
            }}
          >
            <Box sx={{ maxWidth: 700 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 0.5 }}>
                Ready to synthesize your tailored CV?
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Click below to begin AI synthesis. Your master career profile in Step 1 remains untouched and safe.
              </Typography>
            </Box>

            <Button
              variant="contained"
              size="large"
              color="primary"
              startIcon={<BoltRoundedIcon />}
              onClick={onGenerate}
              disabled={isGenerating}
              sx={{
                py: 1.5,
                px: 3.5,
                fontSize: '1rem',
                fontWeight: 800,
                borderRadius: '12px',
              }}
            >
              ✨ Tailor My Resume Now
            </Button>
          </Box>
        )}

        {hasGeneratedCv && !isGenerating && (
          <Alert
            severity="success"
            sx={{ mt: 2.5, borderRadius: '12px' }}
            icon={<CheckCircleRoundedIcon fontSize="inherit" />}
          >
            Tailored resume for <strong>{companyName || 'this vacancy'}</strong> is ready! Click below to view the pixel-perfect live preview and download your PDF.
          </Alert>
        )}
      </Paper>

      {/* Navigation Footer */}
      <Paper
        sx={{
          p: 1.5,
          px: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          border: `1px solid ${theme.palette.divider}`,
          bgcolor: 'background.paper',
          mt: 'auto',
        }}
      >
        <Button
          variant="outlined"
          startIcon={<ArrowBackRoundedIcon />}
          onClick={onPrevStep}
          disabled={isGenerating}
        >
          Back to Target Job
        </Button>

        <Button
          variant="contained"
          color="primary"
          endIcon={<ArrowForwardRoundedIcon />}
          onClick={onNextStep}
          disabled={isGenerating}
          sx={{ fontWeight: 700, px: 3 }}
        >
          View Live CV & PDF Export
        </Button>
      </Paper>
    </Box>
  );
};
