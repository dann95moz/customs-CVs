import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Icon } from '../Icons';
import { SplitMarkdownEditorProps } from '../../types';

export type { SplitMarkdownEditorProps };

export const SplitMarkdownEditor: React.FC<SplitMarkdownEditorProps> = ({
  content,
  onChange,
  onDownload,
  fileName = 'tailored-cv.md'
}) => {
  const { t } = useTranslation(['preview', 'common']);
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
          <span className="split-title">{t('preview:editor.sourceTitle', 'CV Markdown Source')}</span>
          <span className="split-stats">
            {t('preview:editor.stats', '{{words}} words • {{lines}} lines', { words: wordCount, lines: lineCount })}
          </span>
        </div>

        <div className="split-actions">
          <button
            type="button"
            className="studio-btn studio-btn-secondary btn-xs"
            onClick={handleCopy}
            title={t('preview:editor.copyTip', 'Copy entire markdown to clipboard')}
          >
            <Icon type={copied ? 'check' : 'copy'} size={12} />
            {copied ? t('preview:editor.copied', 'Copied!') : t('preview:editor.copy', 'Copy')}
          </button>
          <button
            type="button"
            className="studio-btn studio-btn-secondary btn-xs"
            onClick={onDownload}
            title={`${t('common:actions.download', 'Download')} ${fileName}`}
          >
            <Icon type="download" size={12} /> {t('preview:editor.exportMd', 'Export .md')}
          </button>
        </div>
      </div>

      <div className="split-editor-body">
        <textarea
          className="studio-textarea split-textarea"
          value={content}
          onChange={(e) => onChange(e.target.value)}
          placeholder={t('preview:editor.placeholder', 'CV Markdown content...')}
          spellCheck={false}
        />
      </div>
    </div>
  );
};
