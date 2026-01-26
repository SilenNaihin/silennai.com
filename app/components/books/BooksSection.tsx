import { Book } from '@/app/content/data';
import { useState, useRef, useMemo, useEffect } from 'react';
import Book3D, { PaperTextureFilter } from './Book3D';
import { books as booksData } from '@/app/content/data';
import DetailsColumn from '@/app/components/DetailsColumn';

type SortMode = 'recency' | 'rating';

// Hook to detect if we're on desktop (for side panel layout)
function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);

  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 1024);
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  return isDesktop;
}

// Hook to get responsive bookshelf dimensions
function useResponsiveBookshelf() {
  const [dimensions, setDimensions] = useState({
    booksPerShelf: 8,
    bookWidth: 50,
    bookHeight: 240,
    scale: 1,
  });

  useEffect(() => {
    function updateDimensions() {
      const width = window.innerWidth;

      if (width < 400) {
        // Very small mobile
        setDimensions({
          booksPerShelf: 4,
          bookWidth: 38,
          bookHeight: 182,
          scale: 0.76,
        });
      } else if (width < 520) {
        // Mobile
        setDimensions({
          booksPerShelf: 5,
          bookWidth: 42,
          bookHeight: 200,
          scale: 0.84,
        });
      } else if (width < 680) {
        // Large mobile / small tablet
        setDimensions({
          booksPerShelf: 6,
          bookWidth: 45,
          bookHeight: 216,
          scale: 0.9,
        });
      } else if (width < 1280) {
        // Desktop below xl - 7 books to avoid overlap with side panel
        setDimensions({
          booksPerShelf: 7,
          bookWidth: 48,
          bookHeight: 230,
          scale: 0.96,
        });
      } else {
        // Large desktop (xl+)
        setDimensions({
          booksPerShelf: 8,
          bookWidth: 50,
          bookHeight: 240,
          scale: 1,
        });
      }
    }

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  return dimensions;
}

// Helper to parse date strings like "January 2026", "2019", "April 2019" into sortable values
function parseDateForSort(dateStr: string | undefined): number {
  if (!dateStr) return 0;

  const months: Record<string, number> = {
    january: 1,
    february: 2,
    march: 3,
    april: 4,
    may: 5,
    june: 6,
    july: 7,
    august: 8,
    september: 9,
    october: 10,
    november: 11,
    december: 12,
  };

  // Handle "Month Year" format
  const parts = dateStr.toLowerCase().split(' ');
  if (parts.length === 2) {
    const month = months[parts[0]] || 1;
    const year = parseInt(parts[1], 10);
    return year * 100 + month;
  }

  // Handle just year
  const year = parseInt(dateStr, 10);
  if (!isNaN(year)) {
    return year * 100;
  }

  return 0;
}

// Helper to get numeric rating for sorting
function getRatingForSort(rating: number | string | undefined): number {
  if (rating === undefined) return -1;
  if (typeof rating === 'number') return rating;
  // Handle string ratings like "8.5 (trilogy), 7.5 (prequels), 6 (sequels)" - take first number
  const match = rating.match(/[\d.]+/);
  if (match) return parseFloat(match[0]);
  // Handle "Classic" - sort to end
  if (rating.toLowerCase() === 'classic') return -1;
  return -1;
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
  const [sortMode, setSortMode] = useState<SortMode>('recency');
  const bookRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Get responsive dimensions and desktop detection
  const { booksPerShelf, bookWidth, bookHeight, scale } = useResponsiveBookshelf();
  const isDesktop = useIsDesktop();

  // Sort books based on current mode
  const books = useMemo(() => {
    const sorted = [...booksData];
    if (sortMode === 'recency') {
      sorted.sort(
        (a, b) => parseDateForSort(b.dateRead) - parseDateForSort(a.dateRead)
      );
    } else {
      sorted.sort(
        (a, b) => getRatingForSort(b.rating) - getRatingForSort(a.rating)
      );
    }
    return sorted;
  }, [sortMode]);

  // Calculate total shelves needed
  const totalShelves = Math.ceil(books.length / booksPerShelf);

  // Clicking anywhere on the bookshelf background deselects the selected book
  // (Individual books stop propagation so clicking them doesn't trigger this)
  const handleBackgroundClick = () => {
    if (selectedIndex !== null) {
      // Toggle off by clicking the same book again
      onSelect(books[selectedIndex], selectedIndex);
    }
  };

  // Get selected book for side panel
  const selectedBook = selectedIndex !== null ? books[selectedIndex] : null;

  // Sort buttons component
  const renderSortButtons = () => (
    <div className="flex gap-1.5 -mt-8 -mb-4">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setSortMode('recency');
        }}
        className={`px-2 py-0.5 text-xs rounded transition-colors ${
          sortMode === 'recency'
            ? 'bg-gray-900 text-white'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        Recency
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setSortMode('rating');
        }}
        className={`px-2 py-0.5 text-xs rounded transition-colors ${
          sortMode === 'rating'
            ? 'bg-gray-900 text-white'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        Rating
      </button>
    </div>
  );

  // Render the bookshelf content
  const renderBookshelf = () => (
    <>
      {/* SVG filter for paper texture - rendered once */}
      <PaperTextureFilter />
      <div className="space-y-6">
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
          // Only selected book causes expansion (hovered just shifts itself left)
          const coverWidth = bookWidth * 3.2;
          const rightShiftSelected = coverWidth * 0.7;

          let shelfShift = 0;
          if (hasSelectedBook) {
            shelfShift = -rightShiftSelected / 2;
          }
          // No shelfShift for hover - hovered book shifts left, no net expansion

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
                      ref={(el) => {
                        bookRefs.current[globalIndex] = el;
                      }}
                      book={book}
                      onClick={() => onSelect(book, globalIndex)}
                      isSelected={isSelected}
                      globalIndex={globalIndex}
                      hoveredIndex={hoveredIndex}
                      selectedIndex={selectedIndex}
                      shelfStartIndex={shelfStartIndex}
                      shelfEndIndex={shelfEndIndex}
                      onHoverChange={setHoveredIndex}
                      bookWidth={bookWidth}
                      bookHeight={bookHeight}
                      scale={scale}
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
    </>
  );

  // Don't render until we know the screen size
  if (isDesktop === null) {
    return null;
  }

  // Desktop layout: side-by-side
  if (isDesktop) {
    return (
      <div
        ref={containerRef}
        className="relative"
        onClick={handleBackgroundClick}
      >
        <div className="flex gap-8 -mt-2">
          {/* Bookshelf - takes left portion */}
          <div
            className="transition-all duration-500 ease-out"
            style={{
              width: '48%',
              flexShrink: 0,
            }}
          >
            {renderSortButtons()}
            {renderBookshelf()}
          </div>

        {/* Side panel for details or ratings list - desktop only */}
        <div
          className="transition-all duration-500 ease-out -mt-8"
          style={{
            width: '52%',
            opacity: 1,
          }}
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          {selectedBook ? (
            <div className="pt-12 sticky top-8" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-baseline gap-3 mb-1">
                <h2 className="text-xl font-bold text-gray-900">
                  {selectedBook.title}
                </h2>
                {selectedBook.rating !== undefined && (
                  <span className="text-gray-500 text-base ml-auto whitespace-nowrap">
                    {selectedBook.rating}/10
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between text-gray-500 text-base mb-3">
                <span>{selectedBook.author}</span>
                <span className="whitespace-nowrap">
                  {selectedBook.dateRead}
                </span>
              </div>
              {selectedBook.reflections ? (
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {selectedBook.reflections}
                </p>
              ) : (
                <p className="text-gray-400 text-sm">No notes yet.</p>
              )}
            </div>
          ) : (
            <div className="pt-12 sticky top-8">
              <div className="space-y-2">
                {books.map((book, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelect(book, index);
                    }}
                    className="flex items-center justify-between w-full text-left hover:bg-gray-50 rounded px-2 py-1 -mx-2 transition-colors"
                  >
                    <span className="text-gray-700 text-sm truncate pr-2">
                      {book.title}
                    </span>
                    <span className="text-gray-500 text-sm whitespace-nowrap">
                      {book.rating !== undefined ? `${book.rating}/10` : '—'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        </div>
      </div>
    );
  }

  // Mobile layout: DetailsColumn below
  return (
    <div
      ref={containerRef}
      className="relative w-full -mt-6"
      onClick={handleBackgroundClick}
    >
      {renderSortButtons()}
      {renderBookshelf()}

      <DetailsColumn
        items={books}
        selectedIndex={selectedIndex}
        containerRef={containerRef}
        itemRefs={bookRefs}
        deps={[hoveredIndex]}
        sideOffsetPx={16}
        fillMode="viewport"
        zIndex={30}
        onClose={handleBackgroundClick}
        render={(book) => (
          <div className="p-6 pt-8">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-gray-900">{book.title}</h2>
              {book.rating !== undefined && (
                <span className="text-gray-600 font-medium">
                  {book.rating}/10
                </span>
              )}
              <span className="ml-auto text-gray-600">{book.dateRead}</span>
            </div>
            <p className="text-gray-600 mb-3">{book.author}</p>
            {book.reflections ? (
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {book.reflections}
              </p>
            ) : (
              <p className="text-gray-400 text-sm">No notes yet.</p>
            )}
          </div>
        )}
      />
    </div>
  );
}

export default BooksSection;
