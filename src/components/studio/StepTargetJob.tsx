import React, { useRef, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  ButtonGroup,
  Chip,
  Stack,
  TextField,
  InputAdornment,
  CircularProgress,
  LinearProgress,
  useTheme,
  alpha
} from '@mui/material';
import WorkRoundedIcon from '@mui/icons-material/WorkRounded';
import BusinessRoundedIcon from '@mui/icons-material/BusinessRounded';
import BadgeRoundedIcon from '@mui/icons-material/BadgeRounded';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import CloudUploadRoundedIcon from '@mui/icons-material/CloudUploadRounded';
import FileDownloadRoundedIcon from '@mui/icons-material/FileDownloadRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import BoltRoundedIcon from '@mui/icons-material/BoltRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import { extractTargetCompany } from '../../core/parser';
import { useFileUploader } from '../../hooks/useFileUploader';
import { useTranslation } from 'react-i18next';
import { useResumeStore } from '../../store';
import { StepTargetJobProps } from '../../types';

const ContextualAiModal = React.lazy(() =>
  import('./ai/ContextualAiModal').then((m) => ({ default: m.ContextualAiModal }))
);

export type { StepTargetJobProps };

export const StepTargetJob: React.FC<StepTargetJobProps> = ({
  content,
  onChange,
  companyName,
  onCompanyChange,
  targetRole,
  onRoleChange,
  onLoadSample,
  onPrevStep,
  onNextStep,
  onGenerate,
  isGenerating = false,
  generationStep,
  hasGeneratedCv = false
}) => {
  const { t } = useTranslation(['target', 'common']);
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const providerSettings = useResumeStore((s) => s.providerSettings);
  const setProviderSettings = useResumeStore((s) => s.setProviderSettings);
  const [aiModalOpen, setAiModalOpen] = useState<boolean>(false);

  const { fileInputRef, handleFileUpload, handleDrop, handleDragOver } = useFileUploader({
    onFileLoaded: (text) => {
      onChange(text);
      const inferred = extractTargetCompany(text);
      if (inferred && !companyName) {
        onCompanyChange(inferred.replace(/_/g, ' '));
      }
    }
  });

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `target-job-${companyName || 'posting'}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleTailorAndProceed = () => {
    const isConfigured = Boolean(
      (providerSettings.provider === 'local') ||
      (providerSettings.apiKey && providerSettings.apiKey.trim().length > 5)
    );

    if (!isConfigured) {
      setAiModalOpen(true);
      return;
    }

    if (onGenerate) {
      onGenerate();
    }
  };

  const handleSaveModalAndGenerate = (updatedSettings: typeof providerSettings) => {
    setProviderSettings(updatedSettings);
    setAiModalOpen(false);
    if (onGenerate) {
      onGenerate();
    }
  };

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  const hasJob = content.trim().length > 40 && !content.includes('[Paste the raw job description');

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
        {/* Active AI Synthesis Progress Banner */}
        {isGenerating && (
          <Paper
            sx={{
              p: { xs: 2, sm: 2.5 },
              borderRadius: '16px',
              border: `1.5px solid ${theme.palette.primary.main}`,
              bgcolor: isDark ? alpha(theme.palette.primary.main, 0.12) : alpha(theme.palette.primary.main, 0.05),
              boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.2)}`,
              display: 'flex',
              flexDirection: 'column',
              gap: 1.5,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <CircularProgress size={28} thickness={4} color="primary" />
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'text.primary' }}>
                  {t('target:progress.title', 'Synthesizing Tailored Resume with AI...')}
                </Typography>
                <Typography variant="body2" sx={{ color: theme.palette.primary.main, fontWeight: 600 }}>
                  {generationStep || t('target:progress.defaultStep', 'Cross-referencing competencies and synthesizing XYZ achievements...')}
                </Typography>
              </Box>
              <Chip
                icon={<AutoAwesomeRoundedIcon sx={{ fontSize: '14px !important' }} />}
                label={t('common:status.inProgress', 'In Progress')}
                color="primary"
                size="small"
                sx={{ fontWeight: 700 }}
              />
            </Box>
            <LinearProgress
              variant="indeterminate"
              sx={{
                borderRadius: 4,
                height: 5,
                bgcolor: alpha(theme.palette.primary.main, 0.2),
              }}
            />
            <Typography variant="caption" color="text.secondary">
              {t('target:progress.note', '⚡ Applying factual integrity safeguards and Google XYZ formula metrics. You will be automatically redirected to your live CV as soon as generation completes.')}
            </Typography>
          </Paper>
        )}

        {/* Simplified Guiding Hero Banner */}
        <Paper
          sx={{
            p: { xs: 2, md: 2.5 },
            display: 'flex',
            flexDirection: { xs: 'column', lg: 'row' },
            alignItems: { xs: 'flex-start', lg: 'center' },
            justifyContent: 'space-between',
            gap: 2,
            background: isDark
              ? 'linear-gradient(135deg, rgba(16, 22, 35, 0.8) 0%, rgba(21, 29, 46, 0.9) 100%)'
              : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Box sx={{ maxWidth: 900 }}>
            <Chip
              icon={<WorkRoundedIcon sx={{ fontSize: '16px !important' }} />}
              label={t('target:stepBadge', 'Step 2 of 3 • Target Vacancy & Tailoring')}
              size="small"
              color="secondary"
              variant="outlined"
              sx={{ mb: 1, fontWeight: 700 }}
            />
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.5 }}>
              {t('target:title', 'Target Job Vacancy')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('target:subtitle', 'Paste the job posting description. The AI will automatically calibrate the optimal length, impact metrics, and keyword alignment.')}
            </Typography>
          </Box>

          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<RefreshRoundedIcon />}
              onClick={onLoadSample}
            >
              {t('target:actions.loadSample', 'Load Sample Vacancy')}
            </Button>

            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              accept=".md,.txt"
              onChange={handleFileUpload}
            />
            <Button
              variant="outlined"
              size="small"
              startIcon={<CloudUploadRoundedIcon />}
              onClick={() => fileInputRef.current?.click()}
            >
              {t('target:actions.uploadFile', 'Upload Job File')}
            </Button>

            <Button
              variant="outlined"
              size="small"
              startIcon={<FileDownloadRoundedIcon />}
              onClick={handleDownload}
            >
              {t('target:actions.exportFile', 'Export File')}
            </Button>
          </Stack>
        </Paper>

        {/* Target Metadata & Metric Inputs */}
        <Paper
          sx={{
            p: 2,
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 200px' },
            gap: 2,
            alignItems: 'center',
            bgcolor: 'background.paper',
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <TextField
            label={t('target:fields.company', 'Target Company / Employer')}
            placeholder={t('target:fields.companyPlaceholder', 'e.g. Stripe, Airbnb, Google')}
            value={companyName}
            onChange={(e) => onCompanyChange(e.target.value)}
            size="small"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <BusinessRoundedIcon fontSize="small" color="primary" />
                  </InputAdornment>
                ),
              },
            }}
          />

          <TextField
            label={t('target:fields.role', 'Target Role / Job Title')}
            placeholder={t('target:fields.rolePlaceholder', 'e.g. Senior Frontend Engineer')}
            value={targetRole}
            onChange={(e) => onRoleChange(e.target.value)}
            size="small"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <BadgeRoundedIcon fontSize="small" color="secondary" />
                  </InputAdornment>
                ),
              },
            }}
          />

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              p: 1,
              borderRadius: '10px',
              bgcolor: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.03)',
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <DescriptionRoundedIcon fontSize="small" color="action" />
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                {t('target:fields.vacancyLength', 'Vacancy Length')}
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                {wordCount} {t('target:fields.words', 'words')}
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* Spacious Direct Job Description Editor Area */}
        <Paper
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            minHeight: 400,
            overflow: 'hidden',
            border: `1px solid ${theme.palette.divider}`,
            bgcolor: 'background.paper',
          }}
        >
          <Box
            sx={{
              py: 1.25,
              px: { xs: 1.5, sm: 2 },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: `1px solid ${theme.palette.divider}`,
              bgcolor: isDark ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <EditNoteRoundedIcon fontSize="small" color="secondary" />
              <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: { xs: '0.82rem', sm: '0.875rem' } }}>
                {t('target:editor.editModeTitle', 'Job Description (Plain Text / Markdown)')}
              </Typography>
            </Box>
          </Box>

          <Box
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            sx={{
              flex: 1,
              position: 'relative',
              p: 0,
              display: 'flex',
            }}
          >
            <textarea
              className="studio-textarea"
              value={content}
              onChange={(e) => onChange(e.target.value)}
              placeholder={t('target:editor.placeholder', 'Paste the job description here...')}
              spellCheck={false}
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
                outline: 'none',
                padding: '18px',
                fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                fontSize: '0.9rem',
                lineHeight: 1.65,
                resize: 'none',
                backgroundColor: 'transparent',
                color: isDark ? '#f8fafc' : '#0f172a',
              }}
            />
          </Box>
        </Paper>

        {/* Navigation & Direct Action Footer */}
        <Paper
          sx={{
            p: 1.5,
            px: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            border: `1px solid ${theme.palette.divider}`,
            bgcolor: 'background.paper',
            flexWrap: 'wrap',
            gap: 1.5,
          }}
        >
          <Button
            variant="outlined"
            startIcon={<ArrowBackRoundedIcon />}
            onClick={onPrevStep}
            disabled={isGenerating}
          >
            {t('target:actions.backToProfile', 'Back to Profile (Step 1)')}
          </Button>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
            {hasJob ? (
              <Chip
                icon={<CheckCircleRoundedIcon />}
                label={isGenerating ? (generationStep || t('target:actions.tailoring', 'Tailoring Resume...')) : t('target:status.ready', 'Job details ready')}
                color={isGenerating ? 'info' : 'success'}
                variant="outlined"
                size="small"
                sx={{ fontWeight: 600 }}
              />
            ) : (
              <Chip
                icon={<InfoRoundedIcon />}
                label={t('target:status.missing', 'Paste a job description to tailor')}
                color="warning"
                variant="outlined"
                size="small"
                sx={{ fontWeight: 600 }}
              />
            )}

            {hasGeneratedCv && !isGenerating && (
              <Button
                variant="outlined"
                color="inherit"
                onClick={onNextStep}
                sx={{ fontWeight: 600 }}
              >
                {t('target:actions.viewExisting', 'View Existing CV')}
              </Button>
            )}

            <Button
              variant="contained"
              color="primary"
              size="large"
              startIcon={isGenerating ? <CircularProgress size={18} color="inherit" /> : <BoltRoundedIcon />}
              onClick={handleTailorAndProceed}
              disabled={isGenerating}
              sx={{
                fontWeight: 700,
                px: 3.5,
                py: 1,
                boxShadow: isDark ? '0 4px 14px rgba(2, 132, 199, 0.4)' : '0 4px 14px rgba(2, 132, 199, 0.25)',
              }}
            >
              {isGenerating ? t('target:actions.tailoring', 'Tailoring Resume...') : t('target:actions.tailorNow', 'Tailor Resume Now')}
            </Button>
          </Box>
        </Paper>
      </Box>

      {/* Contextual AI Setup Modal (opens on click if key is missing) */}
      <React.Suspense fallback={null}>
        <ContextualAiModal
          open={aiModalOpen}
          onClose={() => setAiModalOpen(false)}
          settings={providerSettings}
          onSaveAndGenerate={handleSaveModalAndGenerate}
        />
      </React.Suspense>
    </Box>
  );
};
