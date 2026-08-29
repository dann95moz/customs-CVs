import React from 'react';
import { Box, Typography, useTheme, alpha } from '@mui/material';
import StyleRoundedIcon from '@mui/icons-material/StyleRounded';
import FormatPaintRoundedIcon from '@mui/icons-material/FormatPaintRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import SpellcheckRoundedIcon from '@mui/icons-material/SpellcheckRounded';
import { useTranslation } from 'react-i18next';
import { PreviewSidePanelType, StepPreviewNavRailProps } from '../../../types';

export type { PreviewSidePanelType, StepPreviewNavRailProps };

export const StepPreviewNavRail: React.FC<StepPreviewNavRailProps> = ({
  activeSidePanel,
  onToggleSidePanel,
  isEditingMarkdown,
  onToggleMarkdown,
}) => {
  const { t } = useTranslation(['preview', 'common']);
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box
      className="no-print preview-side-rail"
      sx={{
        width: 76,
        borderRight: `1px solid ${theme.palette.divider}`,
        bgcolor: 'background.paper',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        py: 2,
        gap: 1.5,
        flexShrink: 0,
        zIndex: 10,
      }}
    >
      {/* Templates Rail Button */}
      <Box
        onClick={() => onToggleSidePanel('templates')}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          cursor: 'pointer',
          width: '100%',
          px: 0.5,
          gap: 0.5,
          color: activeSidePanel === 'templates' ? 'primary.main' : 'text.secondary',
          transition: 'all 0.15s ease',
          '&:hover': { color: 'text.primary' }
        }}
      >
        <Box
          sx={{
            width: 46,
            height: 46,
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: activeSidePanel === 'templates'
              ? alpha(theme.palette.primary.main, isDark ? 0.2 : 0.1)
              : 'transparent',
            color: activeSidePanel === 'templates' ? 'primary.main' : 'inherit',
            transition: 'all 0.15s ease',
          }}
        >
          <StyleRoundedIcon sx={{ fontSize: 24 }} />
        </Box>
        <Typography
          variant="caption"
          sx={{
            fontSize: '0.68rem',
            fontWeight: activeSidePanel === 'templates' ? 700 : 500,
            textAlign: 'center'
          }}
        >
          {t('preview:navRail.templates', 'Templates')}
        </Typography>
      </Box>

      {/* Design & Formatting Rail Button */}
      <Box
        onClick={() => onToggleSidePanel('design')}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          cursor: 'pointer',
          width: '100%',
          px: 0.5,
          gap: 0.5,
          color: activeSidePanel === 'design' ? 'primary.main' : 'text.secondary',
          transition: 'all 0.15s ease',
          '&:hover': { color: 'text.primary' }
        }}
      >
        <Box
          sx={{
            width: 46,
            height: 46,
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: activeSidePanel === 'design'
              ? alpha(theme.palette.primary.main, isDark ? 0.2 : 0.1)
              : 'transparent',
            color: activeSidePanel === 'design' ? 'primary.main' : 'inherit',
            transition: 'all 0.15s ease',
          }}
        >
          <FormatPaintRoundedIcon sx={{ fontSize: 24 }} />
        </Box>
        <Typography
          variant="caption"
          sx={{
            fontSize: '0.68rem',
            fontWeight: activeSidePanel === 'design' ? 700 : 500,
            textAlign: 'center',
            lineHeight: 1.1
          }}
        >
          {t('preview:navRail.design', 'Design & Format')}
        </Typography>
      </Box>

      {/* Audit Rail Button */}
      <Box
        onClick={() => onToggleSidePanel('audit')}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          cursor: 'pointer',
          width: '100%',
          px: 0.5,
          gap: 0.5,
          color: activeSidePanel === 'audit' ? 'primary.main' : 'text.secondary',
          transition: 'all 0.15s ease',
          '&:hover': { color: 'text.primary' }
        }}
      >
        <Box
          sx={{
            width: 46,
            height: 46,
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: activeSidePanel === 'audit'
              ? alpha(theme.palette.primary.main, isDark ? 0.2 : 0.1)
              : 'transparent',
            color: activeSidePanel === 'audit' ? 'primary.main' : 'inherit',
            transition: 'all 0.15s ease',
          }}
        >
          <SpellcheckRoundedIcon sx={{ fontSize: 24 }} />
        </Box>
        <Typography
          variant="caption"
          sx={{
            fontSize: '0.68rem',
            fontWeight: activeSidePanel === 'audit' ? 700 : 500,
            textAlign: 'center',
            lineHeight: 1.1
          }}
        >
          {t('preview:navRail.audit', 'Quality & Gaps')}
        </Typography>
      </Box>
    </Box>
  );
};
