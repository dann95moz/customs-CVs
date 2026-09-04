import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Button, IconButton, Tooltip, Chip, alpha, useTheme } from '@mui/material';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import UndoRoundedIcon from '@mui/icons-material/UndoRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import { RADIUS_TOKENS } from '../../../theme/dimensions';
import { AiHoverActionsPillProps } from '../../../types/components';

/**
 * Presentational dumb component for AI granular bullet and summary hover actions.
 * Displays check (accept), undo, AI edited badge, and AI re-generation trigger.
 */
export const AiHoverActionsPill: React.FC<AiHoverActionsPillProps> = ({
  hasUndo,
  isRecentlyRegenerated = false,
  onAccept,
  onUndo,
  onOpenAiPopover,
}) => {
  const { t } = useTranslation(['preview', 'common']);
  const theme = useTheme();

  return (
    <span
      className={`no-print cv-ai-hover-actions ${isRecentlyRegenerated ? 'is-recently-regenerated' : ''} ${hasUndo ? 'has-undo' : ''}`}
    >
      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 0.6,
          bgcolor: 'background.paper',
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: RADIUS_TOKENS.full,
          boxShadow: 2,
          px: hasUndo ? 0.6 : 0.25,
          py: 0.25,
        }}
      >
        {hasUndo && (
          <>
            <Chip
              size="small"
              icon={<AutoAwesomeRoundedIcon sx={{ fontSize: '11px !important', color: 'primary.main' }} />}
              label={t('preview:aiRegen.editedBadge', 'AI Edited')}
              sx={{
                height: 22,
                fontSize: '0.68rem',
                fontWeight: 700,
                border: 'none',
                borderRadius: RADIUS_TOKENS.full,
                bgcolor: alpha(theme.palette.primary.main, 0.08),
                color: 'primary.main',
                '& .MuiChip-label': {
                  px: 0.75,
                },
                '& .MuiChip-icon': {
                  ml: 0.75,
                  mr: -0.25,
                },
              }}
            />

            <Tooltip title={t('preview:aiRegen.accept', 'Accept changes')} arrow placement="top">
              <IconButton
                size="small"
                onClick={onAccept}
                color="success"
                aria-label={t('preview:aiRegen.accept', 'Accept changes')}
                sx={{
                  width: 22,
                  height: 22,
                  bgcolor: alpha(theme.palette.success.main, 0.12),
                  color: 'success.main',
                  borderRadius: RADIUS_TOKENS.full,
                  transition: 'all 0.15s ease',
                  '&:hover': {
                    bgcolor: 'success.main',
                    color: 'success.contrastText',
                    transform: 'scale(1.1)',
                  },
                }}
              >
                <CheckRoundedIcon sx={{ fontSize: 13 }} />
              </IconButton>
            </Tooltip>

            <Tooltip title={t('preview:aiRegen.undoTooltip', 'Undo and revert to previous text')} arrow placement="top">
              <Button
                size="small"
                variant="outlined"
                onClick={onUndo}
                startIcon={<UndoRoundedIcon sx={{ fontSize: '13px !important' }} />}
                sx={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  textTransform: 'none',
                  py: 0.1,
                  px: 0.8,
                  minHeight: 22,
                  height: 22,
                  borderRadius: RADIUS_TOKENS.full,
                  borderColor: 'divider',
                  color: 'text.primary',
                  whiteSpace: 'nowrap',
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                    borderColor: 'primary.main',
                  },
                }}
              >
                {t('preview:aiRegen.undo', 'Undo')}
              </Button>
            </Tooltip>
          </>
        )}

        <Tooltip title={t('preview:aiRegen.tooltip', 'Regenerate with AI')} arrow placement="top">
          <IconButton
            size="small"
            onClick={onOpenAiPopover}
            className="cv-ai-sparkle-btn"
            aria-label={t('preview:aiRegen.tooltip', 'Regenerate with AI')}
            sx={{
              width: 22,
              height: 22,
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              color: 'primary.main',
              borderRadius: RADIUS_TOKENS.full,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.25)}`,
              transition: 'all 0.15s ease',
              '&:hover': {
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                transform: 'scale(1.1)',
              },
            }}
          >
            <AutoAwesomeRoundedIcon sx={{ fontSize: 13 }} />
          </IconButton>
        </Tooltip>
      </Box>
    </span>
  );
};
