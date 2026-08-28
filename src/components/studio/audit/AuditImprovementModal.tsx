import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Chip,
  Box,
  Stack,
  IconButton
} from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import { ActionModalState, AuditImprovementModalProps } from '../../../types';

export type { ActionModalState, AuditImprovementModalProps };

/**
 * Modal dialog for applying targeted AI/executive score improvements to the CV.
 * Principle: Single Responsibility (S) - encapsulates interactive improvement prompt dialog.
 */
export const AuditImprovementModal: React.FC<AuditImprovementModalProps> = ({
  modalState,
  onClose,
  onInputChange,
  onApply,
}) => {
  return (
    <Dialog open={modalState.open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AutoAwesomeRoundedIcon color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {modalState.title}
          </Typography>
        </Box>
        <IconButton size="small" onClick={onClose}>
          <CloseRoundedIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
        <Typography variant="body2" color="text.secondary">
          {modalState.description}
        </Typography>

        {modalState.presets.length > 0 && (
          <Box>
            <Typography variant="caption" sx={{ fontWeight: 700, mb: 0.75, display: 'block', color: 'text.secondary' }}>
              Quick Suggestions (Click to apply):
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
              {modalState.presets.map((preset: string, idx: number) => (
                <Chip
                  key={idx}
                  label={preset}
                  size="small"
                  onClick={() => onInputChange(preset)}
                  sx={{
                    maxWidth: '100%',
                    height: 'auto',
                    py: 0.5,
                    cursor: 'pointer',
                    '& .MuiChip-label': { whiteSpace: 'normal', display: 'block' },
                  }}
                />
              ))}
            </Box>
          </Box>
        )}

        <TextField
          multiline
          rows={3}
          label="Proposed Content Addition"
          value={modalState.inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder="Enter content to inject into this section..."
          fullWidth
          size="small"
          autoFocus
        />
      </DialogContent>

      <DialogActions sx={{ p: 2, pt: 0 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AutoAwesomeRoundedIcon />}
          onClick={onApply}
          disabled={!modalState.inputValue.trim()}
        >
          Apply to Tailored CV
        </Button>
      </DialogActions>
    </Dialog>
  );
};
