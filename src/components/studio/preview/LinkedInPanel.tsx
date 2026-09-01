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
import { useTranslation } from 'react-i18next';
import { CVData } from '../../../types/cv';
import { LinkedInProfileResult, LinkedInHeadline } from '../../../types/linkedin';
import { AIProviderSettings } from '../../../types/ai';
import { generateLinkedInProfile } from '../../../core/ai-service';
import { useCopyToClipboard } from '../../../hooks/useCopyToClipboard';

export interface LinkedInPanelProps {
  cvData: CVData;
  companyName: string;
  targetRole: string;
  targetJob?: string;
  providerSettings?: AIProviderSettings;
  onClose: () => void;
}

const DEFAULT_SETTINGS_FALLBACK: AIProviderSettings = {
  provider: 'gemini',
  apiKey: '',
  model: 'gemini-1.5-flash',
  temperature: 0.2,
};


export const LinkedInPanel: React.FC<LinkedInPanelProps> = ({
  cvData,
  companyName,
  targetRole,
  targetJob = '',
  providerSettings,
  onClose,
}) => {
  const { t } = useTranslation(['preview', 'common']);
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const { copy } = useCopyToClipboard();

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
        providerSettings || DEFAULT_SETTINGS_FALLBACK
      );
      setData(res);
      setAboutText(res.about.text);
    } catch (err) {
      console.error('Failed to generate LinkedIn profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (text: string, id: string, label: string) => {
    await copy(text);
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
            {/* Headlines */}
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                  {t('preview:linkedin.headlinesTitle', 'High-Impact Headlines')}
                </Typography>
                <Chip size="small" label={`${data.headlines.length} variants`} variant="outlined" sx={{ fontSize: '0.7rem' }} />
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {data.headlines.map((hl: LinkedInHeadline, idx: number) => {
                  const id = `headline-${idx}`;
                  const isCopied = copiedId === id;
                  return (
                    <Paper
                      key={idx}
                      variant="outlined"
                      sx={{
                        p: 1.75,
                        borderRadius: '12px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          borderColor: 'primary.main',
                          boxShadow: isDark ? '0 4px 12px rgba(0,0,0,0.3)' : '0 4px 12px rgba(0,0,0,0.05)',
                        },
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Chip
                          size="small"
                          label={hl.style}
                          color={idx === 0 ? 'primary' : 'default'}
                          sx={{ fontWeight: 700, fontSize: '0.72rem' }}
                        />
                        <Tooltip title={isCopied ? t('common:actions.copied', 'Copied!') : t('common:actions.copy', 'Copy Headline')}>
                          <IconButton
                            size="small"
                            onClick={() => handleCopy(hl.text, id, `Headline (${hl.style})`)}
                            color={isCopied ? 'success' : 'default'}
                          >
                            {isCopied ? <CheckCircleRoundedIcon fontSize="small" /> : <ContentCopyRoundedIcon fontSize="small" />}
                          </IconButton>
                        </Tooltip>
                      </Box>
                      <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.4 }}>
                        {hl.text}
                      </Typography>
                    </Paper>
                  );
                })}
              </Box>
            </Box>

            {/* Storytelling About */}
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                  {t('preview:linkedin.aboutTitle', 'Storytelling "About" Section')}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    size="small"
                    variant="text"
                    startIcon={<EditRoundedIcon />}
                    onClick={() => setIsEditingAbout(!isEditingAbout)}
                    sx={{ fontSize: '0.75rem', textTransform: 'none' }}
                  >
                    {isEditingAbout ? t('common:actions.preview', 'Preview') : t('common:actions.edit', 'Edit')}
                  </Button>
                  <Tooltip title={copiedId === 'about' ? t('common:actions.copied', 'Copied!') : t('common:actions.copy', 'Copy About')}>
                    <IconButton
                      size="small"
                      color={copiedId === 'about' ? 'success' : 'default'}
                      onClick={() => handleCopy(aboutText, 'about', 'About Section')}
                    >
                      {copiedId === 'about' ? <CheckCircleRoundedIcon fontSize="small" /> : <ContentCopyRoundedIcon fontSize="small" />}
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>

              {isEditingAbout ? (
                <textarea
                  value={aboutText}
                  onChange={(e) => setAboutText(e.target.value)}
                  style={{
                    width: '100%',
                    minHeight: 220,
                    padding: '12px',
                    borderRadius: '12px',
                    border: `1px solid ${theme.palette.divider}`,
                    backgroundColor: isDark ? 'rgba(0,0,0,0.2)' : '#ffffff',
                    color: 'inherit',
                    fontFamily: 'inherit',
                    fontSize: '0.85rem',
                    lineHeight: 1.6,
                    resize: 'vertical',
                    boxSizing: 'border-box',
                  }}
                />
              ) : (
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    borderRadius: '12px',
                    bgcolor: isDark ? 'rgba(255,255,255,0.02)' : '#fafafa',
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      whiteSpace: 'pre-line',
                      lineHeight: 1.65,
                      color: 'text.secondary',
                      fontSize: '0.85rem',
                    }}
                  >
                    {aboutText}
                  </Typography>
                </Paper>
              )}
            </Box>
          </>
        ) : null}
      </Box>

      {/* Footer Regenerate lever */}
      <Box sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}`, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
        <Button
          variant="outlined"
          color="primary"
          size="small"
          startIcon={<RefreshRoundedIcon />}
          onClick={handleGenerate}
          disabled={loading}
          sx={{ fontWeight: 700, fontSize: '0.78rem' }}
        >
          {t('preview:linkedin.regenerate', 'Regenerate LinkedIn Package')}
        </Button>
      </Box>

      {/* Snackbar notification */}
      <Snackbar
        open={Boolean(snackbar)}
        autoHideDuration={3000}
        onClose={() => setSnackbar(null)}
        message={snackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
};
