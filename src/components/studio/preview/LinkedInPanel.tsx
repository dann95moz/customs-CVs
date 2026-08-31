import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Chip,
  IconButton,
  Tooltip,
  CircularProgress,
  Snackbar,
  useTheme,
  alpha,
} from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import LanguageRoundedIcon from '@mui/icons-material/LanguageRounded';
import { useTranslation } from 'react-i18next';
import { CVData } from '../../../types/cv';
import { LinkedInProfileResult, LinkedInHeadline } from '../../../types/linkedin';
import { generateLinkedInProfile } from '../../../core/ai-service';
import { useResumeStore } from '../../../store';

export interface LinkedInPanelProps {
  cvData: CVData;
  companyName: string;
  targetRole: string;
  onClose: () => void;
}

export const LinkedInPanel: React.FC<LinkedInPanelProps> = ({
  cvData,
  companyName,
  targetRole,
  onClose,
}) => {
  const { t } = useTranslation(['preview', 'common']);
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const providerSettings = useResumeStore((s) => s.providerSettings);
  const targetJob = useResumeStore((s) => s.targetJob);

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<LinkedInProfileResult | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isEditingAbout, setIsEditingAbout] = useState(false);
  const [aboutText, setAboutText] = useState('');
  const [snackbar, setSnackbar] = useState<string | null>(null);

  useEffect(() => {
    handleGenerate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyName, targetRole]);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await generateLinkedInProfile(
        cvData,
        targetJob,
        companyName,
        targetRole,
        providerSettings
      );
      setData(res);
      setAboutText(res.about.text);
    } catch (err) {
      console.error('Failed to generate LinkedIn profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, id: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setSnackbar(t('preview:linkedin.copiedToast', '{{label}} copied to clipboard!', { label }));
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', boxSizing: 'border-box' }}>
      {/* Header */}
      <Box
        sx={{
          p: 2,
          borderBottom: `1px solid ${theme.palette.divider}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          bgcolor: isDark ? alpha(theme.palette.background.default, 0.5) : '#f8fafc',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: '8px',
              bgcolor: '#0a66c2',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 900,
              fontSize: '1rem',
            }}
          >
            in
          </Box>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
              {t('preview:linkedin.title', 'LinkedIn Brand Tailoring')}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {t('preview:linkedin.subtitle', 'Optimized Headlines & Storytelling About')}
            </Typography>
          </Box>
        </Box>

        <IconButton size="small" onClick={onClose} aria-label="Close LinkedIn panel">
          <CloseRoundedIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Content Body */}
      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 3, flex: 1, overflowY: 'auto' }}>
        {loading ? (
          <Box sx={{ py: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
            <CircularProgress size={36} color="primary" />
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
              {t('preview:linkedin.generating', 'Generating optimized LinkedIn profile package...')}
            </Typography>
          </Box>
        ) : data ? (
          <>
            {/* SECTION 1: HEADLINES */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, fontSize: '0.86rem' }}>
                  {t('preview:linkedin.headlinesTitle', '1. Optimized Headlines (Max 220 Chars)')}
                </Typography>
                <Chip
                  size="small"
                  label={t('preview:linkedin.recruiterReady', 'Recruiter Ready')}
                  color="primary"
                  variant="outlined"
                  sx={{ fontSize: '0.68rem', fontWeight: 700 }}
                />
              </Box>

              {data.headlines.map((hl) => {
                const isOver = hl.charCount > 220;
                const isCopied = copiedId === hl.id;

                return (
                  <Paper
                    key={hl.id}
                    variant="outlined"
                    sx={{
                      p: 1.75,
                      borderRadius: '12px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 1.25,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        borderColor: 'primary.main',
                        bgcolor: isDark ? alpha(theme.palette.primary.main, 0.04) : '#f8fafc',
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        {hl.title}
                      </Typography>
                      <Chip
                        size="small"
                        label={`${hl.charCount}/220`}
                        color={isOver ? 'error' : 'success'}
                        variant="filled"
                        sx={{ height: 20, fontSize: '0.66rem', fontWeight: 800 }}
                      />
                    </Box>

                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary', lineHeight: 1.5 }}>
                      {hl.text}
                    </Typography>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <Button
                        size="small"
                        variant={isCopied ? 'contained' : 'outlined'}
                        color={isCopied ? 'success' : 'primary'}
                        startIcon={isCopied ? <CheckCircleRoundedIcon /> : <ContentCopyRoundedIcon />}
                        onClick={() => handleCopy(hl.text, hl.id, hl.title)}
                        sx={{ fontSize: '0.74rem', textTransform: 'none', py: 0.4, px: 1.25 }}
                      >
                        {isCopied ? t('common:actions.copied', 'Copied!') : t('common:actions.copy', 'Copy Headline')}
                      </Button>
                    </Box>
                  </Paper>
                );
              })}
            </Box>

            {/* SECTION 2: ABOUT SUMMARY */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, fontSize: '0.86rem' }}>
                  {t('preview:linkedin.aboutTitle', "2. Storytelling 'About' Section (Max 2,600 Chars)")}
                </Typography>
                <Chip
                  size="small"
                  label={`${aboutText.length}/2600`}
                  color={aboutText.length > 2600 ? 'error' : 'success'}
                  variant="outlined"
                  sx={{ fontSize: '0.68rem', fontWeight: 800 }}
                />
              </Box>

              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  borderRadius: '12px',
                  bgcolor: isDark ? alpha(theme.palette.background.default, 0.4) : '#ffffff',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1.5,
                }}
              >
                {isEditingAbout ? (
                  <textarea
                    value={aboutText}
                    onChange={(e) => setAboutText(e.target.value)}
                    style={{
                      width: '100%',
                      minHeight: 280,
                      borderRadius: '8px',
                      border: `1px solid ${theme.palette.divider}`,
                      padding: '12px',
                      fontFamily: 'inherit',
                      fontSize: '0.86rem',
                      lineHeight: 1.6,
                      color: theme.palette.text.primary,
                      backgroundColor: 'transparent',
                      outline: 'none',
                      resize: 'vertical',
                      boxSizing: 'border-box',
                    }}
                  />
                ) : (
                  <Typography
                    variant="body2"
                    sx={{
                      whiteSpace: 'pre-line',
                      color: 'text.primary',
                      lineHeight: 1.65,
                      fontSize: '0.86rem',
                    }}
                  >
                    {aboutText}
                  </Typography>
                )}

                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pt: 1, borderTop: `1px solid ${theme.palette.divider}` }}>
                  <Button
                    size="small"
                    variant="text"
                    startIcon={<EditRoundedIcon />}
                    onClick={() => setIsEditingAbout((prev) => !prev)}
                    sx={{ fontSize: '0.74rem', textTransform: 'none' }}
                  >
                    {isEditingAbout ? t('common:actions.save', 'Save Edits') : t('common:actions.edit', 'Edit Text')}
                  </Button>

                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={copiedId === 'about' ? <CheckCircleRoundedIcon /> : <ContentCopyRoundedIcon />}
                    color={copiedId === 'about' ? 'success' : 'primary'}
                    onClick={() => handleCopy(aboutText, 'about', "LinkedIn 'About' section")}
                    sx={{ fontSize: '0.74rem', textTransform: 'none' }}
                  >
                    {copiedId === 'about' ? t('common:actions.copied', 'Copied!') : t('preview:linkedin.copyAbout', "Copy 'About' Text")}
                  </Button>
                </Box>
              </Paper>
            </Box>

            {/* Bottom Regeneration Action */}
            <Button
              fullWidth
              variant="outlined"
              color="primary"
              startIcon={<RefreshRoundedIcon />}
              onClick={handleGenerate}
              sx={{ textTransform: 'none', fontWeight: 700, py: 1 }}
            >
              {t('preview:linkedin.regenerate', 'Regenerate LinkedIn Package')}
            </Button>
          </>
        ) : null}
      </Box>

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
