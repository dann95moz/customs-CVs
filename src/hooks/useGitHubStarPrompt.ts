import { useState, useCallback, useRef, useEffect } from 'react';
import { APP_LINKS } from '../constants/links';

export interface UseGitHubStarPromptReturn {
  isPromptOpen: boolean;
  triggerPrompt: (delayMs?: number) => void;
  dismissPrompt: () => void;
  openGitHubAndDismiss: () => void;
}

/**
 * Custom hook to orchestrate the one-time satisfaction GitHub star prompt.
 * 
 * Principles:
 * - Single Responsibility: Encapsulates dismissal state, timer management, and localStorage synchronization.
 * - Dependency Inversion: Provides clean actions for UI consumers without coupling to specific view trees.
 */
export const useGitHubStarPrompt = (): UseGitHubStarPromptReturn => {
  const [isPromptOpen, setIsPromptOpen] = useState<boolean>(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clean up any pending timer on component unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const hasBeenDismissed = useCallback((): boolean => {
    if (typeof window === 'undefined') return true;
    try {
      return localStorage.getItem(APP_LINKS.STORAGE_KEY_STAR_DISMISSED) === 'true';
    } catch {
      return false;
    }
  }, []);

  const dismissPrompt = useCallback(() => {
    setIsPromptOpen(false);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(APP_LINKS.STORAGE_KEY_STAR_DISMISSED, 'true');
      } catch (err) {
        console.warn('Failed to save star prompt dismissal to localStorage:', err);
      }
    }
  }, []);

  const triggerPrompt = useCallback((delayMs: number = 1200) => {
    if (hasBeenDismissed()) return;

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      // Re-verify in case another tab or action dismissed it
      if (!hasBeenDismissed()) {
        setIsPromptOpen(true);
      }
    }, delayMs);
  }, [hasBeenDismissed]);

  const openGitHubAndDismiss = useCallback(() => {
    dismissPrompt();
    if (typeof window !== 'undefined') {
      window.open(APP_LINKS.GITHUB_REPO, '_blank', 'noopener,noreferrer');
    }
  }, [dismissPrompt]);

  return {
    isPromptOpen,
    triggerPrompt,
    dismissPrompt,
    openGitHubAndDismiss,
  };
};
