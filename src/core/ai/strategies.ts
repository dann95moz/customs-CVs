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
 * Strategy: Public Free AI via Pollinations
 */
export class PollinationsStrategy implements AIProviderStrategy {
  async execute(prompts: PromptBundle, settings: AIProviderSettings): Promise<StrategyResult> {
    const modelParam = settings.model === 'free-deepseek' ? 'deepseek' : (settings.model === 'free-gemini' ? 'gemini' : 'openai');

    const response = await fetch('https://text.pollinations.ai/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          { role: 'system', content: prompts.systemInstruction },
          { role: 'user', content: prompts.userPrompt }
        ],
        model: modelParam,
        temperature: typeof settings.temperature === 'number' ? settings.temperature : 0.15,
        seed: 42
      })
    }).catch((err) => {
      throw new Error(`Public Free AI connection error (${err.message}). The public endpoint may be rate-limited or blocked by browser CORS. Please use Google Gemini 3.6 Flash (Free key at aistudio.google.com) or configure your key in Settings.`);
    });

    if (!response.ok) {
      throw new Error(`Public Free AI error (HTTP ${response.status} ${response.statusText}). Public inference is currently rate-limited. Please use Google Gemini 3.6 Flash (Free API Key available at aistudio.google.com) or enter your API key in Settings.`);
    }

    const text = await response.text();
    if (!text || text.length < 100) {
      throw new Error('Empty response received from public AI service. Please select another model or enter your API Key.');
    }

    return {
      text,
      modelUsed: `Free AI (${modelParam.toUpperCase()})`
    };
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

    let lastError: any = null;
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
      } catch (err: any) {
        lastError = err;
        console.warn(`Gemini model ${m} failed (${err.message}). Trying fallback model...`);
      }
    }

    throw new Error(`Gemini API Error: ${lastError?.message || 'Failed to generate with Google Gemini'}`);
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
    } catch (err: any) {
      throw new Error(`${settings.provider.toUpperCase()} Error: ${err.message}`);
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
          'dangerously-allow-browser': 'true'
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
    } catch (err: any) {
      throw new Error(`Claude API Error: ${err.message}`);
    }
  }
}

// Strategy instances singleton cache
const pollinationsStrategy = new PollinationsStrategy();
const geminiStrategy = new GeminiStrategy();
const openAICompatibleStrategy = new OpenAICompatibleStrategy();
const claudeStrategy = new ClaudeStrategy();

/**
 * Resolves the appropriate AIProviderStrategy based on provider ID.
 */
export function getAIStrategy(provider: AIProviderId): AIProviderStrategy {
  switch (provider) {
    case 'free-pollinations':
      return pollinationsStrategy;
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
