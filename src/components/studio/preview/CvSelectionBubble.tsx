import React from 'react';
import ReactDOM from 'react-dom';
import FormatBoldRoundedIcon from '@mui/icons-material/FormatBoldRounded';
import FormatItalicRoundedIcon from '@mui/icons-material/FormatItalicRounded';
import HighlightRoundedIcon from '@mui/icons-material/HighlightRounded';

export interface CvSelectionBubbleProps {
  position: { top: number; left: number } | null;
  onToggleBold: () => void;
  onToggleItalic: () => void;
  onToggleHighlight: () => void;
  isBoldActive?: boolean;
  isItalicActive?: boolean;
}

/**
 * Floating inline formatting bubble for live CV editing.
 * Rendered in a portal to avoid parent clipping.
 */
export const CvSelectionBubble: React.FC<CvSelectionBubbleProps> = ({
  position,
  onToggleBold,
  onToggleItalic,
  onToggleHighlight,
  isBoldActive = false,
  isItalicActive = false,
}) => {
  if (!position) return null;

  return ReactDOM.createPortal(
    <div
      className="no-print cv-selection-bubble"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
      onMouseDown={(e) => {
        // Prevent contentEditable from losing focus on mouse click
        e.preventDefault();
      }}
    >
      {/* Bold button */}
      <button
        type="button"
        className={`cv-bubble-btn ${isBoldActive ? 'active' : ''}`}
        onMouseDown={(e) => {
          e.preventDefault();
        }}
        onClick={(e) => {
          e.preventDefault();
          onToggleBold();
        }}
        title="Toggle Bold (Ctrl+B)"
        aria-label="Toggle Bold"
      >
        <FormatBoldRoundedIcon sx={{ fontSize: 17 }} />
      </button>

      {/* Italic button */}
      <button
        type="button"
        className={`cv-bubble-btn ${isItalicActive ? 'active' : ''}`}
        onMouseDown={(e) => {
          e.preventDefault();
        }}
        onClick={(e) => {
          e.preventDefault();
          onToggleItalic();
        }}
        title="Toggle Italic (Ctrl+I)"
        aria-label="Toggle Italic"
      >
        <FormatItalicRoundedIcon sx={{ fontSize: 17 }} />
      </button>

      <div className="cv-bubble-divider" />

      {/* Keyword Highlight button */}
      <button
        type="button"
        className="cv-bubble-btn"
        onMouseDown={(e) => {
          e.preventDefault();
        }}
        onClick={(e) => {
          e.preventDefault();
          onToggleHighlight();
        }}
        title="Toggle Keyword Highlight (++)"
        aria-label="Toggle Keyword Highlight"
      >
        <HighlightRoundedIcon sx={{ fontSize: 16 }} />
      </button>
    </div>,
    document.body
  );
};
