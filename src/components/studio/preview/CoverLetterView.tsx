import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  ButtonGroup,
  Chip,
  CircularProgress,
  Tooltip,
  Snackbar,
  useTheme,
  alpha,
} from '@mui/material';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import PictureAsPdfRoundedIcon from '@mui/icons-material/PictureAsPdfRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import BusinessRoundedIcon from '@mui/icons-material/BusinessRounded';
import { useTranslation } from 'react-i18next';
import { marked } from 'marked';
import { CVData, ThemeId, PaletteId, FontFamilyId } from '../../../types/cv';
import { useResumeStore } from '../../../store';
import { generateCoverLetter } from '../../../core/ai-service';
import { getPaletteConfig } from '../../../constants/palettes';

const FONT_MAP: Record<FontFamilyId, string> = {
  inter: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  outfit: "'Outfit', 'Plus Jakarta Sans', -apple-system, sans-serif",
  serif: "'Merriweather', 'EB Garamond', Georgia, serif",
  mono: "'JetBrains Mono', Consolas, Monaco, monospace",
};

export interface CoverLetterViewProps {
  cvData: CVData;
  companyName: string;
  targetRole: string;
  themeId: ThemeId;
  paletteId: PaletteId;
  customColor?: string;
  fontFamily: FontFamilyId;
  onExportPdf?: () => void;
}

