import React, { useRef, useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Chip,
  TextField,
  InputAdornment,
  CircularProgress,
  LinearProgress,
  Tooltip,
  useTheme,
  alpha
} from '@mui/material';
import WorkRoundedIcon from '@mui/icons-material/WorkRounded';
import BusinessRoundedIcon from '@mui/icons-material/BusinessRounded';
import BadgeRoundedIcon from '@mui/icons-material/BadgeRounded';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import AttachFileRoundedIcon from '@mui/icons-material/AttachFileRounded';
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
  const lastClickRef = useRef<number>(0);

  const [localContent, setLocalContent] = useState(content);
  const [localCompany, setLocalCompany] = useState(companyName);
  const [localRole, setLocalRole] = useState(targetRole);

  const contentTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const companyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const roleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setLocalContent(content);
  }, [content]);

  useEffect(() => {
    setLocalCompany(companyName);
  }, [companyName]);

  useEffect(() => {
    setLocalRole(targetRole);
  }, [targetRole]);

  useEffect(() => {
    return () => {
      if (contentTimerRef.current) clearTimeout(contentTimerRef.current);
      if (companyTimerRef.current) clearTimeout(companyTimerRef.current);
      if (roleTimerRef.current) clearTimeout(roleTimerRef.current);
    };
  }, []);

  const flushAll = React.useCallback(() => {
    if (contentTimerRef.current) {
      clearTimeout(contentTimerRef.current);
      contentTimerRef.current = null;
      onChange(localContent);
    }
    if (companyTimerRef.current) {
      clearTimeout(companyTimerRef.current);
      companyTimerRef.current = null;
      onCompanyChange(localCompany);
    }
    if (roleTimerRef.current) {
      clearTimeout(roleTimerRef.current);
      roleTimerRef.current = null;
      onRoleChange(localRole);
    }
  }, [localContent, localCompany, localRole, onChange, onCompanyChange, onRoleChange]);

  const handleContentChange = (val: string) => {
    setLocalContent(val);
    if (contentTimerRef.current) clearTimeout(contentTimerRef.current);
    contentTimerRef.current = setTimeout(() => {
      contentTimerRef.current = null;
      onChange(val);
    }, 250);
  };

  const handleCompanyChange = (val: string) => {
    setLocalCompany(val);
    if (companyTimerRef.current) clearTimeout(companyTimerRef.current);
    companyTimerRef.current = setTimeout(() => {
      companyTimerRef.current = null;
      onCompanyChange(val);
    }, 250);
  };

  const handleRoleChange = (val: string) => {
    setLocalRole(val);
    if (roleTimerRef.current) clearTimeout(roleTimerRef.current);
    roleTimerRef.current = setTimeout(() => {
      roleTimerRef.current = null;
      onRoleChange(val);
    }, 250);
  };

  const { fileInputRef, handleFileUpload, handleDrop, handleDragOver } = useFileUploader({
    onFileLoaded: (text) => {
      setLocalContent(text);
      onChange(text);
      const inferred = extractTargetCompany(text);
      if (inferred && !companyName) {
        const cleanComp = inferred.replace(/_/g, ' ');
        setLocalCompany(cleanComp);
        onCompanyChange(cleanComp);
      }
    }
  });

  const handleTailorAndProceed = () => {
    if (isGenerating) return;
    flushAll();

    const now = Date.now();
    if (now - lastClickRef.current < 1000) {
      return; // Debounce rapid double clicks
    }
    lastClickRef.current = now;

    const isConfigured = Boolean(
      (providerSettings.provider === 'local') ||
      (providerSettings.provider === 'custom' && providerSettings.customEndpoint?.trim()) ||
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
    if (onGenerate && !isGenerating) {
      onGenerate();
    }
  };

  const wordCount = localContent.trim().split(/\s+/).filter(Boolean).length;
  const hasJob = localContent.trim().length > 40 && !localContent.includes('[Paste the raw job description');

  return (
    <Box
      sx={{
        flex: 1,
        height: '100%',
        overflowY: 'auto',
        p: { xs: 1.5, sm: 2, md: 3 },
        pb: { xs: 'calc(env(safe-area-inset-bottom, 0px) + 48px)', sm: 5, md: 6 },
        display: 'flex',
        justifyContent: 'center',
        boxSizing: 'border-box',
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
        {/* Hidden File Input for .txt / .md files */}
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          accept=".md,.txt"
          onChange={handleFileUpload}
        />

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
                  {generationStep || t('target:progress.defaultStep', 'Highlighting your real competencies and XYZ achievements...')}
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
              {t('target:progress.note', '⚡ Highlighting your real achievements with the Google XYZ impact formula. You will be automatically redirected to your live CV as soon as generation completes.')}
            </Typography>
          </Paper>
        )}

        {/* Guiding Hero Banner with Clear Primary Action */}
        <Paper
          sx={{
            p: { xs: 2, md: 2.5 },
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'flex-start', sm: 'center' },
            justifyContent: 'space-between',
            gap: 2,
            background: isDark
              ? 'linear-gradient(135deg, rgba(16, 22, 35, 0.8) 0%, rgba(21, 29, 46, 0.9) 100%)'
              : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Box sx={{ maxWidth: 780 }}>
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

          <Button
            variant="outlined"
            size="small"
            startIcon={<RefreshRoundedIcon />}
            onClick={onLoadSample}
            sx={{
              fontWeight: 700,
              whiteSpace: 'nowrap',
              flexShrink: 0,
              width: { xs: '100%', sm: 'auto' },
            }}
          >
            {t('target:actions.loadSample', 'Load Sample Vacancy')}
          </Button>
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
            value={localCompany}
            onChange={(e) => handleCompanyChange(e.target.value)}
            onBlur={() => onCompanyChange(localCompany)}
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
            value={localRole}
            onChange={(e) => handleRoleChange(e.target.value)}
            onBlur={() => onRoleChange(localRole)}
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
            border: `1px solid ${theme.palette.divider}`,
            bgcolor: 'background.paper',
            borderRadius: '16px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.03)',
            overflow: 'hidden',
          }}
        >
          {/* Editor Header Toolbar with Subtle Attachment Action */}
          <Box
            sx={{
              py: 1,
              px: { xs: 1.5, sm: 2 },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: `1px solid ${theme.palette.divider}`,
              bgcolor: isDark ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)',
              flexShrink: 0,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <EditNoteRoundedIcon fontSize="small" color="secondary" />
              <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: { xs: '0.82rem', sm: '0.875rem' } }}>
                {t('target:editor.editModeTitle', 'Job Description (Plain Text / Raw Posting)')}
              </Typography>
            </Box>

            <Tooltip title={t('target:actions.uploadFileTip', 'Upload job description file (.txt, .md)')}>
              <Button
                size="small"
                variant="text"
                color="inherit"
                startIcon={<AttachFileRoundedIcon sx={{ fontSize: 16 }} />}
                onClick={() => fileInputRef.current?.click()}
                sx={{
                  fontSize: '0.75rem',
                  textTransform: 'none',
                  color: 'text.secondary',
                  py: 0.25,
                  px: 1,
                  borderRadius: '6px',
                  '&:hover': {
                    color: 'primary.main',
                    bgcolor: alpha(theme.palette.primary.main, 0.08)
                  }
                }}
              >
                {t('target:actions.uploadFileInline', 'Attach file (.txt, .md)')}
              </Button>
            </Tooltip>
          </Box>

          <Box
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            sx={{
              flex: 1,
              position: 'relative',
              p: 0,
              display: 'flex',
              minHeight: 280,
            }}
          >
            <textarea
              className="studio-textarea"
              value={localContent}
              onChange={(e) => handleContentChange(e.target.value)}
              onBlur={() => onChange(localContent)}
              placeholder={t('target:editor.placeholder', 'Paste the job description here...')}
              spellCheck={false}
              style={{
                width: '100%',
                height: '100%',
                minHeight: '280px',
                border: 'none',
                outline: 'none',
                padding: '18px',
                fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                fontSize: '0.9rem',
                lineHeight: 1.65,
                resize: 'none',
                backgroundColor: 'transparent',
                color: isDark ? '#f8fafc' : '#0f172a',
                boxSizing: 'border-box',
              }}
            />
          </Box>

          {/* Understated Helper Link below the textarea */}
          <Box
            sx={{
              px: { xs: 1.5, sm: 2 },
              py: { xs: 1.5, sm: 1 },
              borderTop: `1px solid ${alpha(theme.palette.divider, 0.6)}`,
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'flex-start', sm: 'center' },
              justifyContent: 'space-between',
              gap: 1,
              bgcolor: isDark ? 'rgba(255, 255, 255, 0.015)' : 'rgba(0, 0, 0, 0.015)',
              boxSizing: 'border-box',
              flexShrink: 0,
            }}
          >
            <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.5, display: 'inline', width: { xs: '100%', sm: 'auto' } }}>
              {t('target:editor.uploadHint', 'Have a job posting file instead of text?')}{' '}
              <Box
                component="button"
                type="button"
                onClick={() => fileInputRef.current?.click()}
                sx={{
                  background: 'none',
                  border: 'none',
                  color: 'primary.main',
                  cursor: 'pointer',
                  fontWeight: 700,
                  p: 0,
                  m: 0,
                  display: 'inline',
                  fontFamily: 'inherit',
                  fontSize: 'inherit',
                  textDecoration: 'underline',
                  verticalAlign: 'baseline',
                  '&:hover': { opacity: 0.8 }
                }}
              >
                {t('target:editor.uploadAction', 'Upload it here')}
              </Box>
            </Typography>

            <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.5, flexShrink: 0, alignSelf: { xs: 'flex-end', sm: 'center' } }}>
              {wordCount} {t('target:fields.words', 'words')}
            </Typography>
          </Box>
        </Paper>

        {/* Navigation & Direct Action Footer */}
        <Paper
          sx={{
            p: { xs: 2, sm: 2 },
            px: { xs: 2, sm: 2.5 },
            pb: { xs: 2.5, sm: 2 },
            display: 'flex',
            flexDirection: { xs: 'column-reverse', sm: 'row' },
            alignItems: { xs: 'stretch', sm: 'center' },
            justifyContent: 'space-between',
            border: `1px solid ${theme.palette.divider}`,
            bgcolor: 'background.paper',
            borderRadius: '16px',
            gap: { xs: 1.5, sm: 2 },
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
          }}
        >
          <Button
            variant="outlined"
            startIcon={<ArrowBackRoundedIcon />}
            onClick={() => {
              flushAll();
              onPrevStep();
            }}
            disabled={isGenerating}
            sx={{
              fontWeight: 600,
              width: { xs: '100%', sm: 'auto' },
            }}
          >
            {t('target:actions.backToProfile', 'Back to Profile')}
          </Button>

          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'stretch', sm: 'center' },
              gap: 1.5,
              width: { xs: '100%', sm: 'auto' },
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: { xs: 'center', sm: 'flex-start' } }}>
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
            </Box>

            {hasGeneratedCv && !isGenerating && (
              <Button
                variant="outlined"
                color="inherit"
                onClick={() => {
                  flushAll();
                  onNextStep();
                }}
                sx={{
                  fontWeight: 600,
                  width: { xs: '100%', sm: 'auto' },
                }}
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
                py: 1.2,
                width: { xs: '100%', sm: 'auto' },
                boxShadow: isDark ? '0 4px 14px rgba(2, 132, 199, 0.4)' : '0 4px 14px rgba(2, 132, 199, 0.25)',
              }}
            >
              {isGenerating ? t('target:actions.tailoring', 'Tailoring Resume...') : t('target:actions.tailorNow', 'Tailor Resume Now')}
            </Button>
          </Box>
        </Paper>

        {/* Dedicated End-of-Scroll Safe Spacer (Ensures card ending is 100% visible on mobile) */}
        <Box sx={{ height: { xs: 'calc(env(safe-area-inset-bottom, 0px) + 36px)', sm: 20 }, flexShrink: 0 }} />
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
