import React from 'react';
import {
  Box,
  Typography,
  TextField,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
  Button,
  IconButton,
  useTheme,
} from '@mui/material';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import TranslateRoundedIcon from '@mui/icons-material/TranslateRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import { useTranslation } from 'react-i18next';
import { LanguagesSectionProps } from '../../../types';

export type { LanguagesSectionProps };

export const LanguagesSection: React.FC<LanguagesSectionProps> = ({
  isExpanded,
  onToggle,
  languages,
  onUpdateLanguage,
  onAddLanguage,
  onRemoveLanguage,
}) => {
  const { t } = useTranslation(['profile', 'common']);
  const theme = useTheme();

  return (
    <Accordion
      expanded={isExpanded}
      onChange={onToggle}
      sx={{
        borderRadius: '12px !important',
        border: `1px solid ${theme.palette.divider}`,
        overflow: 'hidden',
        '&:before': { display: 'none' },
      }}
    >
      <AccordionSummary expandIcon={<ExpandMoreRoundedIcon />}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <TranslateRoundedIcon color="primary" />
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            {t('profile:sections.languages.title', '6. Languages & Proficiency')}
          </Typography>
          {languages.length > 0 && (
            <Chip
              label={`${languages.length} ${languages.length === 1 ? 'Language' : 'Languages'}`}
              size="small"
              color="success"
              variant="outlined"
              sx={{ height: 20, fontSize: '0.7rem' }}
            />
          )}
        </Box>
      </AccordionSummary>
      <AccordionDetails sx={{ pt: 1, pb: 3 }}>
        <Stack spacing={1.5}>
          {languages.map((lang, idx) => (
            <Box key={idx} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <TextField
                size="small"
                fullWidth
                value={lang}
                onChange={(e) => onUpdateLanguage(idx, e.target.value)}
                placeholder={t('profile:sections.languages.proficiency', '**English:** Native / Professional Working Proficiency')}
              />
              <IconButton
                size="small"
                color="error"
                onClick={() => onRemoveLanguage(idx)}
                title={t('profile:sections.languages.remove', 'Remove language')}
              >
                <DeleteOutlineRoundedIcon fontSize="small" />
              </IconButton>
            </Box>
          ))}

          <Button
            variant="outlined"
            size="small"
            startIcon={<AddRoundedIcon />}
            onClick={onAddLanguage}
            sx={{ alignSelf: 'flex-start' }}
          >
            {t('profile:sections.languages.addLanguage', 'Add Language')}
          </Button>
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
};
