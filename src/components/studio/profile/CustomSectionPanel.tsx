import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  TextField,
  Paper,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  alpha,
} from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DragIndicatorRoundedIcon from '@mui/icons-material/DragIndicatorRounded';
import WorkspacePremiumRoundedIcon from '@mui/icons-material/WorkspacePremiumRounded';
import EmojiEventsRoundedIcon from '@mui/icons-material/EmojiEventsRounded';
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded';
import VolunteerActivismRoundedIcon from '@mui/icons-material/VolunteerActivismRounded';
import RecordVoiceOverRoundedIcon from '@mui/icons-material/RecordVoiceOverRounded';
import PushPinRoundedIcon from '@mui/icons-material/PushPinRounded';
import { useTranslation } from 'react-i18next';
import { CustomSection, CustomSectionPresetType } from '../../../types/cv';

export interface CustomSectionPanelProps {
  section: CustomSection;
  onUpdateTitle: (newTitle: string) => void;
  onAddItem: (itemText: string) => void;
  onUpdateItem: (index: number, newText: string) => void;
  onRemoveItem: (index: number) => void;
  onRemoveSection: () => void;
}

export const getPresetIcon = (presetType?: CustomSectionPresetType, fontSize = 20) => {
  switch (presetType) {
    case 'certifications':
      return <WorkspacePremiumRoundedIcon sx={{ fontSize, color: '#0284c7' }} />;
    case 'awards':
      return <EmojiEventsRoundedIcon sx={{ fontSize, color: '#eab308' }} />;
    case 'publications':
      return <MenuBookRoundedIcon sx={{ fontSize, color: '#8b5cf6' }} />;
    case 'volunteering':
      return <VolunteerActivismRoundedIcon sx={{ fontSize, color: '#10b981' }} />;
    case 'conferences':
      return <RecordVoiceOverRoundedIcon sx={{ fontSize, color: '#f97316' }} />;
    default:
      return <PushPinRoundedIcon sx={{ fontSize, color: 'primary.main' }} />;
  }
};

