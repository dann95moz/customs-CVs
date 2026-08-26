import React, { useRef } from 'react';
import { Icon } from '../Icons';
import { extractCandidateName, parseCvMarkdownToData } from '../../core/parser';

interface StepMasterDataProps {
  content: string;
  onChange: (value: string) => void;
  onLoadSample: () => void;
  onResetTemplate: () => void;
  onNextStep: () => void;
}

export const StepMasterData: React.FC<StepMasterDataProps> = ({
  content,
  onChange,
  onLoadSample,
  onResetTemplate,
  onNextStep
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (text) {
          onChange(text);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (text) {
          onChange(text);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'master-profile.md';
    link.click();
    URL.revokeObjectURL(url);
  };

  const candidateName = extractCandidateName(content, 'Your Full Name').replace(/_/g, ' ');
  const parsed = parseCvMarkdownToData(content);
  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  const expCount = parsed.experience?.length || 0;
  const skillsCount = parsed.skillGroups?.reduce((acc, curr) => acc + curr.skills.length, 0) || 0;

  const hasData = content.trim().length > 50 && !content.includes('[CANDIDATE FULL NAME]');

  return (
    <div className="wizard-step-view">
      {/* Guiding Hero Banner */}
      <div className="step-guidance-card">
        <div className="guidance-left">
          <div className="step-badge-pill">
            <Icon type="user" size={14} /> Step 1 of 4 • Master Career Dossier
          </div>
          <h2 className="step-title">Your Master Professional Profile</h2>
          <p className="step-description">
            This is your permanent career dossier containing your complete work history, education, and technical competencies.
            <strong> The AI strictly uses this data as its Single Source of Truth</strong> to synthesize targeted resumes for specific jobs without ever fabricating details.
            You can use natural language, extended and detailed description is highly recommended.
          </p>
        </div>

        <div className="guidance-actions">
          <button
            type="button"
            className="studio-btn studio-btn-secondary"
            onClick={onLoadSample}
            title="Load comprehensive sample profile to explore"
          >
            <Icon type="refresh" size={13} /> Load Sample Profile
          </button>

          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            accept=".md,.txt"
            onChange={handleFileUpload}
          />
          <button
            type="button"
            className="studio-btn studio-btn-secondary"
            onClick={() => fileInputRef.current?.click()}
            title="Import an existing .md or .txt file"
          >
            <Icon type="upload" size={13} /> Upload File (.md)
          </button>

          <button
            type="button"
            className="studio-btn studio-btn-secondary"
            onClick={handleDownload}
            title="Download a backup copy to your computer"
          >
            <Icon type="download" size={13} /> Export Copy
          </button>

          <button
            type="button"
            className="studio-btn studio-btn-ghost"
            onClick={onResetTemplate}
            title="Reset to clean blank template"
          >
            <Icon type="file-text" size={13} /> Start Blank
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="step-metrics-strip">
        <div className="metric-chip">
          <span className="metric-chip-icon"><Icon type="user" size={14} /></span>
          <div className="metric-chip-info">
            <span className="metric-chip-label">Candidate</span>
            <strong className="metric-chip-value">{candidateName}</strong>
          </div>
        </div>

        <div className="metric-chip">
          <span className="metric-chip-icon"><Icon type="layers" size={14} /></span>
          <div className="metric-chip-info">
            <span className="metric-chip-label">Experience</span>
            <strong className="metric-chip-value">{expCount} roles recorded</strong>
          </div>
        </div>

        <div className="metric-chip">
          <span className="metric-chip-icon"><Icon type="star" size={14} /></span>
          <div className="metric-chip-info">
            <span className="metric-chip-label">Core Skills</span>
            <strong className="metric-chip-value">{skillsCount} technologies</strong>
          </div>
        </div>

        <div className="metric-chip">
          <span className="metric-chip-icon"><Icon type="file-text" size={14} /></span>
          <div className="metric-chip-info">
            <span className="metric-chip-label">Length</span>
            <strong className="metric-chip-value">{wordCount} words</strong>
          </div>
        </div>
      </div>

      {/* Spacious Dedicated Editor Area */}
      <div className="step-editor-card">
        <div className="editor-card-topbar">
          <div className="topbar-title">
            <Icon type="edit" size={14} />
            <span>Master Profile Editor</span>
          </div>
          <span className="topbar-hint">
            You can type directly, paste text, or drag & drop a file here.
          </span>
        </div>

        <div
          className="step-textarea-container"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          <textarea
            className="step-fullscreen-textarea"
            value={content}
            onChange={(e) => onChange(e.target.value)}
            placeholder="# [CANDIDATE FULL NAME]&#10;**Primary Professional Role / Specialization**&#10;City, Country • candidate.email@example.com • +1 234 567 8900&#10;&#10;## CAREER HISTORY & ACHIEVEMENTS&#10;Write your companies, roles, and achievements here..."
            spellCheck={false}
          />
        </div>
      </div>

      {/* Navigation Footer */}
      <footer className="step-navigation-footer">
        <div className="footer-status-msg">
          {hasData ? (
            <span className="status-good">
              <Icon type="check-circle" size={14} /> Master profile ready for tailoring
            </span>
          ) : (
            <span className="status-notice">
              <Icon type="alert-circle" size={14} /> Click "Load Sample Profile" to test right away
            </span>
          )}
        </div>

        <div className="footer-buttons">
          <button
            type="button"
            className="studio-btn studio-btn-primary btn-next-step"
            onClick={onNextStep}
          >
            <span>Continue to Target Job</span>
            <Icon type="arrow-right" size={15} />
          </button>
        </div>
      </footer>
    </div>
  );
};
