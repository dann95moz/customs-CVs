import TurndownService from 'turndown';

/**
 * Singleton Turndown instance configured for ATS-compliant, standard Markdown output.
 * Guarantees that visual edits produce consistent, clean ATX Markdown.
 */
const turndownService = new TurndownService({
  headingStyle: 'atx',
  bulletListMarker: '-',
  codeBlockStyle: 'fenced',
  emDelimiter: '*',
  strongDelimiter: '**',
  hr: '---',
});

// Remove unnecessary elements or inline spans with empty text
turndownService.addRule('cleanSpans', {
  filter: ['span'],
  replacement: (content) => content,
});

// Ensure clean linebreaks inside paragraphs
turndownService.addRule('paragraphSpacing', {
  filter: 'p',
  replacement: (content) => {
    const trimmed = content.trim();
    if (!trimmed) return '\n\n';
    return `\n\n${trimmed}\n\n`;
  },
});

/**
 * Converts sanitized HTML from the visual WYSIWYG editor into clean Markdown.
 * Preserves Google XYZ bullets, ATX headers, dividers, and emphasis.
 */
export function htmlToMarkdown(html: string): string {
  if (!html || !html.trim()) return '';

  try {
    const markdown = turndownService.turndown(html);
    // Normalize multiple consecutive blank lines to standard double newline
    return markdown.replace(/\n{3,}/g, '\n\n').trim();
  } catch (err) {
    console.error('Failed to convert HTML to Markdown:', err);
    return html;
  }
}
