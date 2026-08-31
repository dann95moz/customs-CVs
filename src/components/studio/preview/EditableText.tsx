import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Tooltip, Box, Button, IconButton, Typography, alpha, useTheme } from '@mui/material';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import UndoRoundedIcon from '@mui/icons-material/UndoRounded';
import { useCvLiveEdit } from './CvLiveEditContext';
import { markdownToHtml, htmlToMarkdown } from '../../../utils/textFormatting';
import { CvSelectionBubble } from './CvSelectionBubble';
import { AiRegeneratePopover } from './AiRegeneratePopover';

export interface AiRegenerateConfig {
  type: 'bullet' | 'summary';
  fieldKey: string;
  sectionType?: 'experience' | 'projects';
  itemIndex?: number;
  bulletIndex?: number;
  company?: string;
  role?: string;
}

export interface EditableTextProps {
  value: string;
  onSave: (newValue: string) => void;
  tagName?: 'span' | 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'li' | 'a';
  className?: string;
  style?: React.CSSProperties;
  placeholder?: string;
  multiline?: boolean;
  htmlContent?: string;
  children?: React.ReactNode;
  aiConfig?: AiRegenerateConfig;
}

/**
 * Clean inline text editor for hot document editing with markdown support.
 * For bullet items and summary: implements a 2-column layout so AI hover actions live in a dedicated
 * right-aligned column that never overlaps, wraps, or clips multi-line text.
 * Completely eliminates nested <li> tags to prevent double bullet points (• •).
 */
