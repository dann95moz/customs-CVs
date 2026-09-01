import React, { useState, useMemo } from 'react';
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
  InputAdornment,
  useTheme,
  alpha
} from '@mui/material';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import CodeRoundedIcon from '@mui/icons-material/CodeRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import { useTranslation } from 'react-i18next';
import { SkillCategory, SkillsSectionProps } from '../../../types';

export type { SkillsSectionProps };

const SUGGESTED_SKILLS: Record<string, string[]> = {
  frontend: ['React', 'TypeScript', 'Next.js', 'Vue.js', 'Tailwind CSS', 'GraphQL', 'Redux', 'Vite', 'HTML5/CSS3'],
  backend: ['Node.js', 'Python', 'Go', 'Java', 'PostgreSQL', 'MongoDB', 'Redis', 'REST APIs', 'FastAPI', 'Express'],
  devops: ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'GitHub Actions', 'Terraform', 'Linux', 'GCP', 'Azure'],
  leadership: ['Agile / Scrum', 'System Design', 'Code Review', 'Technical Mentorship', 'Stakeholder Management', 'Roadmapping']
};

interface SkillGroupCardProps {
  group: SkillCategory;
  idx: number;
  onCategoryChange: (index: number, newCategory: string) => void;
  onSkillsChange: (index: number, skillsStr: string) => void;
  onRemoveCategory: (index: number) => void;
}

const SkillGroupCard: React.FC<SkillGroupCardProps> = React.memo(({
  group,
  idx,
  onCategoryChange,
  onSkillsChange,
  onRemoveCategory,
}) => {
  const { t } = useTranslation(['profile', 'common']);
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [newSkillInput, setNewSkillInput] = useState<string>('');

  const skillsList = group.skills || [];

  const handleAddSkill = () => {
    const rawVal = newSkillInput || '';
    const newItems = rawVal.split(',').map(s => s.trim()).filter(Boolean);
    if (newItems.length === 0) return;

    const currentSkills = group.skills || [];
    const combined = [...currentSkills];
    newItems.forEach(item => {
      if (!combined.some(s => s.toLowerCase() === item.toLowerCase())) {
        combined.push(item);
      }
    });

    onSkillsChange(idx, combined.join(', '));
    setNewSkillInput('');
  };

  const handleRemoveSkill = (skillIdx: number) => {
    const currentSkills = [...(group.skills || [])];
    currentSkills.splice(skillIdx, 1);
    onSkillsChange(idx, currentSkills.join(', '));
  };

  const handleAddSuggestedSkill = (skill: string) => {
    const currentSkills = group.skills || [];
    if (!currentSkills.some(s => s.toLowerCase() === skill.toLowerCase())) {
      const updated = [...currentSkills, skill];
      onSkillsChange(idx, updated.join(', '));
    }
  };

  const categoryLower = group.category.toLowerCase();
  const relevantSuggestions = categoryLower.includes('front') || categoryLower.includes('ui') || categoryLower.includes('web')
    ? SUGGESTED_SKILLS.frontend
    : categoryLower.includes('back') || categoryLower.includes('data') || categoryLower.includes('api')
    ? SUGGESTED_SKILLS.backend
    : categoryLower.includes('cloud') || categoryLower.includes('devops') || categoryLower.includes('ci') || categoryLower.includes('tool')
    ? SUGGESTED_SKILLS.devops
    : categoryLower.includes('lead') || categoryLower.includes('manage') || categoryLower.includes('soft')
    ? SUGGESTED_SKILLS.leadership
    : [...SUGGESTED_SKILLS.frontend.slice(0, 4), ...SUGGESTED_SKILLS.backend.slice(0, 4)];

  const unusedSuggestions = relevantSuggestions.filter(
    s => !skillsList.some(curr => curr.toLowerCase() === s.toLowerCase())
  ).slice(0, 6);

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2.5,
        borderRadius: '12px',
        bgcolor: isDark ? alpha(theme.palette.background.paper, 0.6) : '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        gap: 1.75
      }}
    >
      {/* Category Header Bar */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, justifyContent: 'space-between' }}>
        <TextField
          label={t('profile:sections.skills.groupName', 'Competency Category')}
          size="small"
          value={group.category}
          onChange={(e) => onCategoryChange(idx, e.target.value)}
          sx={{ width: { xs: '100%', sm: '50%' } }}
        />
        <IconButton
          size="small"
          color="error"
          onClick={() => onRemoveCategory(idx)}
          title={t('profile:sections.skills.removeGroup', 'Remove category')}
          sx={{ borderRadius: '8px' }}
        >
          <DeleteOutlineRoundedIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Interactive Skill Chips Container */}
      <Box
        sx={{
          p: 1.5,
          borderRadius: '8px',
          bgcolor: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(241, 245, 249, 0.7)',
          border: `1px dashed ${theme.palette.divider}`,
          minHeight: 48,
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: 1
        }}
      >
        {skillsList.length === 0 ? (
          <Typography variant="caption" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
            {t('profile:sections.skills.empty', 'No skills added yet in this group. Type below or pick a suggestion.')}
          </Typography>
        ) : (
          skillsList.map((skill, sIdx) => (
            <Chip
              key={sIdx}
              label={skill}
              size="small"
              onDelete={() => handleRemoveSkill(sIdx)}
              color="default"
              variant="filled"
              sx={{
                fontWeight: 600,
                fontSize: '0.8rem',
                bgcolor: isDark ? alpha(theme.palette.primary.main, 0.18) : alpha(theme.palette.primary.main, 0.08),
                border: `1px solid ${alpha(theme.palette.primary.main, 0.25)}`,
                color: 'text.primary',
                '& .MuiChip-deleteIcon': {
                  color: isDark ? theme.palette.primary.light : theme.palette.primary.dark,
                  '&:hover': { color: theme.palette.error.main }
                }
              }}
            />
          ))
        )}
      </Box>

      {/* Add New Skill Input Row */}
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        <TextField
          size="small"
          placeholder={t('profile:sections.skills.addPlaceholder', 'Add skill (press Enter or comma)...')}
          value={newSkillInput}
          onChange={(e) => setNewSkillInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ',') {
              e.preventDefault();
              handleAddSkill();
            }
          }}
          sx={{ flex: 1 }}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <Button
                    size="small"
                    variant="contained"
                    disabled={!newSkillInput.trim()}
                    onClick={handleAddSkill}
                    sx={{ minWidth: 'auto', px: 1.5, py: 0.5, fontSize: '0.75rem', fontWeight: 700 }}
                  >
                    <AddRoundedIcon sx={{ fontSize: 16 }} />
                  </Button>
                </InputAdornment>
              )
            }
          }}
        />
      </Box>

      {/* Quick Add Suggestions */}
      {unusedSuggestions.length > 0 && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexWrap: 'wrap', pt: 0.5 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <AutoAwesomeRoundedIcon sx={{ fontSize: 13, color: 'primary.main' }} />
            {t('profile:sections.skills.quickSuggestions', 'Quick add:')}
          </Typography>
          {unusedSuggestions.map((s) => (
            <Chip
              key={s}
              label={`+ ${s}`}
              size="small"
              clickable
              onClick={() => handleAddSuggestedSkill(s)}
              sx={{
                fontSize: '0.72rem',
                height: 22,
                bgcolor: 'transparent',
                border: `1px dashed ${theme.palette.divider}`,
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  borderColor: theme.palette.primary.main
                }
              }}
            />
          ))}
        </Box>
      )}
    </Paper>
  );
});

