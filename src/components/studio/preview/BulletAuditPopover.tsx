import React from 'react';
import {
  Popover,
  Box,
  Typography,
  Button,
  useTheme,
  alpha,
  IconButton,
} from '@mui/material';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { useTranslation } from 'react-i18next';
import { BulletAuditIssue } from '../../../core/audit/bulletAuditor';

export interface BulletAuditPopoverProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  issue: BulletAuditIssue | null;
  onClose: () => void;
  onOptimizeWithAi?: () => void;
}

export const BulletAuditPopover: React.FC<BulletAuditPopoverProps> = ({
  anchorEl,
  open,
  issue,
  onClose,
  onOptimizeWithAi,
}) => {
  const { t } = useTranslation(['preview', 'common']);
  const theme = useTheme();

  if (!issue) return null;

  const warningColor = theme.palette.warning.main;

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      slotProps={{
        paper: {
          sx: {
            p: 2,
            maxWidth: 340,
            borderRadius: 2,
            border: `1px solid ${alpha(warningColor, 0.3)}`,
            boxShadow: 3,
          },
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1, mb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              bgcolor: alpha(warningColor, 0.12),
              color: warningColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <WarningAmberRoundedIcon sx={{ fontSize: 16 }} />
          </Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
            {t(issue.titleKey, issue.defaultTitle)}
          </Typography>
        </Box>
        <IconButton size="small" onClick={onClose} sx={{ color: 'text.secondary', p: 0.25 }}>
          <CloseRoundedIcon sx={{ fontSize: 16 }} />
        </IconButton>
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8125rem', mb: 1.25 }}>
        {t(issue.descKey, issue.defaultDesc)}
      </Typography>

      <Box
        sx={{
          p: 1.25,
          mb: 1.75,
          borderRadius: 1.5,
          bgcolor: alpha(theme.palette.primary.main, 0.05),
          border: `1px dashed ${alpha(theme.palette.primary.main, 0.3)}`,
        }}
      >
        <Typography variant="caption" sx={{ display: 'block', fontWeight: 700, color: 'primary.main', mb: 0.25 }}>
          💡 {t('preview:bulletAudit.hintTitle', 'Fórmula Google XYZ recomendada:')}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
          {t(issue.suggestionKey, issue.defaultSuggestion)}
        </Typography>
      </Box>

      {onOptimizeWithAi && (
        <Button
          fullWidth
          size="small"
          variant="contained"
          color="primary"
          startIcon={<AutoAwesomeRoundedIcon sx={{ fontSize: 15 }} />}
          onClick={() => {
            onClose();
            onOptimizeWithAi();
          }}
          sx={{ fontWeight: 700, textTransform: 'none', py: 0.5 }}
        >
          {t('preview:bulletAudit.optimizeWithAi', 'Optimizar logro con IA')}
        </Button>
      )}
    </Popover>
  );
};
