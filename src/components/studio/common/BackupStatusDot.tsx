import React from 'react';
import {
  Box,
  Tooltip,
  Typography,
  Chip,
  useTheme,
  alpha,
} from '@mui/material';
import CloudDoneRoundedIcon from '@mui/icons-material/CloudDoneRounded';
import BackupRoundedIcon from '@mui/icons-material/BackupRounded';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import { useTranslation } from 'react-i18next';

export interface BackupStatusDotProps {
  lastBackupTimestamp?: number;
  unsavedChangesCount?: number;
  onClickBackup?: () => void;
}

export const BackupStatusDot: React.FC<BackupStatusDotProps> = ({
  lastBackupTimestamp,
  unsavedChangesCount = 0,
  onClickBackup,
}) => {
  const { t } = useTranslation(['common']);
  const theme = useTheme();

  const now = Date.now();
  const timestamp = lastBackupTimestamp || now;
  const daysDiff = Math.floor(Math.max(0, now - timestamp) / (1000 * 60 * 60 * 24));

  // Determine status tier:
  // - success: backed up within the last 3 days
  // - warning: 3 to 10 days
  // - error: > 10 days
  let statusColor: 'success' | 'warning' | 'error' = 'success';
  if (daysDiff > 10) {
    statusColor = 'error';
  } else if (daysDiff >= 3) {
    statusColor = 'warning';
  }

  const colorHex = theme.palette[statusColor].main;

  const getLabelText = () => {
    if (daysDiff === 0) {
      return t('common:backup.today', 'Respaldo: Hoy');
    }
    return t('common:backup.daysAgo', {
      count: daysDiff,
      defaultValue: `Respaldo: hace ${daysDiff}d`,
    });
  };

  const getTooltipText = () => {
    let statusDesc = '';
    if (statusColor === 'success') {
      statusDesc = t('common:backup.tooltipFresh', 'Tus datos están recientemente respaldados.');
    } else if (statusColor === 'warning') {
      statusDesc = t('common:backup.tooltipModerate', 'Han pasado varios días desde tu último respaldo.');
    } else {
      statusDesc = t('common:backup.tooltipOld', 'Atención: Tu último respaldo tiene más de 10 días.');
    }

    const changesDesc =
      unsavedChangesCount > 0
        ? ` (${unsavedChangesCount} ${t('common:backup.changesDetected', 'cambios no exportados')})`
        : '';

    return `${getLabelText()} — ${statusDesc}${changesDesc}. ${t('common:backup.clickToExport', 'Haz clic para exportar un respaldo .md')}`;
  };

  return (
    <Tooltip title={getTooltipText()} arrow>
      <Box
        onClick={onClickBackup}
        role={onClickBackup ? 'button' : undefined}
        tabIndex={onClickBackup ? 0 : undefined}
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 0.75,
          px: { xs: 0.75, sm: 1.25 },
          py: 0.4,
          borderRadius: 9999,
          bgcolor: alpha(colorHex, 0.08),
          border: `1px solid ${alpha(colorHex, 0.25)}`,
          cursor: onClickBackup ? 'pointer' : 'default',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': onClickBackup
            ? {
                bgcolor: alpha(colorHex, 0.16),
                transform: 'translateY(-1px)',
              }
            : {},
        }}
      >
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            bgcolor: colorHex,
            boxShadow: `0 0 6px ${alpha(colorHex, 0.6)}`,
            flexShrink: 0,
          }}
        />

        <Box
          component="span"
          sx={{
            display: { xs: 'none', md: 'inline' },
            fontSize: '0.75rem',
            fontWeight: 600,
            color: 'text.primary',
            whiteSpace: 'nowrap',
          }}
        >
          {getLabelText()}
        </Box>

        {unsavedChangesCount >= 3 && (
          <Box
            component="span"
            sx={{
              display: { xs: 'none', lg: 'inline' },
              fontSize: '0.6875rem',
              color: 'text.secondary',
              whiteSpace: 'nowrap',
            }}
          >
            ({unsavedChangesCount} {t('common:backup.pending', 'pendientes')})
          </Box>
        )}
      </Box>
    </Tooltip>
  );
};