export const EditableText: React.FC<EditableTextProps> = ({
  value,
  onSave,
  tagName = 'span',
  className = '',
  style,
  placeholder,
  multiline = false,
  htmlContent,
  children,
  aiConfig,
}) => {
  const { t } = useTranslation(['preview', 'common']);
  const liveEdit = useCvLiveEdit();
  const theme = useTheme();
  const isEditingEnabled = Boolean(liveEdit?.isLiveEditing);
  const elementRef = useRef<HTMLElement>(null);
  const isFocusedRef = useRef(false);
  const lastRangeRef = useRef<Range | null>(null);

  const [bubblePosition, setBubblePosition] = useState<{ top: number; left: number } | null>(null);
  const [isBoldActive, setIsBoldActive] = useState(false);
  const [isItalicActive, setIsItalicActive] = useState(false);
  const [aiPopoverAnchor, setAiPopoverAnchor] = useState<HTMLElement | null>(null);

  const undoValue = aiConfig ? liveEdit?.undoMap[aiConfig.fieldKey] : undefined;

  // Initialize and synchronize innerHTML when external value changes and element is NOT focused
  useEffect(() => {
    if (elementRef.current && !isFocusedRef.current) {
      const formatted = markdownToHtml(value || '');
      if (elementRef.current.innerHTML !== formatted) {
        elementRef.current.innerHTML = formatted;
      }
    }
  }, [value]);

  const saveCurrentContent = useCallback(() => {
    if (!elementRef.current) return;
    const currentHtml = elementRef.current.innerHTML;
    const cleanMd = htmlToMarkdown(currentHtml);
    if (cleanMd !== value) {
      onSave(cleanMd);
    }
  }, [onSave, value]);

  const updateSelectionState = useCallback(() => {
    if (!isEditingEnabled || !elementRef.current) {
      setBubblePosition(null);
      return;
    }

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
      setBubblePosition(null);
      return;
    }

    const range = selection.getRangeAt(0);
    const container = elementRef.current;

    // Verify selection is within this editable component
    if (!container.contains(range.commonAncestorContainer)) {
      setBubblePosition(null);
      return;
    }

    // Save active range
    lastRangeRef.current = range.cloneRange();

    const selectedText = selection.toString().trim();
    if (!selectedText) {
      setBubblePosition(null);
      return;
    }

    const rect = range.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) {
      setBubblePosition(null);
      return;
    }

    setBubblePosition({
      top: rect.top + window.scrollY,
      left: rect.left + rect.width / 2 + window.scrollX,
    });

    try {
      setIsBoldActive(document.queryCommandState('bold'));
      setIsItalicActive(document.queryCommandState('italic'));
    } catch {
      setIsBoldActive(false);
      setIsItalicActive(false);
    }
  }, [isEditingEnabled]);

  /**
   * Direct DOM toggle for bold, italic, and highlight.
   */
  const handleFormatCommand = useCallback((command: 'bold' | 'italic' | 'highlight') => {
    const container = elementRef.current;
    if (!container) return;

    container.focus();
    const selection = window.getSelection();

    // 1. Restore saved range if available
    let range: Range | null = null;
    if (lastRangeRef.current && selection) {
      try {
        selection.removeAllRanges();
        selection.addRange(lastRangeRef.current);
        range = lastRangeRef.current;
      } catch {
        range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
      }
    } else if (selection && selection.rangeCount > 0) {
      range = selection.getRangeAt(0);
    }

    // 2. Expand range if inside a word
    if (range && range.collapsed) {
      const textNode = range.startContainer;
      if (textNode.nodeType === Node.TEXT_NODE && textNode.textContent) {
        const text = textNode.textContent;
        const offset = range.startOffset;
        let start = offset;
        while (start > 0 && /\S/.test(text[start - 1])) {
          start--;
        }
        let end = offset;
        while (end < text.length && /\S/.test(text[end])) {
          end++;
        }
        if (start < end) {
          range.setStart(textNode, start);
          range.setEnd(textNode, end);
          if (selection) {
            selection.removeAllRanges();
            selection.addRange(range);
          }
        }
      }
    }

    // 3. Apply formatting
    if (range && (!range.collapsed || range.toString().length > 0)) {
      if (command === 'bold') {
        let ancestor: Node | null = range.commonAncestorContainer;
        if (ancestor.nodeType === Node.TEXT_NODE) ancestor = ancestor.parentNode;
        const boldNode = (ancestor as HTMLElement)?.closest?.('strong, b');

        if (boldNode && container.contains(boldNode)) {
          const fragment = document.createDocumentFragment();
          while (boldNode.firstChild) {
            fragment.appendChild(boldNode.firstChild);
          }
          boldNode.parentNode?.replaceChild(fragment, boldNode);
        } else {
          const contentNode = range.extractContents();
          const strong = document.createElement('strong');
          strong.appendChild(contentNode);
          range.insertNode(strong);

          if (selection) {
            selection.removeAllRanges();
            const newRange = document.createRange();
            newRange.selectNodeContents(strong);
            selection.addRange(newRange);
            lastRangeRef.current = newRange.cloneRange();
          }
        }
      } else if (command === 'italic') {
        let ancestor: Node | null = range.commonAncestorContainer;
        if (ancestor.nodeType === Node.TEXT_NODE) ancestor = ancestor.parentNode;
        const italicNode = (ancestor as HTMLElement)?.closest?.('em, i');

        if (italicNode && container.contains(italicNode)) {
          const fragment = document.createDocumentFragment();
          while (italicNode.firstChild) {
            fragment.appendChild(italicNode.firstChild);
          }
          italicNode.parentNode?.replaceChild(fragment, italicNode);
        } else {
          const contentNode = range.extractContents();
          const em = document.createElement('em');
          em.appendChild(contentNode);
          range.insertNode(em);

          if (selection) {
            selection.removeAllRanges();
            const newRange = document.createRange();
            newRange.selectNodeContents(em);
            selection.addRange(newRange);
            lastRangeRef.current = newRange.cloneRange();
          }
        }
      } else if (command === 'highlight') {
        let ancestor: Node | null = range.commonAncestorContainer;
        if (ancestor.nodeType === Node.TEXT_NODE) ancestor = ancestor.parentNode;
        const markNode = (ancestor as HTMLElement)?.closest?.('.cv-highlight-keyword, mark');

        if (markNode && container.contains(markNode)) {
          const fragment = document.createDocumentFragment();
          while (markNode.firstChild) {
            fragment.appendChild(markNode.firstChild);
          }
          markNode.parentNode?.replaceChild(fragment, markNode);
        } else {
          const contentNode = range.extractContents();
          const mark = document.createElement('strong');
          mark.className = 'cv-highlight-keyword';
          mark.appendChild(contentNode);
          range.insertNode(mark);

          if (selection) {
            selection.removeAllRanges();
            const newRange = document.createRange();
            newRange.selectNodeContents(mark);
            selection.addRange(newRange);
            lastRangeRef.current = newRange.cloneRange();
          }
        }
      }
    } else {
      try {
        document.execCommand(command === 'highlight' ? 'bold' : command, false);
      } catch {
        // Safe fallback
      }
    }

    saveCurrentContent();
    updateSelectionState();
  }, [saveCurrentContent, updateSelectionState]);

  // Global mobile selection listener
  useEffect(() => {
    if (!isEditingEnabled) return;

    const handleGlobalSelection = () => {
      if (!elementRef.current) return;
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;

      const range = selection.getRangeAt(0);
      if (elementRef.current.contains(range.commonAncestorContainer)) {
        lastRangeRef.current = range.cloneRange();
        if (liveEdit) {
          liveEdit.setActiveFormatter({ executeFormat: handleFormatCommand });
        }
        updateSelectionState();
      }
    };

    document.addEventListener('selectionchange', handleGlobalSelection);
    return () => {
      document.removeEventListener('selectionchange', handleGlobalSelection);
    };
  }, [isEditingEnabled, handleFormatCommand, liveEdit, updateSelectionState]);

  const handleFocus = () => {
    isFocusedRef.current = true;
    if (liveEdit) {
      liveEdit.setActiveFormatter({ executeFormat: handleFormatCommand });
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLElement>) => {
    isFocusedRef.current = false;
    setTimeout(() => {
      if (!isFocusedRef.current) {
        setBubblePosition(null);
      }
    }, 250);

    const currentHtml = e.currentTarget.innerHTML;
    const cleanMd = htmlToMarkdown(currentHtml);
    if (cleanMd !== value) {
      onSave(cleanMd);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    // Keyboard shortcut: Ctrl+B or Cmd+B for bold
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
      e.preventDefault();
      handleFormatCommand('bold');
      return;
    }

    // Keyboard shortcut: Ctrl+I or Cmd+I for italic
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'i') {
      e.preventDefault();
      handleFormatCommand('italic');
      return;
    }

    // Keyboard shortcut: Ctrl+Z or Cmd+Z for undo if available
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && aiConfig && undoValue !== undefined) {
      e.preventDefault();
      handleUndo();
      return;
    }

    if (!multiline && e.key === 'Enter') {
      e.preventDefault();
      e.currentTarget.blur();
    } else if (e.key === 'Escape') {
      if (elementRef.current) {
        elementRef.current.innerHTML = markdownToHtml(value || '');
        elementRef.current.blur();
      }
    }
  };

  const handleKeyUp = () => {
    updateSelectionState();
  };

  const handleMouseUp = () => {
    updateSelectionState();
  };

  const handleOpenAiPopover = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    e.preventDefault();
    setAiPopoverAnchor(e.currentTarget);
  };

  const handleCloseAiPopover = () => {
    setAiPopoverAnchor(null);
  };

  const handleRegenerateWithAi = async (guidance: string) => {
    if (!aiConfig || !liveEdit) return;

    if (aiConfig.type === 'bullet') {
      const newText = await liveEdit.regenerateExperienceBullet({
        fieldKey: aiConfig.fieldKey,
        sectionType: aiConfig.sectionType || 'experience',
        itemIndex: aiConfig.itemIndex ?? 0,
        bulletIndex: aiConfig.bulletIndex ?? 0,
        company: aiConfig.company || '',
        role: aiConfig.role,
        currentBullet: value,
        userGuidance: guidance,
      });
      if (newText && elementRef.current) {
        elementRef.current.innerHTML = markdownToHtml(newText);
      }
    } else if (aiConfig.type === 'summary') {
      const newText = await liveEdit.regenerateSummaryBlock({
        fieldKey: aiConfig.fieldKey,
        currentSummary: value,
        userGuidance: guidance,
      });
      if (newText && elementRef.current) {
        elementRef.current.innerHTML = markdownToHtml(newText);
      }
    }
  };

  const handleUndo = () => {
    if (!aiConfig || !liveEdit) return;
    liveEdit.undoItem(aiConfig.fieldKey, (previousValue) => {
      onSave(previousValue);
      if (elementRef.current) {
        elementRef.current.innerHTML = markdownToHtml(previousValue);
      }
    });
  };

  const Tag = tagName as React.ElementType;

  // View / Print Mode (0 overhead, single DOM element)
  if (!isEditingEnabled) {
    const content = htmlContent || markdownToHtml(value || '');
    if (content) {
      return (
        <Tag
          className={className}
          style={style}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      );
    }
    return (
      <Tag className={className} style={style}>
        {children || value}
      </Tag>
    );
  }

  const hasAiAction = Boolean(aiConfig);

  // 1. Bullet point item (<li>) with 100% natural text width and floating absolute action pill
  if (tagName === 'li') {
    return (
      <li
        className={`cv-editable-wrapper cv-bullet-item ${className}`}
        style={{
          position: 'relative',
          ...style,
        }}
      >
        {/* Full-width natural editable text: no horizontal columns or reserved margins */}
        <span
          ref={elementRef}
          contentEditable
          suppressContentEditableWarning
          className="cv-editable-field"
          data-placeholder={placeholder}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
          onMouseUp={handleMouseUp}
          title={t('preview:toolbar.clickToEdit', 'Click to edit • Select text to format bold/italic (Ctrl+B)')}
          style={{
            display: 'inline',
            width: '100%',
          }}
        />

        {/* Floating Absolute Action Pill: Floats over the item without altering layout */}
        {hasAiAction && (
          <span
            className={`no-print cv-ai-hover-actions ${undoValue !== undefined ? 'has-undo' : ''}`}
            style={{
              position: 'absolute',
              top: '-12px',
              right: 0,
              zIndex: 25,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.6,
                bgcolor: 'background.paper',
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: '9999px',
                boxShadow: '0 4px 14px rgba(0,0,0,0.12)',
                p: 0.35,
              }}
            >
              {undoValue !== undefined && (
                <Button
                  size="small"
                  variant="outlined"
                  onClick={handleUndo}
                  startIcon={<UndoRoundedIcon sx={{ fontSize: '13px !important' }} />}
                  sx={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    textTransform: 'none',
                    py: 0.1,
                    px: 0.8,
                    minHeight: 22,
                    height: 22,
                    borderRadius: '9999px',
                    borderColor: 'divider',
                    color: 'text.primary',
                    whiteSpace: 'nowrap',
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.08),
                      borderColor: 'primary.main',
                    },
                  }}
                >
                  {t('preview:aiRegen.undo', 'Undo')}
                </Button>
              )}

              <Tooltip title={t('preview:aiRegen.tooltip', 'Regenerate with AI')} arrow placement="top">
                <IconButton
                  size="small"
                  onClick={handleOpenAiPopover}
                  className="cv-ai-sparkle-btn"
                  sx={{
                    width: 24,
                    height: 24,
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    color: 'primary.main',
                    borderRadius: '50%',
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.25)}`,
                    transition: 'all 0.15s ease',
                    '&:hover': {
                      bgcolor: 'primary.main',
                      color: '#ffffff',
                      transform: 'scale(1.1)',
                    },
                  }}
                >
                  <AutoAwesomeRoundedIcon sx={{ fontSize: 13 }} />
                </IconButton>
              </Tooltip>
            </Box>
          </span>
        )}

        {/* Selection Toolbar for Bold/Formatting */}
        <CvSelectionBubble
          position={bubblePosition}
          onToggleBold={() => handleFormatCommand('bold')}
          onToggleItalic={() => handleFormatCommand('italic')}
          onToggleHighlight={() => handleFormatCommand('highlight')}
          isBoldActive={isBoldActive}
          isItalicActive={isItalicActive}
        />

        {/* AI Regenerate Popover / Bottom Sheet */}
        {hasAiAction && (
          <AiRegeneratePopover
            open={Boolean(aiPopoverAnchor)}
            anchorEl={aiPopoverAnchor}
            onClose={handleCloseAiPopover}
            type={aiConfig?.type}
            onRegenerate={handleRegenerateWithAi}
          />
        )}
      </li>
    );
  }

  // 2. Summary or Block item with AI action (<div>)
  if (hasAiAction) {
    return (
      <div
        className={`cv-editable-wrapper cv-summary-item ${className}`}
        style={{
          position: 'relative',
          ...style,
        }}
      >
        {/* Full-width natural editable content */}
        <div
          ref={elementRef as React.RefObject<HTMLDivElement>}
          contentEditable
          suppressContentEditableWarning
          className={`cv-editable-field ${className}`}
          data-placeholder={placeholder}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
          onMouseUp={handleMouseUp}
          title={t('preview:toolbar.clickToEdit', 'Click to edit • Select text to format bold/italic (Ctrl+B)')}
          style={{
            width: '100%',
          }}
        />

        {/* Floating Absolute Action Pill */}
        <span
          className={`no-print cv-ai-hover-actions ${undoValue !== undefined ? 'has-undo' : ''}`}
          style={{
            position: 'absolute',
            top: '-12px',
            right: 0,
            zIndex: 25,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.6,
              bgcolor: 'background.paper',
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: '9999px',
              boxShadow: '0 4px 14px rgba(0,0,0,0.12)',
              p: 0.35,
            }}
          >
            {undoValue !== undefined && (
              <Button
                size="small"
                variant="outlined"
                onClick={handleUndo}
                startIcon={<UndoRoundedIcon sx={{ fontSize: '13px !important' }} />}
                sx={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  textTransform: 'none',
                  py: 0.1,
                  px: 0.8,
                  minHeight: 22,
                  height: 22,
                  borderRadius: '9999px',
                  borderColor: 'divider',
                  color: 'text.primary',
                  whiteSpace: 'nowrap',
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                    borderColor: 'primary.main',
                  },
                }}
              >
                {t('preview:aiRegen.undo', 'Undo')}
              </Button>
            )}

            <Tooltip title={t('preview:aiRegen.tooltip', 'Regenerate with AI')} arrow placement="top">
              <IconButton
                size="small"
                onClick={handleOpenAiPopover}
                className="cv-ai-sparkle-btn"
                sx={{
                  width: 24,
                  height: 24,
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: 'primary.main',
                  borderRadius: '50%',
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.25)}`,
                  transition: 'all 0.15s ease',
                  '&:hover': {
                    bgcolor: 'primary.main',
                    color: '#ffffff',
                    transform: 'scale(1.1)',
                  },
                }}
              >
                <AutoAwesomeRoundedIcon sx={{ fontSize: 13 }} />
              </IconButton>
            </Tooltip>
          </Box>
        </span>

        {/* Selection Toolbar for Bold/Formatting */}
        <CvSelectionBubble
          position={bubblePosition}
          onToggleBold={() => handleFormatCommand('bold')}
          onToggleItalic={() => handleFormatCommand('italic')}
          onToggleHighlight={() => handleFormatCommand('highlight')}
          isBoldActive={isBoldActive}
          isItalicActive={isItalicActive}
        />

        {/* AI Regenerate Popover / Bottom Sheet */}
        <AiRegeneratePopover
          open={Boolean(aiPopoverAnchor)}
          anchorEl={aiPopoverAnchor}
          onClose={handleCloseAiPopover}
          type={aiConfig?.type}
          onRegenerate={handleRegenerateWithAi}
        />
      </div>
    );
  }

  // 3. Regular Editable Tag without AI action (span, h1, h2, etc.)
  return (
    <>
      <Tag
        ref={elementRef}
        contentEditable
        suppressContentEditableWarning
        className={`cv-editable-field ${className}`}
        style={style}
        data-placeholder={placeholder}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        onMouseUp={handleMouseUp}
        title={t('preview:toolbar.clickToEdit', 'Click to edit • Select text to format bold/italic (Ctrl+B)')}
      />

      <CvSelectionBubble
        position={bubblePosition}
        onToggleBold={() => handleFormatCommand('bold')}
        onToggleItalic={() => handleFormatCommand('italic')}
        onToggleHighlight={() => handleFormatCommand('highlight')}
        isBoldActive={isBoldActive}
        isItalicActive={isItalicActive}
      />
    </>
  );
};
