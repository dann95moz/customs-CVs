import React from 'react';
import {
  Box,
  Typography,
  TextField,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
  Stack,
  Button,
  IconButton,
  useTheme,
} from '@mui/material';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import CodeRoundedIcon from '@mui/icons-material/CodeRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import { useTranslation } from 'react-i18next';
import { SkillCategory, SkillsSectionProps } from '../../../types';

export type { SkillsSectionProps };

export const SkillsSection: React.FC<SkillsSectionProps> = ({
  isExpanded,
  onToggle,
  skillGroups,
  skillsTextMap,
  onCategoryChange,
  onSkillsChange,
  onAddCategory,
  onRemoveCategory,
}) => {
  const { t } = useTranslation(['profile', 'common']);
  const theme = useTheme();

  const totalSkillsCount = skillGroups.reduce((acc, g) => acc + (g.skills?.length || 0), 0);

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
          <CodeRoundedIcon color="primary" />
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            {t('profile:sections.skills.title', '3. Skills & Technologies')}
          </Typography>
          {totalSkillsCount > 0 && (
            <Chip
              label={`${totalSkillsCount} Skills`}
              size="small"
              color="success"
              variant="outlined"
              sx={{ height: 20, fontSize: '0.7rem' }}
            />
          )}
        </Box>
      </AccordionSummary>
      <AccordionDetails sx={{ pt: 1, pb: 3 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {t('profile:sections.skills.title', 'Group your skills into categories. Separate items with commas.')}
        </Typography>
        <Stack spacing={2}>
          {skillGroups.map((group, idx) => {
            const skillsVal = skillsTextMap[idx] !== undefined ? skillsTextMap[idx] : (group.skills || []).join(', ');
            return (
              <Paper
                key={idx}
                variant="outlined"
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  gap: 1.5,
                  alignItems: { sm: 'center' }
                }}
              >
                <TextField
                  label={t('profile:sections.skills.groupName', 'Category Name')}
                  size="small"
                  value={group.category}
                  onChange={(e) => onCategoryChange(idx, e.target.value)}
                  sx={{ width: { xs: '100%', sm: '35%' } }}
                />
                <TextField
                  label={t('profile:sections.skills.skillsList', 'Technologies (comma-separated)')}
                  size="small"
                  value={skillsVal}
                  onChange={(e) => onSkillsChange(idx, e.target.value)}
                  placeholder="e.g. TypeScript, React, Next.js, Node.js"
                  sx={{ flex: 1 }}
                />
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => onRemoveCategory(idx)}
                  title={t('profile:sections.skills.removeGroup', 'Remove category')}
                  sx={{ alignSelf: { xs: 'flex-end', sm: 'center' } }}
                >
                  <DeleteOutlineRoundedIcon fontSize="small" />
                </IconButton>
              </Paper>
            );
          })}

          <Button
            variant="outlined"
            size="small"
            startIcon={<AddRoundedIcon />}
            onClick={onAddCategory}
            sx={{ alignSelf: 'flex-start' }}
          >
            {t('profile:sections.skills.addGroup', 'Add Competency Group')}
          </Button>
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
};
