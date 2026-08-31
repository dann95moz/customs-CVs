import {
  AIModelOption,
  AIProviderSettings,
  AIConnectionTestResult,
  TailorRequest,
  TailorResponse
} from '../types/cv';
import { buildPrompts, DEFAULT_RULES, PromptBundle } from './ai/prompt-builder';
import { extractCvAndGap, ExtractedCvAndGap } from './ai/extractor';
import { getAIStrategy } from './ai/strategies';
import { generateInterviewPrep } from './ai/interview-prep-generator';
import { generateCoverLetter } from './ai/cover-letter-generator';
import { generateLinkedInProfile } from './ai/linkedin-generator';
import { GoogleGenerativeAI } from '@google/generative-ai';

export type { AIModelOption, AIProviderSettings, AIConnectionTestResult, TailorRequest, TailorResponse };
export { buildPrompts, DEFAULT_RULES, extractCvAndGap, generateInterviewPrep, generateCoverLetter, generateLinkedInProfile };

export const AVAILABLE_AI_MODELS: AIModelOption[] = [
  // 1. Local AI Models (Ollama, LM Studio, LocalAI, vLLM - 100% Free & Offline)
  {
    id: 'llama3.2',
    name: 'Local AI — Llama 3.2 (Ollama / LM Studio)',
    provider: 'local',
    description: 'Runs completely locally on your hardware. Fast, 100% private, and zero API costs.',
    isFree: true,
    requiresKey: false
  },
  {
    id: 'deepseek-r1:8b',
    name: 'Local AI — DeepSeek R1 Distill (8B / 14B)',
    provider: 'local',
    description: 'Local reasoning model for rigorous ATS keyword extraction and metric validation.',
    isFree: true,
    requiresKey: false
  },
  {
    id: 'mistral',
    name: 'Local AI — Mistral (7B / Nemo)',
    provider: 'local',
    description: 'High-quality local executive writing and concise achievement framing.',
    isFree: true,
    requiresKey: false
  },
  {
    id: 'qwen2.5:7b',
    name: 'Local AI — Qwen 2.5 (7B / 14B)',
    provider: 'local',
    description: 'Exceptional instruction-following and structured Markdown generation.',
    isFree: true,
    requiresKey: false
  },
  {
    id: 'phi4',
    name: 'Local AI — Microsoft Phi-4 (14B)',
    provider: 'local',
    description: 'State-of-the-art small language model with high logical reasoning accuracy.',
    isFree: true,
    requiresKey: false
  },
  {
    id: 'custom-local-model',
    name: 'Local AI — Custom Model Name',
    provider: 'local',
    description: 'Connect to any custom model loaded in your Ollama or LM Studio instance.',
    isFree: true,
    requiresKey: false
  },

  // 2. Google Gemini (Recommended Cloud - Free API Key from Google AI Studio)
  {
    id: 'gemini-3.6-flash',
    name: 'Google Gemini 3.6 Flash (Recommended — Free API Key)',
    provider: 'gemini',
    description: 'Zero hallucinations. Ultra-fast synthesis with free Google AI Studio key.',
    isFree: false,
    requiresKey: true
  },
  {
    id: 'gemini-3.7-flash',
    name: 'Google Gemini 3.7 Flash',
    provider: 'gemini',
    description: 'Latest Google flagship model with advanced reasoning capabilities.',
    isFree: false,
    requiresKey: true
  },
  {
    id: 'gemini-2.5-flash',
    name: 'Google Gemini 2.5 Flash',
    provider: 'gemini',
    description: 'Fast and reliable generative inference for resume optimization.',
    isFree: false,
    requiresKey: true
  },
  {
    id: 'gemini-2.5-pro',
    name: 'Google Gemini 2.5 Pro',
    provider: 'gemini',
    description: 'Deep context reasoning and nuanced executive leadership articulation.',
    isFree: false,
    requiresKey: true
  },

  // 3. Groq (Ultra-Fast Free Tier)
  {
    id: 'llama-3.3-70b-versatile',
    name: 'Groq — Llama 3.3 70B (Fast & Free Key)',
    provider: 'groq',
    description: 'Sub-second response speeds using free Groq Console key (console.groq.com).',
    isFree: false,
    requiresKey: true
  },
  {
    id: 'deepseek-r1-distill-llama-70b',
    name: 'Groq — DeepSeek R1 Distill 70B',
    provider: 'groq',
    description: 'High-speed distilled reasoning model hosted on Groq LPU hardware.',
    isFree: false,
    requiresKey: true
  },

  // 4. OpenAI (BYOK)
  {
    id: 'gpt-4o',
    name: 'OpenAI GPT-4o',
    provider: 'openai',
    description: 'Flagship omni-model with top-tier executive writing quality.',
    isFree: false,
    requiresKey: true
  },
  {
    id: 'gpt-4o-mini',
    name: 'OpenAI GPT-4o Mini',
    provider: 'openai',
    description: 'Affordable, fast, and highly accurate for resume formatting.',
    isFree: false,
    requiresKey: true
  },
  {
    id: 'o3-mini',
    name: 'OpenAI o3-mini (Reasoning)',
    provider: 'openai',
    description: 'Advanced reasoning model for meticulous ATS keyword matching.',
    isFree: false,
    requiresKey: true
  },

  // 5. Anthropic Claude (BYOK)
  {
    id: 'claude-3-7-sonnet-latest',
    name: 'Anthropic Claude 3.7 Sonnet',
    provider: 'claude',
    description: 'State-of-the-art hybrid reasoning for polished resume prose.',
    isFree: false,
    requiresKey: true
  },
  {
    id: 'claude-3-5-sonnet-latest',
    name: 'Anthropic Claude 3.5 Sonnet',
    provider: 'claude',
    description: 'Gold-standard coding and technical narrative generator.',
    isFree: false,
    requiresKey: true
  },

  // 6. OpenRouter (BYOK)
  {
    id: 'openrouter-free',
    name: 'OpenRouter (Multi-Model Gateway)',
    provider: 'openrouter',
    description: 'Connect to 100+ models using your OpenRouter unified key.',
    isFree: false,
    requiresKey: true
  },

  // 7. Custom Remote Endpoint
  {
    id: 'custom-endpoint',
    name: 'Custom OpenAI-Compatible Endpoint',
    provider: 'custom',
    description: 'Private proxy, vLLM instance, or self-hosted API gateway.',
    isFree: false,
    requiresKey: false
  }
];

