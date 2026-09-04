import React from 'react';
import { Box, useTheme, alpha } from '@mui/material';

export interface StatusDotProps {
  color?: 'primary' | 'success' | 'warning' | 'error' | 'info' | 'default' | string;
  size?: number;
  pulse?: boolean;
  className?: string;
}

export const StatusDot: React.FC<StatusDotProps> = ({
  color = 'primary',
  size = 8,
  pulse = false,
  className,
}) => {
  const theme = useTheme();

  // Resolve color from theme palette or direct string
  const resolvedColor = (() => {
    switch (color) {
      case 'primary':
        return theme.palette.primary.main;
      case 'success':
        return theme.palette.success.main;
      case 'warning':
        return theme.palette.warning.main;
      case 'error':
        return theme.palette.error.main;
      case 'info':
        return theme.palette.info.main;
      case 'default':
        return theme.palette.text.secondary;
      default:
        return color;
    }
  })();

  return (
    <Box
      component="span"
      className={className}
      sx={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size,
        flexShrink: 0,
      }}
    >
      {pulse && (
        <Box
          component="span"
          sx={{
            position: 'absolute',
            width: size * 2,
            height: size * 2,
            borderRadius: '50%',
            bgcolor: alpha(resolvedColor, 0.35),
            animation: 'statusPulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            '@keyframes statusPulse': {
              '0%': { transform: 'scale(0.8)', opacity: 0.8 },
              '50%': { transform: 'scale(1.4)', opacity: 0.2 },
              '100%': { transform: 'scale(0.8)', opacity: 0.8 },
            },
          }}
        />
      )}
      <Box
        component="span"
        sx={{
          width: size,
          height: size,
          borderRadius: '50%',
          bgcolor: resolvedColor,
          zIndex: 1,
        }}
      />
    </Box>
  );
};
