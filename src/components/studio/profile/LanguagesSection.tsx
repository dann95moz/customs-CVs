import React from 'react';
import {
  Box,
  Typography,
  TextField,
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
import { LanguagesSectionProps } from '../../../types';

export type { LanguagesSectionProps };

/**
 * Section for candidate languages and CEFR proficiencies.
 * Principle: Single Responsibility (S) - focuses exclusively on language proficiencies.
 */
export const LanguagesSection: React.FC<LanguagesSectionProps> = ({
  isExpanded,
  onToggle,
  languages,
  onUpdateLanguage,
  onAddLanguage,
  onRemoveLanguage,
}) => {
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
            6. Languages &amp; CEFR Proficiencies
          </Typography>
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
                placeholder="**English:** Native / Professional Working Proficiency"
              />
              <IconButton
                size="small"
                color="error"
                onClick={() => onRemoveLanguage(idx)}
                title="Remove language"
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
            Add Language
          </Button>
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
};
