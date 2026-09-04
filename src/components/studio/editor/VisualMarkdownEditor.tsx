import React, { useEffect, useRef, useCallback } from 'react';
import {
  Box,
  Button,
  IconButton,
  Tooltip,
  Divider,
  Typography,
  Chip,
  useTheme,
  alpha,
} from '@mui/material';
import FormatBoldRoundedIcon from '@mui/icons-material/FormatBoldRounded';
import FormatItalicRoundedIcon from '@mui/icons-material/FormatItalicRounded';
import FormatListBulletedRoundedIcon from '@mui/icons-material/FormatListBulletedRounded';
import HorizontalRuleRoundedIcon from '@mui/icons-material/HorizontalRuleRounded';
import FormatClearRoundedIcon from '@mui/icons-material/FormatClearRounded';
import UndoRoundedIcon from '@mui/icons-material/UndoRounded';
import RedoRoundedIcon from '@mui/icons-material/RedoRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import { useTranslation } from 'react-i18next';
import { safeMarkdown } from '../../../utils/sanitize';
import { htmlToMarkdown } from '../../../core/parser';

export interface VisualMarkdownEditorProps {
  markdown: string;
  onChange: (markdown: string) => void;
  onBlur?: () => void;
  onFlushRef?: React.MutableRefObject<(() => void) | null>;
  placeholder?: string;
  minHeight?: number | string;
}

