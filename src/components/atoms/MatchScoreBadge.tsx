import React from 'react';
import { Chip, Box, Typography, useTheme, alpha } from '@mui/material';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import { useTranslation } from 'react-i18next';

export interface MatchScoreBadgeProps {
  score?: number | null;
  variant?: 'chip' | 'pill' | 'text';
  size?: 'small' | 'medium';
  showLabel?: boolean;
  showIcon?: boolean;
  labelOverride?: string;
  className?: string;
}

export const MatchScoreBadge: React.FC<MatchScoreBadgeProps> = ({
  score,
  variant = 'chip',
  size = 'small',
  showLabel = true,
  showIcon = false,
  labelOverride,
  className,
}) => {
  const { t } = useTranslation(['gap', 'common']);
  const theme = useTheme();

  const numScore = typeof score === 'number' && score > 0 ? Math.round(score) : 0;
  const hasScore = numScore > 0;

  // Determine semantic color based on score thresholds
  const getColor = () => {
    if (!hasScore) return theme.palette.text.secondary;
    if (numScore >= 80) return theme.palette.success.main;
    if (numScore >= 60) return theme.palette.warning.main;
    return theme.palette.info.main;
  };

  const color = getColor();
  const labelText = labelOverride ?? t('gap:matchScore', 'Match');
  const displayValue = hasScore ? `${numScore}%` : '--';

  if (variant === 'text') {
    return (
      <Typography
        component="span"
        className={className}
        sx={{
          fontSize: size === 'small' ? '0.75rem' : '0.875rem',
          fontWeight: 700,
          color,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 0.5,
        }}
      >
        {showIcon && <AutoAwesomeRoundedIcon sx={{ fontSize: size === 'small' ? 14 : 16 }} />}
        {displayValue} {showLabel && labelText}
      </Typography>
    );
  }

  if (variant === 'pill') {
    return (
      <Box
        component="span"
        className={className}
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 0.5,
          px: size === 'small' ? 1 : 1.5,
          py: size === 'small' ? 0.25 : 0.5,
          borderRadius: 9999,
          bgcolor: alpha(color, 0.1),
          color,
          fontSize: size === 'small' ? '0.72rem' : '0.8rem',
          fontWeight: 700,
          lineHeight: 1.2,
          border: `1px solid ${alpha(color, 0.25)}`,
        }}
      >
        {showIcon && <AutoAwesomeRoundedIcon sx={{ fontSize: size === 'small' ? 12 : 14 }} />}
        <span>{displayValue}</span>
        {showLabel && <span style={{ opacity: 0.9 }}>{labelText}</span>}
      </Box>
    );
  }

  // Default 'chip' variant using standard MUI Chip
  return (
    <Chip
      className={className}
      size={size}
      icon={showIcon ? <AutoAwesomeRoundedIcon sx={{ fontSize: '13px !important' }} /> : undefined}
      label={showLabel ? `${displayValue} ${labelText}` : displayValue}
      sx={{
        fontWeight: 700,
        fontSize: size === 'small' ? '0.72rem' : '0.8rem',
        bgcolor: alpha(color, 0.08),
        color,
        border: `1px solid ${alpha(color, 0.25)}`,
        '& .MuiChip-icon': {
          color: 'inherit',
        },
      }}
    />
  );
};
