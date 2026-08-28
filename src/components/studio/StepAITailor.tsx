import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Chip,
  LinearProgress,
  CircularProgress,
  useTheme,
  alpha
} from '@mui/material';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import BoltRoundedIcon from '@mui/icons-material/BoltRounded';
import TargetIcon from '@mui/icons-material/TrackChangesRounded';
import { 
  AVAILABLE_AI_MODELS, 
  AIProviderSettings 
} from '../../core/ai-service';
import { PageBudgetSelector } from './tailor/PageBudgetSelector';
import { AiModelSelector } from './tailor/AiModelSelector';
import { StepAITailorProps } from '../../types';

export type { StepAITailorProps };

/**
 * Step 3: AI Resume Tailoring Studio.
 * Principle: Single Responsibility (S) - delegates page budget and model selection to subcomponents.
 */
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
            alignItems: 'stretch',
          }}
        >
          <PageBudgetSelector
            pageBudget={pageBudget}
            onPageBudgetChange={onPageBudgetChange}
          />

          <AiModelSelector
            selectedModelId={providerSettings.model}
            onSelectModel={handleModelSelect}
            disabled={isGenerating}
            apiKey={providerSettings.apiKey}
            provider={providerSettings.provider}
          />
        </Box>

        {/* Synthesis Launch & Real-Time Progress Pipeline */}
        <Paper
          sx={{
            p: { xs: 2.5, md: 3 },
            border: `1px solid ${theme.palette.divider}`,
            bgcolor: isDark ? alpha(theme.palette.primary.main, 0.04) : alpha(theme.palette.primary.main, 0.02),
            borderRadius: '16px',
          }}
        >
          {isGenerating ? (
            <Box sx={{ py: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <CircularProgress size={26} color="primary" />
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>
                      Synthesizing Targeted Resume with AI...
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {generationStep || 'Cross-referencing master profile with target vacancy...'}
                    </Typography>
                  </Box>
                </Box>
                <Chip
                  label="Live AI Synthesis"
                  color="primary"
                  size="small"
                  variant="outlined"
                  sx={{ fontWeight: 600, display: { xs: 'none', sm: 'inline-flex' } }}
                />
              </Box>

              <LinearProgress sx={{ borderRadius: 4, height: 8, mb: 3 }} />

              {/* 5-Stage Live Synthesis Pipeline */}
              <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', mb: 1.5 }}>
                Real-Time Synthesis Pipeline:
              </Typography>

              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(5, 1fr)' }, gap: 1.5 }}>
                {[
                  { step: '1. Keyword Extraction', desc: 'Scanning required vacancy stack', icon: '🔍' },
                  { step: '2. Competency Alignment', desc: 'Mapping master career dossier', icon: '🧠' },
                  { step: '3. Google XYZ Formula', desc: 'Action + Metric + Result', icon: '📐' },
                  { step: '4. Universal ATS Format', desc: 'Zero-bias clean layout', icon: '🛡️' },
                  { step: '5. Gap & Quality Audit', desc: 'Calibrating match score', icon: '📊' }
                ].map((stage, sIdx) => {
                  const isCurrent = (
                    (sIdx === 0 && (!generationStep || generationStep.includes('Reading'))) ||
                    (sIdx === 1 && generationStep.includes('Cross-referencing')) ||
                    (sIdx === 2 && generationStep.includes('Google XYZ')) ||
                    (sIdx === 3 && generationStep.includes('ATS Structure')) ||
                    (sIdx === 4 && generationStep.includes('Gap Analysis'))
                  );
                  return (
                    <Paper
                      key={sIdx}
                      variant="outlined"
                      sx={{
                        p: 1.5,
                        borderRadius: '10px',
                        bgcolor: isCurrent ? alpha(theme.palette.primary.main, 0.12) : 'background.paper',
                        borderColor: isCurrent ? theme.palette.primary.main : theme.palette.divider,
                        transition: 'all 0.25s ease',
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <span>{stage.icon}</span>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.78rem' }}>
                          {stage.step}
                        </Typography>
                      </Box>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: '0.72rem' }}>
                        {stage.desc}
                      </Typography>
                    </Paper>
                  );
                })}
              </Box>
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
                  Ready to tailor your resume surgically?
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  The AI engine will cross-reference your experience with <strong>{companyName || 'this vacancy'}</strong> requirements without touching your master profile in Step 1.
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
                  whiteSpace: 'nowrap',
                  boxShadow: isDark ? '0 4px 14px rgba(2, 132, 199, 0.5)' : '0 4px 14px rgba(2, 132, 199, 0.3)',
                }}
              >
                ✨ Tailor My Resume Now
              </Button>
            </Box>
          )}

          {hasGeneratedCv && !isGenerating && (
            <Box
              sx={{
                mt: 2.5,
                p: 2,
                borderRadius: '12px',
                bgcolor: isDark ? alpha(theme.palette.success.main, 0.1) : '#f0fdf4',
                border: `1px solid ${alpha(theme.palette.success.main, 0.3)}`,
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { sm: 'center' },
                justifyContent: 'space-between',
                gap: 1.5,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <CheckCircleRoundedIcon color="success" />
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: theme.palette.success.main }}>
                    Tailored resume for {companyName || 'this vacancy'} generated successfully!
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Your resume has been aligned with critical keywords and Google XYZ formula. Compare it side-by-side or download your PDF.
                  </Typography>
                </Box>
              </Box>

              <Button
                variant="contained"
                color="success"
                size="small"
                onClick={onNextStep}
                sx={{ fontWeight: 700, borderRadius: '8px', whiteSpace: 'nowrap' }}
              >
                View CV &amp; Compare
              </Button>
            </Box>
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
            View Live CV &amp; PDF Export
          </Button>
        </Paper>
      </Box>
    </Box>
  );
};
