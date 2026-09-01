import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Alert,
} from '@mui/material';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import { useTranslation } from 'react-i18next';

export interface ConfirmDeleteDialogProps {
  open: boolean;
  title?: string;
  message?: string;
  warningMessage?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting?: boolean;
}

export const ConfirmDeleteDialog: React.FC<ConfirmDeleteDialogProps> = React.memo(({
  open,
  title,
  message,
  warningMessage,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
  isDeleting = false,
}) => {
  const { t } = useTranslation(['common']);

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      maxWidth="xs"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: '16px',
            p: 1,
            bgcolor: 'background.paper',
          },
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 800, pb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
        <DeleteOutlineRoundedIcon color="error" />
        {title || t('common:actions.delete', 'Confirm Deletion')}
      </DialogTitle>
      <DialogContent sx={{ pb: 1 }}>
        {warningMessage && (
          <Alert
            severity="warning"
            variant="outlined"
            sx={{ mb: 1.5, py: 0.5, fontSize: '0.8rem', borderRadius: '8px' }}
          >
            {warningMessage}
          </Alert>
        )}
        <DialogContentText sx={{ fontSize: '0.88rem', color: 'text.secondary' }}>
          {message || t('common:confirm.deleteMessage', 'Are you sure you want to delete this item? This action cannot be undone.')}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 2, pb: 1.5, gap: 1 }}>
        <Button
          onClick={onCancel}
          color="inherit"
          variant="outlined"
          size="small"
          disabled={isDeleting}
          sx={{ fontWeight: 700 }}
        >
          {cancelLabel || t('common:actions.cancel', 'Cancel')}
        </Button>
        <Button
          onClick={onConfirm}
          color="error"
          variant="contained"
          size="small"
          disabled={isDeleting}
          startIcon={<DeleteOutlineRoundedIcon />}
          sx={{ fontWeight: 700 }}
        >
          {confirmLabel || t('common:actions.delete', 'Delete Permanently')}
        </Button>
      </DialogActions>
    </Dialog>
  );
});
