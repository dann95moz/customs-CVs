import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  useTheme,
} from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { useTranslation } from 'react-i18next';
import { ColumnEditDialogProps } from '../../../types';
import { getLocalizedColumnTitle } from '../../../utils/kanbanUtils';
import { ColorPalettePicker } from '../../molecules';

const PRESET_COLORS = [
  '#3b82f6', // Blue
  '#8b5cf6', // Purple
  '#ec4899', // Pink
  '#f59e0b', // Amber
  '#10b981', // Emerald
  '#06b6d4', // Cyan
  '#ef4444', // Red
  '#64748b', // Slate
];

export const ColumnEditDialog: React.FC<ColumnEditDialogProps> = ({
  open,
  column,
  onClose,
  onSave,
}) => {
  const { t } = useTranslation(['history', 'common']);
  const theme = useTheme();

  const [title, setTitle] = useState('');
  const [color, setColor] = useState('#3b82f6');

  useEffect(() => {
    if (open) {
      if (column) {
        setTitle(getLocalizedColumnTitle(column, t));
        setColor(column.color || '#3b82f6');
      } else {
        setTitle('');
        setColor('#3b82f6');
      }
    }
  }, [open, column, t]);

  const handleSave = () => {
    if (!title.trim()) return;
    onSave(title.trim(), color);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: '16px',
            p: 1,
          },
        },
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 800 }}>
          {column
            ? t('history:column.editTitle', 'Edit Stage')
            : t('history:column.newTitle', 'New Kanban Stage')}
        </Typography>
        <IconButton size="small" onClick={onClose} sx={{ color: 'text.secondary' }}>
          <CloseRoundedIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '8px !important' }}>
        <TextField
          label={t('history:column.nameField', 'Stage Name')}
          placeholder="e.g. Recruiter Call, Offer, Screening"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
          size="small"
          autoFocus
          required
        />

        <Box>
          <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', display: 'block', mb: 1 }}>
            {t('history:column.colorTheme', 'Accent Color')}
          </Typography>
          <ColorPalettePicker
            swatches={PRESET_COLORS}
            selectedColor={color}
            onSelectColor={setColor}
            size="small"
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, pt: 1 }}>
        <Button onClick={onClose} color="inherit" sx={{ fontWeight: 600 }}>
          {t('common:actions.cancel', 'Cancel')}
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          color="primary"
          disabled={!title.trim()}
          sx={{ fontWeight: 700, px: 2 }}
        >
          {t('common:actions.save', 'Save Stage')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
