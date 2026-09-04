import React from 'react';
import { Box, Tooltip, useTheme, SxProps, Theme } from '@mui/material';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';

export interface ColorSwatchItem {
  id: string;
  color: string;
  label?: string;
}

export interface ColorPalettePickerProps {
  swatches: (string | ColorSwatchItem)[];
  selectedColor?: string;
  selectedId?: string;
  onSelectColor?: (color: string) => void;
  onSelectId?: (id: string) => void;
  size?: 'small' | 'medium';
  sx?: SxProps<Theme>;
}

export const ColorPalettePicker: React.FC<ColorPalettePickerProps> = ({
  swatches,
  selectedColor,
  selectedId,
  onSelectColor,
  onSelectId,
  size = 'small',
  sx,
}) => {
  const theme = useTheme();
  const swatchSize = size === 'small' ? 26 : 34;

  const normalizedSwatches: ColorSwatchItem[] = swatches.map((s) => {
    if (typeof s === 'string') {
      return { id: s, color: s, label: s };
    }
    return s;
  });

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 1,
        flexWrap: 'wrap',
        alignItems: 'center',
        ...sx,
      }}
    >
      {normalizedSwatches.map((item) => {
        const isSelected =
          (selectedId && item.id === selectedId) ||
          (selectedColor && item.color.toLowerCase() === selectedColor.toLowerCase());

        const swatchNode = (
          <Box
            component="button"
            type="button"
            key={item.id}
            onClick={() => {
              onSelectId?.(item.id);
              onSelectColor?.(item.color);
            }}
            aria-label={item.label || item.color}
            sx={{
              width: swatchSize,
              height: swatchSize,
              borderRadius: '50%',
              bgcolor: item.color,
              p: 0,
              cursor: 'pointer',
              border: isSelected
                ? `2px solid ${theme.palette.background.paper}`
                : '2px solid transparent',
              outline: isSelected ? `2px solid ${item.color}` : 'none',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              boxShadow: isSelected ? 2 : 0,
              '&:hover': {
                transform: 'scale(1.15)',
              },
            }}
          >
            {isSelected && (
              <CheckRoundedIcon
                sx={{
                  fontSize: size === 'small' ? 14 : 18,
                  color: 'common.white',
                  filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.5))',
                }}
              />
            )}
          </Box>
        );

        if (item.label) {
          return (
            <Tooltip key={item.id} title={item.label} arrow placement="top">
              {swatchNode}
            </Tooltip>
          );
        }

        return swatchNode;
      })}
    </Box>
  );
};
