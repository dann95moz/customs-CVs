import { useState, useCallback } from 'react';
import { FeedbackPayload, FeedbackStatus } from '../types/feedback';

const FORMSPREE_FORM_ID = import.meta.env.VITE_FORMSPREE_FEEDBACK_ID || 'xdeokqad';
const FORMSPREE_ENDPOINT = `https://formspree.io/f/${FORMSPREE_FORM_ID}`;

export interface UseFeedbackSubmitReturn {
  status: FeedbackStatus;
  errorMessage: string | null;
  submit: (payload: FeedbackPayload) => Promise<boolean>;
  reset: () => void;
}

/**
 * Custom hook to handle secure client-side submissions to Formspree.
 * 
 * Architectural & Security Principles:
 * - Single Responsibility: Encapsulates Formspree endpoint network communication and status transitions.
 * - Input Sanitization: Trims whitespace, enforces maximum message/email lengths, and validates honeypot.
 * - Privacy-Respecting: Never sends sensitive CV data or API keys.
 */
export const useFeedbackSubmit = (): UseFeedbackSubmitReturn => {
  const [status, setStatus] = useState<FeedbackStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const reset = useCallback(() => {
    setStatus('idle');
    setErrorMessage(null);
  }, []);

  const submit = useCallback(async (payload: FeedbackPayload): Promise<boolean> => {
    // 1. Input sanitization & Honeypot validation
    const trimmedMessage = (payload.message || '').trim().slice(0, 2000);
    const trimmedEmail = (payload.email || '').trim().slice(0, 150);
    const honeypot = (payload._gotcha || '').trim();

    if (!trimmedMessage) {
      setErrorMessage('Message cannot be empty.');
      setStatus('error');
      return false;
    }

    // If bot triggered honeypot, fake success without making network request
    if (honeypot.length > 0) {
      setStatus('sent');
      return true;
    }

    setStatus('sending');
    setErrorMessage(null);

    const cleanPayload: FeedbackPayload = {
      rating: payload.rating,
      message: trimmedMessage,
      ...(trimmedEmail ? { email: trimmedEmail } : {}),
      context: {
        appVersion: payload.context.appVersion || '2.0.0',
        locale: payload.context.locale || 'en',
        route: payload.context.route || 'studio',
      },
    };

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(cleanPayload),
      });

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please try again later.');
        }
        const errorData = await response.json().catch(() => null);
        const serverMsg = errorData?.error || errorData?.errors?.[0]?.message || 'Submission failed';
        throw new Error(serverMsg);
      }

      setStatus('sent');
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Network error occurred while submitting feedback';
      setErrorMessage(msg);
      setStatus('error');
      return false;
    }
  }, []);

  return {
    status,
    errorMessage,
    submit,
    reset,
  };
};
