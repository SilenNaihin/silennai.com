'use client';

import { useEffect, useMemo, useRef, useState, useCallback } from 'react';

type Position = { top: number; bottom: number };

export type DetailsColumnFillMode = 'viewport' | 'container';

export default function DetailsColumn<T>({
  items,
  selectedIndex,
  containerRef,
  itemRefs,
  deps = [],
  gapPx = 16,
  sideOffsetPx = 0,
  fillMode = 'viewport',
  zIndex = 30,
  stopPropagation = true,
  panelClassName = 'bg-white',
  panelStyle,
  render,
  onClose,
}: {
  items: T[];
  selectedIndex: number | null;
  containerRef: React.RefObject<HTMLElement | null>;
  itemRefs: React.MutableRefObject<(HTMLElement | null)[]>;
  deps?: React.DependencyList;
  gapPx?: number;
  sideOffsetPx?: number;
  fillMode?: DetailsColumnFillMode;
  zIndex?: number;
  stopPropagation?: boolean;
  panelClassName?: string;
  panelStyle?: React.CSSProperties;
  render: (item: T, index: number) => React.ReactNode;
  onClose?: () => void;
}) {
  const [positions, setPositions] = useState<Position[]>([]);
  const [isExiting, setIsExiting] = useState(false);
  const [displayedIndex, setDisplayedIndex] = useState<number | null>(null);
  const [hasAnimatedIn, setHasAnimatedIn] = useState(false);
  const [contentHeight, setContentHeight] = useState<number>(0);
  const enterTimerRef = useRef<number | null>(null);
  const exitTimerRef = useRef<number | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Handle clicks outside the panel to close it
  const handleClickOutside = useCallback(
    (e: MouseEvent) => {
      if (!onClose || !panelRef.current) return;
      // Check if click is inside the panel
      if (panelRef.current.contains(e.target as Node)) return;
      // Check if click is on one of the items (books/podcasts)
      const clickedOnItem = itemRefs.current.some(
        (ref) => ref && ref.contains(e.target as Node)
      );
      if (clickedOnItem) return;
      onClose();
    },
    [onClose, itemRefs]
  );

  // Add/remove click outside listener
  useEffect(() => {
    if (displayedIndex !== null && onClose) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [displayedIndex, onClose, handleClickOutside]);

  // Measure content height when it changes
  useEffect(() => {
    if (!contentRef.current) return;

    const measureHeight = () => {
      if (contentRef.current) {
        setContentHeight(contentRef.current.offsetHeight);
      }
    };

    measureHeight();

    // Use ResizeObserver to detect content size changes
    const resizeObserver = new ResizeObserver(measureHeight);
    resizeObserver.observe(contentRef.current);

    return () => resizeObserver.disconnect();
  }, [displayedIndex]);

  // Handle selection changes with exit animation
  useEffect(() => {
    if (enterTimerRef.current) window.clearTimeout(enterTimerRef.current);
    if (exitTimerRef.current) window.clearTimeout(exitTimerRef.current);

    if (selectedIndex !== null && displayedIndex === null) {
      // First selection - animate in
      setDisplayedIndex(selectedIndex);
      setIsExiting(false);
      setHasAnimatedIn(false);
      enterTimerRef.current = window.setTimeout(
        () => setHasAnimatedIn(true),
        400
      );
      return;
    }

    if (selectedIndex !== null && displayedIndex !== null) {
      // Switching between items - just update (will transition)
      setDisplayedIndex(selectedIndex);
      return;
    }

    if (selectedIndex === null && displayedIndex !== null) {
      // Deselecting - trigger exit animation
      setIsExiting(true);
      exitTimerRef.current = window.setTimeout(() => {
        setDisplayedIndex(null);
        setIsExiting(false);
        setHasAnimatedIn(false);
      }, 300);
      return;
    }
  }, [selectedIndex, displayedIndex]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (enterTimerRef.current) window.clearTimeout(enterTimerRef.current);
      if (exitTimerRef.current) window.clearTimeout(exitTimerRef.current);
    };
  }, []);

  // Update item positions when selection changes or on resize
  useEffect(() => {
    const updatePositions = () => {
      if (!containerRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();

      const nextPositions = itemRefs.current.map((ref) => {
        if (!ref) return { top: 0, bottom: 0 };
        const rect = ref.getBoundingClientRect();
        const relativeTop = rect.top - containerRect.top;
        const relativeBottom = rect.bottom - containerRect.top;
        return { top: relativeTop, bottom: relativeBottom };
      });

      setPositions(nextPositions);
    };

    updatePositions();
    window.addEventListener('resize', updatePositions);
    return () => window.removeEventListener('resize', updatePositions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIndex, displayedIndex, ...deps]);

  const displayedItem = useMemo(() => {
    return displayedIndex !== null ? items[displayedIndex] : null;
  }, [displayedIndex, items]);

  const displayedPosition = useMemo(() => {
    if (selectedIndex !== null) return positions[selectedIndex] ?? null;
    if (displayedIndex !== null) return positions[displayedIndex] ?? null;
    return null;
  }, [displayedIndex, positions, selectedIndex]);

  if (!displayedItem || !displayedPosition) return null;

  const topPx = displayedPosition.bottom + gapPx;
  // Transition point: content height + some buffer for the fade
  const fadeStartPx = contentHeight > 0 ? contentHeight : 200;

  return (
    <div
      ref={panelRef}
      className={`absolute ${panelClassName}`}
      style={{
        left: `${-sideOffsetPx}px`,
        right: `${-sideOffsetPx}px`,
        top: `${topPx}px`,
        ...(fillMode === 'viewport'
          ? { bottom: '-100vh' }
          : { minHeight: `calc(100% - ${topPx}px)` }),
        // Background: 30% at top, 100% white at 32px, stays 100% until content ends, then 75%
        background: `linear-gradient(to bottom,
          rgba(255, 255, 255, 0.3) 0px,
          rgba(255, 255, 255, 1) 32px,
          rgba(255, 255, 255, 1) ${fadeStartPx}px,
          rgba(255, 255, 255, 0.75) ${fadeStartPx + 24}px)`,
        maskImage:
          'linear-gradient(to bottom, transparent 0%, black 12px, black 100%)',
        WebkitMaskImage:
          'linear-gradient(to bottom, transparent 0%, black 12px, black 100%)',
        animation:
          !hasAnimatedIn && !isExiting
            ? 'slideUp 0.4s ease-out forwards'
            : 'none',
        transition: 'top 0.3s ease-out, opacity 0.3s ease-out',
        opacity: isExiting ? 0 : 1,
        zIndex,
        ...panelStyle,
      }}
      onClick={(e) => {
        if (stopPropagation) e.stopPropagation();
      }}
    >
      {/* Content wrapper for measuring */}
      <div ref={contentRef} className="relative">
        {onClose && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="absolute top-3 -right-1 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
        {render(displayedItem, displayedIndex ?? 0)}
      </div>
      {/* Blur overlay for area below content - fades in gradually */}
      <div
        className="absolute left-0 right-0"
        style={{
          top: `${fadeStartPx}px`,
          bottom: 0,
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 48px)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 48px)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}
