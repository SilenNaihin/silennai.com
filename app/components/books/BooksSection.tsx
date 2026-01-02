import { Book } from '@/app/content/data';
import { useState, useRef, useEffect } from 'react';
import Book3D from './Book3D';
import { books } from '@/app/content/data';

// Hook to calculate responsive shelf count based on screen height
function useResponsiveShelfCount() {
  const [shelfCount, setShelfCount] = useState(3);

  useEffect(() => {
    const calculateShelfCount = () => {
      const viewportHeight = window.innerHeight;
      // Each shelf is roughly 260px (240px book + 20px shelf/gap)
      // Reserve ~350px for header, detail section, and padding
      const availableHeight = viewportHeight - 350;
      const shelfHeight = 260;
      const count = Math.max(1, Math.floor(availableHeight / shelfHeight));
      setShelfCount(Math.min(count, 4)); // Cap at 4 shelves max
    };

    calculateShelfCount();
    window.addEventListener('resize', calculateShelfCount);
    return () => window.removeEventListener('resize', calculateShelfCount);
  }, []);

  return shelfCount;
}

function BooksSection({
  onSelect,
  selectedIndex,
}: {
  onSelect: (item: Book, index: number) => void;
  selectedIndex: number | null;
}) {
  // Track which book is being hovered (separate from selection)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [scrollOffset, setScrollOffset] = useState(0);
  const scrollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Responsive shelf count determines max visible height
  const visibleShelves = useResponsiveShelfCount();

  // Calculate books per shelf to fit within content width
  const booksPerShelf = 8;

  // Calculate total shelves needed
  const totalShelves = Math.ceil(books.length / booksPerShelf);

  // Calculate max height and scroll bounds
  // Each shelf is ~260px (240px book + 20px gap)
  const shelfHeight = 260;
  const maxHeight = visibleShelves * shelfHeight;
  // Account for pt-12 (48px) on first shelf and pb-4 (16px) on last shelf + 16 from somewhere else
  const totalHeight = totalShelves * shelfHeight + 48 + 16 + 16;
  const maxScrollOffset = Math.max(0, totalHeight - maxHeight);

  const canScrollUp = scrollOffset > 0;
  const canScrollDown = scrollOffset < maxScrollOffset - 1; // -1 for floating point tolerance
  const hasMultipleShelves = totalShelves > visibleShelves;

  // Clicking anywhere on the bookshelf background deselects the selected book
  // (Individual books stop propagation so clicking them doesn't trigger this)
  const handleBackgroundClick = () => {
    if (selectedIndex !== null) {
      // Toggle off by clicking the same book again
      onSelect(books[selectedIndex], selectedIndex);
    }
  };

  // Handle book selection with auto-scroll to make shelf visible
  const handleBookSelect = (book: Book, index: number) => {
    const shelfIndex = Math.floor(index / booksPerShelf);

    // Calculate shelf position in the scrollable content
    // First shelf has extra 48px (pt-12) padding at top
    const shelfTop = shelfIndex * shelfHeight + (shelfIndex > 0 ? 48 : 0);
    const shelfBottom = shelfTop + shelfHeight + (shelfIndex === 0 ? 48 : 0);

    // Current visible bounds
    const visibleTop = scrollOffset;
    const visibleBottom = scrollOffset + maxHeight;

    // Calculate new scroll offset if shelf is not fully visible
    let newOffset = scrollOffset;

    // Add padding so the shelf isn't at the very edge (books scale up when selected)
    const scrollPadding = 80;

    if (shelfBottom > visibleBottom) {
      // Shelf extends below visible area - scroll down to show it
      // Add padding so shelf appears higher in the viewport
      newOffset = Math.min(
        maxScrollOffset,
        shelfBottom - maxHeight + scrollPadding
      );
    } else if (shelfTop < visibleTop) {
      // Shelf is above visible area - scroll up
      // Subtract padding so shelf has room above it
      newOffset = Math.max(0, shelfTop - scrollPadding);
    }

    if (newOffset !== scrollOffset) {
      setScrollOffset(newOffset);
    }

    onSelect(book, index);
  };

  const startScrolling = (direction: 'up' | 'down') => {
    if (scrollIntervalRef.current) {
      clearInterval(scrollIntervalRef.current);
    }

    const interval = setInterval(() => {
      setScrollOffset((prev) => {
        const newOffset =
          direction === 'up'
            ? Math.max(0, prev - 3) // Scroll up by 3px per frame
            : Math.min(maxScrollOffset, prev + 3); // Scroll down by 3px per frame
        return newOffset;
      });
    }, 16); // ~60fps

    scrollIntervalRef.current = interval;
  };

  const stopScrolling = () => {
    if (scrollIntervalRef.current) {
      clearInterval(scrollIntervalRef.current);
      scrollIntervalRef.current = null;
    }
  };

  return (
    <div className="relative w-full -mt-6" onClick={handleBackgroundClick}>
      {/* Navigation arrows - positioned on the right */}
      {hasMultipleShelves && (
        <nav className="hidden md:block absolute left-full ml-4 top-1/2 -translate-y-1/2 z-50">
          <div className="flex flex-col gap-2">
            <button
              onMouseEnter={() => canScrollUp && startScrolling('up')}
              onMouseLeave={stopScrolling}
              onClick={(e) => e.stopPropagation()}
              disabled={!canScrollUp}
              className={`w-8 h-8 rounded flex items-center justify-center transition-all ${
                !canScrollUp
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
              aria-label="Scroll up"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="18 15 12 9 6 15" />
              </svg>
            </button>
            <button
              onMouseEnter={() => canScrollDown && startScrolling('down')}
              onMouseLeave={stopScrolling}
              onClick={(e) => e.stopPropagation()}
              disabled={!canScrollDown}
              className={`w-8 h-8 rounded flex items-center justify-center transition-all ${
                !canScrollDown
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
              aria-label="Scroll down"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
          </div>
        </nav>
      )}

      {/* Fixed-height container with hidden overflow */}
      <div
        className="relative overflow-hidden"
        style={{
          height: `${maxHeight}px`,
        }}
      >
        {/* Inner content that moves based on scroll offset */}
        <div
          className="space-y-6"
          style={{
            transform: `translateY(-${scrollOffset}px)`,
            transition: 'transform 0.3s ease-out',
            willChange: 'transform',
          }}
        >
          {Array.from({ length: totalShelves }).map((_, shelfIndex) => {
            const shelfBooks = books.slice(
              shelfIndex * booksPerShelf,
              (shelfIndex + 1) * booksPerShelf
            );

            // Calculate if selected or hovered book is on this shelf
            const shelfStartIndex = shelfIndex * booksPerShelf;
            const shelfEndIndex = shelfStartIndex + shelfBooks.length - 1;
            const hasSelectedBook =
              selectedIndex !== null &&
              selectedIndex >= shelfStartIndex &&
              selectedIndex <= shelfEndIndex;
            const hasHoveredBook =
              hoveredIndex !== null &&
              hoveredIndex >= shelfStartIndex &&
              hoveredIndex <= shelfEndIndex;

            // Calculate shift to keep books centered when one opens
            // Books translate RIGHT when opened, so we shift the container LEFT to compensate
            let shelfShift = 0;
            if (hasSelectedBook && hasHoveredBook) {
              shelfShift = -52; // Half of 105px max translation
            } else if (hasSelectedBook) {
              shelfShift = -45; // Half of 90px selected translation
            } else if (hasHoveredBook) {
              shelfShift = -7; // Half of 15px hover translation
            }

            return (
              <div
                key={shelfIndex}
                className={`relative flex flex-col items-center w-full${
                  shelfIndex === 0 ? ' pt-12' : ''
                }${shelfIndex === totalShelves - 1 ? ' pb-4' : ''}`}
              >
                {/* Books container - shifts left when book opens to stay centered */}
                <div
                  className="flex justify-center gap-2 pb-1 items-end transition-transform duration-500"
                  style={{
                    transformStyle: 'preserve-3d',
                    transform: `translateX(${shelfShift}px)`,
                  }}
                >
                  {shelfBooks.map((book, bookIndex) => {
                    const globalIndex = shelfIndex * booksPerShelf + bookIndex;
                    const isSelected = selectedIndex === globalIndex;

                    return (
                      <Book3D
                        key={`${shelfIndex}-${bookIndex}`}
                        book={book}
                        onClick={() => handleBookSelect(book, globalIndex)}
                        isSelected={isSelected}
                        globalIndex={globalIndex}
                        hoveredIndex={hoveredIndex}
                        selectedIndex={selectedIndex}
                        shelfStartIndex={shelfStartIndex}
                        shelfEndIndex={shelfEndIndex}
                        onHoverChange={setHoveredIndex}
                      />
                    );
                  })}
                </div>

                {/* Shelf - full width */}
                <div
                  className="relative w-full"
                  style={{
                    height: '12px',
                    backgroundImage: `
                        linear-gradient(to bottom, 
                          rgba(255,255,255,0.15) 0%, 
                          rgba(255,255,255,0.05) 20%, 
                          transparent 40%,
                          rgba(0,0,0,0.1) 100%
                        ),
                        url('/books/wood_side.jpeg')
                      `,
                    backgroundSize: 'auto 100%, auto 100%',
                    backgroundRepeat: 'repeat-x, repeat-x',
                    backgroundPosition: 'center, center',
                    boxShadow:
                      '0 -1px 2px rgba(139,69,19,0.3), 0 4px 12px rgba(0,0,0,0.25), 0 8px 24px rgba(0,0,0,0.15), 0 12px 40px rgba(0,0,0,0.1), inset 0 1px 1px rgba(255,255,255,0.4), inset 0 -2px 3px rgba(0,0,0,0.3)',
                    border: '1px solid rgba(101,67,33,0.4)',
                    borderTop: '1px solid rgba(139,90,43,0.6)',
                    borderBottom: '1px solid rgba(61,47,23,0.5)',
                    borderRadius: '2px',
                    transform: 'perspective(1000px) rotateX(-2deg)',
                    transformStyle: 'preserve-3d',
                    zIndex: -1,
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile navigation controls */}
      {hasMultipleShelves && (
        <div className="md:hidden flex justify-center items-center gap-4 mt-4">
          <button
            onTouchStart={() => canScrollUp && startScrolling('up')}
            onTouchEnd={stopScrolling}
            onClick={(e) => {
              e.stopPropagation();
              if (canScrollUp) {
                setScrollOffset((prev) => Math.max(0, prev - shelfHeight));
              }
            }}
            disabled={!canScrollUp}
            className={`p-2 rounded ${
              !canScrollUp ? 'text-gray-300' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            ↑
          </button>
          <button
            onTouchStart={() => canScrollDown && startScrolling('down')}
            onTouchEnd={stopScrolling}
            onClick={(e) => {
              e.stopPropagation();
              if (canScrollDown) {
                setScrollOffset((prev) =>
                  Math.min(maxScrollOffset, prev + shelfHeight)
                );
              }
            }}
            disabled={!canScrollDown}
            className={`p-2 rounded ${
              !canScrollDown
                ? 'text-gray-300'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            ↓
          </button>
        </div>
      )}
    </div>
  );
}

export default BooksSection;
