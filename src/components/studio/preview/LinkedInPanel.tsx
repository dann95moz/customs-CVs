import React from 'react';
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
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import { useTranslation } from 'react-i18next';
import { CVData } from '../../../types/cv';
import { LinkedInHeadline } from '../../../types/linkedin';
import { AIProviderSettings } from '../../../types/ai';
import { useLinkedInWorkflow } from '../../../hooks/useLinkedInWorkflow';

export interface LinkedInPanelProps {
  cvData: CVData;
  companyName: string;
  targetRole: string;
  targetJob?: string;
  providerSettings?: AIProviderSettings;
  onClose: () => void;
}

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

  const {
    loading,
    data,
    copiedId,
    isEditingAbout,
    setIsEditingAbout,
    aboutText,
    setAboutText,
    snackbar,
    handleGenerate,
    handleCopy,
    handleCloseSnackbar,
  } = useLinkedInWorkflow({
    cvData,
    companyName,
    targetRole,
    targetJob,
    providerSettings,
  });

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
            bgcolor: 'background.default',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: 1,
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
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
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 1,
                          transition: 'border-color 0.2s ease',
                          '&:hover': {
                            borderColor: 'primary.main',
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
                      borderRadius: `${theme.shape.borderRadius}px`,
                      border: `1px solid ${theme.palette.divider}`,
                      backgroundColor: theme.palette.background.paper,
                      color: theme.palette.text.primary,
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
                      bgcolor: alpha(theme.palette.text.primary, 0.02),
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
        onClose={handleCloseSnackbar}
        message={snackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
};
