/**
 * CV Studio Pro - AI & Tailoring Types
 * 
 * Domain-specific type definitions for AI model configurations,
 * tailoring requests, responses, and provider options.
 */

export type AIProviderId = 
  | 'free-pollinations' 
  | 'gemini' 
  | 'openai' 
  | 'claude' 
  | 'groq' 
  | 'openrouter' 
  | 'custom';

export interface AIModelOption {
  id: string;
  name: string;
  provider: AIProviderId;
  description: string;
  isFree?: boolean;
  requiresKey?: boolean;
}

export interface AIProviderSettings {
  provider: AIProviderId;
  model: string;
  apiKey?: string;
  customEndpoint?: string;
  temperature?: number;
}

export interface TailorRequest {
  masterData: string;
  targetJob: string;
  rules?: string;
  companyName?: string;
  targetRole?: string;
  pageBudget: 1 | 2;
  providerSettings: AIProviderSettings;
}

export interface TailorResponse {
  tailoredCvMarkdown: string;
  gapAnalysisMarkdown?: string;
  estimatedMatchScore?: number;
  extractedKeywords?: string[];
  rawResponse?: string;
  modelUsed: string;
}