export const CoverLetterView: React.FC<CoverLetterViewProps> = ({
  cvData,
  companyName,
  targetRole,
  themeId,
  paletteId,
  customColor,
  fontFamily,
  onExportPdf,
}) => {
  const { t } = useTranslation(['preview', 'common']);
  const muiTheme = useTheme();
  const isDark = muiTheme.palette.mode === 'dark';

  const providerSettings = useResumeStore((s) => s.providerSettings);
  const targetJob = useResumeStore((s) => s.targetJob);
  const coverLetterMarkdown = useResumeStore((s) => s.coverLetterMarkdown);
  const setCoverLetterMarkdown = useResumeStore((s) => s.setCoverLetterMarkdown);
  const coverLetterTone = useResumeStore((s) => s.coverLetterTone);
  const setCoverLetterTone = useResumeStore((s) => s.setCoverLetterTone);

  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [snackbar, setSnackbar] = useState<string | null>(null);

  const palette = getPaletteConfig(paletteId, customColor);
  const primaryColor = palette.primaryColor;
  const fontCss = FONT_MAP[fontFamily] || FONT_MAP.inter;

  // Generate initial cover letter if empty
  useEffect(() => {
    if (!coverLetterMarkdown || coverLetterMarkdown.trim().length === 0) {
      handleGenerateLetter(coverLetterTone);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyName, targetRole]);

  const handleGenerateLetter = async (tone: typeof coverLetterTone) => {
    setLoading(true);
    try {
      const generated = await generateCoverLetter(
        cvData,
        targetJob,
        companyName,
        targetRole,
        tone,
        providerSettings
      );
      setCoverLetterMarkdown(generated);
      setSnackbar(t('preview:coverLetter.generatedSuccess', 'Cover letter generated successfully!'));
    } catch (err) {
      console.error('Failed to generate cover letter:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToneChange = (tone: typeof coverLetterTone) => {
    setCoverLetterTone(tone);
    handleGenerateLetter(tone);
  };

  const handleCopyMarkdown = () => {
    if (!coverLetterMarkdown) return;
    navigator.clipboard.writeText(coverLetterMarkdown);
    setSnackbar(t('common:actions.copied', 'Copied to clipboard!'));
  };

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date());

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2.5, width: '100%', py: 2 }}>
      {/* Top Floating Action Controls */}
      <Paper
        elevation={2}
        className="no-print"
        sx={{
          p: 1.5,
          px: 2.5,
          borderRadius: '16px',
          bgcolor: 'background.paper',
          border: `1px solid ${muiTheme.palette.divider}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 1.5,
          width: '100%',
          maxWidth: 794,
          boxSizing: 'border-box',
        }}
      >
        {/* Tone Selector Pills */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
          <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 0.5 }}>
            {t('preview:coverLetter.tone', 'Tone')}:
          </Typography>
          <ButtonGroup size="small" variant="outlined" sx={{ borderRadius: '999px', p: 0.25, bgcolor: alpha(muiTheme.palette.primary.main, 0.05) }}>
            <Button
              variant={coverLetterTone === 'corporate' ? 'contained' : 'text'}
              onClick={() => handleToneChange('corporate')}
              disabled={loading}
              sx={{ borderRadius: '999px !important', fontWeight: 700, fontSize: '0.72rem', textTransform: 'none', px: 1.5 }}
            >
              {t('preview:coverLetter.corporate', 'Corporate')}
            </Button>
            <Button
              variant={coverLetterTone === 'startup' ? 'contained' : 'text'}
              onClick={() => handleToneChange('startup')}
              disabled={loading}
              sx={{ borderRadius: '999px !important', fontWeight: 700, fontSize: '0.72rem', textTransform: 'none', px: 1.5 }}
            >
              {t('preview:coverLetter.startup', 'Startup / Direct')}
            </Button>
            <Button
              variant={coverLetterTone === 'leadership' ? 'contained' : 'text'}
              onClick={() => handleToneChange('leadership')}
              disabled={loading}
              sx={{ borderRadius: '999px !important', fontWeight: 700, fontSize: '0.72rem', textTransform: 'none', px: 1.5 }}
            >
              {t('preview:coverLetter.leadership', 'Leadership')}
            </Button>
          </ButtonGroup>
        </Box>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button
            size="small"
            variant="outlined"
            startIcon={isEditing ? <VisibilityRoundedIcon /> : <EditNoteRoundedIcon />}
            onClick={() => setIsEditing((prev) => !prev)}
            sx={{ fontWeight: 600, fontSize: '0.75rem' }}
          >
            {isEditing ? t('preview:coverLetter.viewMode', 'Preview') : t('preview:coverLetter.editMode', 'Edit')}
          </Button>

          <Button
            size="small"
            variant="outlined"
            startIcon={loading ? <CircularProgress size={14} color="inherit" /> : <RefreshRoundedIcon />}
            onClick={() => handleGenerateLetter(coverLetterTone)}
            disabled={loading}
            sx={{ fontWeight: 600, fontSize: '0.75rem' }}
          >
            {t('preview:coverLetter.regenerate', 'Regenerate')}
          </Button>

          <Button
            size="small"
            variant="outlined"
            startIcon={<ContentCopyRoundedIcon />}
            onClick={handleCopyMarkdown}
            sx={{ fontWeight: 600, fontSize: '0.75rem' }}
          >
            {t('common:actions.copy', 'Copy')}
          </Button>

          <Button
            size="small"
            variant="contained"
            color="primary"
            startIcon={<PictureAsPdfRoundedIcon />}
            onClick={onExportPdf}
            sx={{ fontWeight: 700, fontSize: '0.75rem' }}
          >
            {t('preview:toolbar.pdf', 'Print / PDF')}
          </Button>
        </Box>
      </Paper>

      {/* A4 Letter Canvas Sheet */}
      <Paper
        id="cv-print-target"
        elevation={6}
        sx={{
          width: '100%',
          maxWidth: 794,
          minHeight: 1123,
          p: { xs: 4, sm: 6, md: 7 },
          bgcolor: '#ffffff',
          color: '#0f172a',
          boxSizing: 'border-box',
          position: 'relative',
          fontFamily: fontCss,
          lineHeight: 1.7,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <Box>
          {/* Header Section: Candidate Identity */}
          <Box sx={{ borderBottom: `2.5px solid ${primaryColor}`, pb: 2.5, mb: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 900, color: primaryColor, letterSpacing: -0.5, lineHeight: 1.1, mb: 0.5 }}>
              {cvData.name || 'Candidate Full Name'}
            </Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#475569', mb: 1.5 }}>
              {cvData.title || 'Professional Title / Specialization'}
            </Typography>

            {/* Contact details row */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, fontSize: '0.84rem', color: '#64748b' }}>
              {cvData.contacts?.map((contact, i) => (
                <span key={i}>
                  {contact.label}
                  {i < (cvData.contacts?.length || 0) - 1 ? ' • ' : ''}
                </span>
              ))}
            </Box>
          </Box>

          {/* Date & Recipient Block */}
          <Box sx={{ mb: 4, fontSize: '0.9rem', color: '#334155' }}>
            <Typography sx={{ fontWeight: 600, mb: 1 }}>{formattedDate}</Typography>
            <Typography sx={{ fontWeight: 700, color: primaryColor }}>
              Hiring Team & Leadership
            </Typography>
            <Typography sx={{ fontWeight: 600 }}>{companyName || 'Target Company'}</Typography>
            {targetRole && (
              <Typography sx={{ color: '#64748b', fontStyle: 'italic', fontSize: '0.85rem' }}>
                Re: Application for {targetRole}
              </Typography>
            )}
          </Box>

          {/* Letter Body: Rendered Markdown or Editable Textarea */}
          {loading ? (
            <Box sx={{ py: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
              <CircularProgress size={36} sx={{ color: primaryColor }} />
              <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
                {t('preview:coverLetter.crafting', 'Crafting high-impact tailored cover letter...')}
              </Typography>
            </Box>
          ) : isEditing ? (
            <textarea
              value={coverLetterMarkdown}
              onChange={(e) => setCoverLetterMarkdown(e.target.value)}
              style={{
                width: '100%',
                minHeight: 450,
                border: `1.5px solid ${alpha(primaryColor, 0.4)}`,
                borderRadius: '8px',
                padding: '16px',
                fontFamily: fontCss,
                fontSize: '0.94rem',
                lineHeight: 1.7,
                color: '#0f172a',
                backgroundColor: '#f8fafc',
                outline: 'none',
                resize: 'vertical',
                boxSizing: 'border-box',
              }}
            />
          ) : (
            <Box
              sx={{
                fontSize: '0.94rem',
                color: '#1e293b',
                lineHeight: 1.75,
                '& p': { mb: 2.2 },
                '& strong': { color: primaryColor, fontWeight: 700 },
              }}
              dangerouslySetInnerHTML={{
                __html: marked.parse(coverLetterMarkdown || '') as string,
              }}
            />
          )}
        </Box>

        {/* Professional Footer Sign-Off */}
        <Box sx={{ pt: 4, borderTop: '1px solid #e2e8f0', mt: 4, fontSize: '0.8rem', color: '#94a3b8', display: 'flex', justifyContent: 'space-between' }}>
          <span>{cvData.name || 'Candidate'} • Application Dossier</span>
          <span>{companyName ? `Tailored for ${companyName}` : 'Confidential'}</span>
        </Box>
      </Paper>

      {/* Snackbar Feedback */}
      <Snackbar
        open={Boolean(snackbar)}
        autoHideDuration={2500}
        onClose={() => setSnackbar(null)}
        message={snackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
};
