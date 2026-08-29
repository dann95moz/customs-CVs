import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  Chip,
  Stack,
  Tooltip,
  ButtonGroup,
  useTheme,
  alpha
} from '@mui/material';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import CloudUploadRoundedIcon from '@mui/icons-material/CloudUploadRounded';
import FileDownloadRoundedIcon from '@mui/icons-material/FileDownloadRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import ShieldRoundedIcon from '@mui/icons-material/ShieldRounded';
import FormatListBulletedRoundedIcon from '@mui/icons-material/FormatListBulletedRounded';
import CodeRoundedIcon from '@mui/icons-material/CodeRounded';
import { extractCandidateName, parseCvMarkdownToData } from '../../core/parser';
import { useFileUploader } from '../../hooks/useFileUploader';
import { useTranslation } from 'react-i18next';
import { StepMasterDataProps } from '../../types';
import { StudioSkeleton } from './StudioSkeleton';

const GuidedProfileForm = React.lazy(() =>
  import('./GuidedProfileForm').then((m) => ({ default: m.GuidedProfileForm }))
);

export type { StepMasterDataProps };

export const StepMasterData: React.FC<StepMasterDataProps> = ({
  content,
  onChange,
  onLoadSample,
  onNextStep
}) => {
  const { t } = useTranslation(['profile', 'common']);
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const [editMode, setEditMode] = React.useState<'guided' | 'markdown'>('guided');

  const { fileInputRef, handleFileUpload, handleDrop, handleDragOver } = useFileUploader({
    onFileLoaded: (text) => onChange(text)
  });

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'master-profile.md';
    link.click();
    URL.revokeObjectURL(url);
  };

  const hasData = content.trim().length > 50 && !content.includes('[CANDIDATE FULL NAME]');

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
        {/* Hidden File Input for .md / .txt uploads */}
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          accept=".md,.txt"
          onChange={handleFileUpload}
        />

        {/* Guiding Hero Banner with Clear Initial Actions */}
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
              icon={<PersonRoundedIcon sx={{ fontSize: '16px !important' }} />}
              label={t('profile:stepBadge', 'Step 1 of 3 • Candidate Profile')}
              size="small"
              color="primary"
              variant="outlined"
              sx={{ mb: 1, fontWeight: 700 }}
            />
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.5 }}>
              {t('profile:title', 'Your Career Profile')}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexWrap: 'wrap' }}>
              {t('profile:subtitle', "Add your career history and skills once. We'll automatically adapt it for every job you apply to.")}
              <Tooltip
                title={t('common:safeguard.tooltip', 'We never invent achievements, experience, or skills not in your profile.')}
                arrow
                placement="top"
                enterTouchDelay={0}
                leaveTouchDelay={4000}
              >
                <IconButton
                  size="small"
                  aria-label={t('common:safeguard.ariaLabel', 'Career Authenticity Promise')}
                  sx={{
                    p: 0.35,
                    color: theme.palette.success.main,
                    bgcolor: alpha(theme.palette.success.main, 0.08),
                    borderRadius: '6px',
                    '&:hover': { bgcolor: alpha(theme.palette.success.main, 0.16) },
                  }}
                >
                  <ShieldRoundedIcon sx={{ fontSize: '0.95rem' }} />
                </IconButton>
              </Tooltip>
            </Typography>
          </Box>

          {/* Equal-weight action buttons for users with existing data or demo exploration */}
          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1, flexShrink: 0 }}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<RefreshRoundedIcon />}
              onClick={onLoadSample}
              sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}
            >
              {t('profile:actions.loadSample', 'Load Sample Profile')}
            </Button>

            <Button
              variant="outlined"
              size="small"
              startIcon={<CloudUploadRoundedIcon />}
              onClick={() => fileInputRef.current?.click()}
              sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}
            >
              {t('profile:actions.uploadFile', 'Upload File (.md)')}
            </Button>
          </Stack>
        </Paper>

        {/* Mode Switcher & Dedicated Editor Area */}
        <Paper
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            minHeight: 450,
            overflow: 'hidden',
            border: `1px solid ${theme.palette.divider}`,
            bgcolor: 'background.paper',
            borderRadius: '12px',
          }}
        >
          <Box
            sx={{
              py: 1,
              px: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 1,
              borderBottom: `1px solid ${theme.palette.divider}`,
              bgcolor: isDark ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <EditNoteRoundedIcon fontSize="small" color="primary" />
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                {editMode === 'markdown'
                  ? t('profile:modes.markdownTitle', 'Natural Freeform Dossier (Markdown / Natural Language)')
                  : t('profile:modes.guidedTitle', 'Structured Profile Assistant')}
              </Typography>
            </Box>

            <ButtonGroup size="small" variant="outlined">
              <Button
                variant={editMode === 'guided' ? 'contained' : 'outlined'}
                startIcon={<FormatListBulletedRoundedIcon />}
                onClick={() => setEditMode('guided')}
                sx={{ fontWeight: 600, fontSize: '0.8rem' }}
              >
                {t('profile:modes.guidedAssistant', 'Guided Assistant')}
              </Button>
              <Button
                variant={editMode === 'markdown' ? 'contained' : 'outlined'}
                startIcon={<CodeRoundedIcon />}
                onClick={() => setEditMode('markdown')}
                sx={{ fontWeight: 600, fontSize: '0.8rem' }}
              >
                {t('profile:modes.markdownEditor', 'Markdown Editor')}
              </Button>
            </ButtonGroup>
          </Box>

          {editMode === 'guided' ? (
            <Box sx={{ flex: 1, overflowY: 'auto', maxHeight: 'calc(100vh - 350px)' }}>
              <React.Suspense fallback={<StudioSkeleton variant="guidedForm" />}>
                <GuidedProfileForm markdownContent={content} onChange={onChange} />
              </React.Suspense>
            </Box>
          ) : (
            <Box
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              sx={{
                flex: 1,
                position: 'relative',
                p: 0,
                display: 'flex',
                minHeight: 350,
              }}
            >
              <textarea
                className="studio-textarea"
                value={content}
                onChange={(e) => onChange(e.target.value)}
                placeholder="# [CANDIDATE FULL NAME]&#10;**Primary Professional Role / Specialization**&#10;City, Country • candidate.email@example.com • +1 234 567 8900&#10;&#10;## CAREER HISTORY & ACHIEVEMENTS&#10;Write your companies, roles, and achievements here..."
                spellCheck={false}
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  outline: 'none',
                  padding: '16px',
                  fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
                  fontSize: '0.88rem',
                  lineHeight: 1.65,
                  resize: 'none',
                  backgroundColor: 'transparent',
                  color: isDark ? '#f8fafc' : '#0f172a',
                }}
              />
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
            borderRadius: '12px',
            flexWrap: 'wrap',
            gap: 1.5,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
            {hasData ? (
              <Chip
                icon={<CheckCircleRoundedIcon />}
                label={t('profile:status.ready', 'Master profile ready for tailoring')}
                color="success"
                variant="outlined"
                size="small"
                sx={{ fontWeight: 600 }}
              />
            ) : (
              <Chip
                icon={<InfoRoundedIcon />}
                label={t('profile:status.tipLoadSample', "Tip: Click 'Load Sample Profile' to test right away")}
                color="warning"
                variant="outlined"
                size="small"
                sx={{ fontWeight: 600 }}
              />
            )}

            {/* Contextual Backup Export only when there is actual profile data */}
            {hasData && (
              <Tooltip title={t('profile:actions.exportBackupTip', 'Download your master profile as Markdown (.md)')}>
                <Button
                  size="small"
                  variant="text"
                  color="inherit"
                  startIcon={<FileDownloadRoundedIcon sx={{ fontSize: 16 }} />}
                  onClick={handleDownload}
                  sx={{
                    fontSize: '0.75rem',
                    color: 'text.secondary',
                    textTransform: 'none',
                    '&:hover': { color: 'primary.main', bgcolor: alpha(theme.palette.primary.main, 0.06) }
                  }}
                >
                  {t('profile:actions.exportBackup', 'Export Backup (.md)')}
                </Button>
              </Tooltip>
            )}
          </Box>

          <Button
            variant="contained"
            color="primary"
            endIcon={<ArrowForwardRoundedIcon />}
            onClick={onNextStep}
            sx={{ fontWeight: 700, px: 3 }}
          >
            {t('profile:actions.continueToTarget', 'Continue to Target Vacancy (Step 2)')}
          </Button>
        </Paper>
      </Box>
    </Box>
  );
};
