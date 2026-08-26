import React from 'react';
import { Icon } from '../Icons';
import { 
  AVAILABLE_AI_MODELS, 
  AIProviderSettings 
} from '../../core/ai-service';

interface StepAITailorProps {
  candidateName: string;
  companyName: string;
  targetRole: string;
  pageBudget: 1 | 2;
  onPageBudgetChange: (val: 1 | 2) => void;
  providerSettings: AIProviderSettings;
  onSettingsChange: (settings: AIProviderSettings) => void;
  onGenerate: () => Promise<void>;
  isGenerating: boolean;
  generationStep: string;
  hasGeneratedCv: boolean;
  onPrevStep: () => void;
  onNextStep: () => void;
}

export const StepAITailor: React.FC<StepAITailorProps> = ({
  candidateName,
  companyName,
  targetRole,
  pageBudget,
  onPageBudgetChange,
  providerSettings,
  onSettingsChange,
  onGenerate,
  isGenerating,
  generationStep,
  hasGeneratedCv,
  onPrevStep,
  onNextStep
}) => {
  const currentModel = AVAILABLE_AI_MODELS.find(m => m.id === providerSettings.model) || AVAILABLE_AI_MODELS[0];

  const handleModelSelect = (modelId: string) => {
    const selected = AVAILABLE_AI_MODELS.find(m => m.id === modelId);
    if (selected) {
      onSettingsChange({
        ...providerSettings,
        provider: selected.provider,
        model: selected.id
      });
    }
  };

  return (
    <div className="wizard-step-view">
      {/* Guiding Hero Banner */}
      <div className="step-guidance-card">
        <div className="guidance-left">
          <div className="step-badge-pill ai">
            <Icon type="sparkles" size={14} /> Step 3 of 4 • Intelligent AI Tailoring
          </div>
          <h2 className="step-title">Surgically Tailor Your Resume with AI</h2>
          <p className="step-description">
            The AI cross-references your career history with the target job requirements.
            <strong> It aligns your top achievements, embeds required technical keywords</strong>, and calibrates quantifiable metrics (Google XYZ formula) so your resume passes ATS filters and impresses hiring managers.
          </p>
        </div>
      </div>

      {/* Target Summary Card */}
      <div className="tailor-summary-card">
        <div className="tailor-summary-header">
          <Icon type="target" size={16} />
          <span>Application Overview</span>
        </div>
        <div className="tailor-summary-grid">
          <div className="summary-item">
            <span className="summary-label">Candidate:</span>
            <strong className="summary-value">{candidateName || 'Your Name'}</strong>
          </div>
          <div className="summary-item">
            <span className="summary-label">Target Employer:</span>
            <strong className="summary-value">{companyName || 'Employer Pending'}</strong>
          </div>
          <div className="summary-item">
            <span className="summary-label">Target Role:</span>
            <strong className="summary-value">{targetRole || 'Role Pending'}</strong>
          </div>
        </div>
      </div>

      {/* Options Grid */}
      <div className="tailor-config-grid">
        {/* Extensión del CV */}
        <div className="tailor-card">
          <div className="tailor-card-header">
            <Icon type="layers" size={16} />
            <div>
              <h3 className="tailor-card-title">1. Resume Length (Page Budget)</h3>
              <p className="tailor-card-subtitle">
                Select the optimal length for your career seniority.
              </p>
            </div>
          </div>

          <div className="budget-options-grid">
            <div
              className={`budget-card-choice ${pageBudget === 1 ? 'selected' : ''}`}
              onClick={() => onPageBudgetChange(1)}
              role="button"
              tabIndex={0}
            >
              <div className="budget-choice-top">
                <span className="budget-choice-title">1 Page (Standard A4)</span>
                <span className="budget-recommend-badge">Recommended</span>
              </div>
              <p className="budget-choice-desc">
                Optimized for a 30-second recruiter scan. The AI condenses and prioritizes your highest-impact achievements to fit onto a single page.
              </p>
              <div className="budget-choice-check">
                {pageBudget === 1 ? <Icon type="check-circle" size={18} /> : <div className="choice-circle-empty" />}
              </div>
            </div>

            <div
              className={`budget-card-choice ${pageBudget === 2 ? 'selected' : ''}`}
              onClick={() => onPageBudgetChange(2)}
              role="button"
              tabIndex={0}
            >
              <div className="budget-choice-top">
                <span className="budget-choice-title">2 Pages (Extended)</span>
              </div>
              <p className="budget-choice-desc">
                Recommended for directors, tech leads, or professionals with 8-10+ years of experience and extensive project history.
              </p>
              <div className="budget-choice-check">
                {pageBudget === 2 ? <Icon type="check-circle" size={18} /> : <div className="choice-circle-empty" />}
              </div>
            </div>
          </div>
        </div>

        {/* Modelo de Inteligencia */}
        <div className="tailor-card">
          <div className="tailor-card-header">
            <Icon type="brain" size={16} />
            <div>
              <h3 className="tailor-card-title">2. Artificial Intelligence Engine</h3>
              <p className="tailor-card-subtitle">
                Public models are free to use and do not require an account or credit card.
              </p>
            </div>
          </div>

          <div className="model-selection-wrapper">
            <label htmlFor="ai-model-dropdown" className="field-block-label">
              Selected Engine:
            </label>
            <select
              id="ai-model-dropdown"
              className="studio-select-large"
              value={providerSettings.model}
              onChange={(e) => handleModelSelect(e.target.value)}
              disabled={isGenerating}
            >
              <optgroup label="✨ Free Public AI (No API Key Required)">
                {AVAILABLE_AI_MODELS.filter(m => m.isFree).map(m => (
                  <option key={m.id} value={m.id}>
                    🟢 {m.name} — {m.description}
                  </option>
                ))}
              </optgroup>
              <optgroup label="🔑 Custom / BYOK Models">
                {AVAILABLE_AI_MODELS.filter(m => !m.isFree).map(m => (
                  <option key={m.id} value={m.id}>
                    🔑 {m.name}
                  </option>
                ))}
              </optgroup>
            </select>

            <div className="model-info-note">
              <span className="info-icon">💡</span>
              <span>
                Currently using <strong>{currentModel.name}</strong>. {currentModel.isFree ? 'Ready to use with zero setup.' : 'Requires your personal API key configured in Settings.'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Synthesis Trigger Banner */}
      <div className="synthesis-launch-box">
        {isGenerating ? (
          <div className="generation-in-progress">
            <div className="generation-spinner-glow">
              <Icon type="refresh" size={28} className="spin" />
            </div>
            <div className="generation-progress-info">
              <h3 className="generation-headline">Tailoring Your Resume...</h3>
              <p className="generation-current-step">{generationStep || 'Processing requirements and calibrating achievements...'}</p>
            </div>
          </div>
        ) : (
          <div className="generation-ready-state">
            <div className="generation-ready-left">
              <h3 className="generation-cta-title">Ready to tailor your resume?</h3>
              <p className="generation-cta-desc">
                Clicking the button initiates AI synthesis. Your master career profile in Step 1 remains untouched.
              </p>
            </div>

            <button
              type="button"
              className="studio-btn studio-btn-primary btn-generate-hero"
              onClick={onGenerate}
              disabled={isGenerating}
            >
              <Icon type="zap" size={18} />
              <span>✨ Tailor My Resume with AI Now</span>
            </button>
          </div>
        )}

        {hasGeneratedCv && !isGenerating && (
          <div className="generation-success-pill">
            <Icon type="check-circle" size={16} />
            <span>
              Tailored resume for <strong>{companyName || 'this vacancy'}</strong> is ready! Head to Step 4 to preview, change visual themes, or export as PDF.
            </span>
          </div>
        )}
      </div>

      {/* Navigation Footer */}
      <footer className="step-navigation-footer">
        <div className="footer-left">
          <button
            type="button"
            className="studio-btn studio-btn-secondary btn-prev-step"
            onClick={onPrevStep}
            disabled={isGenerating}
          >
            <Icon type="arrow-left" size={15} />
            <span>Back to Target Job</span>
          </button>
        </div>

        <div className="footer-right">
          <button
            type="button"
            className="studio-btn studio-btn-primary btn-next-step"
            onClick={onNextStep}
            disabled={isGenerating}
          >
            <span>View Preview & PDF Export</span>
            <Icon type="arrow-right" size={15} />
          </button>
        </div>
      </footer>
    </div>
  );
};
