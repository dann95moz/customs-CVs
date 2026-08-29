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

  const [windowWidth, setWindowWidth] = React.useState<number>(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );

  React.useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 860;
  const scale = isMobile ? Math.min(0.88, Math.max(0.35, (windowWidth - 32) / 794)) : 0.88;

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Comparison Delta Banner */}
      <Box
        className="no-print"
        sx={{
          py: 1,
          px: { xs: 1.5, sm: 2.5 },
          bgcolor: isDark ? alpha(muiTheme.palette.primary.main, 0.08) : '#eff6ff',
          borderBottom: `1px solid ${alpha(muiTheme.palette.primary.main, 0.2)}`,
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'flex-start', sm: 'center' },
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 1.25,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
          <CompareArrowsRoundedIcon color="primary" sx={{ fontSize: 20 }} />
          <Typography variant="body2" sx={{ fontWeight: 700, fontSize: { xs: '0.82rem', sm: '0.875rem' } }}>
            {t('preview:navRail.compare', 'Impact Comparison')}: {companyName || 'Target Company'}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
          <Chip
            label={`${t('gap:matchScore', 'Match')}: 58% ➔ ${matchScore}% (+${matchScore - 58}%)`}
            color="success"
            size="small"
            sx={{ fontWeight: 800, fontSize: '0.72rem' }}
          />
          <Chip
            label={`${keywordsCount} ${t('gap:integratedKeywords', 'Keywords Integrated')}`}
            color="primary"
            variant="outlined"
            size="small"
            sx={{ fontWeight: 700, fontSize: '0.72rem' }}
          />
        </Box>
      </Box>

      {/* Side-by-side Dual Sheet Layout */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          p: { xs: 1.5, sm: 3 },
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
            <div
              className="paper-sheet-wrapper"
              style={{
                width: `${794 * scale}px`,
                overflow: 'hidden',
                display: 'flex',
                justifyContent: 'center',
                margin: '0 auto',
              }}
            >
              <div
                className="paper-sheet"
                style={{
                  transform: `scale(${scale})`,
                  transformOrigin: 'top center',
                  width: '794px',
                  margin: '0 auto',
                }}
              >
                <CVRenderer
                  data={parsedMasterCv}
                  theme={theme}
                  palette="minimal-slate"
                  customColor={palette === 'custom' ? customColor : undefined}
                  fontFamily={fontFamily}
                  spacingDensity={spacingDensity}
                />
              </div>
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
            <div
              className="paper-sheet-wrapper"
              style={{
                width: `${794 * scale}px`,
                overflow: 'hidden',
                display: 'flex',
                justifyContent: 'center',
                margin: '0 auto',
              }}
            >
              <div
                className="paper-sheet"
                style={{
                  transform: `scale(${scale})`,
                  transformOrigin: 'top center',
                  width: '794px',
                  margin: '0 auto',
                }}
              >
                <CVRenderer
                  data={parsedCv}
                  theme={theme}
                  palette={palette}
                  customColor={palette === 'custom' ? customColor : undefined}
                  fontFamily={fontFamily}
                  spacingDensity={spacingDensity}
                />
              </div>
            </div>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
