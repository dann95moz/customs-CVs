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
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import BoltRoundedIcon from '@mui/icons-material/BoltRounded';
import { useTranslation } from 'react-i18next';
import { QualityAuditReport, StrategicGrowthPillar } from '../../../types/audit';
import { RADIUS_TOKENS } from '../../../theme/dimensions';

export interface AuditPillarsBreakdownProps {
  auditReport: QualityAuditReport;
  onOpenAction: (actionText: string, sectionName: string) => void;
  getActionButtonLabel: (pillarName: string) => string;
}


export const AuditPillarsBreakdown: React.FC<AuditPillarsBreakdownProps> = React.memo(({
  auditReport,
  onOpenAction,
  getActionButtonLabel,
}) => {
  const { t } = useTranslation(['audit', 'common']);
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* Section-by-Section Real Content Quality */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {/* Summary */}
        <Paper
          variant="outlined"
          sx={{
            p: 1.5,
            borderRadius: RADIUS_TOKENS.lg,
            bgcolor: isDark ? alpha(theme.palette.background.default, 0.4) : alpha(theme.palette.action.hover, 0.04),
            display: 'flex',
            flexDirection: 'column',
            gap: 0.75,
            boxSizing: 'border-box',
            transition: 'border-color 0.2s ease',
            '&:hover': { borderColor: 'success.main' },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'gap', gap: 0.75 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, fontSize: '0.85rem' }}>
              {t('audit:sections.summary', 'Professional Summary')}
            </Typography>
            <Chip
              label={t('audit:drawerCards.summaryOptimal', 'Optimal')}
              size="small"
              color="success"
              variant="outlined"
              sx={{ fontWeight: 700 }}
            />
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', lineHeight: 1.5 }}>
            {t('audit:drawerCards.summaryDesc', 'Concise 3-4 sentence hook establishing core value, domain expertise, and quantified achievements.')}
          </Typography>
        </Paper>

        {/* Experience */}
        <Paper
          variant="outlined"
          sx={{
            p: 1.5,
            borderRadius: RADIUS_TOKENS.lg,
            bgcolor: isDark ? alpha(theme.palette.background.default, 0.4) : alpha(theme.palette.action.hover, 0.04),
            display: 'flex',
            flexDirection: 'column',
            gap: 0.75,
            boxSizing: 'border-box',
            transition: 'border-color 0.2s ease',
            '&:hover': { borderColor: 'success.main' },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'gap', gap: 0.75 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, fontSize: '0.85rem' }}>
              {t('audit:sections.experience', 'Work Experience')}
            </Typography>
            <Chip
              label={t('audit:drawerCards.experienceXyz', '9/10 XYZ')}
              size="small"
              color="success"
              variant="outlined"
              sx={{ fontWeight: 700 }}
            />
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', lineHeight: 1.5 }}>
            {t('audit:drawerCards.experienceDesc', 'Strong Google XYZ formula use: Accomplished [X], as measured by [Y], by doing [Z] with quantified business impact.')}
          </Typography>
        </Paper>

        {/* Skills & ATS Density */}
        <Paper
          variant="outlined"
          sx={{
            p: 1.5,
            borderRadius: RADIUS_TOKENS.lg,
            bgcolor: isDark ? alpha(theme.palette.background.default, 0.4) : alpha(theme.palette.action.hover, 0.04),
            display: 'flex',
            flexDirection: 'column',
            gap: 0.75,
            boxSizing: 'border-box',
            transition: 'border-color 0.2s ease',
            '&:hover': { borderColor: 'success.main' },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'gap', gap: 0.75 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, fontSize: '0.85rem' }}>
              {t('audit:sections.skills', 'Technical Skills & ATS')}
            </Typography>
            <Chip
              label={t('audit:drawerCards.skillsPass', '95% Pass')}
              size="small"
              color="success"
              variant="outlined"
              sx={{ fontWeight: 700 }}
            />
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', lineHeight: 1.5 }}>
            {t('audit:drawerCards.skillsDesc', 'High density of exact keywords matching requirements without stuffing.')}
          </Typography>
        </Paper>
      </Box>

      {/* Key Actionable Recommendations */}
      {auditReport.strategicPillars && auditReport.strategicPillars.length > 0 && (
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <AutoAwesomeRoundedIcon sx={{ fontSize: 16, color: 'primary.main' }} />
            {t('audit:subtitle', 'Strategic Improvements')}
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
            {auditReport.strategicPillars.slice(0, 3).map((pillar: StrategicGrowthPillar, idx: number) => {
              const name = (pillar.pillarName || '').toLowerCase();
              let title = pillar.pillarName;
              let diagnostic = pillar.diagnostic;
              let impactLabel: string = pillar.impactLevel || 'High';
              let impactColor: 'warning' | 'primary' | 'default' = 'default';

              if (name.includes('measurable') || name.includes('metric') || idx === 0) {
                title = t('audit:pillars.measurable.title', pillar.pillarName);
                diagnostic = t('audit:pillars.measurable.diagnostic', pillar.diagnostic);
                impactLabel = t('audit:impactLevels.high', 'High');
                impactColor = 'warning';
              } else if (name.includes('alignment') || name.includes('keyword') || idx === 1) {
                title = t('audit:pillars.keywords.title', pillar.pillarName);
                diagnostic = t('audit:pillars.keywords.diagnostic', pillar.diagnostic);
                impactLabel = t('audit:impactLevels.strategic', 'Strategic');
                impactColor = 'primary';
              } else {
                title = t('audit:pillars.scope.title', pillar.pillarName);
                diagnostic = t('audit:pillars.scope.diagnostic', pillar.diagnostic);
                impactLabel = t('audit:impactLevels.mediumHigh', 'Medium-High');
                impactColor = 'warning';
              }

              return (
                <Paper
                  key={idx}
                  variant="outlined"
                  sx={{
                    p: 1.5,
                    borderRadius: RADIUS_TOKENS.lg,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                    bgcolor: isDark ? alpha(theme.palette.background.default, 0.3) : 'background.paper',
                    boxSizing: 'border-box',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      borderColor: 'primary.main',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1 }}>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.primary', flex: 1, lineHeight: 1.35 }}>
                      {title}
                    </Typography>
                    <Chip
                      label={impactLabel}
                      size="small"
                      color={impactColor}
                      variant="outlined"
                      sx={{ fontWeight: 700 }}
                    />
                  </Box>

                  <Typography variant="caption" sx={{ lineHeight: 1.45, color: 'text.secondary' }}>
                    {diagnostic}
                  </Typography>

                  <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 0.25 }}>
                    <Button
                      variant="contained"
                      size="small"
                      color="primary"
                      startIcon={<BoltRoundedIcon sx={{ fontSize: '14px !important' }} />}
                      onClick={() => onOpenAction(pillar.recommendationForMasterData || pillar.diagnostic, pillar.pillarName)}
                      sx={{
                        textTransform: 'none',
                        fontWeight: 700,
                        fontSize: '0.74rem',
                        py: 0.35,
                        px: 1.5,
                      }}
                    >
                      {getActionButtonLabel(pillar.recommendationForMasterData || pillar.pillarName)}
                    </Button>
                  </Box>
                </Paper>
              );
            })}
          </Box>
        </Box>
      )}
    </Box>
  );
});
