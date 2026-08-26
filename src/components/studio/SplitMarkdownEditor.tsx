import React, { useState } from 'react';
import { Icon } from '../Icons';

interface SplitMarkdownEditorProps {
  content: string;
  onChange: (value: string) => void;
  onDownload: () => void;
  fileName?: string;
}

export const SplitMarkdownEditor: React.FC<SplitMarkdownEditorProps> = ({
  content,
  onChange,
  onDownload,
  fileName = 'tailored-cv.md'
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  const lineCount = content.split('\n').length;

  return (
    <div className="split-editor-container">
      <div className="split-editor-header">
        <div className="split-title-group">
          <Icon type="edit" size={14} />
          <span className="split-title">CV Markdown Source</span>
          <span className="split-stats">{wordCount} words • {lineCount} lines</span>
        </div>

        <div className="split-actions">
          <button
            type="button"
            className="studio-btn studio-btn-secondary btn-xs"
            onClick={handleCopy}
            title="Copy entire markdown to clipboard"
          >
            <Icon type={copied ? 'check' : 'copy'} size={12} />
            {copied ? 'Copied!' : 'Copy'}
          </button>
          <button
            type="button"
            className="studio-btn studio-btn-secondary btn-xs"
            onClick={onDownload}
            title={`Download as ${fileName}`}
          >
            <Icon type="download" size={12} /> Export .md
          </button>
        </div>
      </div>

      <div className="split-editor-body">
        <textarea
          className="studio-textarea split-textarea"
          value={content}
          onChange={(e) => onChange(e.target.value)}
          placeholder="CV Markdown content..."
          spellCheck={false}
        />
      </div>
    </div>
  );
};
