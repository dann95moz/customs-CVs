import { GoogleGenerativeAI } from '@google/generative-ai';
import { AIProviderId, AIProviderSettings } from '../../types/cv';
import { PromptBundle } from './prompt-builder';

export interface StrategyResult {
  text: string;
  modelUsed: string;
}

export interface AIProviderStrategy {
  execute(prompts: PromptBundle, settings: AIProviderSettings): Promise<StrategyResult>;
}

/**
 * Strategy: Local AI (Ollama, LM Studio, LocalAI, vLLM, text-generation-webui)
 */
export class LocalAIStrategy implements AIProviderStrategy {
  async execute(prompts: PromptBundle, settings: AIProviderSettings): Promise<StrategyResult> {
    const rawEndpoint = settings.customEndpoint?.trim() || 'http://localhost:11434/v1';
    let endpoint = rawEndpoint.replace(/\/$/, '');
    if (!endpoint.endsWith('/chat/completions')) {
      endpoint = `${endpoint}/chat/completions`;
    }

    const modelName = settings.model?.trim() || 'llama3.2';
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    if (settings.apiKey?.trim()) {
      headers['Authorization'] = `Bearer ${settings.apiKey.trim()}`;
    }

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          model: modelName,
          messages: [
            { role: 'system', content: prompts.systemInstruction },
            { role: 'user', content: prompts.userPrompt }
          ],
          temperature: typeof settings.temperature === 'number' ? settings.temperature : 0.15
        })
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        const errDetail = errJson.error?.message || errJson.message || `HTTP ${response.status} ${response.statusText}`;
        throw new Error(`Local model error: ${errDetail}`);
      }

      const data = await response.json();
      const text = data.choices?.[0]?.message?.content || data.message?.content || '';

      if (!text || text.trim().length === 0) {
        throw new Error(`Empty response from local AI (${modelName}). Please check if the model is loaded in your local server.`);
      }

      return {
        text,
        modelUsed: `Local AI (${modelName})`
      };
    } catch (err: unknown) {
      if (err instanceof Error && (err.message.startsWith('Local model error:') || err.message.startsWith('Empty response'))) {
        throw err;
      }
      const msg = err instanceof Error ? err.message : String(err);
      throw new Error(
        `Failed to connect to Local AI at ${rawEndpoint} (${msg}). ` +
        `Please ensure your local AI server (Ollama / LM Studio) is running. ` +
        `For Ollama, enable CORS by running: OLLAMA_ORIGINS="*" ollama serve`
      );
    }
  }
}

/**
 * Strategy: Google Gemini (SDK)
 */
export class GeminiStrategy implements AIProviderStrategy {
  async execute(prompts: PromptBundle, settings: AIProviderSettings): Promise<StrategyResult> {
    const apiKey = settings.apiKey?.trim();
    if (!apiKey) {
      throw new Error('Please enter your Google Gemini API Key in AI Settings.');
    }

    const requestedModel = settings.model || 'gemini-3.6-flash';
    const modelsToTry = [requestedModel, 'gemini-3.5-flash', 'gemini-3.7-flash'].filter((v, i, a) => a.indexOf(v) === i);

    let lastError: unknown = null;
    for (const m of modelsToTry) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
          model: m,
          systemInstruction: prompts.systemInstruction,
          generationConfig: {
            temperature: typeof settings.temperature === 'number' ? settings.temperature : 0.15
          }
        });

        const result = await model.generateContent(prompts.userPrompt);
        const text = result.response.text();

        return {
          text,
          modelUsed: `Google ${m}`
        };
      } catch (err: unknown) {
        lastError = err;
        const msg = err instanceof Error ? err.message : String(err);
        console.warn(`Gemini model ${m} failed (${msg}). Trying fallback model...`);
      }
    }

    const finalErrMsg = lastError instanceof Error ? lastError.message : 'Failed to generate with Google Gemini';
    throw new Error(`Gemini API Error: ${finalErrMsg}`);
  }
}