export const VisualMarkdownEditor: React.FC<VisualMarkdownEditorProps> = ({
  markdown,
  onChange,
  onBlur,
  onFlushRef,
  placeholder,
}) => {
  const { t } = useTranslation(['profile', 'common']);
  const theme = useTheme();

  const visualRef = useRef<HTMLDivElement>(null);
  const isInternalChangeRef = useRef<boolean>(false);
  const isDirtyRef = useRef<boolean>(false);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync Markdown to Visual HTML on mount and whenever external markdown updates
  useEffect(() => {
    if (isInternalChangeRef.current) {
      isInternalChangeRef.current = false;
      return;
    }
    isDirtyRef.current = false;
    if (visualRef.current) {
      if (document.activeElement !== visualRef.current) {
        visualRef.current.innerHTML = safeMarkdown(markdown || '');
      }
    }
  }, [markdown]);

  // Flush pending changes immediately
  const flushChanges = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    if (isDirtyRef.current && visualRef.current) {
      isDirtyRef.current = false;
      const html = visualRef.current.innerHTML;
      const convertedMarkdown = htmlToMarkdown(html);
      onChange(convertedMarkdown);
    }
  }, [onChange]);

  // Connect onFlushRef for parent components
  useEffect(() => {
    if (onFlushRef) {
      onFlushRef.current = flushChanges;
    }
    return () => {
      if (onFlushRef) {
        onFlushRef.current = null;
      }
    };
  }, [flushChanges, onFlushRef]);

  // Clean up and flush on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
        if (isDirtyRef.current && visualRef.current) {
          isDirtyRef.current = false;
          const html = visualRef.current.innerHTML;
          const convertedMarkdown = htmlToMarkdown(html);
          onChange(convertedMarkdown);
        }
      }
    };
  }, [onChange]);

  // Handle rich-text inputs in contentEditable surface
  const handleVisualInput = useCallback(() => {
    if (!visualRef.current) return;
    isDirtyRef.current = true;
    const html = visualRef.current.innerHTML;
    const convertedMarkdown = htmlToMarkdown(html);

    isInternalChangeRef.current = true;

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      debounceTimerRef.current = null;
      isDirtyRef.current = false;
      onChange(convertedMarkdown);
    }, 200);
  }, [onChange]);

  // Smart Paste Handler: Automatically converts pasted Markdown syntax into rich formatted text
  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    const text = e.clipboardData.getData('text/plain');
    if (!text) return;

    // Detect Markdown syntax: headers (#), bold (**), bullet lists (- or *), dividers (---), blockquotes (>)
    const hasMarkdownSyntax = /(?:^|\n)(?:#{1,6}\s|\*{1,2}|- |\d+\. |---|\[.*\]\(.*\)|>)/m.test(text);

    if (hasMarkdownSyntax) {
      e.preventDefault();
      isDirtyRef.current = true;
      const parsedHtml = safeMarkdown(text);
      document.execCommand('insertHTML', false, parsedHtml);
      handleVisualInput();
    }
  };

  // Execute standard formatting commands
  const executeCommand = (command: string, value: string | undefined = undefined) => {
    if (visualRef.current) {
      visualRef.current.focus();
    }
    isDirtyRef.current = true;
    document.execCommand(command, false, value);
    handleVisualInput();
  };

  const handleVisualBlur = () => {
    if (isDirtyRef.current && visualRef.current) {
      isDirtyRef.current = false;
      const html = visualRef.current.innerHTML;
      const convertedMarkdown = htmlToMarkdown(html);
      if (convertedMarkdown.trim().length > 0 || (markdown || '').trim().length === 0) {
        onChange(convertedMarkdown);
      }
    }
    onBlur?.();
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        width: '100%',
        height: { xs: 480, sm: 540, md: 580 },
        minHeight: { xs: 400, md: 480 },
        bgcolor: 'background.paper',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Top Editor Toolbar */}
      <Box
        sx={{
          py: 0.75,
          px: { xs: 1, sm: 2 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 1,
          borderBottom: `1px solid ${theme.palette.divider}`,
          bgcolor: alpha(theme.palette.text.primary, 0.02),
          flexShrink: 0,
        }}
      >
        {/* Left: Rich Formatting Controls */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexWrap: 'wrap' }}>
          {/* History actions */}
          <Tooltip title={t('profile:visualEditor.undo', 'Undo (Ctrl+Z)')}>
            <IconButton size="small" onClick={() => executeCommand('undo')} sx={{ p: 0.5 }}>
              <UndoRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={t('profile:visualEditor.redo', 'Redo (Ctrl+Y)')}>
            <IconButton size="small" onClick={() => executeCommand('redo')} sx={{ p: 0.5 }}>
              <RedoRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Divider orientation="vertical" flexItem sx={{ mx: 0.5, my: 0.5 }} />

          {/* Inline styles */}
          <Tooltip title={t('profile:visualEditor.bold', 'Bold (Ctrl+B)')}>
            <IconButton size="small" onClick={() => executeCommand('bold')} sx={{ p: 0.5 }}>
              <FormatBoldRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={t('profile:visualEditor.italic', 'Italic (Ctrl+I)')}>
            <IconButton size="small" onClick={() => executeCommand('italic')} sx={{ p: 0.5 }}>
              <FormatItalicRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Divider orientation="vertical" flexItem sx={{ mx: 0.5, my: 0.5 }} />

          {/* Headings */}
          <Tooltip title={t('profile:visualEditor.h1', 'Title (H1)')}>
            <Button
              size="small"
              variant="text"
              color="inherit"
              onClick={() => executeCommand('formatBlock', '<h1>')}
              sx={{ minWidth: 32, px: 0.75, fontWeight: 800, fontSize: '0.8rem' }}
            >
              H1
            </Button>
          </Tooltip>
          <Tooltip title={t('profile:visualEditor.h2', 'Section (H2)')}>
            <Button
              size="small"
              variant="text"
              color="inherit"
              onClick={() => executeCommand('formatBlock', '<h2>')}
              sx={{ minWidth: 32, px: 0.75, fontWeight: 700, fontSize: '0.8rem' }}
            >
              H2
            </Button>
          </Tooltip>
          <Tooltip title={t('profile:visualEditor.h3', 'Role / Subtitle (H3)')}>
            <Button
              size="small"
              variant="text"
              color="inherit"
              onClick={() => executeCommand('formatBlock', '<h3>')}
              sx={{ minWidth: 32, px: 0.75, fontWeight: 600, fontSize: '0.78rem' }}
            >
              H3
            </Button>
          </Tooltip>

          <Divider orientation="vertical" flexItem sx={{ mx: 0.5, my: 0.5 }} />

          {/* Bullets & Dividers */}
          <Tooltip title={t('profile:visualEditor.bulletList', 'Bullet List')}>
            <IconButton size="small" onClick={() => executeCommand('insertUnorderedList')} sx={{ p: 0.5 }}>
              <FormatListBulletedRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={t('profile:visualEditor.divider', 'Divider Line (---)')}>
            <IconButton size="small" onClick={() => executeCommand('insertHorizontalRule')} sx={{ p: 0.5 }}>
              <HorizontalRuleRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Divider orientation="vertical" flexItem sx={{ mx: 0.5, my: 0.5 }} />

          {/* Clear Format */}
          <Tooltip title={t('profile:visualEditor.clear', 'Clear Formatting')}>
            <IconButton size="small" onClick={() => executeCommand('removeFormat')} sx={{ p: 0.5 }}>
              <FormatClearRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Right: Smart Auto-format Indicator */}
        <Chip
          icon={<AutoAwesomeRoundedIcon sx={{ fontSize: '13px !important' }} />}
          label={t('profile:visualEditor.autoFormatTip', 'Smart Paste: auto-formats Markdown')}
          size="small"
          variant="outlined"
          color="default"
          sx={{
            fontSize: '0.72rem',
            fontWeight: 600,
            display: { xs: 'none', sm: 'inline-flex' },
            borderColor: alpha(theme.palette.divider, 0.8),
            color: 'text.secondary',
          }}
        />
      </Box>

      {/* Editor Surface Area: Single Visual WYSIWYG Surface */}
      <Box sx={{ flex: 1, minHeight: 0, position: 'relative', display: 'flex', overflow: 'hidden', height: '100%' }}>
        <Box
          ref={visualRef}
          contentEditable
          suppressContentEditableWarning
          onInput={handleVisualInput}
          onPaste={handlePaste}
          onBlur={handleVisualBlur}
          data-placeholder={placeholder || t('profile:visualEditor.placeholder', 'Write your resume content here...')}
          sx={{
            flex: 1,
            width: '100%',
            height: '100%',
            minHeight: 0,
            p: { xs: 2, sm: 3 },
            outline: 'none',
            overflowY: 'auto',
            WebkitOverflowScrolling: 'touch',
            boxSizing: 'border-box',
            color: 'text.primary',
            fontFamily: theme.typography.fontFamily,
            fontSize: '0.95rem',
            lineHeight: 1.7,
            bgcolor: 'background.paper',
            '&:empty:before': {
              content: 'attr(data-placeholder)',
              color: 'text.disabled',
              pointerEvents: 'none',
            },
            '& h1': {
              fontSize: '1.6rem',
              fontWeight: 800,
              color: 'text.primary',
              mt: 1.5,
              mb: 1,
              letterSpacing: '-0.02em',
            },
            '& h2': {
              fontSize: '1.2rem',
              fontWeight: 700,
              color: 'primary.main',
              mt: 2,
              mb: 0.75,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              borderBottom: `1px solid ${alpha(theme.palette.divider, 0.6)}`,
              pb: 0.5,
            },
            '& h3': {
              fontSize: '1.05rem',
              fontWeight: 700,
              color: 'text.primary',
              mt: 1.5,
              mb: 0.5,
            },
            '& p': {
              my: 0.75,
            },
            '& ul': {
              pl: 3,
              my: 0.75,
            },
            '& li': {
              mb: 0.5,
              lineHeight: 1.6,
            },
            '& hr': {
              border: 'none',
              borderTop: `1px solid ${theme.palette.divider}`,
              my: 2,
            },
            '& strong': {
              fontWeight: 700,
              color: 'text.primary',
            },
            '& em': {
              fontStyle: 'italic',
              color: 'text.secondary',
            },
            '& a': {
              color: 'primary.main',
              textDecoration: 'underline',
            },
          }}
        />
      </Box>
    </Box>
  );
};