/**
 * Validates AI provider connectivity and returns diagnostic feedback.
 */
export async function testAIConnection(settings: AIProviderSettings): Promise<AIConnectionTestResult> {
  try {
    if (settings.provider === 'local') {
      const rawEndpoint = settings.customEndpoint?.trim() || 'http://localhost:11434/v1';
      let endpoint = rawEndpoint.replace(/\/$/, '');
      if (!endpoint.endsWith('/chat/completions')) {
        endpoint = `${endpoint}/chat/completions`;
      }

      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      if (settings.apiKey?.trim()) {
        headers['Authorization'] = `Bearer ${settings.apiKey.trim()}`;
      }

      // First try fetching models list if Ollama / LM Studio standard endpoint
      let detectedModels: string[] | undefined;
      try {
        const baseV1 = rawEndpoint.replace(/\/$/, '').replace(/\/chat\/completions$/, '');
        const modelsRes = await fetch(`${baseV1}/models`, { method: 'GET', headers }).catch(() => null);
        if (modelsRes && modelsRes.ok) {
          const mData = await modelsRes.json().catch(() => ({}));
          if (Array.isArray(mData.data)) {
            detectedModels = mData.data.map((m: { id?: string }) => m.id || '').filter(Boolean);
          }
        }
      } catch {
        // Models list probe optional
      }

      const testRes = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          model: settings.model || 'llama3.2',
          messages: [{ role: 'user', content: 'Respond with the single word: OK' }],
          max_tokens: 5,
          temperature: 0.1
        })
      });

      if (!testRes.ok) {
        const errJson = await testRes.json().catch(() => ({}));
        const errDetail = errJson.error?.message || errJson.message || `HTTP ${testRes.status} ${testRes.statusText}`;
        return {
          success: false,
          message: `Local server responded with error: ${errDetail}`
        };
      }

      return {
        success: true,
        message: `Successfully connected to Local AI (${settings.model || 'Local Model'})!`,
        detectedModels
      };
    }

    if (settings.provider === 'gemini') {
      const key = settings.apiKey?.trim();
      if (!key) {
        return { success: false, message: 'Please enter your Google Gemini API Key from aistudio.google.com' };
      }
      const genAI = new GoogleGenerativeAI(key);
      const model = genAI.getGenerativeModel({ model: settings.model || 'gemini-3.6-flash' });
      await model.generateContent('Say OK');
      return { success: true, message: 'Google Gemini API Key validated successfully!' };
    }

    if (settings.provider === 'claude') {
      const key = settings.apiKey?.trim();
      if (!key) {
        return { success: false, message: 'Please enter your Anthropic Claude API Key.' };
      }
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': key,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true'
        },
        body: JSON.stringify({
          model: settings.model || 'claude-3-7-sonnet-latest',
          max_tokens: 5,
          messages: [{ role: 'user', content: 'Say OK' }]
        })
      });
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        return { success: false, message: errJson.error?.message || `Claude API Error (HTTP ${res.status})` };
      }
      return { success: true, message: 'Anthropic Claude API Key validated successfully!' };
    }

    // OpenAI, Groq, OpenRouter, Custom
    let endpoint = 'https://api.openai.com/v1/chat/completions';
    if (settings.provider === 'groq') {
      endpoint = 'https://api.groq.com/openai/v1/chat/completions';
    } else if (settings.provider === 'openrouter') {
      endpoint = 'https://openrouter.ai/api/v1/chat/completions';
    } else if (settings.provider === 'custom' && settings.customEndpoint) {
      endpoint = settings.customEndpoint.replace(/\/$/, '') + '/chat/completions';
    }

    const key = settings.apiKey?.trim();
    if (!key && settings.provider !== 'custom') {
      return { success: false, message: `Please enter your ${settings.provider.toUpperCase()} API Key.` };
    }

    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (key) {
      headers['Authorization'] = `Bearer ${key}`;
    }
    if (settings.provider === 'openrouter') {
      headers['HTTP-Referer'] = 'https://customs-cvs.app';
      headers['X-Title'] = 'CV Studio Pro';
    }

    const res = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: settings.model || (settings.provider === 'groq' ? 'llama-3.3-70b-versatile' : 'gpt-4o'),
        messages: [{ role: 'user', content: 'Say OK' }],
        max_tokens: 5
      })
    });

    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      return { success: false, message: errJson.error?.message || `API error (HTTP ${res.status})` };
    }

    return { success: true, message: `${settings.provider.toUpperCase()} connection validated successfully!` };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    if (settings.provider === 'local') {
      return {
        success: false,
        message: `Cannot reach Local AI server (${msg}). Ensure Ollama/LM Studio is running and CORS is enabled: OLLAMA_ORIGINS="*" ollama serve`
      };
    }
    return { success: false, message: `Connection test failed: ${msg}` };
  }
}

/**
 * Main Tailor function delegating to Strategy pattern
 */
export async function tailorResume(req: TailorRequest): Promise<TailorResponse> {
  const prompts: PromptBundle = buildPrompts(req);
  const strategy = getAIStrategy(req.providerSettings.provider);

  const result = await strategy.execute(prompts, req.providerSettings);
  const extracted: ExtractedCvAndGap = extractCvAndGap(result.text, req.masterData, prompts.company);

  return {
    tailoredCvMarkdown: extracted.cvMarkdown,
    gapAnalysisMarkdown: extracted.gapMarkdown,
    estimatedMatchScore: extracted.score,
    extractedKeywords: extracted.keywords,
    rawResponse: result.text,
    modelUsed: result.modelUsed
  };
}
