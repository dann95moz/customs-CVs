import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useCvLiveEdit } from './CvLiveEditContext';
import { markdownToHtml, htmlToMarkdown } from '../../../utils/textFormatting';
import { CvSelectionBubble } from './CvSelectionBubble';

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
}

/**
 * Clean inline text editor for hot document editing with markdown support.
 * In editing mode: renders formatted HTML with contentEditable, floating format bubble, and toolbar integration.
 * In view / print mode: renders standard semantic HTML element with 0 overhead.
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
}) => {
  const liveEdit = useCvLiveEdit();
  const isEditingEnabled = Boolean(liveEdit?.isLiveEditing);
  const elementRef = useRef<HTMLElement>(null);
  const isFocusedRef = useRef(false);
  const lastRangeRef = useRef<Range | null>(null);

  const [bubblePosition, setBubblePosition] = useState<{ top: number; left: number } | null>(null);
  const [isBoldActive, setIsBoldActive] = useState(false);
  const [isItalicActive, setIsItalicActive] = useState(false);

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
   * 100% reliable on Mobile Safari, Android Chrome, and Desktop.
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

    // 2. If range is collapsed (cursor inside a word), expand range to surrounding word
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
        // Check if selection is already bold
        let ancestor: Node | null = range.commonAncestorContainer;
        if (ancestor.nodeType === Node.TEXT_NODE) ancestor = ancestor.parentNode;
        const boldNode = (ancestor as HTMLElement)?.closest?.('strong, b');

        if (boldNode && container.contains(boldNode)) {
          // Unwrap bold
          const fragment = document.createDocumentFragment();
          while (boldNode.firstChild) {
            fragment.appendChild(boldNode.firstChild);
          }
          boldNode.parentNode?.replaceChild(fragment, boldNode);
        } else {
          // Wrap in strong
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
      // Fallback: document.execCommand
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

  const Tag = tagName as React.ElementType;

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
        title="Click to edit • Select text to format bold/italic (Ctrl+B)"
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
