import React from 'react';
import {
  Box,
  Typography,
  TextField,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  CardContent,
  Stack,
  Button,
  IconButton,
  useTheme,
  alpha,
} from '@mui/material';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import WorkRoundedIcon from '@mui/icons-material/WorkRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import { ExperienceItem, ExperienceSectionProps } from '../../../types';

export type { ExperienceSectionProps };

/**
 * Section for career experience and accomplishments with Google XYZ Formula assistance.
 * Principle: Single Responsibility (S) - focuses exclusively on work history and measurable impacts.
 */
export const ExperienceSection: React.FC<ExperienceSectionProps> = ({
  isExpanded,
  onToggle,
  experience,
  onFieldChange,
  onAddExperience,
  onRemoveExperience,
  onAddBullet,
  onUpdateBullet,
  onRemoveBullet,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

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
          <WorkRoundedIcon color="primary" />
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            4. Career History &amp; Achievements
          </Typography>
          <Chip
            label={`${experience.length} Roles Recorded`}
            size="small"
            color="success"
            variant="outlined"
            sx={{ height: 20, fontSize: '0.7rem' }}
          />
        </Box>
      </AccordionSummary>
      <AccordionDetails sx={{ pt: 1, pb: 3 }}>
        <Box sx={{ mb: 2, p: 1.5, bgcolor: isDark ? alpha(theme.palette.primary.main, 0.08) : '#f0f9ff', borderRadius: '8px' }}>
          <Typography variant="caption" sx={{ fontWeight: 600, color: theme.palette.primary.main, display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <AutoAwesomeRoundedIcon fontSize="inherit" /> Google XYZ Achievement Formula:
          </Typography>
          <Typography variant="caption" color="text.secondary">
            &quot;Accomplished <strong>[X]</strong> as measured by <strong>[Y%]</strong> by implementing <strong>[Z]</strong>&quot; (e.g. &quot;Reduced CI/CD build times by 50% through Docker pipeline automation&quot;).
          </Typography>
        </Box>

        <Stack spacing={2.5}>
          {experience.map((exp, expIdx) => (
            <Card key={expIdx} variant="outlined" sx={{ borderRadius: '10px' }}>
              <CardContent sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                    Role #{expIdx + 1}: {exp.company || 'Company'}
                  </Typography>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => onRemoveExperience(expIdx)}
                    title="Remove this role"
                  >
                    <DeleteOutlineRoundedIcon fontSize="small" />
                  </IconButton>
                </Box>

                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1.5, mb: 2 }}>
                  <TextField
                    label="Company Name"
                    size="small"
                    value={exp.company}
                    onChange={(e) => onFieldChange(expIdx, 'company', e.target.value)}
                    placeholder="e.g. FinScale Technologies"
                  />
                  <TextField
                    label="Job Title / Seniority"
                    size="small"
                    value={exp.role || ''}
                    onChange={(e) => onFieldChange(expIdx, 'role', e.target.value)}
                    placeholder="e.g. Staff Frontend Engineer"
                  />
                  <TextField
                    label="Employment Dates"
                    size="small"
                    value={exp.date || ''}
                    onChange={(e) => onFieldChange(expIdx, 'date', e.target.value)}
                    placeholder="e.g. Oct 2022 – Present"
                  />
                  <TextField
                    label="Location / Mode"
                    size="small"
                    value={exp.location || ''}
                    onChange={(e) => onFieldChange(expIdx, 'location', e.target.value)}
                    placeholder="e.g. San Francisco, CA (Remote)"
                  />
                </Box>

                <Typography variant="caption" sx={{ fontWeight: 700, mb: 1, display: 'block' }}>
                  Accomplishments &amp; Impact Bullets:
                </Typography>

                <Stack spacing={1} sx={{ mb: 1.5 }}>
                  {exp.bullets.map((bullet, bIdx) => (
                    <Box key={bIdx} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <Typography variant="body2" sx={{ color: theme.palette.primary.main, fontWeight: 700 }}>
                        •
                      </Typography>
                      <TextField
                        multiline
                        rows={2}
                        size="small"
                        fullWidth
                        value={bullet}
                        onChange={(e) => onUpdateBullet(expIdx, bIdx, e.target.value)}
                        placeholder="Accomplished [X] as measured by [Y] by doing [Z]..."
                      />
                      <IconButton
                        size="small"
                        color="inherit"
                        onClick={() => onRemoveBullet(expIdx, bIdx)}
                        title="Remove bullet"
                      >
                        <DeleteOutlineRoundedIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  ))}
                </Stack>

                <Button
                  variant="text"
                  size="small"
                  startIcon={<AddRoundedIcon />}
                  onClick={() => onAddBullet(expIdx)}
                  sx={{ fontSize: '0.8rem' }}
                >
                  Add Impact Bullet
                </Button>
              </CardContent>
            </Card>
          ))}

          <Button
            variant="outlined"
            startIcon={<AddRoundedIcon />}
            onClick={onAddExperience}
            sx={{ alignSelf: 'flex-start' }}
          >
            Add Another Experience
          </Button>
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
};
