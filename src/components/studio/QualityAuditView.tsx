import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Chip,
  Box,
  Stack,
  Alert,
  Snackbar,
  IconButton
} from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import BoltRoundedIcon from '@mui/icons-material/BoltRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import { Icon } from '../Icons';
import { QualityAuditReport } from '../../types/cv';
import { useResumeWorkspace } from '../../context/ResumeWorkspaceContext';

interface QualityAuditViewProps {
  report: QualityAuditReport;
  onRefresh: () => void;
}

interface ActionModalState {
  open: boolean;
  sectionName: string;
  title: string;
  description: string;
  type: 'certification' | 'summary_metric' | 'github_link' | 'google_xyz' | 'skills_3cat' | 'generic';
  inputValue: string;
  presets: string[];
}

export const QualityAuditView: React.FC<QualityAuditViewProps> = ({
  report,
  onRefresh
}) => {
  const { cvMarkdown, setCvMarkdown, masterData, setMasterData } = useResumeWorkspace();

  const [modalState, setModalState] = useState<ActionModalState>({
    open: false,
    sectionName: '',
    title: '',
    description: '',
    type: 'generic',
    inputValue: '',
    presets: []
  });

  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);

  const handleDownloadReport = () => {
    const blob = new Blob([report.markdownReport], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Quality_Report_${report.candidateName.replace(/\s+/g, '_')}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getScoreColor = (score: number) => {
    if (score >= 9.0) return '#10b981'; // Green
    if (score >= 8.0) return '#38bdf8'; // Blue
    if (score >= 7.0) return '#f59e0b'; // Amber
    return '#ef4444'; // Red
  };

  // Helper to open targeted action modal based on lever text
  const handleOpenAction = (actionText: string, sectionName: string) => {
    const lower = actionText.toLowerCase();

    if (lower.includes('aws') || lower.includes('cloud') || lower.includes('certification') || sectionName.includes('Education')) {
      setModalState({
        open: true,
        sectionName,
        title: 'Add Industry-Recognized Cloud Certification (10/10)',
        description: 'Incorporate an official cloud or architecture credential to establish verified technical authority.',
        type: 'certification',
        inputValue: 'AWS Certified Solutions Architect – Associate (2024)',
        presets: [
          'AWS Certified Solutions Architect – Associate (2024)',
          'Google Cloud Certified – Professional Cloud Architect (2024)',
          'Meta Certified Front-End Developer (2023)',
          'Certified Kubernetes Administrator (CKA, 2024)',
          'HashiCorp Certified: Terraform Associate (2023)'
        ]
      });
    } else if (lower.includes('metric') || lower.includes('business outcome') || sectionName.includes('Summary')) {
      setModalState({
        open: true,
        sectionName,
        title: 'Incorporate Business Impact Metric in Summary',
        description: 'Connect your engineering competencies to commercial business impact (transaction volume, retention, or team efficiency).',
        type: 'summary_metric',
        inputValue: 'with a proven track record processing over $80M+ USD in annual transaction volume and reducing production incidents by 40%.',
        presets: [
          'scaling architectures for over 1.5M active users while processing $80M+ USD annually.',
          'accelerating customer onboarding velocity by 32% and saving 120+ monthly engineering hours.',
          'optimizing mission-critical transaction workflows with 99.99% uptime and zero unscheduled downtime.'
        ]
      });
    } else if (lower.includes('github') || lower.includes('portfolio') || sectionName.includes('Header')) {
      setModalState({
        open: true,
        sectionName,
        title: 'Add GitHub / Portfolio Public Code Link',
        description: 'Provide technical recruiters with a direct link to public repositories or demonstrable projects.',
        type: 'github_link',
        inputValue: 'https://github.com/alexmorgan-eng',
        presets: [
          'https://github.com/your-username',
          'https://linkedin.com/in/your-profile',
          'https://alexmorgan.dev'
        ]
      });
    } else if (lower.includes('percentage') || lower.includes('google xyz') || sectionName.includes('Experience')) {
      setModalState({
        open: true,
        sectionName,
        title: 'Calibrate Achievement with Google XYZ Formula',
        description: 'Add an achievement with an explicit quantitative metric (%) following the Google XYZ formula.',
        type: 'google_xyz',
        inputValue: '- **Optimized** core infrastructure cutting latency by **38%** for over **1.2M daily requests** through microfrontend architecture.',
        presets: [
          '- **Optimized** core infrastructure cutting latency by **38%** for over **1.2M daily requests**.',
          '- **Redesigned** CI/CD pipeline using GitHub Actions, cutting build durations by **52%**.',
          '- **Increased** test coverage from 38% to **84%**, preventing **40% of production regressions**.'
        ]
      });
    } else {
      setModalState({
        open: true,
        sectionName,
        title: 'Apply Strategic Enhancement',
        description: actionText,
        type: 'generic',
        inputValue: actionText,
        presets: []
      });
    }
  };

  // Helper to execute action and update workspace markdown
  const handleApplyAction = () => {
    const { type, inputValue } = modalState;

    if (!inputValue.trim()) return;

    let updatedCv = cvMarkdown;
    let updatedMaster = masterData;

    if (type === 'certification') {
      const certLine = `\n- **${inputValue.replace(/^\*+|\*+$/g, '')}**`;
      if (updatedCv.includes('## EDUCATION')) {
        updatedCv = updatedCv.replace(/(## EDUCATION[^\n]*\n)/i, `$1${certLine}\n`);
      } else if (updatedCv.includes('## EDUCACI')) {
        updatedCv = updatedCv.replace(/(## EDUCACI[^\n]*\n)/i, `$1${certLine}\n`);
      } else {
        updatedCv += `\n\n## EDUCATION & CERTIFICATIONS${certLine}\n`;
      }

      if (updatedMaster.includes('## EDUCATION') || updatedMaster.includes('## 🎓 EDUCATION')) {
        updatedMaster = updatedMaster.replace(/(## [^\n]*EDUCATION[^\n]*\n)/i, `$1${certLine}\n`);
      }
    } else if (type === 'summary_metric') {
      if (updatedCv.includes('## PROFESSIONAL SUMMARY')) {
        updatedCv = updatedCv.replace(/(## PROFESSIONAL SUMMARY\n[^\n]+)/i, `$1 ${inputValue.trim()}`);
      } else {
        updatedCv += `\n\n## PROFESSIONAL SUMMARY\n${inputValue.trim()}\n`;
      }
    } else if (type === 'github_link') {
      if (updatedCv.includes('http')) {
        updatedCv = updatedCv.replace(/(\[LinkedIn\]\([^\)]+\))/i, `$1 • [GitHub](${inputValue.trim()})`);
      } else {
        updatedCv = updatedCv.replace(/(# [^\n]+\n[^\n]+\n)/i, `$1[GitHub](${inputValue.trim()})\n`);
      }
    } else if (type === 'google_xyz') {
      if (updatedCv.includes('## PROFESSIONAL EXPERIENCE')) {
        updatedCv = updatedCv.replace(/(### [^\n]+\n\*[^\n]+\n)/i, `$1${inputValue.trim()}\n`);
      }
    }

    setCvMarkdown(updatedCv);
    setMasterData(updatedMaster);
    setModalState(prev => ({ ...prev, open: false }));
    setSnackbarMessage('Action successfully applied! Quality audit scores and report updated.');
  };

  const getActionButtonLabel = (actionText: string) => {
    const lower = actionText.toLowerCase();
    if (lower.includes('aws') || lower.includes('cloud') || lower.includes('certification')) {
      return '+ Add Cloud Certification';
    }
    if (lower.includes('metric') || lower.includes('business')) {
      return '✨ Add Business Impact Metric';
    }
    if (lower.includes('github') || lower.includes('portfolio')) {
      return '🔗 Link GitHub / Portfolio';
    }
    if (lower.includes('percentage') || lower.includes('xyz') || lower.includes('quantitative')) {
      return '⚡ Add Google XYZ Achievement';
    }
    if (lower.includes('3 categories') || lower.includes('categor')) {
      return '🗂️ Reorganize into 3 Categories';
    }
    return '🚀 Apply Direct Action';
  };

  return (
    <div className="audit-dashboard-container">
      {/* Top Overview Banner */}
      <div className="audit-score-hero">
        <div className="score-gauge-box">
          <div 
            className="score-circle-outer"
            style={{ borderColor: getScoreColor(report.overallScore) }}
          >
            <span className="score-number">{report.overallScore}</span>
            <span className="score-max">/ 10.0</span>
          </div>
          <div className="score-meta-text">
            <div className="readiness-badge">
              <Icon type="check-circle" size={14} /> Application Readiness: <strong>Ready to Submit</strong>
            </div>
            <h2 className="audit-hero-title">Executive Headhunter Quality Audit</h2>
            <p className="audit-hero-desc">
              Candidate: <strong>{report.candidateName}</strong> • Target: <strong>{report.targetCompany}</strong>
            </p>
          </div>
        </div>

        <div className="audit-hero-actions">
          <button 
            type="button"
            className="studio-btn studio-btn-secondary btn-sm"
            onClick={onRefresh}
            title="Recalculate audit scores"
          >
            <Icon type="refresh" size={13} /> Re-Calculate
          </button>
          <button 
            type="button"
            className="studio-btn studio-btn-secondary btn-sm"
            onClick={handleDownloadReport}
            title="Download full markdown audit report"
          >
            <Icon type="download" size={13} /> Export Report (.md)
          </button>
        </div>
      </div>

      {/* 7-Pillar Section Breakdown */}
      <div className="audit-section-group">
        <h3 className="section-group-title">
          <Icon type="gauge" size={18} /> 1. Section-by-Section Calibrated Diagnostic & Action Levers
        </h3>

        <div className="audit-cards-grid">
          {report.sections.map((sec, idx) => (
            <div key={idx} className="audit-metric-card">
              <div className="card-top-row">
                <h4 className="metric-section-name">{sec.sectionName}</h4>
                <div 
                  className="metric-score-badge"
                  style={{ 
                    backgroundColor: `${getScoreColor(sec.score)}22`, 
                    color: getScoreColor(sec.score),
                    borderColor: `${getScoreColor(sec.score)}55`
                  }}
                >
                  {sec.score} / 10.0
                </div>
              </div>

              <div className="metric-status-tag">
                {sec.status}
              </div>

              <p className="metric-comment">{sec.comment}</p>

              {sec.identifiedGaps && sec.identifiedGaps.length > 0 && (
                <div className="metric-gaps-box">
                  <span className="gaps-title">⚠️ Identified Gap:</span>
                  <ul className="gaps-list">
                    {sec.identifiedGaps.map((g, i) => (
                      <li key={i}>{g}</li>
                    ))}
                  </ul>
                </div>
              )}

              {sec.actionToTen && sec.actionToTen.length > 0 && (
                <div className="metric-action-box" style={{ background: 'rgba(56, 189, 248, 0.05)', borderRadius: 8, padding: 12 }}>
                  <span className="action-title" style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, marginBottom: 8 }}>
                    <AutoAwesomeRoundedIcon sx={{ fontSize: 16, color: '#0284c7' }} /> Strategic Levers to Reach 10/10:
                  </span>
                  <Stack spacing={1.5}>
                    {sec.actionToTen.map((a, i) => (
                      <Box key={i} sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Typography variant="body2" sx={{ fontSize: '0.82rem', color: 'text.secondary' }}>
                          {a}
                        </Typography>
                        <Button
                          variant="contained"
                          size="small"
                          color="primary"
                          startIcon={<BoltRoundedIcon sx={{ fontSize: '15px !important' }} />}
                          onClick={() => handleOpenAction(a, sec.sectionName)}
                          sx={{
                            alignSelf: 'flex-start',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            py: 0.5,
                            px: 1.5,
                            borderRadius: '8px'
                          }}
                        >
                          {getActionButtonLabel(a)}
                        </Button>
                      </Box>
                    ))}
                  </Stack>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Strategic Growth Pillars */}
      <div className="audit-section-group">
        <h3 className="section-group-title">
          <Icon type="star" size={18} /> 2. Strategic Growth Levers (Top 5% Candidate Ceiling)
        </h3>

        <div className="growth-pillars-list">
          {report.strategicPillars.map((p, idx) => (
            <div key={idx} className="growth-pillar-card">
              <div className="pillar-header">
                <h4 className="pillar-name">{p.pillarName}</h4>
                <span className={`impact-badge ${p.impactLevel.toLowerCase().replace(/\s+/g, '-')}`}>
                  Impact: {p.impactLevel}
                </span>
              </div>
              <p className="pillar-diag"><strong>Diagnostic:</strong> {p.diagnostic}</p>
              <div className="pillar-action" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Icon type="zap" size={14} />
                  <span><strong>Recommended Action:</strong> {p.recommendationForMasterData}</span>
                </div>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => handleOpenAction(p.recommendationForMasterData, p.pillarName)}
                  sx={{ fontSize: '0.75rem', fontWeight: 600, py: 0.25, px: 1 }}
                >
                  Execute Lever
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Dialog */}
      <Dialog
        open={modalState.open}
        onClose={() => setModalState(prev => ({ ...prev, open: false }))}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AutoAwesomeRoundedIcon color="primary" />
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              {modalState.title}
            </Typography>
          </Box>
          <IconButton size="small" onClick={() => setModalState(prev => ({ ...prev, open: false }))}>
            <CloseRoundedIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {modalState.description}
          </Typography>

          {modalState.presets.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 1 }}>
                One-Click Suggestions:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {modalState.presets.map((preset, pIdx) => (
                  <Chip
                    key={pIdx}
                    label={preset}
                    size="small"
                    variant={modalState.inputValue === preset ? 'filled' : 'outlined'}
                    color={modalState.inputValue === preset ? 'primary' : 'default'}
                    onClick={() => setModalState(prev => ({ ...prev, inputValue: preset }))}
                    sx={{ cursor: 'pointer', maxWidth: '100%' }}
                  />
                ))}
              </Box>
            </Box>
          )}

          <TextField
            label="Content to Incorporate into CV"
            fullWidth
            multiline
            rows={modalState.type === 'summary_metric' || modalState.type === 'google_xyz' ? 3 : 1}
            value={modalState.inputValue}
            onChange={(e) => setModalState(prev => ({ ...prev, inputValue: e.target.value }))}
            size="small"
          />
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setModalState(prev => ({ ...prev, open: false }))}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<BoltRoundedIcon />}
            onClick={handleApplyAction}
            sx={{ fontWeight: 700 }}
          >
            ✨ Apply to CV & Recalculate Score
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar Feedback */}
      <Snackbar
        open={Boolean(snackbarMessage)}
        autoHideDuration={4000}
        onClose={() => setSnackbarMessage(null)}
        message={snackbarMessage}
      />
    </div>
  );
};
