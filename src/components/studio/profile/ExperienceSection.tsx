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
import { useTranslation } from 'react-i18next';
import { ExperienceItem, ExperienceSectionProps } from '../../../types';

export type { ExperienceSectionProps };

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
  const { t } = useTranslation(['profile', 'common']);
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
            {t('profile:sections.experience.title', '4. Work Experience & Roles')}
          </Typography>
          {experience.length > 0 && (
            <Chip
              label={`${experience.length} ${experience.length === 1 ? 'Role' : 'Roles'}`}
              size="small"
              color="success"
              variant="outlined"
              sx={{ height: 20, fontSize: '0.7rem' }}
            />
          )}
        </Box>
      </AccordionSummary>
      <AccordionDetails sx={{ pt: 1, pb: 3 }}>
        <Box sx={{ mb: 2, p: 1.5, bgcolor: isDark ? alpha(theme.palette.primary.main, 0.08) : '#f0f9ff', borderRadius: '8px' }}>
          <Typography variant="caption" sx={{ fontWeight: 600, color: theme.palette.primary.main, display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <AutoAwesomeRoundedIcon fontSize="inherit" /> Impact Tip:
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {t('profile:sections.experience.bullets', 'Include measurable impact where possible with XYZ formula (Accomplished X as measured by Y by doing Z).')}
          </Typography>
        </Box>

        <Stack spacing={2.5}>
          {experience.map((exp, expIdx) => (
            <Card key={expIdx} variant="outlined" sx={{ borderRadius: '10px' }}>
              <CardContent sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                    {t('profile:sections.experience.role', 'Role')} #{expIdx + 1}: {exp.company || 'Company'}
                  </Typography>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => onRemoveExperience(expIdx)}
                    title={t('profile:sections.experience.removeRole', 'Remove this role')}
                  >
                    <DeleteOutlineRoundedIcon fontSize="small" />
                  </IconButton>
                </Box>

                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1.5, mb: 2 }}>
                  <TextField
                    label={t('profile:sections.experience.company', 'Company Name')}
                    size="small"
                    value={exp.company}
                    onChange={(e) => onFieldChange(expIdx, 'company', e.target.value)}
                    placeholder="e.g. FinScale Technologies"
                  />
                  <TextField
                    label={t('profile:sections.experience.role', 'Job Title / Seniority')}
                    size="small"
                    value={exp.role || ''}
                    onChange={(e) => onFieldChange(expIdx, 'role', e.target.value)}
                    placeholder="e.g. Staff Frontend Engineer"
                  />
                  <TextField
                    label={t('profile:sections.experience.dates', 'Employment Dates')}
                    size="small"
                    value={exp.date || ''}
                    onChange={(e) => onFieldChange(expIdx, 'date', e.target.value)}
                    placeholder="e.g. Oct 2022 – Present"
                  />
                  <TextField
                    label={t('profile:sections.experience.location', 'Location / Mode')}
                    size="small"
                    value={exp.location || ''}
                    onChange={(e) => onFieldChange(expIdx, 'location', e.target.value)}
                    placeholder="e.g. San Francisco, CA (Remote)"
                  />
                </Box>

                <Typography variant="caption" sx={{ fontWeight: 700, mb: 1, display: 'block' }}>
                  {t('profile:sections.experience.bullets', 'Accomplishments & Impact Bullets:')}
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
                  {t('profile:sections.experience.addBullet', 'Add Impact Bullet')}
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
            {t('profile:sections.experience.addRole', 'Add Another Experience')}
          </Button>
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
};
