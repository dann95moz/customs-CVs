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
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import { EducationSectionProps } from '../../../types';

export type { EducationSectionProps };

/**
 * Section for education degrees, universities, and industry certifications.
 * Principle: Single Responsibility (S) - focuses exclusively on academic and credential background.
 */
export const EducationSection: React.FC<EducationSectionProps> = ({
  isExpanded,
  onToggle,
  education,
  onUpdateEducation,
  onAddEducation,
  onRemoveEducation,
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
          <SchoolRoundedIcon color="primary" />
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            5. Education &amp; Certifications
          </Typography>
          {education.length > 0 && (
            <Chip
              label={`${education.length} ${education.length === 1 ? 'Entry' : 'Entries'}`}
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
          {education.map((edu, idx) => (
            <Box key={idx} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <TextField
                size="small"
                fullWidth
                value={edu}
                onChange={(e) => onUpdateEducation(idx, e.target.value)}
                placeholder="**B.S. in Computer Science** – UC Berkeley, 2019"
              />
              <IconButton
                size="small"
                color="error"
                onClick={() => onRemoveEducation(idx)}
                title="Remove entry"
              >
                <DeleteOutlineRoundedIcon fontSize="small" />
              </IconButton>
            </Box>
          ))}

          <Button
            variant="outlined"
            size="small"
            startIcon={<AddRoundedIcon />}
            onClick={onAddEducation}
            sx={{ alignSelf: 'flex-start' }}
          >
            Add Degree or Certification
          </Button>
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
};
