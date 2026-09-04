import React, { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  IconButton,
  Button,
  TextField,
  Tooltip,
  CircularProgress,
  Alert,
  useTheme,
  alpha,
} from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import RateReviewRoundedIcon from '@mui/icons-material/RateReviewRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import SentimentDissatisfiedRoundedIcon from '@mui/icons-material/SentimentDissatisfiedRounded';
import SentimentNeutralRoundedIcon from '@mui/icons-material/SentimentNeutralRounded';
import SentimentSatisfiedAltRoundedIcon from '@mui/icons-material/SentimentSatisfiedAltRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import { useTranslation } from 'react-i18next';
import { FeedbackModalProps, FeedbackRating } from '../../types/feedback';
import { useFeedbackSubmit } from '../../hooks/useFeedbackSubmit';
import { RADIUS_TOKENS } from '../../theme/dimensions';

const MAX_MESSAGE_LENGTH = 2000;

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  open,
  onClose,
  currentRoute = 'settings',
}) => {
  const { t, i18n } = useTranslation(['feedback', 'common']);
  const muiTheme = useTheme();

  const [rating, setRating] = useState<FeedbackRating | null>(null);
  const [message, setMessage] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [honeypot, setHoneypot] = useState<string>('');
  const [emailError, setEmailError] = useState<string | null>(null);

  const { status, errorMessage, submit, reset } = useFeedbackSubmit();

  // Reset form state when dialog opens
  useEffect(() => {
    if (open) {
      setRating(null);
      setMessage('');
      setEmail('');
      setHoneypot('');
      setEmailError(null);
      reset();
    }
  }, [open, reset]);

  // Auto-close dialog 2.5s after successful submission
  useEffect(() => {
    if (status === 'sent') {
      const timer = setTimeout(() => {
        onClose();
      }, 2600);
      return () => clearTimeout(timer);
    }
  }, [status, onClose]);

  const validateEmail = (val: string): boolean => {
    if (!val.trim()) return true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(val.trim());
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setEmail(val);
    if (val.trim() && !validateEmail(val)) {
      setEmailError('Invalid email format');
    } else {
      setEmailError(null);
    }
  };

  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const trimmedMsg = message.trim();
    if (!trimmedMsg) return;

    if (email.trim() && !validateEmail(email)) {
      setEmailError('Invalid email format');
      return;
    }

    await submit({
      rating,
      message: trimmedMsg,
      email: email.trim() || undefined,
      context: {
        appVersion: '1.0.0',
        locale: i18n.language || 'en',
        route: currentRoute,
      },
      _gotcha: honeypot,
    });
  }, [message, email, rating, i18n.language, currentRoute, honeypot, submit]);

  return (
    <Dialog
      open={open}
      onClose={status === 'sending' ? undefined : onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogContent sx={{ p: { xs: 2.5, sm: 3.5 }, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        {/* SUCCESS CONFIRMATION VIEW */}
        {status === 'sent' ? (
          <Box
            sx={{
              py: 4,
              px: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              gap: 2,
              animation: 'feedbackPopIn 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
              '@keyframes feedbackPopIn': {
                '0%': { transform: 'scale(0.92)', opacity: 0 },
                '100%': { transform: 'scale(1)', opacity: 1 },
              },
            }}
          >
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                bgcolor: alpha(muiTheme.palette.success.main, 0.14),
                color: 'success.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 0 24px ${alpha(muiTheme.palette.success.main, 0.3)}`,
              }}
            >
              <CheckCircleRoundedIcon sx={{ fontSize: 40 }} />
            </Box>

            <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary' }}>
              {t('feedback:successTitle', 'Thank you for your feedback!')}
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 420, lineHeight: 1.6 }}>
              {t(
                'feedback:successMessage',
                'We read every single comment to make CV Studio better for everyone.'
              )}
            </Typography>

            <Button
              variant="contained"
              color="primary"
              onClick={onClose}
              sx={{ mt: 2, px: 4 }}
            >
              {t('feedback:close', 'Close')}
            </Button>
          </Box>
        ) : (
          /* REGULAR FORM VIEW */
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            {/* Hidden honeypot for spam bots */}
            <input
              type="text"
              name="_gotcha"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
              style={{ display: 'none', position: 'absolute', opacity: 0, pointerEvents: 'none' }}
              aria-hidden="true"
            />

            {/* Header with Title & Close Button */}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: RADIUS_TOKENS.lg,
                    background: 'var(--gradient-badge)',
                    color: 'common.white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    boxShadow: 'var(--pill-shadow)',
                  }}
                >
                  <RateReviewRoundedIcon sx={{ fontSize: 24, color: 'common.white' }} />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2, color: 'text.primary' }}>
                    {t('feedback:title', 'Send Feedback')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.82rem', mt: 0.25 }}>
                    {t('feedback:subtitle', 'Help us improve CV Studio with your suggestions, ideas, or issue reports.')}
                  </Typography>
                </Box>
              </Box>

              <Tooltip title={t('feedback:close', 'Close')}>
                <IconButton
                  size="small"
                  onClick={onClose}
                  disabled={status === 'sending'}
                  aria-label={t('feedback:close', 'Close')}
                >
                  <CloseRoundedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>

            {/* Error Notification Banner */}
            {status === 'error' && (
              <Alert
                severity="error"
                action={
                  <Button
                    color="inherit"
                    size="small"
                    startIcon={<RefreshRoundedIcon />}
                    onClick={() => handleSubmit()}
                    sx={{ fontWeight: 700 }}
                  >
                    {t('feedback:retry', 'Try Again')}
                  </Button>
                }
                sx={{
                  borderRadius: RADIUS_TOKENS.lg,
                  fontSize: '0.85rem',
                  alignItems: 'center',
                }}
              >
                {errorMessage || t('feedback:errorMessage', 'An error occurred while sending your feedback. Please try again.')}
              </Alert>
            )}

            {/* Rating Selector */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.primary', fontSize: '0.85rem' }}>
                {t('feedback:ratingLabel', 'How is your experience with CV Studio?')}
              </Typography>

              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1.5 }}>
                {/* 1. Bad Rating */}
                <Button
                  type="button"
                  variant={rating === 'bad' ? 'contained' : 'outlined'}
                  color="error"
                  onClick={() => setRating(prev => (prev === 'bad' ? null : 'bad'))}
                  disabled={status === 'sending'}
                  startIcon={<SentimentDissatisfiedRoundedIcon sx={{ fontSize: 20 }} />}
                  sx={{
                    py: 1.25,
                    px: 1,
                    fontSize: { xs: '0.78rem', sm: '0.82rem' },
                    opacity: rating && rating !== 'bad' ? 0.55 : 1,
                    transition: 'all 0.2s ease',
                  }}
                >
                  {t('feedback:ratingBad', 'Needs work')}
                </Button>

                {/* 2. Neutral Rating */}
                <Button
                  type="button"
                  variant={rating === 'neutral' ? 'contained' : 'outlined'}
                  color="warning"
                  onClick={() => setRating(prev => (prev === 'neutral' ? null : 'neutral'))}
                  disabled={status === 'sending'}
                  startIcon={<SentimentNeutralRoundedIcon sx={{ fontSize: 20 }} />}
                  sx={{
                    py: 1.25,
                    px: 1,
                    fontSize: { xs: '0.78rem', sm: '0.82rem' },
                    opacity: rating && rating !== 'neutral' ? 0.55 : 1,
                    transition: 'all 0.2s ease',
                  }}
                >
                  {t('feedback:ratingNeutral', 'Okay')}
                </Button>

                {/* 3. Good Rating */}
                <Button
                  type="button"
                  variant={rating === 'good' ? 'contained' : 'outlined'}
                  color="success"
                  onClick={() => setRating(prev => (prev === 'good' ? null : 'good'))}
                  disabled={status === 'sending'}
                  startIcon={<SentimentSatisfiedAltRoundedIcon sx={{ fontSize: 20 }} />}
                  sx={{
                    py: 1.25,
                    px: 1,
                    fontSize: { xs: '0.78rem', sm: '0.82rem' },
                    opacity: rating && rating !== 'good' ? 0.55 : 1,
                    transition: 'all 0.2s ease',
                  }}
                >
                  {t('feedback:ratingGood', 'Great')}
                </Button>
              </Box>
            </Box>

            {/* Feedback Message Input (Required) */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.primary', fontSize: '0.85rem' }}>
                  {t('feedback:messageLabel', 'Your feedback')} <Box component="span" sx={{ color: 'error.main' }}>*</Box>
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                  {message.length} / {MAX_MESSAGE_LENGTH}
                </Typography>
              </Box>

              <TextField
                multiline
                minRows={4}
                maxRows={7}
                placeholder={t(
                  'feedback:messagePlaceholder',
                  'What could we improve or what new feature would you like to see?'
                )}
                value={message}
                onChange={(e) => {
                  if (e.target.value.length <= MAX_MESSAGE_LENGTH) {
                    setMessage(e.target.value);
                  }
                }}
                disabled={status === 'sending'}
                fullWidth
              />
            </Box>

            {/* Email Input (Optional) */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.secondary', fontSize: '0.82rem' }}>
                {t('feedback:emailLabel', 'Your email (optional, if you would like a reply)')}
              </Typography>

              <TextField
                type="email"
                size="small"
                placeholder={t('feedback:emailPlaceholder', 'name@example.com')}
                value={email}
                onChange={handleEmailChange}
                error={Boolean(emailError)}
                helperText={emailError}
                disabled={status === 'sending'}
                fullWidth
              />
            </Box>

            {/* Footer Action Buttons */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1.5, pt: 1 }}>
              <Button
                type="button"
                variant="text"
                onClick={onClose}
                disabled={status === 'sending'}
                sx={{ color: 'text.secondary' }}
              >
                {t('feedback:cancel', 'Cancel')}
              </Button>

              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={!message.trim() || status === 'sending' || Boolean(emailError)}
                startIcon={
                  status === 'sending' ? (
                    <CircularProgress size={16} color="inherit" />
                  ) : (
                    <SendRoundedIcon sx={{ fontSize: 18 }} />
                  )
                }
                sx={{ px: 3, py: 1 }}
              >
                {status === 'sending'
                  ? t('feedback:sending', 'Sending feedback...')
                  : t('feedback:send', 'Send Feedback')}
              </Button>
            </Box>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};
