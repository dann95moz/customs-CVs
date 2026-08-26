import React from 'react';
import { Icon } from '../Icons';

interface GapAnalysisViewProps {
  gapMarkdown: string;
  matchScore: number;
  keywords: string[];
  companyName: string;
  targetRole: string;
  onDownload: () => void;
}

export const GapAnalysisView: React.FC<GapAnalysisViewProps> = ({
  gapMarkdown,
  matchScore,
  keywords,
  companyName,
  targetRole,
  onDownload
}) => {
  return (
    <div className="gap-analysis-container">
      {/* Hero Banner */}
      <div className="gap-hero-banner">
        <div className="gap-score-badge">
          <span className="score-percent">{matchScore}%</span>
          <span className="score-label">Estimated Match</span>
        </div>

        <div className="gap-hero-text">
          <div className="target-pill">
            <Icon type="target" size={13} />
            <span>Target: <strong>{companyName || 'Target Company'}</strong> • {targetRole || 'Target Role'}</span>
          </div>
          <h2 className="gap-title">Matching & Tailoring Strategy Report</h2>
          <p className="gap-desc">
            Deep cross-reference between your candidate profile and the target job posting.
          </p>
        </div>

        <div className="gap-actions">
          <button
            type="button"
            className="studio-btn studio-btn-secondary btn-sm"
            onClick={onDownload}
            title="Download Gap Analysis as Markdown"
          >
            <Icon type="download" size={13} /> Export Gap Report (.md)
          </button>
        </div>
      </div>

      {/* Keywords Tag Cloud */}
      <div className="gap-card">
        <div className="card-header">
          <span className="card-icon">
            <Icon type="sparkles" size={16} />
          </span>
          <h3 className="card-title">Critical Integrated Keywords & Technologies</h3>
        </div>
        <div className="keywords-cloud">
          {keywords.map((kw, i) => (
            <span key={i} className="keyword-pill">
              <Icon type="check" size={11} /> {kw}
            </span>
          ))}
        </div>
      </div>

      {/* Full Gap Report Markdown View */}
      <div className="gap-card">
        <div className="card-header">
          <span className="card-icon">
            <Icon type="file-text" size={16} />
          </span>
          <h3 className="card-title">Strategic Narrative & Identified Mitigations</h3>
        </div>
        <div className="gap-markdown-rendered">
          <pre className="gap-raw-text">{gapMarkdown || 'No gap analysis available yet. Generate a tailored CV first.'}</pre>
        </div>
      </div>
    </div>
  );
};
