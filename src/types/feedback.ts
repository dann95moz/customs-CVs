/**
 * Domain types for in-app user feedback submission via Formspree.
 */

export type FeedbackRating = 'good' | 'neutral' | 'bad';

export interface FeedbackContext {
  appVersion: string;
  locale: string;
  route: string;
}

export interface FeedbackPayload {
  rating: FeedbackRating | null;
  message: string;
  email?: string;
  context: FeedbackContext;
  _gotcha?: string;
}

export type FeedbackStatus = 'idle' | 'sending' | 'sent' | 'error';

export interface FeedbackModalProps {
  open: boolean;
  onClose: () => void;
  currentRoute?: string;
}
