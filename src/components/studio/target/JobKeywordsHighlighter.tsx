import React, { useMemo } from 'react';
import {
  Box,
  Typography,
  Chip,
  Tooltip,
  useTheme,
  alpha,
} from '@mui/material';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import { useTranslation } from 'react-i18next';
import { extractJobKeywords } from '../../../core/matching/quickMatcher';

export interface JobKeywordsHighlighterProps {
  jobText: string;
  masterData: string;
}

export const JobKeywordsHighlighter: React.FC<JobKeywordsHighlighterProps> = ({
  jobText,
  masterData,
}) => {
  const { t } = useTranslation(['target', 'common']);
  const theme = useTheme();

  const { keywords, coveredSet, missingSet, highlightedSegments } = useMemo(() => {
    if (!jobText || jobText.trim().length < 20) {
      return {
        keywords: [],
        coveredSet: new Set<string>(),
        missingSet: new Set<string>(),
        highlightedSegments: [],
      };
    }

    const kwList = extractJobKeywords(jobText);
    const lowerMaster = (masterData || '').toLowerCase();

    const covered = new Set<string>();
    const missing = new Set<string>();

    for (const kw of kwList) {
      const clean = kw.toLowerCase().trim();
      const escaped = clean.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
      const regex = new RegExp(`(?:^|[^a-zA-Z0-9#+])${escaped}(?:$|[^a-zA-Z0-9#+])`, 'i');
      if (regex.test(lowerMaster)) {
        covered.add(clean);
      } else {
        missing.add(clean);
      }
    }

    // Build regex pattern matching any keyword with word boundaries
    if (kwList.length === 0) {
      return {
        keywords: [],
        coveredSet: covered,
        missingSet: missing,
        highlightedSegments: [{ text: jobText, isKeyword: false, isCovered: false }],
      };
    }

    const escapedPatterns = kwList
      .map((k) => k.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'))
      .sort((a, b) => b.length - a.length);

    const regex = new RegExp(`(\\b(?:${escapedPatterns.join('|')})\\b)`, 'gi');
    const parts = jobText.split(regex);

    const segments = parts.map((part) => {
      const pLower = part.toLowerCase();
      const isKeyword = covered.has(pLower) || missing.has(pLower);
      const isCovered = covered.has(pLower);
      return {
        text: part,
        isKeyword,
        isCovered,
      };
    });

    return {
      keywords: kwList,
      coveredSet: covered,
      missingSet: missing,
      highlightedSegments: segments,
    };
  }, [jobText, masterData]);

  if (!jobText || jobText.trim().length < 20) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          {t('target:editor.noJobPasted', 'Pega una descripción de vacante para activar el análisis de palabras clave.')}
        </Typography>
      </Box>
    );
  }

  const successColor = theme.palette.success.main;
  const warningColor = theme.palette.warning.main;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Overview Legend Bar */}
      <Box
        sx={{
          p: 1.5,
          px: 2,
          borderBottom: `1px solid ${theme.palette.divider}`,
          bgcolor: alpha(theme.palette.text.primary, 0.02),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 1.5,
        }}
      >
        <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>
          {t('target:highlighter.summary', {
            total: keywords.length,
            covered: coveredSet.size,
            missing: missingSet.size,
            defaultValue: `${keywords.length} requerimientos detectados: ${coveredSet.size} cubiertos, ${missingSet.size} pendientes`,
          })}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                bgcolor: successColor,
              }}
            />
            <Typography variant="caption" sx={{ fontWeight: 600, color: 'success.main' }}>
              {t('target:highlighter.coveredLabel', 'Cubierta en tu perfil')} ({coveredSet.size})
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                bgcolor: warningColor,
              }}
            />
            <Typography variant="caption" sx={{ fontWeight: 600, color: 'warning.main' }}>
              {t('target:highlighter.missingLabel', 'Pendiente por cubrir')} ({missingSet.size})
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Highlighted Document Body */}
      <Box
        sx={{
          p: 2.5,
          flex: 1,
          overflowY: 'auto',
          whiteSpace: 'pre-wrap',
          fontFamily: 'monospace',
          fontSize: '0.875rem',
          lineHeight: 1.7,
          color: 'text.primary',
        }}
      >
        {highlightedSegments.map((segment, index) => {
          if (!segment.isKeyword) {
            return <React.Fragment key={index}>{segment.text}</React.Fragment>;
          }

          const isCovered = segment.isCovered;
          const bg = isCovered ? alpha(successColor, 0.18) : alpha(warningColor, 0.22);
          const border = isCovered ? alpha(successColor, 0.4) : alpha(warningColor, 0.5);
          const tooltip = isCovered
            ? t('target:highlighter.coveredTooltip', '✓ Habilidad presente en tu Perfil Maestro')
            : t('target:highlighter.missingTooltip', '⚡ Brecha detectada: No encontrada en tu Perfil Maestro');

          return (
            <Tooltip key={index} title={tooltip} arrow placement="top">
              <Box
                component="mark"
                sx={{
                  bgcolor: bg,
                  color: 'inherit',
                  border: `1px solid ${border}`,
                  borderRadius: 1,
                  px: 0.5,
                  py: 0.1,
                  mx: 0.2,
                  fontWeight: 700,
                  cursor: 'help',
                  display: 'inline-block',
                  lineHeight: 1.3,
                  transition: 'all 0.15s ease',
                  '&:hover': {
                    filter: 'brightness(1.1)',
                    transform: 'translateY(-1px)',
                  },
                }}
              >
                {segment.text}
              </Box>
            </Tooltip>
          );
        })}
      </Box>
    </Box>
  );
};
