import React, { useState, useMemo } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  ButtonGroup,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Tooltip,
  Paper,
  Snackbar,
  useTheme,
  alpha,
} from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import CompareArrowsRoundedIcon from '@mui/icons-material/CompareArrowsRounded';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import DifferenceRoundedIcon from '@mui/icons-material/DifferenceRounded';
import ViewColumnRoundedIcon from '@mui/icons-material/ViewColumnRounded';
import ViewAgendaRoundedIcon from '@mui/icons-material/ViewAgendaRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import { useTranslation } from 'react-i18next';
import { useResumeStore } from '../../../store';
import { computeLineDiff } from '../../../utils/diffUtils';

export interface VersionDiffModalProps {
  open: boolean;
  onClose: () => void;
  initialVersionAId?: string;
  initialVersionBId?: string;
}

export const VersionDiffModal: React.FC<VersionDiffModalProps> = ({
  open,
  onClose,
  initialVersionAId,
  initialVersionBId,
}) => {
  const { t } = useTranslation(['history', 'common']);
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const masterData = useResumeStore((s) => s.masterData);
  const cvMarkdown = useResumeStore((s) => s.cvMarkdown);
  const savedVersions = useResumeStore((s) => s.savedVersions || []);
  const handleLoadVersion = useResumeStore((s) => s.handleLoadVersion);
  const setWizardStep = useResumeStore((s) => s.setWizardStep);

  const [versionAId, setVersionAId] = useState<string>(() => initialVersionAId || 'master');
  const [versionBId, setVersionBId] = useState<string>(() => {
    if (initialVersionBId) return initialVersionBId;
    if (savedVersions.length > 0) return savedVersions[0].id;
    return 'current';
  });

  const [viewMode, setViewMode] = useState<'unified' | 'split'>('unified');
  const [snackbar, setSnackbar] = useState<string | null>(null);

  // Helper to resolve markdown content by ID
  const getVersionText = (id: string): { label: string; text: string } => {
    if (id === 'master') {
      return { label: t('history:diff.masterCv', 'Master Profile (SSOT)'), text: masterData };
    }
    if (id === 'current') {
      return { label: t('history:diff.currentTailored', 'Current Tailored CV (Editor)'), text: cvMarkdown };
    }
    const found = savedVersions.find((v) => v.id === id);
    if (found) {
      const company = found.companyName || 'General';
      const role = found.targetRole ? ` • ${found.targetRole}` : '';
      const date = new Date(found.createdAt).toLocaleDateString();
      return { label: `${company}${role} (${date})`, text: found.cvMarkdown };
    }
    return { label: 'Unknown Version', text: '' };
  };

  const verA = useMemo(() => getVersionText(versionAId), [versionAId, masterData, savedVersions]);
  const verB = useMemo(() => getVersionText(versionBId), [versionBId, cvMarkdown, savedVersions]);

  // Compute diff
  const diffResult = useMemo(() => {
    return computeLineDiff(verA.text, verB.text);
  }, [verA.text, verB.text]);

  const handleCopyDiff = () => {
    const rawDiff = diffResult.lines
      .map((l) => `${l.type === 'added' ? '+ ' : l.type === 'removed' ? '- ' : '  '}${l.content}`)
      .join('\n');
    navigator.clipboard.writeText(rawDiff);
    setSnackbar(t('common:actions.copied', 'Copied to clipboard!'));
  };

  const handleLoadVersionB = () => {
    if (versionBId === 'master') {
      useResumeStore.getState().setCvMarkdown(masterData);
    } else if (versionBId !== 'current') {
      handleLoadVersion(versionBId);
    }
    setWizardStep('preview');
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: '16px',
            bgcolor: 'background.paper',
            height: '88vh',
            display: 'flex',
            flexDirection: 'column',
          },
        },
      }}
    >
      {/* Modal Header */}
      <DialogTitle
        sx={{
          p: 2,
          px: 3,
          borderBottom: `1px solid ${theme.palette.divider}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          bgcolor: isDark ? alpha(theme.palette.background.default, 0.6) : '#f8fafc',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: '10px',
              bgcolor: alpha(theme.palette.primary.main, 0.15),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'primary.main',
            }}
          >
            <DifferenceRoundedIcon />
          </Box>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
              {t('history:diff.title', 'Visual Version Diff Comparator')}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {t('history:diff.subtitle', 'Compare tailored variants side-by-side or unified')}
            </Typography>
          </Box>
        </Box>

        <IconButton size="small" onClick={onClose} aria-label="Close diff modal">
          <CloseRoundedIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      {/* Version Selector & Mode Controls Bar */}
      <Box
        sx={{
          p: 2,
          px: 3,
          bgcolor: isDark ? 'background.default' : '#f1f5f9',
          borderBottom: `1px solid ${theme.palette.divider}`,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'stretch', md: 'center' },
          justifyContent: 'space-between',
          gap: 2,
        }}
      >
        {/* Selectors for Version A vs Version B */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1, flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, flex: 1, minWidth: 200 }}>
            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>
              {t('history:diff.baseVersion', 'Base Version (Original):')}
            </Typography>
            <Select
              size="small"
              value={versionAId}
              onChange={(e) => setVersionAId(e.target.value)}
              sx={{ fontSize: '0.82rem', fontWeight: 600, bgcolor: 'background.paper', borderRadius: '8px' }}
            >
              <MenuItem value="master">{t('history:diff.masterCv', 'Master Profile (SSOT)')}</MenuItem>
              <MenuItem value="current">{t('history:diff.currentTailored', 'Current Tailored CV')}</MenuItem>
              {savedVersions.map((v) => (
                <MenuItem key={v.id} value={v.id}>
                  {v.companyName || 'General'} {v.targetRole ? `(${v.targetRole})` : ''} - {new Date(v.createdAt).toLocaleDateString()}
                </MenuItem>
              ))}
            </Select>
          </Box>

          <CompareArrowsRoundedIcon sx={{ color: 'text.secondary', display: { xs: 'none', md: 'block' }, mt: 2 }} />

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, flex: 1, minWidth: 200 }}>
            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>
              {t('history:diff.targetVersion', 'Compare Target (Tailored):')}
            </Typography>
            <Select
              size="small"
              value={versionBId}
              onChange={(e) => setVersionBId(e.target.value)}
              sx={{ fontSize: '0.82rem', fontWeight: 600, bgcolor: 'background.paper', borderRadius: '8px' }}
            >
              <MenuItem value="current">{t('history:diff.currentTailored', 'Current Tailored CV')}</MenuItem>
              <MenuItem value="master">{t('history:diff.masterCv', 'Master Profile (SSOT)')}</MenuItem>
              {savedVersions.map((v) => (
                <MenuItem key={v.id} value={v.id}>
                  {v.companyName || 'General'} {v.targetRole ? `(${v.targetRole})` : ''} - {new Date(v.createdAt).toLocaleDateString()}
                </MenuItem>
              ))}
            </Select>
          </Box>
        </Box>

        {/* View Mode Toggle: Unified vs Split */}
        <ButtonGroup size="small" variant="outlined" sx={{ alignSelf: { xs: 'flex-start', md: 'center' }, mt: { xs: 1, md: 2 } }}>
          <Button
            variant={viewMode === 'unified' ? 'contained' : 'outlined'}
            onClick={() => setViewMode('unified')}
            startIcon={<ViewAgendaRoundedIcon sx={{ fontSize: 15 }} />}
            sx={{ textTransform: 'none', fontWeight: 700, fontSize: '0.75rem' }}
          >
            {t('history:diff.unified', 'Unified Diff')}
          </Button>
          <Button
            variant={viewMode === 'split' ? 'contained' : 'outlined'}
            onClick={() => setViewMode('split')}
            startIcon={<ViewColumnRoundedIcon sx={{ fontSize: 15 }} />}
            sx={{ textTransform: 'none', fontWeight: 700, fontSize: '0.75rem' }}
          >
            {t('history:diff.split', 'Side-by-Side')}
          </Button>
        </ButtonGroup>
      </Box>

      {/* Stats Summary Bar */}
      <Box
        sx={{
          py: 1,
          px: 3,
          bgcolor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
          borderBottom: `1px solid ${theme.palette.divider}`,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          flexWrap: 'wrap',
        }}
      >
        <Chip
          size="small"
          label={`+${diffResult.stats.additions} ${t('history:diff.additions', 'Additions')}`}
          color="success"
          variant="filled"
          sx={{ fontWeight: 800, fontSize: '0.72rem' }}
        />
        <Chip
          size="small"
          label={`-${diffResult.stats.deletions} ${t('history:diff.deletions', 'Deletions')}`}
          color="error"
          variant="filled"
          sx={{ fontWeight: 800, fontSize: '0.72rem' }}
        />
        <Chip
          size="small"
          label={`${diffResult.stats.similarity}% ${t('history:diff.similarity', 'Match Similarity')}`}
          color="primary"
          variant="outlined"
          sx={{ fontWeight: 800, fontSize: '0.72rem' }}
        />
        {diffResult.stats.metricsCount > 0 && (
          <Chip
            size="small"
            label={`${diffResult.stats.metricsCount} ${t('history:diff.metricsEnhanced', 'Metrics Enhanced')}`}
            color="secondary"
            variant="outlined"
            sx={{ fontWeight: 800, fontSize: '0.72rem' }}
          />
        )}
      </Box>

      {/* Main Diff Code Display */}
      <DialogContent sx={{ p: 0, flex: 1, overflowY: 'auto', bgcolor: isDark ? '#0f172a' : '#ffffff' }}>
        {viewMode === 'unified' ? (
          /* UNIFIED DIFF VIEW */
          <Box sx={{ fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace", fontSize: '0.82rem', lineHeight: 1.6 }}>
            {diffResult.lines.map((line, idx) => {
              const isAdded = line.type === 'added';
              const isRemoved = line.type === 'removed';

              let bg = 'transparent';
              let color = isDark ? '#cbd5e1' : '#334155';
              let prefix = '  ';

              if (isAdded) {
                bg = isDark ? 'rgba(34, 197, 94, 0.18)' : 'rgba(34, 197, 94, 0.12)';
                color = isDark ? '#86efac' : '#15803d';
                prefix = '+ ';
              } else if (isRemoved) {
                bg = isDark ? 'rgba(239, 68, 68, 0.18)' : 'rgba(239, 68, 68, 0.1)';
                color = isDark ? '#fca5a5' : '#b91c1c';
                prefix = '- ';
              }

              return (
                <Box
                  key={idx}
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    bgcolor: bg,
                    color: color,
                    px: 2,
                    py: 0.25,
                    borderLeft: isAdded ? '3px solid #22c55e' : isRemoved ? '3px solid #ef4444' : '3px solid transparent',
                    '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' },
                  }}
                >
                  <Typography
                    component="span"
                    sx={{
                      width: 44,
                      userSelect: 'none',
                      color: isDark ? '#64748b' : '#94a3b8',
                      fontSize: '0.72rem',
                      textAlign: 'right',
                      pr: 2,
                      flexShrink: 0,
                    }}
                  >
                    {line.newLineNumber || line.oldLineNumber || ''}
                  </Typography>
                  <Typography
                    component="span"
                    sx={{
                      fontWeight: 700,
                      width: 20,
                      userSelect: 'none',
                      color: isAdded ? '#22c55e' : isRemoved ? '#ef4444' : '#94a3b8',
                      flexShrink: 0,
                    }}
                  >
                    {prefix}
                  </Typography>
                  <Typography component="span" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', flex: 1, fontFamily: 'inherit' }}>
                    {line.content || ' '}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        ) : (
          /* SIDE-BY-SIDE SPLIT VIEW */
          <Box sx={{ display: 'flex', height: '100%', minHeight: 400 }}>
            {/* Left Column: Version A */}
            <Box sx={{ flex: 1, borderRight: `1px solid ${theme.palette.divider}`, p: 2, overflowY: 'auto' }}>
              <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', mb: 1, display: 'block' }}>
                {verA.label}
              </Typography>
              <Box sx={{ fontFamily: "'JetBrains Mono', Consolas, monospace", fontSize: '0.8rem', whiteSpace: 'pre-wrap' }}>
                {verA.text}
              </Box>
            </Box>

            {/* Right Column: Version B */}
            <Box sx={{ flex: 1, p: 2, overflowY: 'auto' }}>
              <Typography variant="caption" sx={{ fontWeight: 800, color: 'primary.main', textTransform: 'uppercase', mb: 1, display: 'block' }}>
                {verB.label}
              </Typography>
              <Box sx={{ fontFamily: "'JetBrains Mono', Consolas, monospace", fontSize: '0.8rem', whiteSpace: 'pre-wrap' }}>
                {verB.text}
              </Box>
            </Box>
          </Box>
        )}
      </DialogContent>

      {/* Footer Actions */}
      <DialogActions sx={{ p: 2, px: 3, justifyContent: 'space-between', borderTop: `1px solid ${theme.palette.divider}` }}>
        <Button
          size="small"
          variant="outlined"
          startIcon={<ContentCopyRoundedIcon />}
          onClick={handleCopyDiff}
          sx={{ fontWeight: 600, textTransform: 'none' }}
        >
          {t('history:diff.copyDiff', 'Copy Raw Diff')}
        </Button>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Button size="small" variant="text" onClick={onClose}>
            {t('common:actions.close', 'Close')}
          </Button>

          <Button
            size="small"
            variant="contained"
            color="primary"
            endIcon={<ArrowForwardRoundedIcon />}
            onClick={handleLoadVersionB}
            sx={{ fontWeight: 700, textTransform: 'none', px: 2 }}
          >
            {t('history:diff.openInEditor', 'Load Version into Editor')}
          </Button>
        </Box>
      </DialogActions>

      {/* Toast Feedback */}
      <Snackbar
        open={Boolean(snackbar)}
        autoHideDuration={2500}
        onClose={() => setSnackbar(null)}
        message={snackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Dialog>
  );
};