/**
 * Strategy: OpenAI-Compatible APIs (OpenAI, Groq, OpenRouter, Custom Endpoints)
 */
export class OpenAICompatibleStrategy implements AIProviderStrategy {
  async execute(prompts: PromptBundle, settings: AIProviderSettings): Promise<StrategyResult> {
    let endpoint = 'https://api.openai.com/v1/chat/completions';
    const apiKey = settings.apiKey?.trim() || '';

    if (settings.provider === 'groq') {
      endpoint = 'https://api.groq.com/openai/v1/chat/completions';
    } else if (settings.provider === 'openrouter') {
      endpoint = 'https://openrouter.ai/api/v1/chat/completions';
    } else if (settings.provider === 'custom' && settings.customEndpoint) {
      endpoint = settings.customEndpoint.replace(/\/$/, '') + '/chat/completions';
    }

    if (!apiKey && settings.provider !== 'custom') {
      throw new Error(`Please enter your ${settings.provider.toUpperCase()} API Key in AI Settings.`);
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    if (apiKey) {
      headers['Authorization'] = `Bearer ${apiKey}`;
    }
    if (settings.provider === 'openrouter') {
      headers['HTTP-Referer'] = 'https://customs-cvs.app';
      headers['X-Title'] = 'CV Studio Pro';
    }

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          model: settings.model || (settings.provider === 'groq' ? 'llama-3.3-70b-versatile' : 'gpt-4o'),
          messages: [
            { role: 'system', content: prompts.systemInstruction },
            { role: 'user', content: prompts.userPrompt }
          ],
          temperature: typeof settings.temperature === 'number' ? settings.temperature : 0.15
        })
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error?.message || `API error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const text = data.choices?.[0]?.message?.content || '';

      return {
        text,
        modelUsed: `${settings.provider.toUpperCase()} (${settings.model})`
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      throw new Error(`${settings.provider.toUpperCase()} Error: ${msg}`);
    }
  }
}

/**
 * Strategy: Anthropic Claude API
 */
export class ClaudeStrategy implements AIProviderStrategy {
  async execute(prompts: PromptBundle, settings: AIProviderSettings): Promise<StrategyResult> {
    const apiKey = settings.apiKey?.trim();
    if (!apiKey) {
      throw new Error('Please enter your Anthropic API Key in AI Settings.');
    }

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true'
        },
        body: JSON.stringify({
          model: settings.model || 'claude-3-7-sonnet-latest',
          max_tokens: 4000,
          system: prompts.systemInstruction,
          messages: [
            { role: 'user', content: prompts.userPrompt }
          ],
          temperature: typeof settings.temperature === 'number' ? settings.temperature : 0.15
        })
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error?.message || `Claude API Error ${response.status}`);
      }

      const data = await response.json();
      const text = data.content?.[0]?.text || '';

      return {
        text,
        modelUsed: `Anthropic ${settings.model || 'Claude 3.7 Sonnet'}`
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      throw new Error(`Claude API Error: ${msg}`);
    }
  }
}

// Strategy instances singleton cache
const localAIStrategy = new LocalAIStrategy();
const geminiStrategy = new GeminiStrategy();
const openAICompatibleStrategy = new OpenAICompatibleStrategy();
const claudeStrategy = new ClaudeStrategy();

/**
 * Resolves the appropriate AIProviderStrategy based on provider ID.
 */
export function getAIStrategy(provider: AIProviderId): AIProviderStrategy {
  switch (provider) {
    case 'local':
      return localAIStrategy;
    case 'gemini':
      return geminiStrategy;
    case 'claude':
      return claudeStrategy;
    case 'openai':
    case 'groq':
    case 'openrouter':
    case 'custom':
      return openAICompatibleStrategy;
    default:
      throw new Error(`Unsupported AI Provider: ${provider}`);
  }
}
