import React from 'react';
import { useResumeWorkspace } from '../../context/ResumeWorkspaceContext';

export const SynthesisErrorBanner: React.FC = () => {
  const { generationError, setGenerationError, setActiveTab } = useResumeWorkspace();

  if (!generationError) return null;

  return (
    <div className="synthesis-error-banner">
      <div className="error-banner-content">
        <div className="error-banner-header">
          <span className="error-icon">⚠️</span>
          <h4>AI Synthesis Notification</h4>
        </div>
        <p>{generationError}</p>
        <div className="error-banner-actions">
          <button
            className="studio-btn studio-btn-primary btn-xs"
            onClick={() => {
              setGenerationError(null);
              setActiveTab('settings');
            }}
          >
            ⚙️ Open AI Settings & Add Key
          </button>
          <button
            className="studio-btn studio-btn-secondary btn-xs"
            onClick={() => setGenerationError(null)}
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
