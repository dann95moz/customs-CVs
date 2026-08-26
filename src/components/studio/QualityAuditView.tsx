import React from 'react';
import { Icon } from '../Icons';
import { QualityAuditReport } from '../../types/cv';

interface QualityAuditViewProps {
  report: QualityAuditReport;
  onRefresh: () => void;
}

export const QualityAuditView: React.FC<QualityAuditViewProps> = ({
  report,
  onRefresh
}) => {
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
          <Icon type="gauge" size={18} /> 1. Section-by-Section Calibrated Diagnostic
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
                <div className="metric-action-box">
                  <span className="action-title">🚀 Strategic Lever to Reach 10/10:</span>
                  <ul className="action-list">
                    {sec.actionToTen.map((a, i) => (
                      <li key={i}>{a}</li>
                    ))}
                  </ul>
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
              <div className="pillar-action">
                <Icon type="zap" size={14} />
                <span><strong>Recommended Action:</strong> {p.recommendationForMasterData}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
