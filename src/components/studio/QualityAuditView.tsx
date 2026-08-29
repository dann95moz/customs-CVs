import React, { useState } from 'react';
import {
  Button,
  Snackbar,
  useTheme,
} from '@mui/material';
import { Icon } from '../Icons';
import { QualityAuditReport, QualityAuditViewProps } from '../../types';
import { AuditImprovementModal } from './audit/AuditImprovementModal';
import { AuditSectionCard } from './audit/AuditSectionCard';
import { useAuditActions } from '../../hooks/useAuditActions';

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
  const {
    modalState,
    snackbarMessage,
    handleOpenAction,
    handleApplyAction,
    handleCloseModal,
    handleCloseSnackbar,
    handleInputChange,
    getActionButtonLabel,
  } = useAuditActions();

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
        onClose={handleCloseModal}
        onInputChange={handleInputChange}
        onApply={handleApplyAction}
      />

      {/* Snackbar Feedback */}
      <Snackbar
        open={Boolean(snackbarMessage)}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
      />
    </div>
  );
};
