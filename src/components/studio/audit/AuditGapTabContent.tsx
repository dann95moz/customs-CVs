import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Chip,
  Button,
  useTheme,
  alpha,
} from '@mui/material';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import ArticleRoundedIcon from '@mui/icons-material/ArticleRounded';
import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded';
import { useTranslation } from 'react-i18next';

export interface AuditGapTabContentProps {
  matchScore: number;
  companyName?: string;
  targetRole?: string;
  matchedKeywords: string[];
  missingKeywords: string[];
  hasGapMarkdown: boolean;
  onViewFullReport: () => void;
}

export const AuditGapTabContent: React.FC<AuditGapTabContentProps> = React.memo(({
  matchScore,
  companyName,
  targetRole,
  matchedKeywords,
  missingKeywords,
  hasGapMarkdown,
  onViewFullReport,
}) => {
  const { t } = useTranslation(['gap', 'target', 'common']);
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* Match Score Banner */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: '12px',
            bgcolor: alpha(theme.palette.primary.main, 0.15),
            border: `1.5px solid ${theme.palette.primary.main}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 900, color: theme.palette.primary.main }}>
            {matchScore}%
          </Typography>
        </Box>
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
            {t('gap:matchScore', 'Role Match')}: {companyName ? `${companyName}` : t('target:fields.company', 'Target Job')}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {targetRole || t('gap:subtitle', 'Synthesized against required employer qualifications')}
          </Typography>
        </Box>
      </Box>

      {/* Keyword Alignment (Matched vs Missing) */}
      <Box>
        <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', display: 'block', mb: 1 }}>
          {t('gap:integratedKeywords', 'Aligned Keywords & Competencies')}:
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mb: 1.5 }}>
          {matchedKeywords.map((kw: string) => (
            <Chip
              key={kw}
              icon={<CheckCircleRoundedIcon sx={{ fontSize: '13px !important' }} />}
              label={kw}
              size="small"
              color="success"
              variant="outlined"
              sx={{ fontWeight: 600 }}
            />
          ))}
          {missingKeywords.map((kw: string) => (
            <Chip
              key={kw}
              icon={<WarningAmberRoundedIcon sx={{ fontSize: '13px !important' }} />}
              label={kw}
              size="small"
              color="warning"
              variant="outlined"
              sx={{ fontWeight: 600 }}
            />
          ))}
        </Box>
      </Box>

      {/* Strategic Highlights */}
      <Paper
        variant="outlined"
        sx={{
          p: 1.75,
          borderRadius: '12px',
          bgcolor: isDark ? alpha(theme.palette.primary.main, 0.05) : '#f8fafc',
          borderColor: alpha(theme.palette.primary.main, 0.2),
        }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 0.75 }}>
          {t('gap:title', 'Strategic Positioning')}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', lineHeight: 1.55 }}>
          {t('gap:subtitle', 'Your experience highlights core requirements and architecture impact requested in the job description.')}
        </Typography>
      </Paper>

      {/* Progressive Disclosure Link / Button */}
      {hasGapMarkdown && (
        <Button
          fullWidth
          variant="outlined"
          color="primary"
          size="small"
          startIcon={<ArticleRoundedIcon />}
          endIcon={<OpenInNewRoundedIcon sx={{ fontSize: '14px !important' }} />}
          onClick={onViewFullReport}
          sx={{
            textTransform: 'none',
            fontWeight: 700,
            py: 0.8,
            fontSize: '0.8rem',
          }}
        >
          {t('gap:downloadReport', 'View Full Gap Strategy Report')}
        </Button>
      )}
    </Box>
  );
});
