import React, { useState } from 'react';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Alert,
  useTheme,
  alpha
} from '@mui/material';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import PictureAsPdfRoundedIcon from '@mui/icons-material/PictureAsPdfRounded';
import CloudUploadRoundedIcon from '@mui/icons-material/CloudUploadRounded';
import FileDownloadRoundedIcon from '@mui/icons-material/FileDownloadRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import ShieldRoundedIcon from '@mui/icons-material/ShieldRounded';
import FormatListBulletedRoundedIcon from '@mui/icons-material/FormatListBulletedRounded';
import CodeRoundedIcon from '@mui/icons-material/CodeRounded';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import { extractCandidateName } from '../../core/parser';
import { useFileUploader } from '../../hooks/useFileUploader';
import { useTranslation } from 'react-i18next';
import { downloadTextFile, buildTimestampedFileName } from '../../utils/fileUtils';
import { StepMasterDataProps } from '../../types';
import { StudioSkeleton } from './StudioSkeleton';
import { PdfImportResult } from '../../core/pdf-extractor';
import { ConfirmDeleteDialog } from './common/ConfirmDeleteDialog';


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
  const [manualText, setManualText] = useState(content);
  const manualTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    setManualText(content);
  }, [content]);

  React.useEffect(() => {
    return () => {
      if (manualTimerRef.current) {
        clearTimeout(manualTimerRef.current);
        manualTimerRef.current = null;
      }
    };
  }, []);

  const flushManual = React.useCallback(() => {
    if (manualTimerRef.current) {
      clearTimeout(manualTimerRef.current);
      manualTimerRef.current = null;
      onChange(manualText);
    }
  }, [manualText, onChange]);

  const handleManualTextChange = (val: string) => {
    setManualText(val);
    if (manualTimerRef.current) {
      clearTimeout(manualTimerRef.current);
    }
    manualTimerRef.current = setTimeout(() => {
      manualTimerRef.current = null;
      onChange(val);
    }, 250);
  };

  const handleManualBlur = () => {
    if (manualTimerRef.current) {
      clearTimeout(manualTimerRef.current);
      manualTimerRef.current = null;
    }
    if (manualText !== content) {
      onChange(manualText);
    }
  };

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showClearConfirmDialog, setShowClearConfirmDialog] = useState(false);
  const [pendingFile, setPendingFile] = useState<{
    content: string;
    fileName: string;
    isPdf?: boolean;
    details?: PdfImportResult;
  } | null>(null);

  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'info' | 'error';
    usedAI?: boolean;
  }>({
    open: false,
    message: '',
    severity: 'success'
  });

  const hasData = Boolean(content && content.trim().length > 20);

  const handleApplyImportedData = (importedText: string, fileName: string, isPdf?: boolean, details?: PdfImportResult) => {
    onChange(importedText);
    const candidateName = extractCandidateName(importedText, fileName.replace(/\.pdf$/i, ''));

    setNotification({
      open: true,
      message: t('profile:status.pdfSuccess', {
        fileName,
        defaultValue: `Successfully imported career profile for ${candidateName} from ${fileName}`
      }),
      severity: 'success',
      usedAI: details?.usedAI
    });
  };

  const handleFileLoaded = (
    loadedContent: string,
    fileName: string,
    isPdf?: boolean,
    details?: PdfImportResult
  ) => {
    if (hasData) {
      setPendingFile({ content: loadedContent, fileName, isPdf, details });
      setShowConfirmDialog(true);
    } else {
      handleApplyImportedData(loadedContent, fileName, isPdf, details);
    }
  };

  const handleConfirmReplace = () => {
    if (pendingFile) {
      handleApplyImportedData(
        pendingFile.content,
        pendingFile.fileName,
        pendingFile.isPdf,
        pendingFile.details
      );
      setPendingFile(null);
    }
    setShowConfirmDialog(false);
  };

  const handleCancelReplace = () => {
    setPendingFile(null);
    setShowConfirmDialog(false);
  };

  const handleConfirmClear = () => {
    onChange('');
    setShowClearConfirmDialog(false);
    setNotification({
      open: true,
      message: t('profile:status.clearedSuccess', 'Career profile cleared. You can start from a blank slate.'),
      severity: 'info'
    });
  };

  const {
    fileInputRef,
    isProcessing,
    isDragging,
    handleFileUpload,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    openFileDialog
  } = useFileUploader({
    onFileLoaded: handleFileLoaded,
    onError: (err) => {
      setNotification({
        open: true,
        message: err.message || 'Error processing uploaded file',
        severity: 'error'
      });
    }
  });

  const handleDownload = () => {
    const candidateName = extractCandidateName(content, '');
    const baseName = candidateName ? `master-profile_${candidateName.replace(/\s+/g, '_')}` : 'master-profile';
    const fileName = buildTimestampedFileName(baseName, 'md');
    downloadTextFile(content, fileName);
  };

  return (
    <Box
      sx={{
        flex: 1,
        height: '100%',
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch',
        p: { xs: 1.5, sm: 2, md: 3 },
        pb: { xs: 'calc(env(safe-area-inset-bottom, 0px) + 48px)', sm: 5, md: 6 },
        display: 'flex',
        justifyContent: 'center',
        position: 'relative',
        boxSizing: 'border-box',
      }}

      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Full-View Drag Overlay */}
      {isDragging && (
        <Box
          sx={{
            position: 'absolute',
            inset: 12,
            zIndex: 10,
            bgcolor: alpha(theme.palette.primary.main, 0.12),
            backdropFilter: 'blur(8px)',
            border: `2px dashed ${theme.palette.primary.main}`,
            borderRadius: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
            pointerEvents: 'none',
          }}
        >
          <PictureAsPdfRoundedIcon sx={{ fontSize: 56, color: 'primary.main', animation: 'pulse 1.5s infinite' }} />
          <Typography variant="h5" sx={{ fontWeight: 800, color: 'primary.main' }}>
            {t('profile:dropzone.dropToImport', 'Drop your PDF, .md or .txt file here to import')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('profile:subtitle', 'We will automatically extract your contact info, experience, and technical skills.')}
          </Typography>
        </Box>
      )}

      <Box
        sx={{
          width: '100%',
          maxWidth: 1200,
          display: 'flex',
          flexDirection: 'column',
          gap: 2.5,
        }}
      >
        {/* Hidden File Input for .pdf, .md, .txt uploads */}
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          accept=".pdf,.md,.txt,application/pdf,text/plain,text/markdown"
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
            bgcolor: 'background.paper',
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
              {t('profile:title', 'Your Master Career Profile')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('profile:subtitleShort', 'Your master career database. Fill in your achievements below or import directly from an existing PDF or Markdown resume.')}
              {' '}
              <Tooltip
                title={t('common:safeguard.integrityPromise', 'Zero AI Invention: The AI tailors exclusively using achievements explicitly present in this career profile, strictly obeying the Google XYZ formula.')}
                arrow
              >
                <IconButton
                  size="small"
                  aria-label={t('common:safeguard.ariaLabel', 'Career Authenticity Promise')}
                  sx={{
                    p: 0.35,
                    color: theme.palette.success.main,
                    bgcolor: alpha(theme.palette.success.main, 0.08),
                    '&:hover': { bgcolor: alpha(theme.palette.success.main, 0.16) },
                  }}
                >
                  <ShieldRoundedIcon sx={{ fontSize: '0.95rem' }} />
                </IconButton>
              </Tooltip>
            </Typography>
          </Box>

          {/* Unified clean action buttons responsive layout */}
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1}
            sx={{
              width: { xs: '100%', sm: 'auto' },
              alignItems: { xs: 'stretch', sm: 'center' },
              flexShrink: 0,
            }}
          >

            <Button
              variant="contained"
              color="primary"
              size="small"
              startIcon={<CloudUploadRoundedIcon />}
              onClick={openFileDialog}
              disabled={isProcessing}
              sx={{
                fontWeight: 700,
                whiteSpace: 'nowrap',
                width: { xs: '100%', sm: 'auto' },
              }}
            >
              {t('profile:actions.importResume', 'Import Resume (PDF, .md)')}
            </Button>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: { xs: '100%', sm: 'auto' } }}>
              <Button
                variant="outlined"
                size="small"
                startIcon={<RefreshRoundedIcon />}
                onClick={onLoadSample}
                disabled={isProcessing}
                sx={{
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                  flex: { xs: 1, sm: 'initial' },
                  width: { xs: '100%', sm: 'auto' },
                }}
              >
                {t('profile:actions.loadSample', 'Load Sample Profile')}
              </Button>

              {hasData && (
                <Tooltip title={t('profile:actions.clearProfileTip', 'Clear all profile fields and start from a blank slate')}>
                  <IconButton
                    size="small"
                    onClick={() => setShowClearConfirmDialog(true)}
                    disabled={isProcessing}
                    aria-label={t('profile:actions.clearProfile', 'Start from Scratch')}
                    sx={{
                      color: 'text.secondary',
                      border: `1px solid ${theme.palette.divider}`,
                      p: 0.75,
                      flexShrink: 0,
                      '&:hover': {
                        borderColor: theme.palette.error.main,
                        color: theme.palette.error.main,
                        bgcolor: alpha(theme.palette.error.main, 0.08),
                      },
                    }}
                  >
                    <DeleteOutlineRoundedIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          </Stack>
        </Paper>

        {/* Mode Switcher & Dedicated Editor Area */}
        <Paper
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            minHeight: { xs: 'auto', md: 450 },
            overflow: { xs: 'visible', md: 'hidden' },
            border: `1px solid ${theme.palette.divider}`,
            bgcolor: 'background.paper',
            borderRadius: 2,
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
              bgcolor: alpha(theme.palette.text.primary, 0.02),
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <EditNoteRoundedIcon fontSize="small" color="primary" />
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                {editMode === 'markdown'
                  ? t('profile:modes.markdownTitle', 'Freeform Text / Manual Mode')
                  : t('profile:modes.guidedTitle', 'Guided Profile Form')}
              </Typography>
            </Box>

            <ButtonGroup size="small" variant="outlined" sx={{ width: { xs: '100%', sm: 'auto' } }}>
              <Button
                variant={editMode === 'guided' ? 'contained' : 'outlined'}
                startIcon={<FormatListBulletedRoundedIcon />}
                onClick={() => setEditMode('guided')}
                sx={{ fontWeight: 600, fontSize: '0.8rem', flex: { xs: 1, sm: 'initial' }, whiteSpace: 'nowrap' }}
              >
                <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                  {t('profile:modes.guidedAssistant', 'Guided Form')}
                </Box>
                <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>
                  {t('profile:modes.guidedShort', 'Guided')}
                </Box>
              </Button>
              <Button
                variant={editMode === 'markdown' ? 'contained' : 'outlined'}
                startIcon={<CodeRoundedIcon />}
                onClick={() => setEditMode('markdown')}
                sx={{ fontWeight: 600, fontSize: '0.8rem', flex: { xs: 1, sm: 'initial' }, whiteSpace: 'nowrap' }}
              >
                <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                  {t('profile:modes.markdownEditor', 'Manual Mode')}
                </Box>
                <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>
                  {t('profile:modes.markdownShort', 'Manual')}
                </Box>
              </Button>
            </ButtonGroup>
          </Box>

          {editMode === 'guided' ? (
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: { xs: 'auto', md: 520 }, overflow: { xs: 'visible', md: 'hidden' } }}>
              <React.Suspense fallback={<StudioSkeleton variant="guidedForm" />}>
                <GuidedProfileForm markdownContent={content} onChange={onChange} />
              </React.Suspense>
            </Box>
          ) : (


            <Box
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
                value={manualText}
                onChange={(e) => handleManualTextChange(e.target.value)}
                onBlur={handleManualBlur}
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
                  color: theme.palette.text.primary,
                }}
              />
            </Box>
          )}
        </Paper>

        {/* Navigation Footer */}
        <Paper
          sx={{
            p: { xs: 2, sm: 2 },
            px: { xs: 2, sm: 2.5 },
            pb: { xs: 2.5, sm: 2 },
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'stretch', sm: 'center' },
            justifyContent: 'space-between',
            border: `1px solid ${theme.palette.divider}`,
            bgcolor: 'background.paper',
            borderRadius: 2,
            gap: { xs: 1.5, sm: 2 },
            boxShadow: 2,
          }}
        >

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap', justifyContent: { xs: 'center', sm: 'flex-start' } }}>
            {hasData ? (
              <Chip
                icon={<CheckCircleRoundedIcon />}
                label={t('profile:status.ready', 'Career profile ready for tailoring')}
                color="success"
                variant="outlined"
                size="small"
                sx={{ fontWeight: 600 }}
              />
            ) : (
              <Chip
                icon={<InfoRoundedIcon />}
                label={t('profile:status.tipLoadSample', "Tip: Click 'Import from PDF' or 'Load Sample Profile' to start")}
                color="warning"
                variant="outlined"
                size="small"
                sx={{ fontWeight: 600 }}
              />
            )}

            {/* Contextual Backup Export only when there is actual profile data */}
            {hasData && (
              <Tooltip title={t('profile:actions.exportBackupTip', 'Download your career profile as Markdown (.md)')}>

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
            onClick={() => {
              flushManual();
              onNextStep();
            }}
            sx={{
              fontWeight: 700,
              px: 3,
              py: 1.2,
              width: { xs: '100%', sm: 'auto' },
            }}
          >
            {t('profile:actions.continueToTarget', 'Continue to Target Vacancy')}
          </Button>
        </Paper>

        {/* Dedicated End-of-Scroll Safe Spacer (Ensures card ending is 100% visible on mobile) */}
        <Box sx={{ height: { xs: 'calc(env(safe-area-inset-bottom, 0px) + 40px)', sm: 20 }, flexShrink: 0 }} />
      </Box>


      {/* Confirmation Dialog Before Overwriting Existing Profile */}
      <Dialog
        open={showConfirmDialog}
        onClose={handleCancelReplace}
        maxWidth="xs"
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, fontWeight: 800 }}>
          <WarningAmberRoundedIcon color="warning" />
          {t('profile:dialog.confirmReplaceTitle', 'Replace current profile?')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: 'text.secondary', fontSize: '0.92rem' }}>
            {t(
              'profile:dialog.confirmReplaceDesc',
              'Importing this file will overwrite your current career profile data. Are you sure you want to proceed?'
            )}
          </DialogContentText>
          {pendingFile && (
            <Paper
              variant="outlined"
              sx={{
                mt: 2,
                p: 1.5,
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                bgcolor: alpha(theme.palette.text.primary, 0.02),
                borderRadius: 1,
              }}
            >
              {pendingFile.isPdf ? (
                <PictureAsPdfRoundedIcon color="primary" />
              ) : (
                <CodeRoundedIcon color="primary" />
              )}
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  {pendingFile.fileName}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {t('profile:status.importedLocal', '100% Client-Side Local Parser')}
                </Typography>
              </Box>
            </Paper>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCancelReplace} color="inherit" sx={{ fontWeight: 600 }}>
            {t('profile:dialog.cancel', 'Cancel')}
          </Button>
          <Button
            onClick={handleConfirmReplace}
            variant="contained"
            color="primary"
            sx={{ fontWeight: 700 }}
          >
            {t('profile:dialog.confirm', 'Import & Replace')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog Before Starting From Scratch / Clearing Data */}
      <ConfirmDeleteDialog
        open={showClearConfirmDialog}
        onCancel={() => setShowClearConfirmDialog(false)}
        onConfirm={() => {
          setShowClearConfirmDialog(false);
          handleConfirmClear();
        }}
        title={t('profile:dialog.confirmClearTitle', 'Start from scratch?')}
        message={t(
          'profile:dialog.confirmClearDesc',
          'Are you sure you want to clear all profile data? This action cannot be undone.'
        )}
        confirmLabel={t('profile:dialog.confirmClear', 'Confirm')}
        cancelLabel={t('profile:dialog.cancel', 'Cancel')}
      />

      {/* Success / Error Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={notification.severity}
          onClose={() => setNotification((prev) => ({ ...prev, open: false }))}
          sx={{ fontWeight: 600 }}
        >
          {notification.message}
        </Alert>
      </Snackbar>

    </Box>
  );
};
