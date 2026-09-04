import React, { useRef, useEffect, useState } from 'react';
import { TextField, InputAdornment, SxProps, Theme } from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { ActionIconButton } from '../atoms/ActionIconButton';
import { useTranslation } from 'react-i18next';

export interface SearchBarWithClearProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  size?: 'small' | 'medium';
  fullWidth?: boolean;
  debounceMs?: number;
  autoFocus?: boolean;
  className?: string;
  sx?: SxProps<Theme>;
}

export const SearchBarWithClear: React.FC<SearchBarWithClearProps> = ({
  value,
  onChange,
  placeholder,
  size = 'small',
  fullWidth = false,
  debounceMs = 0,
  autoFocus = false,
  className,
  sx,
}) => {
  const { t } = useTranslation(['common']);
  const [internalValue, setInternalValue] = useState(value);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync with outer value
  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextVal = e.target.value;
    setInternalValue(nextVal);

    if (debounceMs > 0) {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      debounceTimerRef.current = setTimeout(() => {
        debounceTimerRef.current = null;
        onChange(nextVal);
      }, debounceMs);
    } else {
      onChange(nextVal);
    }
  };

  const handleClear = () => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    setInternalValue('');
    onChange('');
  };

  const resolvedPlaceholder = placeholder ?? t('common:actions.search', 'Search...');

  return (
    <TextField
      value={internalValue}
      onChange={handleChange}
      placeholder={resolvedPlaceholder}
      size={size}
      fullWidth={fullWidth}
      autoFocus={autoFocus}
      className={className}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchRoundedIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
            </InputAdornment>
          ),
          endAdornment: internalValue ? (
            <InputAdornment position="end">
              <ActionIconButton
                size="small"
                onClick={handleClear}
                tooltip={t('common:actions.clear', 'Clear')}
                edge="end"
                sx={{ p: 0.25 }}
              >
                <CloseRoundedIcon sx={{ fontSize: 16 }} />
              </ActionIconButton>
            </InputAdornment>
          ) : undefined,
          sx: {
            fontSize: size === 'small' ? '0.82rem' : '0.9rem',
          },
        },
      }}
      sx={{
        minWidth: 200,
        ...sx,
      }}
    />
  );
};
