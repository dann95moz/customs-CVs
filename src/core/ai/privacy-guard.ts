import { parseCvMarkdownToData } from '../parser/markdownParser';
import { extractCandidateName, extractTargetRole } from '../parser/metadataExtractor';

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

  // 5. Replace Personal Profile URLs ONLY in the top header (before the first ## section)
  // Preserving public project repositories (e.g. github.com/user/repo) and demo URLs in body
  if (headerMatch && headerMatch[1]) {
    const rawHeader = headerMatch[1];
    const sanitizedHeader = rawHeader
      .replace(/https?:\/\/(?:www\.)?linkedin\.com\/in\/[^\s)\]]+/gi, 'https://linkedin.com/in/candidate-profile')
      .replace(/https?:\/\/(?:www\.)?github\.com\/[^\s)\]]+/gi, 'https://github.com/candidate-profile')
      .replace(/https?:\/\/(?:www\.)?twitter\.com\/[^\s)\]]+/gi, 'https://x.com/candidate-profile')
      .replace(/https?:\/\/(?:www\.)?x\.com\/[^\s)\]]+/gi, 'https://x.com/candidate-profile');

    sanitized = sanitizedHeader + sanitized.slice(rawHeader.length);
  }

  return {
    sanitizedText: sanitized,
    originalHeaderBlock,
  };
}

/**
 * Reconstructs the synthesized CV markdown by deterministically restoring the candidate's real header block
 * (Name, Target Role, and real contact links) from master data or target parameters,
 * ensuring 0% hallucination and 100% privacy preservation.
 */
export function restoreOriginalHeader(
  synthesizedMarkdown: string,
  originalMasterData: string = '',
  targetRoleOverride?: string
): string {
  if (!synthesizedMarkdown) {
    return synthesizedMarkdown;
  }

  // 1. Parse structured data from master data and synthesized markdown
  const masterParsed = originalMasterData ? parseCvMarkdownToData(originalMasterData) : null;
  const synthParsed = parseCvMarkdownToData(synthesizedMarkdown);

  // 2. Resolve Candidate Name
  let candidateName = masterParsed?.name?.trim() || '';
  if (!candidateName || candidateName.toLowerCase() === 'candidate' || candidateName.toLowerCase().includes('dossier')) {
    // If masterData didn't have a clean name, check synthesized markdown or extractCandidateName
    const extractedFromMaster = originalMasterData ? extractCandidateName(originalMasterData, '').replace(/_/g, ' ') : '';
    if (extractedFromMaster && extractedFromMaster.toLowerCase() !== 'candidate') {
      candidateName = extractedFromMaster;
    } else if (synthParsed.name && synthParsed.name.toLowerCase() !== 'candidate' && !synthParsed.name.includes('[CANDIDATE')) {
      candidateName = synthParsed.name;
    } else {
      candidateName = 'Candidate';
    }
  }

  // 3. Resolve Target Role Title (trust AI synthesis or target override, fallback to master data)
  let roleTitle = targetRoleOverride?.trim() || '';
  if (!roleTitle || roleTitle.includes('[')) {
    if (
      synthParsed.title &&
      synthParsed.title.toLowerCase() !== 'professional specialist' &&
      !synthParsed.title.includes('[') &&
      !synthParsed.title.toLowerCase().includes('dossier') &&
      !synthParsed.title.toLowerCase().includes('instructions')
    ) {
      roleTitle = synthParsed.title;
    } else if (
      masterParsed?.title &&
      masterParsed.title.toLowerCase() !== 'professional specialist' &&
      !masterParsed.title.includes('[') &&
      !masterParsed.title.toLowerCase().includes('dossier') &&
      !masterParsed.title.toLowerCase().includes('instructions')
    ) {
      roleTitle = masterParsed.title;
    } else {
      roleTitle = extractTargetRole('', originalMasterData, 'Professional Specialist');
    }
  }

  // 4. Resolve Contacts (strictly use verifiable contacts from master data)
  const masterContacts = masterParsed?.contacts || [];
  const synthContacts = synthParsed.contacts || [];
  const contacts = masterContacts.length > 0 ? masterContacts : synthContacts;

  const basicContacts: string[] = [];
  const linkContacts: string[] = [];

  for (const c of contacts) {
    if (c.type === 'location' || c.type === 'email' || c.type === 'phone') {
      if (
        c.label &&
        !c.label.includes('[candidate-email') &&
        !c.label.includes('[+1 (555)') &&
        !c.label.includes('[Email') &&
        !c.label.includes('[Phone')
      ) {
        const cleanLabel = c.label.replace(/\\/g, '').trim();
        if (cleanLabel) {
          basicContacts.push(cleanLabel);
        }
      }
    } else if (
      c.url &&
      !c.url.includes('candidate-profile') &&
      !c.url.includes('example.com') &&
      !c.url.includes('...') &&
      !c.url.includes('[')
    ) {
      let displayLabel = (c.label || '').replace(/\\/g, '').trim();
      if (c.type === 'linkedin') displayLabel = 'LinkedIn';
      else if (c.type === 'github') displayLabel = 'GitHub';
      else if (c.type === 'globe') displayLabel = 'Portfolio';
      linkContacts.push(`[${displayLabel}](${c.url})`);
    }
  }

  // Build clean reconstructed header lines
  const headerLines: string[] = [];
  headerLines.push(`# ${candidateName.toUpperCase()}`);
  headerLines.push(`**${roleTitle}**  `);

  if (basicContacts.length > 0) {
    headerLines.push(basicContacts.join(' • '));
  }
  if (linkContacts.length > 0) {
    headerLines.push(linkContacts.join(' • '));
  }

  const cleanHeader = headerLines.join('\n');

  // 5. Extract synthesized body (first ## section onwards)
  const firstSectionIndex = synthesizedMarkdown.search(/\n+##\s+/i);
  if (firstSectionIndex === -1) {
    return `${cleanHeader}\n\n---\n\n${synthesizedMarkdown}`;
  }

  let synthesizedBody = synthesizedMarkdown.slice(firstSectionIndex).trim();
  // Strip any dummy privacy guard URLs if they leaked into body
  synthesizedBody = synthesizedBody
    .replace(/https?:\/\/github\.com\/candidate-profile/gi, '')
    .replace(/https?:\/\/linkedin\.com\/in\/candidate-profile/gi, '')
    .replace(/\[candidate-email@example\.com\]/gi, '');

  return `${cleanHeader}\n\n---\n\n${synthesizedBody}`;
}
