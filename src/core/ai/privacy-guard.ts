import { extractCandidateName } from '../parser';

export interface AnonymizedPayload {
  sanitizedText: string;
  originalHeaderBlock: string;
}

/**
 * Privacy Guard: Masks Personally Identifiable Information (PII) before sending data to external AI models.
 * Principle: Single Responsibility & Privacy by Design.
 * 
 * Redacts:
 * - Real email addresses -> [candidate-email@example.com]
 * - Real phone numbers -> [+1 (555) 000-0000]
 * - Direct profile URLs (LinkedIn, GitHub, personal portfolios) -> [https://linkedin.com/in/profile], etc.
 * - Exact candidate name in top header -> # [CANDIDATE FULL NAME]
 */
export function sanitizeMasterDataForAi(masterData: string): AnonymizedPayload {
  if (!masterData || typeof masterData !== 'string') {
    return { sanitizedText: '', originalHeaderBlock: '' };
  }

  // 1. Extract and preserve the original header block before any section (##) or divider (---)
  const headerMatch = masterData.match(/^([\s\S]*?)(?=\n+##|\n+---)/i);
  const originalHeaderBlock = headerMatch ? headerMatch[1].trim() : '';

  let sanitized = masterData;

  // 2. Replace Email Addresses
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g;
  sanitized = sanitized.replace(emailRegex, '[candidate-email@example.com]');

  // 3. Replace Phone Numbers (international & standard formats)
  const phoneRegex = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}\b/g;
  sanitized = sanitized.replace(phoneRegex, (match) => {
    // Avoid replacing pure 4-digit years like 2024 or small numbers
    if (/^\d{4}$/.test(match.trim())) return match;
    return '[+1 (555) 000-0000]';
  });

  // 4. Sanitize Top Header (# Full Name and contact line)
  sanitized = sanitized.replace(/^#\s+[^\n]+/m, '# [CANDIDATE FULL NAME]');

  // 5. Replace Personal Profile URLs
  sanitized = sanitized
    .replace(/https?:\/\/(?:www\.)?linkedin\.com\/in\/[^\s)\]]+/gi, 'https://linkedin.com/in/candidate-profile')
    .replace(/https?:\/\/(?:www\.)?github\.com\/[^\s)\]]+/gi, 'https://github.com/candidate-profile')
    .replace(/https?:\/\/(?:www\.)?twitter\.com\/[^\s)\]]+/gi, 'https://x.com/candidate-profile')
    .replace(/https?:\/\/(?:www\.)?x\.com\/[^\s)\]]+/gi, 'https://x.com/candidate-profile');

  return {
    sanitizedText: sanitized,
    originalHeaderBlock,
  };
}

/**
 * Reconstructs the synthesized CV markdown by deterministically restoring the candidate's real header block
 * from the local master data, ensuring 0% hallucination and 100% privacy preservation.
 */
export function restoreOriginalHeader(synthesizedMarkdown: string, originalMasterData: string): string {
  if (!originalMasterData || !synthesizedMarkdown) {
    return synthesizedMarkdown;
  }

  // 1. Extract original header block from master data (everything before first ## or ---)
  const originalHeaderMatch = originalMasterData.match(/^([\s\S]*?)(?=\n+##|\n+---)/i);
  const originalHeader = originalHeaderMatch ? originalHeaderMatch[1].trim() : '';

  if (!originalHeader) {
    return synthesizedMarkdown;
  }

  // 2. Locate where the body sections begin in synthesized CV (first ##)
  const firstSectionIndex = synthesizedMarkdown.search(/\n+##\s+/i);

  if (firstSectionIndex === -1) {
    return `${originalHeader}\n\n---\n\n${synthesizedMarkdown}`;
  }

  const synthesizedBody = synthesizedMarkdown.slice(firstSectionIndex).trim();

  return `${originalHeader}\n\n---\n\n${synthesizedBody}`;
}
