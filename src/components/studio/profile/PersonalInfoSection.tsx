import React from 'react';
import {
  Box,
  Typography,
  TextField,
} from '@mui/material';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import { useTranslation } from 'react-i18next';
import { ContactType, PersonalInfoSectionProps } from '../../../types';

export type { PersonalInfoSectionProps };

export const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = React.memo(({
  name,
  title,
  contacts,
  onNameChange,
  onTitleChange,
  onContactChange
}) => {
  const { t } = useTranslation(['profile', 'common']);

  const contactValues = React.useMemo(() => {
    const map: Partial<Record<ContactType, string>> = {};
    (contacts || []).forEach((c) => {
      const raw =
        c.type === 'email'
          ? c.label || c.url || ''
          : c.type === 'location' || c.type === 'phone' || c.type === 'text'
          ? c.label || ''
          : c.url || c.label || '';

      let cleaned = raw
        .replace(/^mailto:/i, '')
        .replace(/\\([\[\]+*`_~\\-])/g, '$1')
        .replace(/\*\*([^*]+)\*\*/g, '$1')
        .trim();

      if (c.type === 'linkedin' || c.type === 'github' || c.type === 'globe') {
        const urlMatch = cleaned.match(/https?:\/\/[^\s)\]]+/i);
        if (urlMatch) {
          cleaned = urlMatch[0];
        } else {
          cleaned = cleaned.replace(/[*_\[\]()]/g, '').trim();
        }
      } else {
        cleaned = cleaned.replace(/[*_\[\]]/g, '').replace(/^\\+|\\+$/g, '').trim();
      }
      map[c.type] = cleaned;
    });
    return map;
  }, [contacts]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, p: { xs: 1.5, sm: 2.5 } }}>
      {/* Header Info */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <PersonRoundedIcon color="primary" sx={{ fontSize: 20 }} />
        <Typography variant="subtitle1" sx={{ fontWeight: 800, fontSize: '0.98rem' }}>
          {t('profile:sections.personalInfo.title', 'Información Personal y Contacto')}
        </Typography>
      </Box>

      {/* Inputs Form */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Full Name */}
        <TextField
          label={t('profile:sections.personalInfo.fullName', 'Nombre completo')}
          variant="outlined"
          size="small"
          value={name || ''}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="e.g. Daniel Corredor Acosta"
          fullWidth
        />

        {/* Location & Email (Grid 2 cols) */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
          <TextField
            label={t('profile:sections.personalInfo.location', 'Ubicación')}
            variant="outlined"
            size="small"
            value={contactValues.location || ''}
            onChange={(e) => onContactChange('location', e.target.value)}
            placeholder="e.g. Bogotá, Colombia"
            fullWidth
          />

          <TextField
            label={t('profile:sections.personalInfo.email', 'Email')}
            variant="outlined"
            size="small"
            type="email"
            value={contactValues.email || ''}
            onChange={(e) => onContactChange('email', e.target.value)}
            placeholder="e.g. name@example.com"
            fullWidth
          />
        </Box>

        {/* Professional Title / Specialization */}
        <TextField
          label={t('profile:sections.personalInfo.jobTitle', 'Título Profesional / Especialización')}
          variant="outlined"
          size="small"
          value={title || ''}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="e.g. Staff Frontend Architect | TypeScript & Distributed Systems"
          fullWidth
        />

        {/* Phone, LinkedIn, GitHub & Portfolio (Grid 2 cols) */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
          <TextField
            label={t('profile:sections.personalInfo.phone', 'Teléfono')}
            variant="outlined"
            size="small"
            value={contactValues.phone || ''}
            onChange={(e) => onContactChange('phone', e.target.value)}
            placeholder="e.g. +57 300 123 4567"
            fullWidth
          />

          <TextField
            label={t('profile:sections.personalInfo.linkedin', 'LinkedIn')}
            variant="outlined"
            size="small"
            value={contactValues.linkedin || ''}
            onChange={(e) => onContactChange('linkedin', e.target.value)}
            placeholder="linkedin.com/in/username"
            fullWidth
          />

          <TextField
            label={t('profile:sections.personalInfo.github', 'GitHub')}
            variant="outlined"
            size="small"
            value={contactValues.github || ''}
            onChange={(e) => onContactChange('github', e.target.value)}
            placeholder="github.com/username"
            fullWidth
          />

          <TextField
            label={t('profile:sections.personalInfo.portfolio', 'Portafolio / Web')}
            variant="outlined"
            size="small"
            value={contactValues.globe || ''}
            onChange={(e) => onContactChange('globe', e.target.value)}
            placeholder="myportfolio.dev"
            fullWidth
          />
        </Box>
      </Box>

    </Box>
  );
});
