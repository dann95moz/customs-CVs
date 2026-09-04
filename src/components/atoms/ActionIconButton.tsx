import React from 'react';
import { IconButton, Tooltip, IconButtonProps, TooltipProps } from '@mui/material';

export interface ActionIconButtonProps extends Omit<IconButtonProps, 'title'> {
  tooltip?: string;
  tooltipPlacement?: TooltipProps['placement'];
  children: React.ReactNode;
}

export const ActionIconButton: React.FC<ActionIconButtonProps> = ({
  tooltip,
  tooltipPlacement = 'top',
  children,
  'aria-label': ariaLabel,
  disabled,
  size = 'small',
  sx,
  ...rest
}) => {
  const label = ariaLabel || tooltip;

  const button = (
    <IconButton
      size={size}
      aria-label={label}
      disabled={disabled}
      sx={{
        transition: 'all 0.15s ease-in-out',
        ...sx,
      }}
      {...rest}
    >
      {children}
    </IconButton>
  );

  if (tooltip && !disabled) {
    return (
      <Tooltip title={tooltip} placement={tooltipPlacement} arrow>
        {button}
      </Tooltip>
    );
  }

  return button;
};
