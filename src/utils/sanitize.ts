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
 * Backwards compatibility re-export for extractGapInfo.
 * SSOT location is src/core/parser/metadataExtractor.ts.
 */
export { extractGapInfo } from '../core/parser';

