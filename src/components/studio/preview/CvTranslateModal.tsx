import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  Alert,
  CircularProgress,
  Chip,
  useTheme,
  alpha,
} from '@mui/material';
import TranslateRoundedIcon from '@mui/icons-material/TranslateRounded';
import BoltRoundedIcon from '@mui/icons-material/BoltRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import { useTranslation } from 'react-i18next';
import { SupportedLanguage, LANGUAGE_DEFINITIONS } from '../../../constants/languages';
import { CvTranslationVariant } from '../../../types/cv';

export interface CvTranslateModalProps {
  open: boolean;
  onClose: () => void;
  baseLanguage: string;
  translations: Record<string, CvTranslationVariant>;
  activeProviderName: string;
  activeModelName: string;
  isTranslating: boolean;
  onTranslateFull: (targetLang: SupportedLanguage) => Promise<void>;
  onTranslateIncremental: (targetLang: SupportedLanguage, sections: string[]) => Promise<void>;
}

const SUPPORTED_LANGUAGES_LIST: { code: SupportedLanguage; label: string; flag: string }[] = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'it', label: 'Italiano', flag: '🇮🇹' },
];

export const CvTranslateModal: React.FC<CvTranslateModalProps> = ({
  open,
  onClose,
  baseLanguage,
  translations,
  activeProviderName,
  activeModelName,
  isTranslating,
  onTranslateFull,
  onTranslateIncremental,
}) => {
  const { t } = useTranslation(['preview', 'common']);
  const theme = useTheme();

  // Pick first language different from baseLanguage as default
  const defaultTargetLang: SupportedLanguage =
    (SUPPORTED_LANGUAGES_LIST.find((l) => l.code !== baseLanguage)?.code as SupportedLanguage) || 'en';

  const [selectedLang, setSelectedLang] = useState<SupportedLanguage>(defaultTargetLang);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const existingVariant = translations[selectedLang];
  const isOutdated = Boolean(existingVariant?.isOutdated);
  const outdatedSections = existingVariant?.outdatedSections || [];

  const handleFullTranslate = async () => {
    setErrorMessage(null);
    try {
      await onTranslateFull(selectedLang);
      onClose();
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : t('preview:translation.errorGeneric', 'Translation failed. Please verify AI provider configuration.'));
    }
  };

  const handleIncrementalTranslate = async () => {
    setErrorMessage(null);
    try {
      await onTranslateIncremental(selectedLang, outdatedSections);
      onClose();
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : t('preview:translation.errorGeneric', 'Translation failed. Please verify AI provider configuration.'));
    }
  };

  return (
    <Dialog
      open={open}
      onClose={isTranslating ? undefined : onClose}
      maxWidth="sm"
      fullWidth
      aria-labelledby="cv-translate-dialog-title"
    >
      <DialogTitle id="cv-translate-dialog-title" sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TranslateRoundedIcon color="primary" />
          <Typography variant="h6" component="span" sx={{ fontWeight: 700 }}>
            {t('preview:translation.modalTitle', 'Translate CV with AI')}
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontSize: '0.85rem' }}>
          {t('preview:translation.modalSubtitle', 'Create multilingual variants linked to this tailored resume without duplicating your pipeline.')}
        </Typography>
      </DialogTitle>

      <DialogContent dividers sx={{ pt: 2 }}>
        {/* AI Provider Info Notice */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            p: 1.25,
            mb: 2.5,
            borderRadius: 1,
            bgcolor: alpha(theme.palette.primary.main, 0.05),
            border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
          }}
        >
          <ShieldOutlinedIcon sx={{ fontSize: 18, color: 'primary.main', flexShrink: 0 }} />
          <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.78rem' }}>
            {t('preview:translation.providerNote', 'Running on your configured AI')} ({activeProviderName} • {activeModelName}). {t('preview:translation.rolesPreservedNote', 'Technical job titles and technology names are protected from literal translation.')}
          </Typography>
        </Box>

        {/* Target Language Selection */}
        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
          {t('preview:translation.selectTargetLanguage', 'Select Target Language:')}
        </Typography>

        <RadioGroup
          value={selectedLang}
          onChange={(e) => setSelectedLang(e.target.value as SupportedLanguage)}
        >
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1, mb: 2 }}>
            {SUPPORTED_LANGUAGES_LIST.map((lang) => {
              const isBase = lang.code === baseLanguage;
              const hasVariant = Boolean(translations[lang.code]);
              const variantOutdated = Boolean(translations[lang.code]?.isOutdated);

              return (
                <Box
                  key={lang.code}
                  onClick={() => !isBase && setSelectedLang(lang.code)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: 1,
                    px: 1.5,
                    borderRadius: 1,
                    border: `1px solid ${selectedLang === lang.code ? theme.palette.primary.main : theme.palette.divider}`,
                    bgcolor: selectedLang === lang.code ? alpha(theme.palette.primary.main, 0.05) : 'background.paper',
                    opacity: isBase ? 0.55 : 1,
                    cursor: isBase ? 'not-allowed' : 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <FormControlLabel
                    value={lang.code}
                    disabled={isBase}
                    control={<Radio size="small" />}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                        <Typography component="span" sx={{ fontSize: '1rem' }}>{lang.flag}</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{lang.label}</Typography>
                      </Box>
                    }
                    sx={{ m: 0 }}
                  />

                  {isBase ? (
                    <Chip
                      size="small"
                      label={t('preview:translation.baseBadge', 'Base')}
                      variant="outlined"
                      sx={{ fontSize: '0.65rem', height: 20 }}
                    />
                  ) : hasVariant ? (
                    variantOutdated ? (
                      <Chip
                        size="small"
                        icon={<WarningAmberRoundedIcon sx={{ fontSize: '12px !important' }} />}
                        label={t('preview:translation.outdatedBadge', 'Outdated')}
                        color="warning"
                        variant="outlined"
                        sx={{ fontSize: '0.65rem', height: 20 }}
                      />
                    ) : (
                      <Chip
                        size="small"
                        icon={<CheckCircleOutlineRoundedIcon sx={{ fontSize: '12px !important' }} />}
                        label={t('preview:translation.readyBadge', 'Active')}
                        color="success"
                        variant="outlined"
                        sx={{ fontSize: '0.65rem', height: 20 }}
                      />
                    )
                  ) : null}
                </Box>
              );
            })}
          </Box>
        </RadioGroup>

        {/* Existing Variant Status Banner */}
        {existingVariant && (
          <Box sx={{ mb: 1.5 }}>
            {isOutdated ? (
              <Alert
                severity="warning"
                icon={<WarningAmberRoundedIcon />}
                sx={{ fontSize: '0.82rem', '& .MuiAlert-message': { width: '100%' } }}
              >
                <Typography variant="body2" sx={{ fontWeight: 700, mb: 0.5 }}>
                  {t('preview:translation.outdatedTitle', 'Translation is out of sync with base CV')}
                </Typography>
                <Typography variant="caption" sx={{ display: 'block', mb: 1, color: 'text.secondary' }}>
                  {t('preview:translation.outdatedExplanation', 'The base resume was modified after this translation was generated.')}
                  {outdatedSections.length > 0 && (
                    <> {t('preview:translation.modifiedSections', 'Modified sections')}: <strong>{outdatedSections.join(', ')}</strong>.</>
                  )}
                </Typography>
                <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary' }}>
                  {t('preview:translation.diffAdvantage', 'You can sync only the modified sections to save tokens and preserve the rest.')}
                </Typography>
              </Alert>
            ) : (
              <Alert severity="info" icon={<CheckCircleOutlineRoundedIcon />} sx={{ fontSize: '0.82rem' }}>
                {t('preview:translation.upToDateMessage', 'A translated version in this language already exists and is synchronized with the base CV.')}
              </Alert>
            )}
          </Box>
        )}

        {/* Error Feedback */}
        {errorMessage && (
          <Alert severity="error" sx={{ mt: 1.5, fontSize: '0.82rem' }}>
            {errorMessage}
          </Alert>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 2.5, py: 1.75, justifyContent: 'space-between' }}>
        <Button onClick={onClose} disabled={isTranslating} color="inherit">
          {t('common:actions.cancel', 'Cancel')}
        </Button>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {isOutdated && (
            <Button
              variant="outlined"
              color="warning"
              onClick={handleIncrementalTranslate}
              disabled={isTranslating}
              startIcon={isTranslating ? <CircularProgress size={14} color="inherit" /> : <BoltRoundedIcon />}
              sx={{ fontWeight: 700, textTransform: 'none' }}
            >
              {t('preview:translation.syncDiffBtn', 'Sync Changed Sections')}
            </Button>
          )}

          <Button
            variant="contained"
            color="primary"
            onClick={handleFullTranslate}
            disabled={isTranslating || selectedLang === baseLanguage}
            startIcon={isTranslating ? <CircularProgress size={14} color="inherit" /> : <AutoAwesomeRoundedIcon />}
            sx={{ fontWeight: 700, textTransform: 'none' }}
          >
            {isTranslating
              ? t('preview:translation.translatingInProgress', 'Translating...')
              : existingVariant
              ? t('preview:translation.retranslateFullBtn', 'Retranslate Full CV')
              : t('preview:translation.translateFullBtn', 'Translate Full CV')}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};
