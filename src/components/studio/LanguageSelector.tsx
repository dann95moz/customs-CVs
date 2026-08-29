import React, { useState } from 'react';
import {
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Tooltip,
  Box,
  useTheme,
  alpha,
} from '@mui/material';
import LanguageRoundedIcon from '@mui/icons-material/LanguageRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES, SupportedLanguage } from '../../i18n/types';

export interface LanguageSelectorProps {
  variant?: 'navbar' | 'compact' | 'full';
  showLabel?: boolean;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  variant = 'navbar',
  showLabel = false,
}) => {
  const { i18n, t } = useTranslation('common');
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const currentLangCode = (i18n.language?.substring(0, 2) as SupportedLanguage) || 'en';
  const currentLang =
    SUPPORTED_LANGUAGES.find((l) => l.code === currentLangCode) || SUPPORTED_LANGUAGES[0];

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelectLanguage = (code: SupportedLanguage) => {
    i18n.changeLanguage(code);
    handleClose();
  };

  return (
    <>
      <Tooltip title={t('language.chooseLanguage', 'Select language')}>
        <Button
          onClick={handleClick}
          size="small"
          aria-controls={open ? 'language-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          startIcon={<LanguageRoundedIcon sx={{ fontSize: '1.1rem' }} />}
          sx={{
            minWidth: variant === 'compact' ? 40 : 'auto',
            px: variant === 'compact' ? 1 : 1.25,
            py: 0.6,
            borderRadius: '8px',
            border: `1px solid ${theme.palette.divider}`,
            color: 'text.primary',
            bgcolor: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.03)',
            fontWeight: 600,
            fontSize: '0.82rem',
            textTransform: 'none',
            transition: 'all 0.2s ease',
            '&:hover': {
              bgcolor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
              borderColor: alpha(theme.palette.primary.main, 0.5),
            },
          }}
        >
          <Box component="span" sx={{ mr: 0.5, fontSize: '0.95rem' }}>
            {currentLang.flag}
          </Box>
          {showLabel && (
            <Typography
              variant="caption"
              sx={{
                fontWeight: 700,
                letterSpacing: '0.02em',
                display: { xs: 'none', sm: 'inline' },
              }}
            >
              {currentLang.code.toUpperCase()}
            </Typography>
          )}
        </Button>
      </Tooltip>

      <Menu
        id="language-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        slotProps={{
          paper: {
            elevation: 4,
            sx: {
              minWidth: 190,
              borderRadius: '12px',
              mt: 0.75,
              border: `1px solid ${theme.palette.divider}`,
              bgcolor: isDark ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.98)',
              backdropFilter: 'blur(12px)',
              boxShadow: isDark
                ? '0 10px 30px rgba(0, 0, 0, 0.5)'
                : '0 10px 30px rgba(0, 0, 0, 0.1)',
              overflow: 'visible',
              '& .MuiMenuItem-root': {
                px: 1.75,
                py: 1,
                borderRadius: '8px',
                mx: 0.75,
                my: 0.25,
                transition: 'all 0.15s ease',
                '&:hover': {
                  bgcolor: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.04)',
                },
                '&.Mui-selected': {
                  bgcolor: alpha(theme.palette.primary.main, isDark ? 0.18 : 0.1),
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, isDark ? 0.24 : 0.15),
                  },
                },
              },
            },
          },
        }}
      >
        <Box sx={{ px: 2, py: 1, borderBottom: `1px solid ${theme.palette.divider}` }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {t('language.selectLanguage', 'Language')}
          </Typography>
        </Box>

        {SUPPORTED_LANGUAGES.map((lang) => {
          const isSelected = currentLang.code === lang.code;
          return (
            <MenuItem
              key={lang.code}
              selected={isSelected}
              onClick={() => handleSelectLanguage(lang.code)}
            >
              <ListItemIcon sx={{ minWidth: 28, fontSize: '1.1rem' }}>
                {lang.flag}
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="body2" sx={{ fontWeight: isSelected ? 700 : 500 }}>
                    {lang.nativeLabel}
                  </Typography>
                }
                secondary={
                  lang.nativeLabel !== lang.label ? (
                    <Typography variant="caption" color="text.secondary">
                      {lang.label}
                    </Typography>
                  ) : null
                }
              />
              {isSelected && (
                <CheckRoundedIcon
                  fontSize="small"
                  color="primary"
                  sx={{ ml: 1, fontSize: '1.1rem' }}
                />
              )}
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
};
