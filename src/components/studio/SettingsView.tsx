import React, { useState } from 'react';
import { Icon } from '../Icons';
import {
  AVAILABLE_AI_MODELS,
  AIProviderSettings,
  DEFAULT_RULES
} from '../../core/ai-service';

interface SettingsViewProps {
  settings: AIProviderSettings;
  onSettingsChange: (settings: AIProviderSettings) => void;
  rules: string;
  onRulesChange: (rules: string) => void;
  onResetDefaults: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onSettingsChange,
  rules,
  onRulesChange,
  onResetDefaults
}) => {
  const [showKey, setShowKey] = useState(false);
  const [activeTab, setActiveTab] = useState<'ai' | 'rules'>('ai');

  const handleProviderChange = (provider: any) => {
    const defaultModelForProvider = AVAILABLE_AI_MODELS.find(m => m.provider === provider)?.id || 'gemini-3.6-flash';
    onSettingsChange({
      ...settings,
      provider,
      model: defaultModelForProvider
    });
  };

  return (
    <div className="settings-container">
      {/* Top Banner */}
      <div className="settings-header">
        <div className="settings-title-group">
          <span className="settings-icon">
            <Icon type="settings" size={20} />
          </span>
          <div>
            <h2 className="settings-title">Studio & AI Configuration</h2>
            <p className="settings-subtitle">
              Manage your AI inference engine, API credentials, and resume synthesis rules.
            </p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="settings-nav-pills">
          <button
            type="button"
            className={`settings-pill ${activeTab === 'ai' ? 'active' : ''}`}
            onClick={() => setActiveTab('ai')}
          >
            <Icon type="brain" size={14} /> AI Providers & Keys
          </button>
          <button
            type="button"
            className={`settings-pill ${activeTab === 'rules' ? 'active' : ''}`}
            onClick={() => setActiveTab('rules')}
          >
            <Icon type="shield" size={14} /> Synthesis Rules (rules.md)
          </button>
        </div>
      </div>

      {activeTab === 'ai' ? (
        <div className="settings-grid">
          {/* AI Provider Config */}
          <div className="studio-card">
            <div className="card-header">
              <span className="card-icon"><Icon type="zap" size={16} /></span>
              <h3 className="card-title">Active AI Provider</h3>
            </div>

            <div className="provider-options-grid">
              <label className={`provider-radio-card ${settings.provider === 'free-pollinations' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="provider-radio"
                  checked={settings.provider === 'free-pollinations'}
                  onChange={() => handleProviderChange('free-pollinations')}
                />
                <div className="provider-info">
                  <div className="provider-name-row">
                    <strong>Free AI (No API Key)</strong>
                    <span className="badge-free">100% Free</span>
                  </div>
                  <p>Uses public inference endpoints with zero setup required.</p>
                </div>
              </label>

              <label className={`provider-radio-card ${settings.provider === 'gemini' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="provider-radio"
                  checked={settings.provider === 'gemini'}
                  onChange={() => handleProviderChange('gemini')}
                />
                <div className="provider-info">
                  <div className="provider-name-row">
                    <strong>Google Gemini (BYOK)</strong>
                    <span className="badge-pro">Recommended</span>
                  </div>
                  <p>Direct Google AI API with Gemini 3.6 Flash.</p>
                </div>
              </label>

              <label className={`provider-radio-card ${settings.provider === 'openai' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="provider-radio"
                  checked={settings.provider === 'openai'}
                  onChange={() => handleProviderChange('openai')}
                />
                <div className="provider-info">
                  <div className="provider-name-row">
                    <strong>OpenAI (BYOK)</strong>
                  </div>
                  <p>GPT-4o, GPT-4o-mini, and o3-mini models.</p>
                </div>
              </label>

              <label className={`provider-radio-card ${settings.provider === 'claude' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="provider-radio"
                  checked={settings.provider === 'claude'}
                  onChange={() => handleProviderChange('claude')}
                />
                <div className="provider-info">
                  <div className="provider-name-row">
                    <strong>Anthropic Claude (BYOK)</strong>
                  </div>
                  <p>Claude 3.7 Sonnet and Claude 3.5 Sonnet.</p>
                </div>
              </label>

              <label className={`provider-radio-card ${settings.provider === 'groq' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="provider-radio"
                  checked={settings.provider === 'groq'}
                  onChange={() => handleProviderChange('groq')}
                />
                <div className="provider-info">
                  <div className="provider-name-row">
                    <strong>Groq (BYOK)</strong>
                    <span className="badge-speed">Ultra Fast</span>
                  </div>
                  <p>Llama 3.3 70B & DeepSeek R1 running on Groq LPUs.</p>
                </div>
              </label>

              <label className={`provider-radio-card ${settings.provider === 'openrouter' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="provider-radio"
                  checked={settings.provider === 'openrouter'}
                  onChange={() => handleProviderChange('openrouter')}
                />
                <div className="provider-info">
                  <div className="provider-name-row">
                    <strong>OpenRouter / Custom (BYOK)</strong>
                  </div>
                  <p>Connect any OpenAI-compatible proxy or local server.</p>
                </div>
              </label>
            </div>
          </div>

          {/* Key & Parameters Card */}
          <div className="studio-card">
            <div className="card-header">
              <span className="card-icon"><Icon type="shield" size={16} /></span>
              <h3 className="card-title">Credentials & Synthesis Parameters</h3>
            </div>

            <div className="card-body-fields">
              {settings.provider !== 'free-pollinations' && (
                <div className="field-group">
                  <label className="field-label" htmlFor="settings-api-key-input">
                    {settings.provider.toUpperCase()} API Key:
                  </label>
                  <div className="key-input-wrapper">
                    <input
                      id="settings-api-key-input"
                      type={showKey ? 'text' : 'password'}
                      className="studio-input"
                      placeholder={`Paste your ${settings.provider} API key...`}
                      value={settings.apiKey || ''}
                      onChange={(e) => onSettingsChange({ ...settings, apiKey: e.target.value })}
                    />
                    <button
                      type="button"
                      className="key-toggle-btn"
                      onClick={() => setShowKey(!showKey)}
                    >
                      <Icon type="eye" size={14} />
                    </button>
                  </div>
                  <div className="api-key-hint-box" style={{ marginTop: '6px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    {settings.provider === 'gemini' && (
                      <p>
                        💡 <strong>100% Free Google Key:</strong> Get your free Gemini API key in 10 seconds at{' '}
                        <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>
                          aistudio.google.com
                        </a>{' '}
                        (No credit card required).
                      </p>
                    )}
                    {settings.provider === 'groq' && (
                      <p>
                        ⚡ <strong>Free Groq Key:</strong> Generate your free ultra-fast key at{' '}
                        <a href="https://console.groq.com/keys" target="_blank" rel="noreferrer" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>
                          console.groq.com/keys
                        </a>.
                      </p>
                    )}
                    <span className="api-key-hint">
                      🔒 Kept securely in your browser's private local storage.
                    </span>
                  </div>
                </div>
              )}

              {settings.provider === 'custom' && (
                <div className="field-group">
                  <label className="field-label" htmlFor="custom-endpoint-input">Custom API Endpoint URL:</label>
                  <input
                    id="custom-endpoint-input"
                    type="text"
                    className="studio-input"
                    placeholder="http://localhost:11434/v1"
                    value={settings.customEndpoint || ''}
                    onChange={(e) => onSettingsChange({ ...settings, customEndpoint: e.target.value })}
                  />
                </div>
              )}

              <div className="field-group">
                <label className="field-label" htmlFor="settings-model-picker">Active Model:</label>
                <select
                  id="settings-model-picker"
                  className="studio-select"
                  value={settings.model}
                  onChange={(e) => onSettingsChange({ ...settings, model: e.target.value })}
                >
                  {AVAILABLE_AI_MODELS.filter(m => m.provider === settings.provider).map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>

              <div className="field-group">
                <label className="field-label">Creativity / Temperature: {(typeof settings.temperature === 'number' ? settings.temperature : 0.15).toFixed(2)}</label>
                <input
                  type="range"
                  min="0.0"
                  max="1.0"
                  step="0.05"
                  className="studio-slider"
                  value={typeof settings.temperature === 'number' ? settings.temperature : 0.15}
                  onChange={(e) => onSettingsChange({ ...settings, temperature: parseFloat(e.target.value) })}
                />
                <span className="slider-hint">Recommended: 0.10 - 0.25 for strict factual precision (Zero Hallucination).</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="rules-editor-wrapper">
          <div className="rules-header-row">
            <div>
              <h3>AI Synthesis Guidelines & SSOT Rules (rules.md)</h3>
              <p>These instructions are sent as the system prompt to guide the AI's phrasing, metric format, and ATS rules.</p>
            </div>
            <button
              type="button"
              className="studio-btn studio-btn-secondary btn-sm"
              onClick={() => onRulesChange(DEFAULT_RULES)}
            >
              <Icon type="refresh" size={13} /> Reset to Default Rules
            </button>
          </div>

          <textarea
            className="studio-textarea rules-textarea"
            value={rules}
            onChange={(e) => onRulesChange(e.target.value)}
            spellCheck={false}
          />
        </div>
      )}

      {/* Footer Reset */}
      <div className="settings-footer">
        <button
          type="button"
          className="studio-btn studio-btn-danger btn-sm"
          onClick={onResetDefaults}
        >
          <Icon type="trash" size={13} /> Reset Workspace & Clear Cache
        </button>
      </div>
    </div>
  );
};
