import React, { useRef } from 'react';
import { Icon } from '../Icons';
import { extractCandidateName, parseCvMarkdownToData } from '../../core/parser';

interface MasterDataEditorProps {
  content: string;
  onChange: (value: string) => void;
  onLoadSample: () => void;
  onResetTemplate: () => void;
}

export const MasterDataEditor: React.FC<MasterDataEditorProps> = ({
  content,
  onChange,
  onLoadSample,
  onResetTemplate
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
    link.download = 'master-data.md';
    link.click();
    URL.revokeObjectURL(url);
  };

  const candidateName = extractCandidateName(content, 'Candidate Name').replace(/_/g, ' ');
  const parsed = parseCvMarkdownToData(content);
  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  const charCount = content.length;
  const expCount = parsed.experience?.length || 0;
  const skillsCount = parsed.skillGroups?.reduce((acc, curr) => acc + curr.skills.length, 0) || 0;

  return (
    <div className="editor-panel-container">
      {/* Header Bar */}
      <div className="editor-header-bar">
        <div className="editor-header-left">
          <div className="editor-title-group">
            <span className="editor-icon-badge master">
              <Icon type="brain" size={16} />
            </span>
            <div>
              <h3 className="editor-title">Candidate Master Data (SSOT)</h3>
              <p className="editor-subtitle">
                Your permanent career database. Never edited by AI; serves as the strict Single Source of Truth.
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
            title="Upload existing .md or .txt file"
          >
            <Icon type="upload" size={13} /> Upload .md
          </button>
          <button 
            className="studio-btn studio-btn-secondary btn-sm"
            onClick={handleDownload}
            title="Download as master-data.md"
          >
            <Icon type="download" size={13} /> Export .md
          </button>
          <button 
            className="studio-btn studio-btn-secondary btn-sm"
            onClick={onLoadSample}
            title="Load comprehensive sample profile"
          >
            <Icon type="refresh" size={13} /> Load Sample
          </button>
          <button 
            className="studio-btn studio-btn-secondary btn-sm"
            onClick={onResetTemplate}
            title="Reset to blank template"
          >
            <Icon type="file-text" size={13} /> Blank Template
          </button>
        </div>
      </div>

      {/* Meta Bar */}
      <div className="editor-meta-bar">
        <div className="meta-pill">
          <span className="meta-label">Candidate:</span>
          <strong className="meta-value">{candidateName}</strong>
        </div>
        <div className="meta-pill">
          <span className="meta-label">Experiences:</span>
          <strong className="meta-value">{expCount} Roles</strong>
        </div>
        <div className="meta-pill">
          <span className="meta-label">Master Skills:</span>
          <strong className="meta-value">{skillsCount} Technologies</strong>
        </div>
        <div className="meta-pill">
          <span className="meta-label">Word Count:</span>
          <strong className="meta-value">{wordCount} words ({charCount} chars)</strong>
        </div>
      </div>

      {/* Textarea with Drag & Drop */}
      <div 
        className="editor-textarea-wrapper"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <textarea
          className="studio-textarea master-textarea"
          value={content}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste or write your full master-data.md here (career history, metrics, tech stack, education, languages)..."
          spellCheck={false}
        />
      </div>

      <div className="editor-footer-hint">
        <span>💡 <strong>Tip:</strong> Drag and drop any <code>.md</code> file directly onto this editor to load your profile.</span>
      </div>
    </div>
  );
};
