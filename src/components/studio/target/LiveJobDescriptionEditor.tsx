import React, { useMemo, useRef, useEffect, useCallback } from 'react';
import { Box, useTheme, alpha } from '@mui/material';
import { extractJobKeywords } from '../../../core/matching/quickMatcher';
import { RADIUS_TOKENS } from '../../../theme/dimensions';

export interface LiveJobDescriptionEditorProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  masterData: string;
  highlightsEnabled?: boolean;
  placeholder?: string;
}

const SHARED_TYPOGRAPHY = {
  fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
  fontSize: '0.88rem',
  lineHeight: 1.65,
  letterSpacing: 'normal',
  padding: '16px',
  boxSizing: 'border-box' as const,
  whiteSpace: 'pre-wrap' as const,
  wordBreak: 'break-word' as const,
};

export const LiveJobDescriptionEditor: React.FC<LiveJobDescriptionEditorProps> = ({
  value,
  onChange,
  onBlur,
  masterData,
  highlightsEnabled = true,
  placeholder,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  // Sync scrolling between textarea and backdrop
  const handleScroll = useCallback(() => {
    if (textareaRef.current && backdropRef.current) {
      backdropRef.current.scrollTop = textareaRef.current.scrollTop;
      backdropRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  }, []);

  // Compute keyword segments
  const { coveredSet, missingSet, regex } = useMemo(() => {
    if (!value || value.trim().length < 15 || !highlightsEnabled) {
      return {
        coveredSet: new Set<string>(),
        missingSet: new Set<string>(),
        regex: null,
      };
    }

    const kwList = extractJobKeywords(value);
    const lowerMaster = (masterData || '').toLowerCase();

    const covered = new Set<string>();
    const missing = new Set<string>();

    for (const kw of kwList) {
      const clean = kw.toLowerCase().trim();
      const escaped = clean.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
      const testRegex = new RegExp(`(?:^|[^a-zA-Z0-9#+])${escaped}(?:$|[^a-zA-Z0-9#+])`, 'i');
      if (testRegex.test(lowerMaster)) {
        covered.add(clean);
      } else {
        missing.add(clean);
      }
    }

    if (kwList.length === 0) {
      return { coveredSet: covered, missingSet: missing, regex: null };
    }

    const escapedPatterns = kwList
      .map((k) => k.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'))
      .sort((a, b) => b.length - a.length);

    const compiledRegex = new RegExp(`(\\b(?:${escapedPatterns.join('|')})\\b)`, 'gi');

    return {
      coveredSet: covered,
      missingSet: missing,
      regex: compiledRegex,
    };
  }, [value, masterData, highlightsEnabled]);

  // Ensure scroll sync whenever text changes or window resizes
  useEffect(() => {
    handleScroll();
  }, [value, handleScroll]);

  const successBg = alpha(theme.palette.success.main, isDark ? 0.32 : 0.18);
  const successBorder = theme.palette.success.main;
  const warningBg = alpha(theme.palette.warning.main, isDark ? 0.38 : 0.22);
  const warningBorder = theme.palette.warning.main;

  // Render backdrop content with marks
  const renderBackdropContent = () => {
    if (!highlightsEnabled || !regex || !value) {
      return null;
    }

    const parts = value.split(regex);
    const elements: React.ReactNode[] = [];

    parts.forEach((part, idx) => {
      const pLower = part.toLowerCase();
      const isCovered = coveredSet.has(pLower);
      const isMissing = missingSet.has(pLower);

      if (isCovered || isMissing) {
        elements.push(
          <mark
            key={idx}
            style={{
              backgroundColor: isCovered ? successBg : warningBg,
              color: 'transparent',
              borderBottom: `2px solid ${isCovered ? successBorder : warningBorder}`,
              borderRadius: RADIUS_TOKENS.xs,
              padding: '1px 0',
              margin: '0',
            }}
          >
            {part}
          </mark>
        );
      } else {
        elements.push(
          <span key={idx} style={{ color: 'transparent' }}>
            {part}
          </span>
        );
      }
    });

    // Handle trailing newline in pre-wrap so backdrop height matches textarea exactly
    if (value.endsWith('\n')) {
      elements.push(
        <span key="trailing-newline" style={{ color: 'transparent' }}>
          {'\n '}
        </span>
      );
    }

    return elements;
  };

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: '100%',
        minHeight: 280,
        flex: 1,
        display: 'flex',
        overflow: 'hidden',
      }}
    >
      {/* 1. Underlying Highlight Backdrop Layer (Synchronized Scroll) */}
      <Box
        ref={backdropRef}
        aria-hidden="true"
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none',
          overflowY: 'hidden',
          overflowX: 'hidden',
          margin: 0,
          border: 'none',
          ...SHARED_TYPOGRAPHY,
        }}
      >
        {renderBackdropContent()}
      </Box>

      {/* 2. Top-level Native Textarea (Interactive, Native Caret & Selection) */}
      <textarea
        ref={textareaRef}
        className="studio-textarea"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        onScroll={handleScroll}
        placeholder={placeholder}
        spellCheck={false}
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          minHeight: '280px',
          border: 'none',
          outline: 'none',
          resize: 'none',
          backgroundColor: 'transparent',
          color: theme.palette.text.primary,
          caretColor: theme.palette.primary.main,
          overflowY: 'auto',
          margin: 0,
          zIndex: 1,
          ...SHARED_TYPOGRAPHY,
        }}
      />
    </Box>
  );
};
