import { Book } from '@/app/content/data';
import { useState, useRef, useMemo } from 'react';
import Book3D from './Book3D';
import { books as booksData } from '@/app/content/data';
import DetailsColumn from '@/app/components/DetailsColumn';

type SortMode = 'recency' | 'rating';

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

  // Sort books based on current mode
  const books = useMemo(() => {
    const sorted = [...booksData];
    if (sortMode === 'recency') {
      sorted.sort((a, b) => parseDateForSort(b.dateRead) - parseDateForSort(a.dateRead));
    } else {
      sorted.sort((a, b) => getRatingForSort(b.rating) - getRatingForSort(a.rating));
    }
    return sorted;
  }, [sortMode]);

  // Calculate books per shelf to fit within content width
  const booksPerShelf = 8;

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

  return (
    <div
      ref={containerRef}
      className="relative w-full -mt-6"
      onClick={handleBackgroundClick}
    >
      {/* Sort buttons */}
      <div className="flex justify-end gap-2 mb-4 pt-2 pr-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setSortMode('recency');
          }}
          className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
            sortMode === 'recency'
              ? 'bg-gray-900 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          By Recency
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setSortMode('rating');
          }}
          className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
            sortMode === 'rating'
              ? 'bg-gray-900 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          By Rating
        </button>
      </div>
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

      <DetailsColumn
        items={books}
        selectedIndex={selectedIndex}
        containerRef={containerRef}
        itemRefs={bookRefs}
        deps={[hoveredIndex]}
        sideOffsetPx={16}
        fillMode="viewport"
        zIndex={30}
        render={(book) => (
          <div className="p-6 pt-6">
            <div className="flex items-baseline gap-3 mb-2">
              <h2 className="text-xl font-bold text-gray-900">{book.title}</h2>
              {book.rating !== undefined && (
                <span className="text-gray-600 text-sm">{book.rating}</span>
              )}
            </div>
            <p className="text-gray-600 text-sm mb-4">{book.author}</p>
            {book.reflections ? (
              <p className="text-gray-700 leading-relaxed text-sm whitespace-pre-line">
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