export const CustomSectionPanel: React.FC<CustomSectionPanelProps> = ({
  section,
  onUpdateTitle,
  onAddItem,
  onUpdateItem,
  onRemoveItem,
  onRemoveSection,
}) => {
  const { t } = useTranslation(['profile', 'common']);
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const [newItemText, setNewItemText] = useState('');
  const [editingTitle, setEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(section.title);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const getPlaceholder = (presetType?: CustomSectionPresetType) => {
    switch (presetType) {
      case 'certifications':
        return t(
          'profile:customSections.placeholders.certifications',
          'Ej. AWS Certified Solutions Architect – Associate (2024) • Amazon Web Services'
        );
      case 'awards':
        return t(
          'profile:customSections.placeholders.awards',
          'Ej. 1er Lugar – Hackathon Nacional de Inteligencia Artificial (2023)'
        );
      case 'publications':
        return t(
          'profile:customSections.placeholders.publications',
          'Ej. "Arquitecturas Reactivas en Sistemas Distribuidos", Conferencia IEEE (2022)'
        );
      case 'volunteering':
        return t(
          'profile:customSections.placeholders.volunteering',
          'Ej. Mentor de Programación Web – Fundación Código Libre (2021 – Presente)'
        );
      case 'conferences':
        return t(
          'profile:customSections.placeholders.conferences',
          'Ej. Speaker: "Microfrontends a Gran Escala" – TechConf Latam (2023)'
        );
      default:
        return t('profile:customSections.placeholders.custom', 'Escribe un logro, detalle o elemento para esta sección...');
    }
  };

  const handleAddItem = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newItemText.trim()) return;
    onAddItem(newItemText.trim());
    setNewItemText('');
  };

  const handleSaveTitle = () => {
    if (tempTitle.trim() && tempTitle.trim() !== section.title) {
      onUpdateTitle(tempTitle.trim());
    }
    setEditingTitle(false);
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      {/* Header Banner */}
      <Paper
        variant="outlined"
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderRadius: '12px',
          bgcolor: isDark ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.015)',
          borderColor: theme.palette.divider,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1, minWidth: 0 }}>
          <Box
            sx={{
              p: 1,
              borderRadius: '8px',
              bgcolor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {getPresetIcon(section.presetType, 22)}
          </Box>

          {editingTitle ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1, maxWidth: 400 }}>
              <TextField
                size="small"
                autoFocus
                value={tempTitle}
                onChange={(e) => setTempTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveTitle();
                  if (e.key === 'Escape') {
                    setTempTitle(section.title);
                    setEditingTitle(false);
                  }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': { borderRadius: '8px' },
                }}
              />
              <Button size="small" variant="contained" onClick={handleSaveTitle}>
                {t('common:actions.save', 'Guardar')}
              </Button>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                {section.title}
              </Typography>
              <Tooltip title={t('common:actions.edit', 'Renombrar Sección')}>
                <IconButton
                  size="small"
                  onClick={() => {
                    setTempTitle(section.title);
                    setEditingTitle(true);
                  }}
                  sx={{ color: 'text.secondary' }}
                >
                  <EditRoundedIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Tooltip>
            </Box>
          )}
        </Box>

        {/* Delete Section Action */}
        <Tooltip title={t('profile:customSections.deleteSectionTip', 'Eliminar esta sección completa')}>
          <IconButton
            size="small"
            color="error"
            onClick={() => setShowDeleteConfirm(true)}
            sx={{
              p: 0.8,
              border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
              '&:hover': {
                bgcolor: alpha(theme.palette.error.main, 0.08),
                borderColor: theme.palette.error.main,
              },
            }}
          >
            <DeleteOutlineRoundedIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>
      </Paper>

      {/* Add New Item Form */}
      <Box
        component="form"
        onSubmit={handleAddItem}
        sx={{ display: 'flex', gap: 1, alignItems: 'center' }}
      >
        <TextField
          fullWidth
          size="small"
          placeholder={getPlaceholder(section.presetType)}
          value={newItemText}
          onChange={(e) => setNewItemText(e.target.value)}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
            },
          }}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          startIcon={<AddRoundedIcon />}
          disabled={!newItemText.trim()}
          sx={{
            fontWeight: 700,
            whiteSpace: 'nowrap',
            px: 2.5,
          }}
        >
          {t('common:actions.add', 'Agregar')}
        </Button>
      </Box>

      {/* Items List */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {section.items && section.items.length > 0 ? (
          section.items.map((item, index) => (
            <Paper
              key={index}
              variant="outlined"
              sx={{
                p: 1.5,
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                borderRadius: '8px',
                borderColor: theme.palette.divider,
                bgcolor: 'background.paper',
                transition: 'all 0.15s ease',
                '&:hover': {
                  borderColor: theme.palette.primary.main,
                  bgcolor: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.01)',
                },
              }}
            >
              <DragIndicatorRoundedIcon sx={{ color: 'text.disabled', fontSize: 18 }} />
              <TextField
                fullWidth
                variant="standard"
                value={item}
                onChange={(e) => onUpdateItem(index, e.target.value)}
                slotProps={{
                  input: {
                    disableUnderline: true,
                    sx: { fontSize: '0.9rem', fontWeight: 500 },
                  },
                }}
              />
              <Tooltip title={t('common:actions.delete', 'Eliminar')}>
                <IconButton
                  size="small"
                  onClick={() => onRemoveItem(index)}
                  sx={{
                    color: 'text.disabled',
                    '&:hover': { color: theme.palette.error.main },
                  }}
                >
                  <DeleteOutlineRoundedIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </Tooltip>
            </Paper>
          ))
        ) : (
          <Box
            sx={{
              py: 5,
              textAlign: 'center',
              border: `1px dashed ${theme.palette.divider}`,
              borderRadius: '12px',
            }}
          >
            <Typography variant="body2" color="text.secondary">
              {t('profile:customSections.emptyList', 'Aún no has agregado ningún elemento a esta sección.')}
            </Typography>
            <Typography variant="caption" color="text.disabled" sx={{ mt: 0.5, display: 'block' }}>
              {t('profile:customSections.emptyListSub', 'Usa el campo superior para ingresar tus certificaciones, premios o logros.')}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        maxWidth="xs"
        slotProps={{
          paper: {
            sx: { borderRadius: '16px', p: 1 },
          },
        }}
      >

        <DialogTitle sx={{ fontWeight: 800, pb: 1 }}>
          {t('profile:customSections.deleteTitle', '¿Eliminar sección?')}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            {t(
              'profile:customSections.deleteConfirm',
              'Esta acción eliminará "{{title}}" y todos sus elementos del perfil.',
              { title: section.title }
            )}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, justifyContent: 'space-between' }}>
          <Button variant="text" color="inherit" onClick={() => setShowDeleteConfirm(false)}>
            {t('common:actions.cancel', 'Cancelar')}
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              setShowDeleteConfirm(false);
              onRemoveSection();
            }}
            sx={{ fontWeight: 700 }}
          >
            {t('common:actions.delete', 'Eliminar')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