export const SkillsSection: React.FC<SkillsSectionProps> = React.memo(({
  isExpanded,
  onToggle,
  skillGroups,
  onCategoryChange,
  onSkillsChange,
  onAddCategory,
  onRemoveCategory,
}) => {
  const { t } = useTranslation(['profile', 'common']);

  const totalSkillsCount = useMemo(
    () => skillGroups.reduce((acc, g) => acc + (g.skills?.length || 0), 0),
    [skillGroups]
  );

  return (
    <Accordion
      expanded={isExpanded}
      onChange={onToggle}
      slotProps={{ transition: { unmountOnExit: true } }}
      sx={{
        borderRadius: '12px !important',
        border: (theme) => `1px solid ${theme.palette.divider}`,
        overflow: 'hidden',
        '&:before': { display: 'none' },
      }}
    >
      <AccordionSummary expandIcon={<ExpandMoreRoundedIcon />}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
          <CodeRoundedIcon color="primary" />
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            {t('profile:sections.skills.title', '3. Skills & Technologies')}
          </Typography>
          {totalSkillsCount > 0 && (
            <Chip
              label={`${totalSkillsCount} Skills`}
              size="small"
              color="primary"
              variant="outlined"
              sx={{ height: 22, fontSize: '0.72rem', fontWeight: 600 }}
            />
          )}
        </Box>
      </AccordionSummary>
      <AccordionDetails sx={{ pt: 1, pb: 3 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
          {t('profile:sections.skills.desc', 'Organize your technical competencies into clean categories. Type a skill and press Enter, or click suggestions.')}
        </Typography>

        <Stack spacing={2.5}>
          {skillGroups.map((group, idx) => (
            <SkillGroupCard
              key={idx}
              group={group}
              idx={idx}
              onCategoryChange={onCategoryChange}
              onSkillsChange={onSkillsChange}
              onRemoveCategory={onRemoveCategory}
            />
          ))}

          <Button
            variant="outlined"
            size="small"
            startIcon={<AddRoundedIcon />}
            onClick={onAddCategory}
            sx={{ alignSelf: 'flex-start', fontWeight: 700 }}
          >
            {t('profile:sections.skills.addGroup', 'Add Competency Group')}
          </Button>
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
});
