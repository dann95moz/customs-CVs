import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Box, IconButton, useTheme, SxProps, Theme } from '@mui/material';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';

export interface HorizontalScrollContainerProps {
  children: React.ReactNode;
  sx?: SxProps<Theme>;
  contentSx?: SxProps<Theme>;
  showArrows?: boolean;
  fadeWidth?: number;
  scrollStep?: number;
  className?: string;
}

/**
 * Reusable horizontal scroll container with dynamic fade gradients and scroll arrows.
 * Provides intuitive visual cues that more content can be scrolled or swiped.
 */
export const HorizontalScrollContainer: React.FC<HorizontalScrollContainerProps> = ({
  children,
  sx,
  contentSx,
  showArrows = true,
  fadeWidth = 48,
  scrollStep = 300,
  className,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 6);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 6);
  }, []);

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (!el) return;

    const resizeObserver = new ResizeObserver(() => {
      checkScroll();
    });
    resizeObserver.observe(el);

    return () => {
      resizeObserver.disconnect();
    };
  }, [checkScroll]);

  const scrollByAmount = (amount: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  const fadeColor = isDark ? theme.palette.background.default : theme.palette.background.paper;

  return (
    <Box
      className={className}
      sx={{
        position: 'relative',
        width: '100%',
        maxWidth: '100%',
        minWidth: 0,
        boxSizing: 'border-box',
        overflow: 'hidden',
        ...sx,
      }}
    >
      {/* Left Fade Gradient & Scroll Arrow */}
      {canScrollLeft && (
        <Box
          sx={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: { xs: 36, sm: fadeWidth },
            background: `linear-gradient(to right, ${fadeColor} 30%, transparent)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            zIndex: 10,
            pointerEvents: showArrows ? 'auto' : 'none',
            pl: { xs: 0.25, sm: 0.5 },
          }}
        >
          {showArrows && (
            <IconButton
              size="small"
              onClick={() => scrollByAmount(-scrollStep)}
              aria-label="Scroll left"
              sx={{
                bgcolor: isDark ? 'rgba(30, 41, 59, 0.9)' : 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(4px)',
                border: `1px solid ${theme.palette.divider}`,
                boxShadow: '0 2px 10px rgba(0,0,0,0.18)',
                p: 0.5,
                width: { xs: 26, sm: 28 },
                height: { xs: 26, sm: 28 },
                color: 'text.primary',
                transition: 'all 0.15s ease',
                '&:hover': {
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  transform: 'scale(1.05)',
                },
              }}
            >
              <ArrowBackIosNewRoundedIcon sx={{ fontSize: 13, ml: '-2px' }} />
            </IconButton>
          )}
        </Box>
      )}

      {/* Main Horizontal Scrollable Viewport */}
      <Box
        ref={scrollRef}
        onScroll={checkScroll}
        sx={{
          display: 'flex',
          overflowX: 'auto',
          overflowY: 'hidden',
          overscrollBehaviorX: 'contain',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
          width: '100%',
          maxWidth: '100%',
          boxSizing: 'border-box',
          scrollBehavior: 'smooth',
          ...contentSx,
        }}
      >
        {children}
      </Box>

      {/* Right Fade Gradient & Scroll Arrow */}
      {canScrollRight && (
        <Box
          sx={{
            position: 'absolute',
            right: 0,
            top: 0,
            bottom: 0,
            width: { xs: 36, sm: fadeWidth },
            background: `linear-gradient(to left, ${fadeColor} 30%, transparent)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            zIndex: 10,
            pointerEvents: showArrows ? 'auto' : 'none',
            pr: { xs: 0.25, sm: 0.5 },
          }}
        >
          {showArrows && (
            <IconButton
              size="small"
              onClick={() => scrollByAmount(scrollStep)}
              aria-label="Scroll right"
              sx={{
                bgcolor: isDark ? 'rgba(30, 41, 59, 0.9)' : 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(4px)',
                border: `1px solid ${theme.palette.divider}`,
                boxShadow: '0 2px 10px rgba(0,0,0,0.18)',
                p: 0.5,
                width: { xs: 26, sm: 28 },
                height: { xs: 26, sm: 28 },
                color: 'text.primary',
                transition: 'all 0.15s ease',
                '&:hover': {
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  transform: 'scale(1.05)',
                },
              }}
            >
              <ArrowForwardIosRoundedIcon sx={{ fontSize: 13, mr: '-2px' }} />
            </IconButton>
          )}
        </Box>
      )}
    </Box>
  );
};
