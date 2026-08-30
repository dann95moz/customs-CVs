import React from 'react';
import {
  Box,
  Typography,
  TextField,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useTheme,
} from '@mui/material';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import { useTranslation } from 'react-i18next';
import { ContactItem, ContactType, PersonalInfoSectionProps } from '../../../types';

export type { PersonalInfoSectionProps };

export const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({
  isExpanded,
  onToggle,
  name,
  title,
  contacts,
  onNameChange,
  onTitleChange,
  onContactChange,
}) => {
  const { t } = useTranslation(['profile', 'common']);
  const theme = useTheme();

  const getContactVal = (type: ContactType): string => {
    const found = contacts.find(c => c.type === type);
    if (!found) return '';
    if (type === 'email') {
      const raw = found.label || found.url || '';
      return raw.replace(/^mailto:/i, '').trim();
    }
    if (type === 'location' || type === 'phone' || type === 'text') {
      return found.label || '';
    }
    return found.url || found.label || '';
  };

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
          <PersonRoundedIcon color="primary" />
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            {t('profile:sections.personalInfo.title', '1. Personal Info & Contact')}
          </Typography>
          {Boolean(name && name.trim()) ? (
            <Chip label={t('common:badge.added', 'Added')} size="small" color="success" variant="outlined" sx={{ height: 20, fontSize: '0.7rem' }} />
          ) : (
            <Chip label={t('common:badge.essential', 'Essential')} size="small" color="primary" variant="outlined" sx={{ height: 20, fontSize: '0.7rem' }} />
          )}
        </Box>
      </AccordionSummary>
      <AccordionDetails sx={{ pt: 1, pb: 3 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
          <TextField
            label={t('profile:sections.personalInfo.fullName', 'Full Name')}
            variant="outlined"
            size="small"
            value={name || ''}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="e.g. Alex Morgan"
            fullWidth
          />
          <TextField
            label={t('profile:sections.personalInfo.jobTitle', 'Primary Professional Role / Specialization')}
            variant="outlined"
            size="small"
            value={title || ''}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="e.g. Staff Frontend Engineer | Distributed Systems"
            fullWidth
          />
          <TextField
            label={t('profile:sections.personalInfo.location', 'Location')}
            variant="outlined"
            size="small"
            value={getContactVal('location')}
            onChange={(e) => onContactChange('location', e.target.value)}
            placeholder="e.g. San Francisco, CA (or Remote)"
            fullWidth
          />
          <TextField
            label={t('profile:sections.personalInfo.email', 'Email Address')}
            variant="outlined"
            size="small"
            value={getContactVal('email')}
            onChange={(e) => onContactChange('email', e.target.value)}
            placeholder="alex.morgan@example.com"
            fullWidth
          />
          <TextField
            label={t('profile:sections.personalInfo.phone', 'Phone Number')}
            variant="outlined"
            size="small"
            value={getContactVal('phone')}
            onChange={(e) => onContactChange('phone', e.target.value)}
            placeholder="+1 (555) 019-2834"
            fullWidth
          />
          <TextField
            label={t('profile:sections.personalInfo.linkedin', 'LinkedIn URL')}
            variant="outlined"
            size="small"
            value={getContactVal('linkedin')}
            onChange={(e) => onContactChange('linkedin', e.target.value, e.target.value)}
            placeholder="https://linkedin.com/in/username"
            fullWidth
          />
          <TextField
            label={t('profile:sections.personalInfo.github', 'GitHub URL (Optional)')}
            variant="outlined"
            size="small"
            value={getContactVal('github')}
            onChange={(e) => onContactChange('github', e.target.value, e.target.value)}
            placeholder="https://github.com/username"
            fullWidth
          />
          <TextField
            label={t('profile:sections.personalInfo.portfolio', 'Portfolio / Personal Website (Optional)')}
            variant="outlined"
            size="small"
            value={getContactVal('globe')}
            onChange={(e) => onContactChange('globe', e.target.value, e.target.value)}
            placeholder="https://alexmorgan.dev"
            fullWidth
          />
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};
