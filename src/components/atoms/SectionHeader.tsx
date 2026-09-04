import React from 'react';
import { Box, Typography, SxProps, Theme } from '@mui/material';

export interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  size?: 'small' | 'medium';
  sx?: SxProps<Theme>;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  icon,
  action,
  size = 'medium',
  sx,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 1,
        ...sx,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
        {icon && (
          <Box
            component="span"
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'primary.main',
              flexShrink: 0,
            }}
          >
            {icon}
          </Box>
        )}
        <Box sx={{ minWidth: 0 }}>
          <Typography
            variant={size === 'small' ? 'subtitle2' : 'subtitle1'}
            sx={{
              fontWeight: 800,
              lineHeight: 1.25,
              color: 'text.primary',
            }}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography
              variant="caption"
              sx={{
                color: 'text.secondary',
                display: 'block',
                lineHeight: 1.3,
                mt: 0.25,
              }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>
      </Box>

      {action && (
        <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
          {action}
        </Box>
      )}
    </Box>
  );
};
