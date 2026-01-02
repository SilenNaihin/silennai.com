'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

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
}) {
  const [positions, setPositions] = useState<Position[]>([]);
  const [isExiting, setIsExiting] = useState(false);
  const [displayedIndex, setDisplayedIndex] = useState<number | null>(null);
  const [hasAnimatedIn, setHasAnimatedIn] = useState(false);
  const enterTimerRef = useRef<number | null>(null);
  const exitTimerRef = useRef<number | null>(null);

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

  return (
    <div
      className={`absolute ${panelClassName}`}
      style={{
        left: `${-sideOffsetPx}px`,
        right: `${-sideOffsetPx}px`,
        top: `${topPx}px`,
        ...(fillMode === 'viewport'
          ? { bottom: '-100vh' }
          : { minHeight: `calc(100% - ${topPx}px)` }),
        background:
          'linear-gradient(to bottom, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.99) 32px)',
        backdropFilter: 'blur(2px)',
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
      {render(displayedItem, displayedIndex ?? 0)}
    </div>
  );
}
