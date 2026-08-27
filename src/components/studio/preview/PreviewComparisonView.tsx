import React from 'react';
import { Box, Typography, Chip, useTheme, alpha } from '@mui/material';
import CompareArrowsRoundedIcon from '@mui/icons-material/CompareArrowsRounded';
import { CVRenderer } from '../../CVRenderer';
import { CVData, ThemeId, PaletteId, FontFamilyId, SpacingDensity } from '../../../types/cv';

export interface PreviewComparisonViewProps {
  parsedMasterCv: CVData;
  parsedCv: CVData;
  theme: ThemeId;
  palette: PaletteId;
  customColor?: string;
  fontFamily: FontFamilyId;
  spacingDensity: SpacingDensity;
  companyName: string;
  matchScore: number;
  keywordsCount: number;
}

/**
 * Side-by-side comparison layout showing Generic Master Dossier vs. AI-Tailored CV.
 * Principle: Single Responsibility (S) - encapsulates dual-sheet comparison presentation.
 */
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
            Impact Delta: Base Master Profile vs. AI-Tailored Resume for {companyName || 'Target Company'}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Chip
            label={`Match Score: 58% Base ➔ ${matchScore}% Tailored (+${matchScore - 58}%)`}
            color="success"
            size="small"
            sx={{ fontWeight: 800 }}
          />
          <Chip
            label={`${keywordsCount} Keywords Integrated`}
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
              label="1. Base Master Dossier (Generic Baseline)"
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
              label={`2. Surgical Tailored Resume (${matchScore}% Match)`}
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
