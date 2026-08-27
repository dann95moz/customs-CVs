import { useCallback } from 'react';

/**
 * Custom hook to safely orchestrate printing a CV to PDF in the browser.
 * 
 * Capabilities:
 * 1. Dynamically sets document.title to target filename so the browser's "Save as PDF"
 *    dialog automatically suggests the right filename (e.g. CV_Daniel_Corredor_Addi.pdf).
 * 2. Temporarily switches DOM attributes to light mode so the browser's PDF compositor
 *    prints pure white even if dark mode is active in the studio.
 * 3. Restores previous title and theme state safely after printing completes.
 * 
 * Principle: Single Responsibility & Dependency Inversion (SOLID).
 */
export const usePrintPdf = () => {
  const handleDownloadPdf = useCallback((fileName?: string) => {
    const root = document.documentElement;
    const previousTheme = root.getAttribute('data-theme');
    const previousScheme = root.style.colorScheme;
    const previousTitle = document.title;

    // Temporarily switch DOM to light mode for crisp PDF composition
    root.setAttribute('data-theme', 'light');
    root.style.colorScheme = 'light';

    if (fileName && fileName.trim().length > 0) {
      const sanitized = fileName.replace(/\.pdf$/i, '').trim();
      document.title = sanitized;
    }

    const restoreTheme = () => {
      document.title = previousTitle;
      if (previousTheme) {
        root.setAttribute('data-theme', previousTheme);
      }
      if (previousScheme) {
        root.style.colorScheme = previousScheme;
      } else {
        root.style.removeProperty('color-scheme');
      }
      window.removeEventListener('afterprint', restoreTheme);
    };

    window.addEventListener('afterprint', restoreTheme, { once: true });

    // Trigger browser print dialog (A4 vector output)
    window.print();

    // Safety fallback restoration in case afterprint does not fire in some browsers
    setTimeout(restoreTheme, 2500);
  }, []);

  return { handleDownloadPdf };
};
