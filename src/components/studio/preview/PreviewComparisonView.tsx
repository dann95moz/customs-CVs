import React from 'react';
import { Box, Typography, Chip, useTheme, alpha } from '@mui/material';
import CompareArrowsRoundedIcon from '@mui/icons-material/CompareArrowsRounded';
import { useTranslation } from 'react-i18next';
import { CVRenderer } from '../../CVRenderer';
import { CVData, ThemeId, PaletteId, FontFamilyId, SpacingDensity, PreviewComparisonViewProps } from '../../../types';

export type { PreviewComparisonViewProps };

export const PreviewComparisonView: React.FC<PreviewComparisonViewProps> = ({
  parsedMasterCv,
  parsedCv,
  theme,
  palette,
  customColor,
  fontFamily,
  spacingDensity,
  companyName,
  matchScore,
  keywordsCount,
}) => {
  const { t } = useTranslation(['preview', 'gap', 'common']);
  const muiTheme = useTheme();
  const isDark = muiTheme.palette.mode === 'dark';

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Comparison Delta Banner */}
      <Box
        className="no-print"
        sx={{
          py: 1,
          px: 2.5,
          bgcolor: isDark ? alpha(muiTheme.palette.primary.main, 0.08) : '#eff6ff',
          borderBottom: `1px solid ${alpha(muiTheme.palette.primary.main, 0.2)}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <CompareArrowsRoundedIcon color="primary" />
          <Typography variant="body2" sx={{ fontWeight: 700 }}>
            {t('preview:navRail.compare', 'Impact Comparison')}: {companyName || 'Target Company'}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Chip
            label={`${t('gap:matchScore', 'Match')}: 58% ➔ ${matchScore}% (+${matchScore - 58}%)`}
            color="success"
            size="small"
            sx={{ fontWeight: 800 }}
          />
          <Chip
            label={`${keywordsCount} ${t('gap:integratedKeywords', 'Keywords Integrated')}`}
            color="primary"
            variant="outlined"
            size="small"
            sx={{ fontWeight: 700 }}
          />
        </Box>
      </Box>

      {/* Side-by-side Dual Sheet Layout */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          p: 3,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, 1fr)' },
            gap: 3,
            width: '100%',
            maxWidth: 1700,
            alignItems: 'start',
          }}
        >
          {/* Left Sheet: Base / Generic CV */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Chip
              label={`1. ${t('preview:panels.comparison.masterProfile', 'Base Profile (Generic)')}`}
              size="small"
              variant="outlined"
              sx={{ mb: 1, fontWeight: 700 }}
            />
            <div className="paper-sheet" style={{ transform: 'scale(0.88)', transformOrigin: 'top center' }}>
              <CVRenderer
                data={parsedMasterCv}
                theme={theme}
                palette="minimal-slate"
                customColor={palette === 'custom' ? customColor : undefined}
                fontFamily={fontFamily}
                spacingDensity={spacingDensity}
              />
            </div>
          </Box>

          {/* Right Sheet: Tailored CV */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Chip
              label={`2. ${t('preview:panels.comparison.tailoredCv', 'Tailored CV')} (${matchScore}% ${t('gap:matchScore', 'Match')})`}
              size="small"
              color="primary"
              sx={{ mb: 1, fontWeight: 800 }}
            />
            <div className="paper-sheet" style={{ transform: 'scale(0.88)', transformOrigin: 'top center' }}>
              <CVRenderer
                data={parsedCv}
                theme={theme}
                palette={palette}
                customColor={palette === 'custom' ? customColor : undefined}
                fontFamily={fontFamily}
                spacingDensity={spacingDensity}
              />
            </div>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
