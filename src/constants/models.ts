import { AIModelOption } from '../types/ai';

export const AVAILABLE_AI_MODELS: AIModelOption[] = [
  // 1. Local AI Models (Ollama, LM Studio, LocalAI, vLLM - 100% Free & Offline)
  {
    id: 'llama3.2',
    name: 'Local AI — Llama 3.2 (Ollama / LM Studio)',
    provider: 'local',
    description: 'Runs completely locally on your hardware. Fast, 100% private, and zero API costs.',
    isFree: true,
    requiresKey: false,
  },
  {
    id: 'deepseek-r1:8b',
    name: 'Local AI — DeepSeek R1 Distill (8B / 14B)',
    provider: 'local',
    description: 'Local reasoning model for rigorous ATS keyword extraction and metric validation.',
    isFree: true,
    requiresKey: false,
  },
  {
    id: 'mistral',
    name: 'Local AI — Mistral (7B / Nemo)',
    provider: 'local',
    description: 'High-quality local executive writing and concise achievement framing.',
    isFree: true,
    requiresKey: false,
  },
  {
    id: 'qwen2.5:7b',
    name: 'Local AI — Qwen 2.5 (7B / 14B)',
    provider: 'local',
    description: 'Exceptional instruction-following and structured Markdown generation.',
    isFree: true,
    requiresKey: false,
  },
  {
    id: 'phi4',
    name: 'Local AI — Microsoft Phi-4 (14B)',
    provider: 'local',
    description: 'State-of-the-art small language model with high logical reasoning accuracy.',
    isFree: true,
    requiresKey: false,
  },
  {
    id: 'custom-local-model',
    name: 'Local AI — Custom Model Name',
    provider: 'local',
    description: 'Connect to any custom model loaded in your Ollama or LM Studio instance.',
    isFree: true,
    requiresKey: false,
  },

  // 2. Google Gemini (Cloud - Free API Key from Google AI Studio)
  {
    id: 'gemini-3.7-flash',
    name: 'Google Gemini 3.7 Flash (Recommended — Free API Key)',
    provider: 'gemini',
    description: 'Zero hallucinations. Ultra-fast synthesis with free Google AI Studio key.',
    isFree: false,
    requiresKey: true,
  },
  {
    id: 'gemini-3.8-flash',
    name: 'Google Gemini 3.8 Flash',
    provider: 'gemini',
    description: 'Fast, high-fidelity generative inference for ATS resume optimization.',
    isFree: false,
    requiresKey: true,
  },
  {
    id: 'gemini-3.6-flash',
    name: 'Google Gemini 3.6 Flash',
    provider: 'gemini',
    description: 'Next-gen high speed generative reasoning model.',
    isFree: false,
    requiresKey: true,
  },

  // 3. Groq (Ultra-Fast Free Tier)
  {
    id: 'llama-3.3-70b-versatile',
    name: 'Groq — Llama 3.3 70B (Fast & Free Key)',
    provider: 'groq',
    description: 'Sub-second response speeds using free Groq Console key (console.groq.com).',
    isFree: false,
    requiresKey: true,
  },
  {
    id: 'deepseek-r1-distill-llama-70b',
    name: 'Groq — DeepSeek R1 Distill 70B',
    provider: 'groq',
    description: 'High-speed distilled reasoning model hosted on Groq LPU hardware.',
    isFree: false,
    requiresKey: true,
  },

  // 4. OpenAI (BYOK)
  {
    id: 'gpt-4o',
    name: 'OpenAI GPT-4o',
    provider: 'openai',
    description: 'Flagship omni-model with top-tier executive writing quality.',
    isFree: false,
    requiresKey: true,
  },
  {
    id: 'gpt-4o-mini',
    name: 'OpenAI GPT-4o Mini',
    provider: 'openai',
    description: 'Affordable, fast, and highly accurate for resume formatting.',
    isFree: false,
    requiresKey: true,
  },
  {
    id: 'o3-mini',
    name: 'OpenAI o3-mini (Reasoning)',
    provider: 'openai',
    description: 'Advanced reasoning model for meticulous ATS keyword matching.',
    isFree: false,
    requiresKey: true,
  },

  // 5. Anthropic Claude (BYOK)
  {
    id: 'claude-3-7-sonnet-latest',
    name: 'Anthropic Claude 3.7 Sonnet',
    provider: 'claude',
    description: 'State-of-the-art hybrid reasoning for polished resume prose.',
    isFree: false,
    requiresKey: true,
  },
  {
    id: 'claude-3-5-sonnet-latest',
    name: 'Anthropic Claude 3.5 Sonnet',
    provider: 'claude',
    description: 'Gold-standard coding and technical narrative generator.',
    isFree: false,
    requiresKey: true,
  },

  // 6. OpenRouter (BYOK)
  {
    id: 'openrouter-free',
    name: 'OpenRouter (Multi-Model Gateway)',
    provider: 'openrouter',
    description: 'Connect to 100+ models using your OpenRouter unified key.',
    isFree: false,
    requiresKey: true,
  },

  // 7. Custom Remote Endpoint
  {
    id: 'custom-endpoint',
    name: 'Custom OpenAI-Compatible Endpoint',
    provider: 'custom',
    description: 'Private proxy, vLLM instance, or self-hosted API gateway.',
    isFree: false,
    requiresKey: false,
  },
];
