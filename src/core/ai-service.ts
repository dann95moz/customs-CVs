import {
  AIModelOption,
  AIProviderSettings,
  TailorRequest,
  TailorResponse
} from '../types/cv';
import { buildPrompts, DEFAULT_RULES, PromptBundle } from './ai/prompt-builder';
import { extractCvAndGap, ExtractedCvAndGap } from './ai/extractor';
import { getAIStrategy } from './ai/strategies';

export type { AIModelOption, AIProviderSettings, TailorRequest, TailorResponse };
export { buildPrompts, DEFAULT_RULES, extractCvAndGap };

export const AVAILABLE_AI_MODELS: AIModelOption[] = [
  // Google Gemini (Recommended - Free API Key from Google AI Studio)
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
    id: 'gemini-3.5-flash',
    name: 'Google Gemini 3.5 Flash',
    provider: 'gemini',
    description: 'Fast and reliable generative inference for resume optimization.',
    isFree: false,
    requiresKey: true
  },

  // Groq (Ultra-Fast Free Tier)
  {
    id: 'llama-3.3-70b-versatile',
    name: 'Groq — Llama 3.3 70B (Fast & Free Key)',
    provider: 'groq',
    description: 'Sub-second response speeds using free Groq Console key.',
    isFree: false,
    requiresKey: true
  },
  {
    id: 'deepseek-r1-distill-llama-70b',
    name: 'Groq — DeepSeek R1 Distill 70B',
    provider: 'groq',
    description: 'High-speed distilled reasoning model hosted on Groq.',
    isFree: false,
    requiresKey: true
  },

  // OpenAI (BYOK)
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

  // Anthropic Claude (BYOK)
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

  // Public Free AI (No Key - Best Effort)
  {
    id: 'free-openai',
    name: 'Public Free AI — GPT-4o (Zero Configuration)',
    provider: 'free-pollinations',
    description: 'Shared public server inference (subject to rate limits & server load).',
    isFree: true,
    requiresKey: false
  },
  {
    id: 'free-deepseek',
    name: 'Public Free AI — DeepSeek R1 (Zero Configuration)',
    provider: 'free-pollinations',
    description: 'Public shared reasoning model (subject to rate limits & server load).',
    isFree: true,
    requiresKey: false
  },
  {
    id: 'free-gemini',
    name: 'Public Free AI — Gemini 3.6 (Zero Configuration)',
    provider: 'free-pollinations',
    description: 'Public shared Gemini inference (subject to rate limits & server load).',
    isFree: true,
    requiresKey: false
  },

  // OpenRouter (BYOK)
  {
    id: 'openrouter-free',
    name: 'OpenRouter Free Models',
    provider: 'openrouter',
    description: 'Connect to OpenRouter free models using your OpenRouter key.',
    isFree: false,
    requiresKey: true
  },

  // Custom Endpoint
  {
    id: 'custom-endpoint',
    name: 'Custom OpenAI-Compatible API',
    provider: 'custom',
    description: 'Localhost Ollama, LM Studio, vLLM, or private proxy.',
    isFree: false,
    requiresKey: false
  }
];

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
