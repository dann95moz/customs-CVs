import React, { useState } from 'react';
import { Icon } from '../Icons';
import { 
  AVAILABLE_AI_MODELS, 
  AIModelOption, 
  AIProviderSettings 
} from '../../core/ai-service';
import { AIProviderId } from '../../types/cv';

interface AIGeneratorPanelProps {
  companyName: string;
  onCompanyChange: (val: string) => void;
  targetRole: string;
  onRoleChange: (val: string) => void;
  pageBudget: 1 | 2;
  onPageBudgetChange: (val: 1 | 2) => void;
  providerSettings: AIProviderSettings;
  onSettingsChange: (settings: AIProviderSettings) => void;
  onGenerate: () => Promise<void>;
  isGenerating: boolean;
  generationStep: string;
}

export const AIGeneratorPanel: React.FC<AIGeneratorPanelProps> = ({
  companyName,
  onCompanyChange,
  targetRole,
  onRoleChange,
  pageBudget,
  onPageBudgetChange,
  providerSettings,
  onSettingsChange,
  onGenerate,
  isGenerating,
  generationStep
}) => {
  const [showKey, setShowKey] = useState(false);

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

  const handleApiKeyChange = (key: string) => {
    onSettingsChange({
      ...providerSettings,
      apiKey: key
    });
  };

  const isFreeModel = currentModel.isFree;

  return (
    <div className="generator-panel-container">
      {/* Banner */}
      <div className="generator-hero-banner">
        <div className="hero-content">
          <div className="hero-badge">
            <Icon type="sparkles" size={14} /> AI Tailor & Synthesizer Studio
          </div>
          <h2 className="hero-title">Custom Resume Tailoring Engine</h2>
          <p className="hero-desc">
            Synthesize an ATS-optimized, high-impact CV strictly aligned to your target vacancy using the Google XYZ achievement formula and verifiable metrics.
          </p>
        </div>
      </div>

      <div className="generator-grid">
        {/* Model Selection Card */}
        <div className="studio-card">
          <div className="card-header">
            <span className="card-icon">
              <Icon type="brain" size={16} />
            </span>
            <h3 className="card-title">1. Choose AI Model & Provider</h3>
          </div>

          <div className="model-selector-group">
            <label className="field-label" htmlFor="model-picker-select">Select Intelligence Engine:</label>
            <select
              id="model-picker-select"
              className="studio-select-large"
              value={providerSettings.model}
              onChange={(e) => handleModelSelect(e.target.value)}
              disabled={isGenerating}
            >
              <optgroup label="✨ Free Models (No API Key Required)">
                {AVAILABLE_AI_MODELS.filter(m => m.isFree).map(m => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </optgroup>
              <optgroup label="🔷 Google Gemini (BYOK)">
                {AVAILABLE_AI_MODELS.filter(m => m.provider === 'gemini').map(m => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </optgroup>
              <optgroup label="🟣 OpenAI (BYOK)">
                {AVAILABLE_AI_MODELS.filter(m => m.provider === 'openai').map(m => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </optgroup>
              <optgroup label="🟠 Anthropic Claude (BYOK)">
                {AVAILABLE_AI_MODELS.filter(m => m.provider === 'claude').map(m => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </optgroup>
              <optgroup label="⚡ Groq Fast Inference (BYOK)">
                {AVAILABLE_AI_MODELS.filter(m => m.provider === 'groq').map(m => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </optgroup>
              <optgroup label="🌐 OpenRouter / Custom (BYOK)">
                {AVAILABLE_AI_MODELS.filter(m => ['openrouter', 'custom'].includes(m.provider)).map(m => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </optgroup>
            </select>
            <p className="model-description-hint">
              {currentModel.description}
            </p>
          </div>

          {/* API Key Input (if not free) */}
          {!isFreeModel ? (
            <div className="api-key-box">
              <div className="api-key-header">
                <label className="field-label" htmlFor="api-key-input">
                  {providerSettings.provider.toUpperCase()} API Key:
                </label>
                <span className="key-saved-tag">
                  <Icon type="shield" size={11} /> Saved in Browser
                </span>
              </div>
              <div className="key-input-wrapper">
                <input
                  id="api-key-input"
                  type={showKey ? 'text' : 'password'}
                  className="studio-input"
                  placeholder={`Enter your ${providerSettings.provider} API key...`}
                  value={providerSettings.apiKey || ''}
                  onChange={(e) => handleApiKeyChange(e.target.value)}
                  disabled={isGenerating}
                />
                <button
                  type="button"
                  className="key-toggle-btn"
                  onClick={() => setShowKey(!showKey)}
                >
                  <Icon type={showKey ? 'eye' : 'eye'} size={14} />
                </button>
              </div>
              <span className="api-key-hint">
                🔒 Keys remain 100% private in your browser's <code>localStorage</code> and are never stored on any server.
              </span>
            </div>
          ) : (
            <div className="free-active-banner">
              <Icon type="check-circle" size={16} />
              <div>
                <strong>Free Public AI Active</strong>
                <p>Zero configuration needed. Ready to synthesize immediately!</p>
              </div>
            </div>
          )}
        </div>

        {/* Tailor Settings Card */}
        <div className="studio-card">
          <div className="card-header">
            <span className="card-icon">
              <Icon type="target" size={16} />
            </span>
            <div className="card-title-with-badge">
              <h3 className="card-title">2. Target Position & Page Budget</h3>
              {(companyName || targetRole) && (
                <span className="auto-detected-badge">
                  <Icon type="check-circle" size={11} /> Auto-Detected
                </span>
              )}
            </div>
          </div>

          <div className="card-body-fields">
            <div className="field-group">
              <div className="field-label-row">
                <label className="field-label" htmlFor="gen-company-input">Target Company Name:</label>
                <span className="field-hint-micro">Auto-extracted from target-job.md</span>
              </div>
              <input
                id="gen-company-input"
                type="text"
                className="studio-input"
                placeholder="Auto-detected from vacancy or enter name..."
                value={companyName}
                onChange={(e) => onCompanyChange(e.target.value)}
                disabled={isGenerating}
              />
            </div>

            <div className="field-group">
              <div className="field-label-row">
                <label className="field-label" htmlFor="gen-role-input">Target Role Title:</label>
                <span className="field-hint-micro">Auto-extracted from vacancy / profile</span>
              </div>
              <input
                id="gen-role-input"
                type="text"
                className="studio-input"
                placeholder="Auto-detected from vacancy or enter role..."
                value={targetRole}
                onChange={(e) => onRoleChange(e.target.value)}
                disabled={isGenerating}
              />
            </div>

            <div className="field-group">
              <label className="field-label">Target Page Budget:</label>
              <div className="page-budget-toggle">
                <button
                  type="button"
                  className={`budget-option ${pageBudget === 1 ? 'active' : ''}`}
                  onClick={() => onPageBudgetChange(1)}
                  disabled={isGenerating}
                >
                  <span className="budget-title">1 Page (A4 Strict Fit)</span>
                  <span className="budget-subtitle">420 – 480 words • 80-90% fill • High impact</span>
                </button>
                <button
                  type="button"
                  className={`budget-option ${pageBudget === 2 ? 'active' : ''}`}
                  onClick={() => onPageBudgetChange(2)}
                  disabled={isGenerating}
                >
                  <span className="budget-title">2 Pages (Senior / Lead)</span>
                  <span className="budget-subtitle">750 – 850 words • Extended projects & leadership</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Generation Trigger & Progress */}
      <div className="generation-action-box">
        {isGenerating ? (
          <div className="generating-status-card">
            <div className="spinner-sparkle">
              <Icon type="sparkles" size={24} />
            </div>
            <div className="status-text-group">
              <h4>Synthesizing Tailored Resume...</h4>
              <p className="status-step-label">{generationStep || 'Cross-referencing master data with vacancy...'}</p>
            </div>
          </div>
        ) : (
          <button
            type="button"
            className="studio-btn studio-btn-primary btn-generate-massive"
            onClick={onGenerate}
          >
            <Icon type="zap" size={18} /> Synthesize Tailored CV (1-Click)
          </button>
        )}
      </div>
    </div>
  );
};
