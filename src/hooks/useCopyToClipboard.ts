import { useState, useCallback, useRef, useEffect } from 'react';

export interface UseCopyToClipboardReturn {
  copied: boolean;
  copy: (text: string) => Promise<boolean>;
  reset: () => void;
}

/**
 * Custom hook for copying text to the clipboard with temporary feedback state (DRY & KISS).
 * 
 * @param timeout Duration in ms to keep the `copied` state as true (default: 2000ms).
 */
export function useCopyToClipboard(timeout: number = 2000): UseCopyToClipboardReturn {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const copy = useCallback(
    async (text: string): Promise<boolean> => {
      if (!text) return false;

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      try {
        if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          timerRef.current = setTimeout(() => {
            setCopied(false);
          }, timeout);
          return true;
        }
        return false;
      } catch (err) {
        console.warn('Failed to copy to clipboard:', err);
        setCopied(false);
        return false;
      }
    },
    [timeout]
  );

  const reset = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setCopied(false);
  }, []);

  return { copied, copy, reset };
}
