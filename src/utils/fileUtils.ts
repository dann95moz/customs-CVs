/**
 * File utility functions (Single Responsibility: Browser File Downloads)
 */

/**
 * Triggers a browser download of text or markdown content as a file.
 */
export function downloadTextFile(
  content: string,
  fileName: string,
  mimeType: string = 'text/markdown;charset=utf-8;'
): void {
  if (!content) return;
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
