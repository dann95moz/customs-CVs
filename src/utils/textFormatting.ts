/**
 * Bidirectional inline formatting utilities for CV text and live in-place editing.
 * Handles Markdown bold (**text**), italic (*text*), and keyword highlights (++text++).
 */

/**
 * Escapes HTML characters to prevent XSS while preparing text for inline rendering.
 */
export const escapeHtml = (text: string): string => {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

/**
 * Converts Markdown inline formatting into safe HTML for contentEditable and preview rendering.
 * Supports:
 * - Bold: **text** or __text__ -> <strong>text</strong>
 * - Highlights: ++text++ -> <strong class="cv-highlight-keyword">text</strong>
 * - Italic: *text* or _text_ -> <em>text</em>
 */
export const markdownToHtml = (markdown: string): string => {
  if (!markdown) return '';

  let html = escapeHtml(markdown);

  // 1. Keyword highlights: ++text++ -> <strong class="cv-highlight-keyword">text</strong>
  html = html.replace(/\+\+([^\+\r\n]+?)\+\+/g, '<strong class="cv-highlight-keyword">$1</strong>');

  // 2. Bold: **text** or __text__ -> <strong>text</strong>
  html = html.replace(/\*\*([^\*\r\n]+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/__([^_\r\n]+?)__/g, '<strong>$1</strong>');

  // 3. Italic: *text* or _text_ (excluding inside tags)
  html = html.replace(/(^|[^\*])\*([^\*\r\n]+?)\*([^\*]|$)/g, '$1<em>$2</em>$3');
  html = html.replace(/(^|[^_])_([^_\r\n]+?)_([^_]|$)/g, '$1<em>$2</em>$3');

  return html;
};

/**
 * Converts DOM / HTML content from contentEditable back to clean Markdown.
 * Supports:
 * - <strong>, <b>, bold styles -> **text**
 * - <em>, <i>, italic styles -> *text*
 * - <mark>, .cv-highlight-keyword -> ++text++ (or **text**)
 * - Line breaks <br>, <div>, <p> -> \n
 */
export const htmlToMarkdown = (html: string): string => {
  if (!html) return '';

  // Create a temporary DOM parser element
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;

  const processNode = (node: Node): string => {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent || '';
    }

    if (node.nodeType !== Node.ELEMENT_NODE) {
      return '';
    }

    const element = node as HTMLElement;
    if (element.classList.contains('no-print') || element.classList.contains('cv-ai-hover-actions')) {
      return '';
    }
    const tagName = element.tagName.toLowerCase();
    const style = element.style || ({} as CSSStyleDeclaration);

    // Recursively process child nodes
    let innerContent = '';
    element.childNodes.forEach((child) => {
      innerContent += processNode(child);
    });

    // Check for bold styling
    const isBold =
      tagName === 'strong' ||
      tagName === 'b' ||
      style.fontWeight === 'bold' ||
      parseInt(style.fontWeight, 10) >= 600;

    // Check for italic styling
    const isItalic =
      tagName === 'em' ||
      tagName === 'i' ||
      style.fontStyle === 'italic';

    // Check for keyword highlight
    const isHighlight =
      tagName === 'mark' ||
      element.classList.contains('cv-highlight-keyword') ||
      element.classList.contains('cv-keyword-highlight');

    if (isHighlight) {
      return innerContent.trim() ? `++${innerContent.trim()}++` : '';
    }

    if (isBold && isItalic) {
      return innerContent.trim() ? `***${innerContent.trim()}***` : '';
    }

    if (isBold) {
      return innerContent.trim() ? `**${innerContent.trim()}**` : '';
    }

    if (isItalic) {
      return innerContent.trim() ? `*${innerContent.trim()}*` : '';
    }

    if (tagName === 'br') {
      return '\n';
    }

    if (tagName === 'div' || tagName === 'p' || tagName === 'li') {
      return innerContent ? `\n${innerContent}` : '';
    }

    return innerContent;
  };

  let result = '';
  tempDiv.childNodes.forEach((child) => {
    result += processNode(child);
  });

  // Clean up excessive newlines and leading/trailing whitespace
  return result
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
};
