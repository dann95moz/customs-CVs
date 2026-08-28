import React, { useState } from 'react';
import {
  Button,
  Snackbar,
  useTheme,
} from '@mui/material';
import { Icon } from '../Icons';
import { QualityAuditReport, ActionModalState, QualityAuditViewProps } from '../../types';
import { useResumeWorkspace } from '../../context/ResumeWorkspaceContext';
import { AuditImprovementModal } from './audit/AuditImprovementModal';
import { AuditSectionCard } from './audit/AuditSectionCard';

export type { QualityAuditViewProps };

/**
 * Quality Audit view orchestrator displaying 1-10 executive scoring, growth pillars, and action modal.
 * Principle: Single Responsibility (S) - delegates card rendering and modal to subcomponents.
 */
export const QualityAuditView: React.FC<QualityAuditViewProps> = ({
  report,
  onRefresh
}) => {
  const theme = useTheme();
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
  const [expandedSections, setExpandedSections] = useState<Record<number, boolean>>({});

  const allExpanded = report.sections.length > 0 && report.sections.every((_, idx) => expandedSections[idx]);

  const handleToggleAll = () => {
    if (allExpanded) {
      setExpandedSections({});
    } else {
      const all: Record<number, boolean> = {};
      report.sections.forEach((_, idx) => {
        all[idx] = true;
      });
      setExpandedSections(all);
    }
  };

  const handleToggleSection = (idx: number) => {
    setExpandedSections(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

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
    if (score >= 9.0) return theme.palette.success.main;
    if (score >= 8.0) return theme.palette.primary.main;
    if (score >= 7.0) return theme.palette.warning.main;
    return theme.palette.error.main;
  };

  // Open targeted action modal based on lever text
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
      }
    } else if (type === 'google_xyz') {
      const bulletLine = inputValue.startsWith('- ') ? inputValue : `- ${inputValue}`;
      if (updatedCv.includes('### **')) {
        updatedCv = updatedCv.replace(/(### \*\*[^\n]+\n\*?[^\n]*\*?\n)/, `$1${bulletLine}\n`);
      } else {
        updatedCv += `\n${bulletLine}\n`;
      }
    } else {
      updatedCv += `\n\n<!-- Strategic Lever Applied: ${modalState.sectionName} -->\n${inputValue}\n`;
    }

    setCvMarkdown(updatedCv);
    setMasterData(updatedMaster);
    setSnackbarMessage(`Successfully applied "${modalState.title}" to your tailored CV!`);
    setModalState(prev => ({ ...prev, open: false }));
  };

  const getActionButtonLabel = (action: string): string => {
    const lower = action.toLowerCase();
    if (lower.includes('aws') || lower.includes('cloud') || lower.includes('certif')) {
      return '🎓 Add Official Certification';
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

      {/* Section Breakdown */}
      <div className="audit-section-group">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, flexWrap: 'wrap', gap: 10 }}>
          <h3 className="section-group-title" style={{ margin: 0 }}>
            <Icon type="gauge" size={18} /> Section Diagnostic &amp; Action Levers
          </h3>
          <Button
            size="small"
            variant="outlined"
            onClick={handleToggleAll}
            sx={{ fontSize: '0.75rem', fontWeight: 600, py: 0.25, px: 1.5, borderRadius: '8px' }}
          >
            {allExpanded ? 'Collapse All Sections' : 'Expand All Sections'}
          </Button>
        </div>

        <div className="audit-cards-grid">
          {report.sections.map((sec, idx) => (
            <AuditSectionCard
              key={idx}
              section={sec}
              scoreColor={getScoreColor(sec.score)}
              onExecuteAction={handleOpenAction}
              getActionButtonLabel={getActionButtonLabel}
              isExpanded={Boolean(expandedSections[idx])}
              onToggle={() => handleToggleSection(idx)}
            />
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
      <AuditImprovementModal
        modalState={modalState}
        onClose={() => setModalState(prev => ({ ...prev, open: false }))}
        onInputChange={(val: string) => setModalState(prev => ({ ...prev, inputValue: val }))}
        onApply={handleApplyAction}
      />

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
