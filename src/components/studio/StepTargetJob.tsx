import React, { useRef } from 'react';
import { Icon } from '../Icons';
import { extractTargetCompany } from '../../core/parser';

interface StepTargetJobProps {
  content: string;
  onChange: (value: string) => void;
  companyName: string;
  onCompanyChange: (value: string) => void;
  targetRole: string;
  onRoleChange: (value: string) => void;
  onLoadSample: () => void;
  onPrevStep: () => void;
  onNextStep: () => void;
}

export const StepTargetJob: React.FC<StepTargetJobProps> = ({
  content,
  onChange,
  companyName,
  onCompanyChange,
  targetRole,
  onRoleChange,
  onLoadSample,
  onPrevStep,
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
          const inferred = extractTargetCompany(text);
          if (inferred && !companyName) {
            onCompanyChange(inferred.replace(/_/g, ' '));
          }
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
          const inferred = extractTargetCompany(text);
          if (inferred && !companyName) {
            onCompanyChange(inferred.replace(/_/g, ' '));
          }
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
    link.download = `target-job-${companyName || 'posting'}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  const hasJob = content.trim().length > 40 && !content.includes('[Paste the raw job description');

  return (
    <div className="wizard-step-view">
      {/* Guiding Hero Banner */}
      <div className="step-guidance-card">
        <div className="guidance-left">
          <div className="step-badge-pill target">
            <Icon type="target" size={14} /> Step 2 of 4 • Target Vacancy Posting
          </div>
          <h2 className="step-title">The Target Role You Are Applying For</h2>
          <p className="step-description">
            Paste the job description from LinkedIn, Indeed, Greenhouse, or the company's careers site. 
            <strong> The AI will analyze exact requirements</strong> and align your achievements from Step 1 so your resume beats ATS filters and catches recruiters' attention.
          </p>
        </div>

        <div className="guidance-actions">
          <button
            type="button"
            className="studio-btn studio-btn-secondary"
            onClick={onLoadSample}
            title="Load sample vacancy posting to explore"
          >
            <Icon type="refresh" size={13} /> Load Sample Job
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
            title="Upload a file with the job description"
          >
            <Icon type="upload" size={13} /> Upload File (.md)
          </button>

          <button
            type="button"
            className="studio-btn studio-btn-secondary"
            onClick={handleDownload}
            title="Download a copy of this job posting"
          >
            <Icon type="download" size={13} /> Export Copy
          </button>
        </div>
      </div>

      {/* Quick Company & Role Fields */}
      <div className="step-inputs-card">
        <div className="inputs-row">
          <div className="field-block">
            <label htmlFor="company-name-input" className="field-block-label">
              <Icon type="globe" size={14} />
              <span>Target Company Name</span>
            </label>
            <input
              id="company-name-input"
              type="text"
              className="studio-input-large"
              placeholder="e.g. Stripe, Google, Mercado Libre, Amazon..."
              value={companyName}
              onChange={(e) => onCompanyChange(e.target.value)}
            />
            <span className="field-block-help">
              Used to label output files and calibrate matching keywords.
            </span>
          </div>

          <div className="field-block">
            <label htmlFor="role-title-input" className="field-block-label">
              <Icon type="star" size={14} />
              <span>Target Role Title</span>
            </label>
            <input
              id="role-title-input"
              type="text"
              className="studio-input-large"
              placeholder="e.g. Senior Fullstack Engineer, Tech Lead, Product Manager..."
              value={targetRole}
              onChange={(e) => onRoleChange(e.target.value)}
            />
            <span className="field-block-help">
              The exact job title optimizes ATS keyword density and seniority level.
            </span>
          </div>
        </div>
      </div>

      {/* Description Textarea Card */}
      <div className="step-editor-card">
        <div className="editor-card-topbar">
          <div className="topbar-title">
            <Icon type="file-text" size={14} />
            <span>Full Job Description & Requirements</span>
          </div>
          <span className="topbar-hint">
            {wordCount > 0 ? `${wordCount} words pasted` : 'Paste the job posting description here'}
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
            placeholder="# 🎯 Target Job Posting&#10;&#10;Paste all job posting details here: responsibilities, requirements, qualifications, and tech stack..."
            spellCheck={false}
          />
        </div>
      </div>

      {/* Navigation Footer */}
      <footer className="step-navigation-footer">
        <div className="footer-left">
          <button
            type="button"
            className="studio-btn studio-btn-secondary btn-prev-step"
            onClick={onPrevStep}
          >
            <Icon type="arrow-left" size={15} />
            <span>Back to Profile</span>
          </button>
        </div>

        <div className="footer-status-msg">
          {hasJob ? (
            <span className="status-good">
              <Icon type="check-circle" size={14} /> Job posting ready for {companyName || 'target company'}
            </span>
          ) : (
            <span className="status-notice">
              <Icon type="alert-circle" size={14} /> Paste a job description or click "Load Sample Job"
            </span>
          )}
        </div>

        <div className="footer-right">
          <button
            type="button"
            className="studio-btn studio-btn-primary btn-next-step"
            onClick={onNextStep}
          >
            <span>Continue to AI Tailoring</span>
            <Icon type="arrow-right" size={15} />
          </button>
        </div>
      </footer>
    </div>
  );
};
