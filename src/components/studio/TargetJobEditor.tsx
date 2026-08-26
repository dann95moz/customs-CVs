import React, { useRef } from 'react';
import { Icon } from '../Icons';
import { extractTargetCompany } from '../../core/parser';

interface TargetJobEditorProps {
  content: string;
  onChange: (value: string) => void;
  companyName: string;
  onCompanyChange: (value: string) => void;
  targetRole: string;
  onRoleChange: (value: string) => void;
  onLoadSample: () => void;
}

export const TargetJobEditor: React.FC<TargetJobEditorProps> = ({
  content,
  onChange,
  companyName,
  onCompanyChange,
  targetRole,
  onRoleChange,
  onLoadSample
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
          // Auto infer company if not already set
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
    link.download = 'target-job.md';
    link.click();
    URL.revokeObjectURL(url);
  };

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="editor-panel-container">
      {/* Header Bar */}
      <div className="editor-header-bar">
        <div className="editor-header-left">
          <div className="editor-title-group">
            <span className="editor-icon-badge target">
              <Icon type="target" size={16} />
            </span>
            <div>
              <h3 className="editor-title">Target Job & Vacancy Posting</h3>
              <p className="editor-subtitle">
                Paste the job description, key requirements, and company info to tailor your CV against.
              </p>
            </div>
          </div>
        </div>

        <div className="editor-actions">
          <input 
            type="file" 
            ref={fileInputRef} 
            style={{ display: 'none' }} 
            accept=".md,.txt"
            onChange={handleFileUpload}
          />
          <button 
            className="studio-btn studio-btn-secondary btn-sm"
            onClick={() => fileInputRef.current?.click()}
            title="Upload existing .md or .txt job file"
          >
            <Icon type="upload" size={13} /> Upload Job .md
          </button>
          <button 
            className="studio-btn studio-btn-secondary btn-sm"
            onClick={handleDownload}
            title="Download as target-job.md"
          >
            <Icon type="download" size={13} /> Export .md
          </button>
          <button 
            className="studio-btn studio-btn-secondary btn-sm"
            onClick={onLoadSample}
            title="Load sample vacancy posting"
          >
            <Icon type="refresh" size={13} /> Load Sample Job
          </button>
        </div>
      </div>

      {/* Vacancy Quick Config Fields */}
      <div className="job-quick-fields">
        <div className="field-group">
          <label htmlFor="target-company-input">Target Company Name:</label>
          <input
            id="target-company-input"
            type="text"
            className="studio-input"
            placeholder="e.g. Stripe, Google, Addi, Amazon"
            value={companyName}
            onChange={(e) => onCompanyChange(e.target.value)}
          />
        </div>
        <div className="field-group">
          <label htmlFor="target-role-input">Target Role Title:</label>
          <input
            id="target-role-input"
            type="text"
            className="studio-input"
            placeholder="e.g. Senior Fullstack Engineer, Tech Lead"
            value={targetRole}
            onChange={(e) => onRoleChange(e.target.value)}
          />
        </div>
        <div className="field-group field-group-stat">
          <span className="stat-label">Job Length:</span>
          <span className="stat-value">{wordCount} words</span>
        </div>
      </div>

      {/* Textarea with Drag & Drop */}
      <div 
        className="editor-textarea-wrapper"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <textarea
          className="studio-textarea target-textarea"
          value={content}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste raw job description, requirements, responsibilities, and required stack here..."
          spellCheck={false}
        />
      </div>

      <div className="editor-footer-hint">
        <span>💡 <strong>Tip:</strong> The AI synthesizer extracts priority keywords and requirements directly from this text.</span>
      </div>
    </div>
  );
};
