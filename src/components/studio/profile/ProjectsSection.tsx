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
  Autocomplete,
  useTheme,
  alpha,
} from '@mui/material';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import { useTranslation } from 'react-i18next';
import { ProjectsSectionProps } from '../../../types';

export type { ProjectsSectionProps };

const CATEGORY_SUGGESTIONS: string[] = [
  'Personal Project',
  'Open Source',
  'Conference Talk',
  'Publication',
  'Volunteering',
  'Award / Recognition',
  'Certification',
  'Side Venture',
  'Research Paper',
  'Community Leadership',
];

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  isExpanded,
  onToggle,
  projects,
  onFieldChange,
  onAddProject,
  onRemoveProject,
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
          <AutoAwesomeRoundedIcon color="primary" />
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            {t('profile:sections.projects.title', '7. Projects & Extras')}
          </Typography>
          <Chip
            label={t('common:badge.optional', 'Optional')}
            size="small"
            sx={{
              height: 20,
              fontSize: '0.7rem',
              fontWeight: 600,
              bgcolor: isDark ? alpha(theme.palette.success.main, 0.16) : '#e6f7ec',
              color: isDark ? theme.palette.success.light : '#1b8042',
              border: `1px solid ${isDark ? alpha(theme.palette.success.main, 0.3) : '#bbf0cb'}`,
            }}
          />
          {projects.length > 0 && (
            <Chip
              label={`${projects.length} ${projects.length === 1 ? 'Entry' : 'Entries'}`}
              size="small"
              variant="outlined"
              color="primary"
              sx={{ height: 20, fontSize: '0.7rem' }}
            />
          )}
        </Box>
      </AccordionSummary>

      <AccordionDetails sx={{ pt: 1, pb: 3 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {t('profile:sections.projects.title', 'Add anything that doesn\'t fit above — projects, publications, volunteering. We\'ll pick what to show based on each job vacancy.')}
        </Typography>

        <Stack spacing={2.5}>
          {projects.map((proj, projIdx) => {
            const descriptionText = (proj.bullets || []).join('\n');

            return (
              <Card key={projIdx} variant="outlined" sx={{ borderRadius: '10px' }}>
                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                      {t('profile:sections.projects.projectName', 'Item')} #{projIdx + 1}: {proj.company || 'New Entry'}
                    </Typography>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => onRemoveProject(projIdx)}
                      title={t('profile:sections.projects.remove', 'Remove this item')}
                    >
                      <DeleteOutlineRoundedIcon fontSize="small" />
                    </IconButton>
                  </Box>

                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1.5fr 1fr' }, gap: 1.5, mb: 1.5 }}>
                    <TextField
                      label={t('profile:sections.projects.projectName', 'Title / Name')}
                      size="small"
                      value={proj.company || ''}
                      onChange={(e) => onFieldChange(projIdx, 'company', e.target.value)}
                      placeholder="e.g. CV Studio Pro"
                      fullWidth
                    />
                    <Autocomplete
                      freeSolo
                      options={CATEGORY_SUGGESTIONS}
                      value={proj.role || ''}
                      onInputChange={(_event, newInputValue) => {
                        onFieldChange(projIdx, 'role', newInputValue);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={t('profile:sections.projects.role', 'Category')}
                          size="small"
                          placeholder="e.g. Personal Project"
                        />
                      )}
                    />
                  </Box>

                  <Box sx={{ mb: 1.5 }}>
                    <TextField
                      label={t('profile:sections.projects.bullets', 'Description / Key Highlights')}
                      size="small"
                      multiline
                      rows={2}
                      fullWidth
                      value={descriptionText}
                      onChange={(e) => {
                        const lines = e.target.value
                          .split('\n')
                          .map((l) => l.trim())
                          .filter(Boolean);
                        onFieldChange(projIdx, 'bullets', lines.length > 0 ? lines : [e.target.value]);
                      }}
                      placeholder="e.g. AI tool to generate tailored CVs per vacancy using TypeScript and React."
                    />
                  </Box>

                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1.5 }}>
                    <TextField
                      label={t('profile:sections.projects.link', 'Link / URL (Optional)')}
                      size="small"
                      value={proj.location || ''}
                      onChange={(e) => onFieldChange(projIdx, 'location', e.target.value)}
                      placeholder="e.g. https://github.com/username/project"
                    />
                    <TextField
                      label={t('profile:sections.projects.date', 'Date / Period (Optional)')}
                      size="small"
                      value={proj.date || ''}
                      onChange={(e) => onFieldChange(projIdx, 'date', e.target.value)}
                      placeholder="e.g. 2024 or Jan 2023 – Present"
                    />
                  </Box>
                </CardContent>
              </Card>
            );
          })}

          <Button
            variant="outlined"
            size="small"
            startIcon={<AddRoundedIcon />}
            onClick={onAddProject}
            sx={{ alignSelf: 'flex-start' }}
          >
            {t('profile:sections.projects.addProject', 'Add Project / Extra')}
          </Button>
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
};
