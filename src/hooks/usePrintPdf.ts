import { useCallback } from 'react';

/**
 * Custom hook to safely orchestrate printing a CV to PDF.
 * Temporarily switches DOM attributes to light mode so the browser's PDF compositor prints pure white,
 * then restores the user's previous theme state after printing completes.
 * 
 * Principle: Single Responsibility & Dependency Inversion (SOLID).
 */
export const usePrintPdf = () => {
  const handleDownloadPdf = useCallback(() => {
    const root = document.documentElement;
    const previousTheme = root.getAttribute('data-theme');
    const previousScheme = root.style.colorScheme;

    // Temporarily switch DOM to light mode for crisp PDF composition
    root.setAttribute('data-theme', 'light');
    root.style.colorScheme = 'light';

    const restoreTheme = () => {
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

    // Trigger browser print dialog
    window.print();

    // Safety fallback restoration in case afterprint does not fire in some browsers
    setTimeout(restoreTheme, 1500);
  }, []);

  return { handleDownloadPdf };
};
