import { GoogleGenerativeAI } from '@google/generative-ai';
import { AIProviderId, AIProviderSettings } from '../../types/cv';
import { PromptBundle } from './prompt-builder';

export interface StrategyResult {
  text: string;
  modelUsed: string;
}

export type StrategyProgressCallback = (update: {
  chunk: string;
  accumulatedText: string;
  wordCount: number;
}) => void;

export interface AIProviderStrategy {
  execute(
    prompts: PromptBundle,
    settings: AIProviderSettings,
    onProgress?: StrategyProgressCallback,
    signal?: AbortSignal
  ): Promise<StrategyResult>;
}

/**
 * Strategy: Local AI (Ollama, LM Studio, LocalAI, vLLM, text-generation-webui)
 */
export class LocalAIStrategy implements AIProviderStrategy {
  async execute(
    prompts: PromptBundle,
    settings: AIProviderSettings,
    onProgress?: StrategyProgressCallback,
    signal?: AbortSignal
  ): Promise<StrategyResult> {
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
        signal,
        body: JSON.stringify({
          model: modelName,
          messages: [
            { role: 'system', content: prompts.systemInstruction },
            { role: 'user', content: prompts.userPrompt }
          ],
          stream: true,
          temperature: typeof settings.temperature === 'number' ? settings.temperature : 0.15
        })
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        const errDetail = errJson.error?.message || errJson.message || `HTTP ${response.status} ${response.statusText}`;
        throw new Error(`Local model error: ${errDetail}`);
      }

      if (!response.body) {
        throw new Error('No response stream received from Local AI server.');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let text = '';
      let buffer = '';

      while (true) {
        if (signal?.aborted) throw new Error('Generation cancelled by user.');
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith('data: ') && trimmed !== 'data: [DONE]') {
            try {
              const parsed = JSON.parse(trimmed.slice(6));
              const delta = parsed.choices?.[0]?.delta?.content || '';
              if (delta) {
                text += delta;
                if (onProgress) {
                  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
                  onProgress({ chunk: delta, accumulatedText: text, wordCount });
                }
              }
            } catch {
              // Ignore partial chunk parse error
            }
          }
        }
      }

      if (!text || text.trim().length === 0) {
        throw new Error(`Empty response from local AI (${modelName}). Please check if the model is loaded in your local server.`);
      }

      return {
        text,
        modelUsed: `Local AI (${modelName})`
      };
    } catch (err: unknown) {
      if (signal?.aborted || (err instanceof Error && err.name === 'AbortError')) {
        throw new Error('Generation cancelled by user.');
      }
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
 * Strategy: Google Gemini (SDK with Content Stream)
 */
export class GeminiStrategy implements AIProviderStrategy {
  async execute(
    prompts: PromptBundle,
    settings: AIProviderSettings,
    onProgress?: StrategyProgressCallback,
    signal?: AbortSignal
  ): Promise<StrategyResult> {
    const apiKey = settings.apiKey?.trim();
    if (!apiKey) {
      throw new Error('Please enter your Google Gemini API Key in AI Settings.');
    }

    const modelName = settings.model?.trim() || 'gemini-3.6-flash';

    if (signal?.aborted) throw new Error('Generation cancelled by user.');

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction: prompts.systemInstruction,
        generationConfig: {
          temperature: typeof settings.temperature === 'number' ? settings.temperature : 0.15
        }
      });

      const resultStream = await model.generateContentStream(prompts.userPrompt);
      let text = '';

      for await (const chunk of resultStream.stream) {
        if (signal?.aborted) throw new Error('Generation cancelled by user.');
        const chunkText = chunk.text();
        text += chunkText;
        if (onProgress) {
          const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
          onProgress({ chunk: chunkText, accumulatedText: text, wordCount });
        }
      }

      if (!text || text.trim().length === 0) {
        throw new Error(`Empty response from Gemini model ${modelName}`);
      }

      return {
        text,
        modelUsed: `Google ${modelName}`
      };
    } catch (err: unknown) {
      if (signal?.aborted || (err instanceof Error && (err.name === 'AbortError' || err.message.includes('cancelled')))) {
        throw new Error('Generation cancelled by user.');
      }
      const msg = err instanceof Error ? err.message : String(err);
      throw new Error(`Gemini (${modelName}) Error: ${msg}`);
    }
  }
}

/**
 * Strategy: OpenAI-Compatible APIs (OpenAI, Groq, OpenRouter, Custom Endpoints)
 */
export class OpenAICompatibleStrategy implements AIProviderStrategy {
  async execute(
    prompts: PromptBundle,
    settings: AIProviderSettings,
    onProgress?: StrategyProgressCallback,
    signal?: AbortSignal
  ): Promise<StrategyResult> {
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
        signal,
        body: JSON.stringify({
          model: settings.model || (settings.provider === 'groq' ? 'llama-3.3-70b-versatile' : 'gpt-4o'),
          messages: [
            { role: 'system', content: prompts.systemInstruction },
            { role: 'user', content: prompts.userPrompt }
          ],
          stream: true,
          temperature: typeof settings.temperature === 'number' ? settings.temperature : 0.15
        })
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error?.message || `API error ${response.status}: ${response.statusText}`);
      }

      if (!response.body) {
        throw new Error('No stream response from API.');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let text = '';
      let buffer = '';

      while (true) {
        if (signal?.aborted) throw new Error('Generation cancelled by user.');
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith('data: ') && trimmed !== 'data: [DONE]') {
            try {
              const parsed = JSON.parse(trimmed.slice(6));
              const delta = parsed.choices?.[0]?.delta?.content || '';
              if (delta) {
                text += delta;
                if (onProgress) {
                  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
                  onProgress({ chunk: delta, accumulatedText: text, wordCount });
                }
              }
            } catch {
              // Ignore partial chunk parse error
            }
          }
        }
      }

      return {
        text,
        modelUsed: `${settings.provider.toUpperCase()} (${settings.model})`
      };
    } catch (err: unknown) {
      if (signal?.aborted || (err instanceof Error && err.name === 'AbortError')) {
        throw new Error('Generation cancelled by user.');
      }
      const msg = err instanceof Error ? err.message : String(err);
      throw new Error(`${settings.provider.toUpperCase()} Error: ${msg}`);
    }
  }
}

/**
 * Strategy: Anthropic Claude API
 */
export class ClaudeStrategy implements AIProviderStrategy {
  async execute(
    prompts: PromptBundle,
    settings: AIProviderSettings,
    onProgress?: StrategyProgressCallback,
    signal?: AbortSignal
  ): Promise<StrategyResult> {
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
        signal,
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
      if (onProgress) {
        const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
        onProgress({ chunk: text, accumulatedText: text, wordCount });
      }

      return {
        text,
        modelUsed: `Anthropic ${settings.model || 'Claude 3.7 Sonnet'}`
      };
    } catch (err: unknown) {
      if (signal?.aborted || (err instanceof Error && err.name === 'AbortError')) {
        throw new Error('Generation cancelled by user.');
      }
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
