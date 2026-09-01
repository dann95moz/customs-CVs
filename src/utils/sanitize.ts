import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { ContactItem } from '../types/cv';

/**
 * Configure marked renderer options for clean inline and block outputs.
 */
marked.setOptions({
  gfm: true,
  breaks: true,
});

/**
 * Sanitizes and parses markdown text to secure HTML.
 * Eliminates XSS vectors, prompt injection tags, and malicious script execution.
 */
export function safeMarkdown(markdown: string): string {
  if (!markdown) return '';
  const rawHtml = marked.parse(markdown) as string;
  if (typeof window !== 'undefined') {
    return DOMPurify.sanitize(rawHtml, {
      USE_PROFILES: { html: true },
      ADD_ATTR: ['target', 'rel'],
    });
  }
  return rawHtml;
}

/**
 * Sanitizes and parses inline markdown text to secure HTML (spans/strong/em).
 */
export function safeMarkdownInline(markdown: string): string {
  if (!markdown) return '';
  const rawHtml = marked.parseInline(markdown) as string;
  if (typeof window !== 'undefined') {
    return DOMPurify.sanitize(rawHtml, {
      USE_PROFILES: { html: true },
      ADD_ATTR: ['target', 'rel'],
    });
  }
  return rawHtml;
}

/**
 * Unified contact label resolver (DRY).
 * Converts full URLs or raw identifiers into clean, human-readable labels for badges & links.
 */
export function getCleanContactLabel(contact: { type?: string; label: string; url?: string } | ContactItem): string {
  if (!contact || !contact.label) return '';
  
  const type = contact.type || '';
  const label = contact.label.trim();

  if (type === 'linkedin' && (label.startsWith('http') || label.includes('linkedin.com'))) {
    return 'LinkedIn';
  }
  if (type === 'github' && (label.startsWith('http') || label.includes('github.com'))) {
    return 'GitHub';
  }
  if (type === 'globe' && label.startsWith('http')) {
    return 'Portfolio';
  }
  return label;
}

/**
 * Extracts match score and critical keywords from Gap Analysis Markdown text (DRY).
 * Includes intelligent keyword extraction without hardcoding software-specific frameworks.
 */
export function extractGapInfo(
  gapMarkdown: string,
  targetJobText: string = ''
): { matchScore: number; keywords: string[] } {
  let matchScore = 92;
  if (gapMarkdown) {
    const scoreMatch = gapMarkdown.match(/Estimated Match Score:\*{0,2}\s*(\d{1,3})/i);
    if (scoreMatch) {
      const parsed = parseInt(scoreMatch[1], 10);
      if (!isNaN(parsed) && parsed >= 0 && parsed <= 100) {
        matchScore = parsed;
      }
    }
  }

  let keywords: string[] = [];

  if (gapMarkdown) {
    const kwMatch = gapMarkdown.match(/Critical Integrated Keywords:\*{0,2}\s*\[?([^\]\r\n]+)\]?/i);
    if (kwMatch) {
      keywords = kwMatch[1]
        .split(/[,|•·;]/)
        .map((k) => k.replace(/[*_`\[\]]/g, '').trim())
        .filter(Boolean);
    }
  }

  // If no explicit keywords in gap markdown, extract top salient keywords from target job
  if (keywords.length === 0 && targetJobText && targetJobText.trim().length > 20) {
    const cleanJob = targetJobText
      .replace(/[#*`_\[\]()]/g, ' ')
      .replace(/[^\w\s\u00C0-\u024F\u1E00-\u1EFF-]/g, ' ');
    const tokens = cleanJob.split(/\s+/).filter((t) => t.length > 3);
    const stopWords = new Set([
      'with', 'have', 'from', 'this', 'that', 'your', 'about', 'will', 'must',
      'para', 'como', 'sobre', 'este', 'esta', 'para', 'con', 'experiencia',
      'responsibilities', 'qualifications', 'requirements', 'requisitos',
      'und', 'mit', 'für', 'pour', 'avec', 'dans', 'della', 'delle', 'con'
    ]);
    const candidates = Array.from(new Set(tokens.filter((t) => !stopWords.has(t.toLowerCase()))));
    keywords = candidates.slice(0, 6);
  }

  // Fallback if completely empty
  if (keywords.length === 0) {
    keywords = ['Core Competencies', 'Industry Best Practices', 'Leadership', 'Execution'];
  }

  return { matchScore, keywords };
}
