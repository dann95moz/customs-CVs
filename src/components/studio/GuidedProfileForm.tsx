import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  Card,
  CardContent,
  Stack,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useTheme,
  alpha
} from '@mui/material';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import CodeRoundedIcon from '@mui/icons-material/CodeRounded';
import WorkRoundedIcon from '@mui/icons-material/WorkRounded';
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded';
import TranslateRoundedIcon from '@mui/icons-material/TranslateRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded';
import { parseCvMarkdownToData, serializeCvDataToMarkdown } from '../../core/parser';
import { CVData, ContactItem, ExperienceItem, SkillCategory } from '../../types/cv';

interface GuidedProfileFormProps {
  markdownContent: string;
  onChange: (newMarkdown: string) => void;
}

export const GuidedProfileForm: React.FC<GuidedProfileFormProps> = ({
  markdownContent,
  onChange,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  // Internal state initialized from markdown
  const [formData, setFormData] = useState<CVData>(() => parseCvMarkdownToData(markdownContent));
  const [expandedSection, setExpandedSection] = useState<string | false>('personal');
  const [skillsTextMap, setSkillsTextMap] = useState<Record<number, string>>({});

  // Keep internal state updated if markdownContent changes from external sample load or file upload
  useEffect(() => {
    const parsed = parseCvMarkdownToData(markdownContent);
    setFormData(parsed);
    // Reset local skillsTextMap if groups count changes externally
    setSkillsTextMap({});
  }, [markdownContent]);

  // Helper to commit changes back to markdown
  const updateData = (updater: (prev: CVData) => CVData) => {
    setFormData(prev => {
      const next = updater(prev);
      const newMarkdown = serializeCvDataToMarkdown(next);
      onChange(newMarkdown);
      return next;
    });
  };

  // Contacts Helpers
  const getContactVal = (type: string): string => {
    const found = formData.contacts.find(c => c.type === type);
    return found ? (found.url || found.label) : '';
  };

  const setContactVal = (type: any, label: string, url?: string) => {
    updateData(prev => {
      const remaining = prev.contacts.filter(c => c.type !== type);
      if (label.trim()) {
        const newContact: ContactItem = {
          type,
          label: label.trim(),
          url: url || (type === 'email' ? `mailto:${label.trim()}` : (url || (type === 'linkedin' || type === 'github' || type === 'globe' ? label.trim() : undefined)))
        };
        return { ...prev, contacts: [...remaining, newContact] };
      }
      return { ...prev, contacts: remaining };
    });
  };

  // Skill category helpers
  const handleSkillGroupCategoryChange = (index: number, newCategory: string) => {
    updateData(prev => {
      const groups = [...(prev.skillGroups || [])];
      if (!groups[index]) return prev;
      groups[index] = {
        ...groups[index],
        category: newCategory
      };
      return { ...prev, skillGroups: groups };
    });
  };

  const handleSkillGroupSkillsChange = (index: number, skillsStr: string) => {
    updateData(prev => {
      const groups = [...(prev.skillGroups || [])];
      if (!groups[index]) return prev;
      groups[index] = {
        ...groups[index],
        skills: skillsStr.split(',').map(s => s.trim()).filter(Boolean)
      };
      return { ...prev, skillGroups: groups };
    });
  };

  const handleAddSkillGroup = () => {
    updateData(prev => {
      const current = prev.skillGroups ? [...prev.skillGroups] : [];
      const newIdx = current.length;
      const defaultCategory = newIdx === 0
        ? 'Languages & Fundamentals'
        : newIdx === 1
        ? 'Frameworks & Architecture'
        : newIdx === 2
        ? 'Tooling, CI/CD & Cloud'
        : `Competency Group ${newIdx + 1}`;

      const newGroup: SkillCategory = {
        category: defaultCategory,
        skills: ['Technology 1', 'Technology 2']
      };
      setSkillsTextMap(prevMap => ({ ...prevMap, [newIdx]: 'Technology 1, Technology 2' }));
      return {
        ...prev,
        skillGroups: [...current, newGroup]
      };
    });
  };

  const handleRemoveSkillGroup = (index: number) => {
    setSkillsTextMap(prevMap => {
      const newMap: Record<number, string> = {};
      Object.keys(prevMap).forEach(keyStr => {
        const k = Number(keyStr);
        if (k < index) newMap[k] = prevMap[k];
        else if (k > index) newMap[k - 1] = prevMap[k];
      });
      return newMap;
    });
    updateData(prev => ({
      ...prev,
      skillGroups: (prev.skillGroups || []).filter((_, i) => i !== index)
    }));
  };

  // Experience helpers
  const handleExperienceChange = (index: number, field: keyof ExperienceItem, value: any) => {
    updateData(prev => {
      const expList = [...(prev.experience || [])];
      expList[index] = { ...expList[index], [field]: value };
      return { ...prev, experience: expList };
    });
  };

  const handleAddExperience = () => {
    const newExp: ExperienceItem = {
      company: 'Company Name',
      role: 'Job Title / Specialization',
      location: 'City, Country (or Remote)',
      date: 'Mon YYYY – Present',
      bullets: [
        'Spearheaded key architectural initiatives cutting build times by 45% through modern CI/CD automation.'
      ]
    };
    updateData(prev => ({
      ...prev,
      experience: [newExp, ...(prev.experience || [])]
    }));
  };

  const handleRemoveExperience = (index: number) => {
    updateData(prev => ({
      ...prev,
      experience: (prev.experience || []).filter((_, i) => i !== index)
    }));
  };

  const handleAddBullet = (expIndex: number) => {
    updateData(prev => {
      const expList = [...(prev.experience || [])];
      const targetExp = expList[expIndex];
      const newBullets = [...targetExp.bullets, 'Accomplished [X] as measured by [Y%] by designing and deploying [Z].'];
      expList[expIndex] = { ...targetExp, bullets: newBullets };
      return { ...prev, experience: expList };
    });
  };

  const handleUpdateBullet = (expIndex: number, bulletIndex: number, text: string) => {
    updateData(prev => {
      const expList = [...(prev.experience || [])];
      const targetExp = expList[expIndex];
      const newBullets = [...targetExp.bullets];
      newBullets[bulletIndex] = text;
      expList[expIndex] = { ...targetExp, bullets: newBullets };
      return { ...prev, experience: expList };
    });
  };

  const handleRemoveBullet = (expIndex: number, bulletIndex: number) => {
    updateData(prev => {
      const expList = [...(prev.experience || [])];
      const targetExp = expList[expIndex];
      const newBullets = targetExp.bullets.filter((_, i) => i !== bulletIndex);
      expList[expIndex] = { ...targetExp, bullets: newBullets };
      return { ...prev, experience: expList };
    });
  };

  // Education helpers
  const handleAddEducation = () => {
    updateData(prev => ({
      ...prev,
      education: [...(prev.education || []), '**B.S. in Computer Science** – University Name, 2022']
    }));
  };

  const handleUpdateEducation = (index: number, text: string) => {
    updateData(prev => {
      const list = [...(prev.education || [])];
      list[index] = text;
      return { ...prev, education: list };
    });
  };

  const handleRemoveEducation = (index: number) => {
    updateData(prev => ({
      ...prev,
      education: (prev.education || []).filter((_, i) => i !== index)
    }));
  };

  // Languages helpers
  const handleAddLanguage = () => {
    updateData(prev => ({
      ...prev,
      languages: [...(prev.languages || []), '**English:** Native / Full Professional Proficiency']
    }));
  };

  const handleUpdateLanguage = (index: number, text: string) => {
    updateData(prev => {
      const list = [...(prev.languages || [])];
      list[index] = text;
      return { ...prev, languages: list };
    });
  };

  const handleRemoveLanguage = (index: number) => {
    updateData(prev => ({
      ...prev,
      languages: (prev.languages || []).filter((_, i) => i !== index)
    }));
  };

  const handleAccordionChange = (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedSection(isExpanded ? panel : false);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: { xs: 1, sm: 2 } }}>
      {/* Natural Language Philosophy Banner */}


      {/* 1. Identity & Contact Links */}
      <Accordion
        expanded={expandedSection === 'personal'}
        onChange={handleAccordionChange('personal')}
        sx={{
          borderRadius: '12px !important',
          border: `1px solid ${theme.palette.divider}`,
          overflow: 'hidden',
          '&:before': { display: 'none' },
        }}
      >
        <AccordionSummary expandIcon={<ExpandMoreRoundedIcon />}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <PersonRoundedIcon color="primary" />
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              1. Candidate Identity & Contact
            </Typography>
            <Chip label="Essential" size="small" color="primary" variant="outlined" sx={{ height: 20, fontSize: '0.7rem' }} />
          </Box>
        </AccordionSummary>
        <AccordionDetails sx={{ pt: 1, pb: 3 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
            <TextField
              label="Full Name"
              variant="outlined"
              size="small"
              value={formData.name || ''}
              onChange={(e) => updateData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g. Alex Morgan"
              fullWidth
            />
            <TextField
              label="Primary Professional Role / Specialization"
              variant="outlined"
              size="small"
              value={formData.title || ''}
              onChange={(e) => updateData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g. Staff Frontend Engineer | Distributed Systems"
              fullWidth
            />
            <TextField
              label="Location"
              variant="outlined"
              size="small"
              value={getContactVal('location')}
              onChange={(e) => setContactVal('location', e.target.value)}
              placeholder="e.g. San Francisco, CA (or Remote)"
              fullWidth
            />
            <TextField
              label="Email Address"
              variant="outlined"
              size="small"
              value={getContactVal('email')}
              onChange={(e) => setContactVal('email', e.target.value)}
              placeholder="alex.morgan@example.com"
              fullWidth
            />
            <TextField
              label="Phone Number"
              variant="outlined"
              size="small"
              value={getContactVal('phone')}
              onChange={(e) => setContactVal('phone', e.target.value)}
              placeholder="+1 (555) 019-2834"
              fullWidth
            />
            <TextField
              label="LinkedIn URL"
              variant="outlined"
              size="small"
              value={getContactVal('linkedin')}
              onChange={(e) => setContactVal('linkedin', e.target.value, e.target.value)}
              placeholder="https://linkedin.com/in/username"
              fullWidth
            />
            <TextField
              label="GitHub URL (Optional)"
              variant="outlined"
              size="small"
              value={getContactVal('github')}
              onChange={(e) => setContactVal('github', e.target.value, e.target.value)}

              fullWidth
            />
            <TextField
              label="Portfolio / Personal Website (Optional)"
              variant="outlined"
              size="small"
              value={getContactVal('globe')}
              onChange={(e) => setContactVal('globe', e.target.value, e.target.value)}
              placeholder="https://alexmorgan.dev"
              fullWidth
            />
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* 2. Professional Summary & Pitch */}
      <Accordion
        expanded={expandedSection === 'summary'}
        onChange={handleAccordionChange('summary')}
        sx={{
          borderRadius: '12px !important',
          border: `1px solid ${theme.palette.divider}`,
          overflow: 'hidden',
          '&:before': { display: 'none' },
        }}
      >
        <AccordionSummary expandIcon={<ExpandMoreRoundedIcon />}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <DescriptionRoundedIcon color="primary" />
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              2. Career Trajectory & Executive Pitch
            </Typography>
            <Chip label="Natural Narrative" size="small" variant="outlined" sx={{ height: 20, fontSize: '0.7rem' }} />
          </Box>
        </AccordionSummary>
        <AccordionDetails sx={{ pt: 1, pb: 3 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
            Write freely about your career trajectory, core technical domain, architectural capabilities, and high-level engineering achievements. The AI uses this narrative to build targeted executive hooks.
          </Typography>
          <TextField
            multiline
            rows={4}
            variant="outlined"
            size="small"
            value={formData.summary || ''}
            onChange={(e) => updateData(prev => ({ ...prev, summary: e.target.value }))}
            placeholder="Senior Frontend Engineer with 6+ years of experience specialized in architecting high-throughput web applications, microfrontends, and design systems using TypeScript and React. Proven track record scaling platforms processing over $80M in transaction volume..."
            fullWidth
          />
        </AccordionDetails>
      </Accordion>

      {/* 3. Tech Stack & Competencies */}
      <Accordion
        expanded={expandedSection === 'skills'}
        onChange={handleAccordionChange('skills')}
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
              3. Master Tech Stack & Competencies
            </Typography>
            <Chip label="High-Density Stack" size="small" color="primary" variant="outlined" sx={{ height: 20, fontSize: '0.7rem' }} />
          </Box>
        </AccordionSummary>
        <AccordionDetails sx={{ pt: 1, pb: 3 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Organize competencies into high-density categories. Separate individual technologies with commas.
          </Typography>
          <Stack spacing={2}>
            {(formData.skillGroups || []).map((group, idx) => {
              const skillsVal = skillsTextMap[idx] !== undefined ? skillsTextMap[idx] : (group.skills || []).join(', ');
              return (
                <Paper
                  key={idx}
                  variant="outlined"
                  sx={{ p: 2, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1.5, alignItems: { sm: 'center' } }}
                >
                  <TextField
                    label="Category Name"
                    size="small"
                    value={group.category}
                    onChange={(e) => handleSkillGroupCategoryChange(idx, e.target.value)}
                    sx={{ width: { xs: '100%', sm: '35%' } }}
                  />
                  <TextField
                    label="Technologies (comma-separated)"
                    size="small"
                    value={skillsVal}
                    onChange={(e) => {
                      const val = e.target.value;
                      setSkillsTextMap(prev => ({ ...prev, [idx]: val }));
                      handleSkillGroupSkillsChange(idx, val);
                    }}
                    placeholder="e.g. TypeScript, React, Next.js, Node.js"
                    sx={{ flex: 1 }}
                  />
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleRemoveSkillGroup(idx)}
                    title="Remove category"
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
              onClick={handleAddSkillGroup}
              sx={{ alignSelf: 'flex-start' }}
            >
              Add Competency Group
            </Button>
          </Stack>
        </AccordionDetails>
      </Accordion>

      {/* 4. Work History & Achievements */}
      <Accordion
        expanded={expandedSection === 'experience'}
        onChange={handleAccordionChange('experience')}
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
              4. Career History & Achievements
            </Typography>
            <Chip
              label={`${(formData.experience || []).length} Roles Recorded`}
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
              "Accomplished <strong>[X]</strong> as measured by <strong>[Y%]</strong> by implementing <strong>[Z]</strong>" (e.g. "Reduced CI/CD build times by 50% through Docker pipeline automation").
            </Typography>
          </Box>

          <Stack spacing={2.5}>
            {(formData.experience || []).map((exp, expIdx) => (
              <Card key={expIdx} variant="outlined" sx={{ borderRadius: '10px' }}>
                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                      Role #{expIdx + 1}: {exp.company || 'Company'}
                    </Typography>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleRemoveExperience(expIdx)}
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
                      onChange={(e) => handleExperienceChange(expIdx, 'company', e.target.value)}
                      placeholder="e.g. FinScale Technologies"
                    />
                    <TextField
                      label="Job Title / Seniority"
                      size="small"
                      value={exp.role || ''}
                      onChange={(e) => handleExperienceChange(expIdx, 'role', e.target.value)}
                      placeholder="e.g. Staff Frontend Engineer"
                    />
                    <TextField
                      label="Employment Dates"
                      size="small"
                      value={exp.date || ''}
                      onChange={(e) => handleExperienceChange(expIdx, 'date', e.target.value)}
                      placeholder="e.g. Oct 2022 – Present"
                    />
                    <TextField
                      label="Location / Mode"
                      size="small"
                      value={exp.location || ''}
                      onChange={(e) => handleExperienceChange(expIdx, 'location', e.target.value)}
                      placeholder="e.g. San Francisco, CA (Remote)"
                    />
                  </Box>

                  <Typography variant="caption" sx={{ fontWeight: 700, mb: 1, display: 'block' }}>
                    Accomplishments & Impact Bullets:
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
                          onChange={(e) => handleUpdateBullet(expIdx, bIdx, e.target.value)}
                          placeholder="Accomplished [X] as measured by [Y] by doing [Z]..."
                        />
                        <IconButton
                          size="small"
                          color="inherit"
                          onClick={() => handleRemoveBullet(expIdx, bIdx)}
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
                    onClick={() => handleAddBullet(expIdx)}
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
              onClick={handleAddExperience}
              sx={{ alignSelf: 'flex-start' }}
            >
              Add Another Experience
            </Button>
          </Stack>
        </AccordionDetails>
      </Accordion>

      {/* 5. Education & Certifications */}
      <Accordion
        expanded={expandedSection === 'education'}
        onChange={handleAccordionChange('education')}
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
              5. Education & Industry Certifications
            </Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails sx={{ pt: 1, pb: 3 }}>
          <Stack spacing={1.5}>
            {(formData.education || []).map((edu, idx) => (
              <Box key={idx} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <TextField
                  size="small"
                  fullWidth
                  value={edu}
                  onChange={(e) => handleUpdateEducation(idx, e.target.value)}
                  placeholder="**B.S. in Computer Science** – UC Berkeley, 2019"
                />
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => handleRemoveEducation(idx)}
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
              onClick={handleAddEducation}
              sx={{ alignSelf: 'flex-start' }}
            >
              Add Degree or Certification
            </Button>
          </Stack>
        </AccordionDetails>
      </Accordion>

      {/* 6. Languages */}
      <Accordion
        expanded={expandedSection === 'languages'}
        onChange={handleAccordionChange('languages')}
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
              6. Languages & CEFR Proficiencies
            </Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails sx={{ pt: 1, pb: 3 }}>
          <Stack spacing={1.5}>
            {(formData.languages || []).map((lang, idx) => (
              <Box key={idx} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <TextField
                  size="small"
                  fullWidth
                  value={lang}
                  onChange={(e) => handleUpdateLanguage(idx, e.target.value)}
                  placeholder="**English:** Native / Professional Working Proficiency"
                />
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => handleRemoveLanguage(idx)}
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
              onClick={handleAddLanguage}
              sx={{ alignSelf: 'flex-start' }}
            >
              Add Language
            </Button>
          </Stack>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};
