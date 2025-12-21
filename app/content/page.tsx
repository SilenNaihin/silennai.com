'use client';

import { useState, useEffect, useRef } from 'react';
import { books, podcasts, links, Book, Podcast, Link } from './data';

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

type Section = 'books' | 'podcasts' | 'links';
type SelectedItem = Book | Podcast | Link | null;

export default function Content() {
  const [activeSection, setActiveSection] = useState<Section>('books');
  const [selectedItem, setSelectedItem] = useState<SelectedItem>(books[0]);
  const [selectedBookIndex, setSelectedBookIndex] = useState<number | null>(0);
  const [selectedPodcastIndex, setSelectedPodcastIndex] = useState<
    number | null
  >(null);

  return (
    <div className="relative">
      {/* Content Area - matches home page width */}
      <main className="max-w-2xl mx-auto px-4 md:px-8 py-8 min-h-screen relative">
        {/* Side Navigation - positioned to the left of main content */}
        <nav className="hidden md:block absolute right-full mr-4 top-0 w-24">
          <ul className="space-y-2 sticky top-32">
            <li>
              <button
                onClick={() => setActiveSection('books')}
                className={`text-left w-full py-2 px-3 rounded transition-all ${
                  activeSection === 'books'
                    ? 'font-bold bg-gray-100'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Books
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveSection('podcasts')}
                className={`text-left w-full py-2 px-3 rounded transition-all ${
                  activeSection === 'podcasts'
                    ? 'font-bold bg-gray-100'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Podcasts
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveSection('links')}
                className={`text-left w-full py-2 px-3 rounded transition-all ${
                  activeSection === 'links'
                    ? 'font-bold bg-gray-100'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Links
              </button>
            </li>
          </ul>
        </nav>
        <div
          key={activeSection}
          style={{
            animation: 'fadeIn 0.2s ease-out',
          }}
        >
          {activeSection === 'books' && (
            <BooksSection
              onSelect={(book, index) => {
                if (selectedBookIndex === index) {
                  // Click on same book - deselect
                  setSelectedItem(null);
                  setSelectedBookIndex(null);
                } else {
                  // Click on different book - select
                  setSelectedItem(book);
                  setSelectedBookIndex(index);
                }
              }}
              selectedIndex={selectedBookIndex}
            />
          )}
          {activeSection === 'podcasts' && (
            <PodcastsSection
              onSelect={(podcast, index) => {
                if (selectedPodcastIndex === index) {
                  // Click on same podcast - deselect
                  setSelectedItem(null);
                  setSelectedPodcastIndex(null);
                } else {
                  // Click on different podcast - select
                  setSelectedItem(podcast);
                  setSelectedPodcastIndex(index);
                }
              }}
              selectedIndex={selectedPodcastIndex}
            />
          )}
          {activeSection === 'links' && (
            <LinksSection onSelect={setSelectedItem} />
          )}
        </div>

        {/* Detail Section - inline below content */}
        <div
          className="border-t border-gray-200 pt-6 transition-all duration-300"
          style={{
            minHeight: '200px',
            maxHeight: selectedItem ? 'none' : '200px',
          }}
        >
          {selectedItem ? (
            <div
              style={{
                animation: 'fadeIn 0.3s ease-out',
              }}
            >
              <div className="flex items-baseline gap-3 mb-2">
                <h2 className="text-xl font-bold">
                  {'title' in selectedItem
                    ? selectedItem.title
                    : selectedItem.name}
                </h2>
                {'rating' in selectedItem && selectedItem.rating && (
                  <span className="text-gray-600 text-sm">
                    {selectedItem.rating}/10
                  </span>
                )}
              </div>
              {'author' in selectedItem && (
                <p className="text-gray-600 text-sm mb-4">
                  {selectedItem.author}
                </p>
              )}

              {'reflections' in selectedItem && selectedItem.reflections && (
                <p className="text-gray-700 leading-relaxed text-sm">
                  {selectedItem.reflections}
                </p>
              )}

              {'url' in selectedItem && (
                <div className="mt-4">
                  <a
                    href={selectedItem.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Visit link →
                  </a>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400 text-sm">
              Select an item to view details
            </div>
          )}
        </div>
      </main>
    </div>
  );
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
                  className="relative h-2 rounded-sm w-full"
                  style={{
                    background: 'linear-gradient(to bottom, #d4d4d4, #a3a3a3)',
                    boxShadow:
                      '0 2px 4px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.5)',
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

/**
 * Book3D Component - Renders a 3D book with spine and cover
 *
 * Animation System:
 * - Hover: Book pulls forward slightly (translateZ) and rotates to show cover
 * - Click: Book opens fully (more translateZ, more rotation, scale up)
 * - Books to the right shift right to make space for opened/hovered books
 * - Each book has its own perspective to ensure consistent rotation across the shelf
 */
function Book3D({
  book,
  onClick,
  isSelected,
  globalIndex,
  hoveredIndex,
  selectedIndex,
  shelfStartIndex,
  shelfEndIndex,
  onHoverChange,
}: {
  book: (typeof books)[0];
  onClick: () => void;
  isSelected: boolean;
  globalIndex: number;
  hoveredIndex: number | null;
  selectedIndex: number | null;
  shelfStartIndex: number;
  shelfEndIndex: number;
  onHoverChange: (index: number | null) => void;
}) {
  // This book is hovered only if it's the hovered book AND not already selected
  const isHovered = hoveredIndex === globalIndex && !isSelected;

  // shouldShiftRightHover: Books to the right of a hovered book shift 15px
  // This includes the selected book if it's to the right of the hover
  const shouldShiftRightHover =
    hoveredIndex !== null &&
    hoveredIndex >= shelfStartIndex &&
    hoveredIndex <= shelfEndIndex &&
    globalIndex > hoveredIndex;

  // shouldShiftRightSelected: Books to the right of a selected book shift 90px
  const shouldShiftRightSelected =
    selectedIndex !== null &&
    selectedIndex >= shelfStartIndex &&
    selectedIndex <= shelfEndIndex &&
    globalIndex > selectedIndex;

  const handleClick = (e: React.MouseEvent) => {
    // Prevent click from bubbling to background (which would deselect)
    e.stopPropagation();
    // Clear hover state when clicking to prevent double-shifting
    onHoverChange(null);
    onClick();
  };

  const handleMouseEnter = () => {
    // Allow hover on any book except the selected one
    if (!isSelected) {
      onHoverChange(globalIndex);
    }
  };

  const handleMouseLeave = () => {
    // Clear hover state when mouse leaves
    onHoverChange(null);
  };

  return (
    <div
      className={`relative cursor-pointer transition-all duration-500 ${
        isSelected || isHovered ? 'z-50' : 'z-0'
      }`}
      style={{
        width: '50px',
        height: '240px',
        perspective: '2000px', // Each book has its own perspective for consistent rotation
        transformStyle: 'preserve-3d',
        // Transform logic (evaluated in order):
        // 1. Selected book + another book is hovered to its left: Shift +15px (from -10 to +5)
        // 2. Selected book (no hover interference): Come forward, rotate -45deg, scale 1.15
        // 3. Hovered book + already shifted right due to selection: Come forward at shifted position (90-5=85px)
        // 4. Hovered book (normal): Come forward, rotate -10deg, scale 1.03
        // 5. Book to right of BOTH selected AND hovered: Shift 105px (90+15)
        // 6. Book to right of selected only: Shift 90px
        // 7. Book to right of hovered only: Shift 15px
        // 8. Default: No transform
        transform:
          isSelected && shouldShiftRightHover
            ? 'translateZ(150px) translateX(5px) rotateY(-45deg) scale(1.15)'
            : isSelected
            ? 'translateZ(150px) translateX(-10px) rotateY(-45deg) scale(1.15)'
            : isHovered && shouldShiftRightSelected
            ? 'translateZ(50px) translateX(85px) rotateY(-10deg) scale(1.03)'
            : isHovered
            ? 'translateZ(50px) translateX(-5px) rotateY(-10deg) scale(1.03)'
            : shouldShiftRightSelected && shouldShiftRightHover
            ? 'translateX(105px)'
            : shouldShiftRightSelected
            ? 'translateX(90px)'
            : shouldShiftRightHover
            ? 'translateX(15px)'
            : 'translateZ(0px) scale(1)',
        transformOrigin: 'center center',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {/* Book Spine (front face) - 50px wide x 240px tall */}
      <div
        className="absolute top-0 left-0 flex items-center justify-center text-white text-xs font-semibold"
        style={{
          width: '50px',
          height: '240px',
          background: book.spineColor,
          backgroundImage: `
              linear-gradient(135deg, 
                ${book.spineColor} 0%, 
                ${book.spineColor}ee 45%, 
                ${book.spineColor}dd 50%, 
                ${book.spineColor}ee 55%, 
                ${book.spineColor} 100%
              ),
              repeating-linear-gradient(
                0deg,
                transparent,
                transparent 3px,
                rgba(0,0,0,0.05) 3px,
                rgba(0,0,0,0.05) 6px
              ),
              url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='2' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.15'/%3E%3C/svg%3E")
            `,
          borderRadius: '2px 0 0 2px',
          boxShadow:
            'inset 3px 0 6px rgba(0,0,0,0.3), inset -2px 0 4px rgba(0,0,0,0.2), inset 0 0 20px rgba(0,0,0,0.1)',
          transformStyle: 'preserve-3d',
        }}
      >
        <div
          className="whitespace-nowrap text-[14px] tracking-tight font-bold"
          style={{
            writingMode: 'vertical-rl',
            transform: 'rotate(180deg)',
            maxHeight: '230px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
          }}
        >
          {book.title}
        </div>
      </div>

      {/* Book Cover (right face) - 160px wide x 240px tall (2:3 aspect ratio)
          Positioned at left: 50px to align flush with the right edge of spine
          Recommended cover image resolution: 800x1200px or 1600x2400px for retina */}
      <div
        className="absolute top-0 overflow-hidden"
        style={{
          left: '50px',
          width: '160px',
          height: '240px',
          transform: 'rotateY(90deg)',
          transformOrigin: 'left center',
          transformStyle: 'preserve-3d',
          opacity: isHovered || isSelected ? 1 : 0,
          transition: 'opacity 0.3s ease-out',
          boxShadow: '0 15px 40px rgba(0,0,0,0.6)',
          borderRadius: '0 2px 2px 0',
        }}
      >
        {book.cover ? (
          <img
            src={book.cover}
            alt={`${book.title} cover`}
            className="w-full h-full object-cover"
            style={{
              boxShadow: 'inset 0 0 30px rgba(0,0,0,0.2)',
            }}
          />
        ) : (
          <div
            className="w-full h-full bg-linear-to-br from-gray-300 to-gray-400 flex items-center justify-center p-4"
            style={{
              backgroundImage: `
                  linear-gradient(to bottom right, #d1d5db, #9ca3af),
                  url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='3' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.25'/%3E%3C/svg%3E")
                `,
              boxShadow: 'inset 0 0 30px rgba(0,0,0,0.2)',
            }}
          >
            <div className="text-center">
              <p className="text-sm font-bold mb-2 text-gray-800">
                {book.title}
              </p>
              <p className="text-xs text-gray-600">{book.author}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function PodcastsSection({
  onSelect,
  selectedIndex,
}: {
  onSelect: (item: Podcast, index: number) => void;
  selectedIndex: number | null;
}) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
      {podcasts.map((podcast, index) => (
        <PodcastCover
          key={index}
          podcast={podcast}
          onClick={() => onSelect(podcast, index)}
          isSelected={selectedIndex === index}
        />
      ))}
    </div>
  );
}

function PodcastCover({
  podcast,
  onClick,
  isSelected,
}: {
  podcast: (typeof podcasts)[0];
  onClick: () => void;
  isSelected: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative cursor-pointer"
      style={{ perspective: '1500px', height: '200px' }}
      onMouseEnter={() => !isSelected && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div
        className="relative w-48 h-48 mx-auto transition-all duration-700 ease-out"
        style={{
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Left Cover (opens like a book) */}
        <div
          className="absolute left-0 top-0 w-48 h-48 rounded-lg overflow-hidden shadow-xl"
          style={{
            transformStyle: 'preserve-3d',
            transformOrigin: 'left center',
            transform: isSelected
              ? 'rotateY(-140deg)'
              : isHovered
              ? 'rotateY(-10deg)'
              : 'rotateY(0deg)',
            transition: 'transform 0.7s ease-out',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
            zIndex: isSelected ? 2 : 1,
          }}
        >
          {/* Front of left cover */}
          <div
            className="absolute inset-0 bg-linear-to-br from-gray-300 to-gray-500 flex items-center justify-center p-6"
            style={{
              backgroundImage: `
                linear-gradient(to bottom right, #d1d5db, #6b7280),
                repeating-linear-gradient(
                  45deg,
                  transparent,
                  transparent 10px,
                  rgba(255,255,255,0.03) 10px,
                  rgba(255,255,255,0.03) 20px
                ),
                url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='4' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.2'/%3E%3C/svg%3E")
              `,
              boxShadow: 'inset 0 0 40px rgba(0,0,0,0.15)',
              backfaceVisibility: 'hidden',
            }}
          >
            <div className="text-center relative z-10">
              <p className="text-lg font-bold text-gray-800 drop-shadow-sm">
                {podcast.title}
              </p>
            </div>
          </div>

          {/* Inside left of cover */}
          <div
            className="absolute inset-0 bg-black flex items-center justify-center p-4"
            style={{
              transform: 'rotateY(180deg)',
              backfaceVisibility: 'hidden',
            }}
          >
            <div
              className="w-full h-full bg-linear-to-br from-gray-700 to-gray-900 rounded flex items-center justify-center"
              style={{
                backgroundImage: `
                  linear-gradient(to bottom right, #374151, #111827),
                  url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='4' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.1'/%3E%3C/svg%3E")
                `,
              }}
            >
              <p className="text-xs text-gray-400 text-center px-2">
                {podcast.title}
              </p>
            </div>
          </div>
        </div>

        {/* Right side - CD/Disc holder */}
        {isSelected && (
          <div
            className="absolute left-0 top-0 w-48 h-48 bg-gray-900 rounded-lg flex items-center justify-center"
            style={{
              boxShadow: 'inset 0 0 30px rgba(0,0,0,0.5)',
              zIndex: 1,
            }}
          >
            {/* CD/Disc */}
            <div
              className="relative w-36 h-36 rounded-full"
              style={{
                background:
                  'radial-gradient(circle at 50% 50%, #e5e7eb 0%, #d1d5db 30%, #9ca3af 60%, #6b7280 100%)',
                boxShadow:
                  '0 8px 20px rgba(0,0,0,0.4), inset 0 0 20px rgba(255,255,255,0.3)',
              }}
            >
              {/* CD Grooves */}
              <div className="absolute inset-0 rounded-full opacity-40">
                {Array.from({ length: 15 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute rounded-full border border-gray-400"
                    style={{
                      top: `${10 + i * 5}%`,
                      left: `${10 + i * 5}%`,
                      right: `${10 + i * 5}%`,
                      bottom: `${10 + i * 5}%`,
                    }}
                  />
                ))}
              </div>

              {/* Center hole */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gray-800 shadow-inner" />

              {/* Shine effect */}
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 50%, rgba(255,255,255,0.2) 100%)',
                  mixBlendMode: 'overlay',
                }}
              />
            </div>
          </div>
        )}

        {/* Vinyl texture overlay */}
        {!isSelected && (
          <div
            className="absolute inset-0 pointer-events-none rounded-lg"
            style={{
              backgroundImage: `
                radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3) 0%, transparent 50%)
              `,
              mixBlendMode: 'overlay',
            }}
          />
        )}

        {/* Shine effect on hover */}
        {isHovered && !isSelected && (
          <div
            className="absolute inset-0 bg-linear-to-br from-white/30 to-transparent pointer-events-none rounded-lg"
            style={{
              transform: 'translateZ(1px)',
            }}
          />
        )}
      </div>
    </div>
  );
}

function LinksSection({ onSelect }: { onSelect: (item: Link) => void }) {
  // Group links by category
  const groupedLinks = links.reduce((acc, link) => {
    if (!acc[link.category]) {
      acc[link.category] = [];
    }
    acc[link.category].push(link);
    return acc;
  }, {} as Record<string, typeof links>);

  return (
    <div>
      {Object.entries(groupedLinks).map(([category, categoryLinks]) => (
        <div key={category} className="mb-8">
          <h3 className="font-bold mb-4 text-lg">{category}</h3>
          <ul className="space-y-2">
            {categoryLinks.map((link, index) => (
              <li key={index}>
                <button
                  onClick={() => onSelect(link)}
                  className="text-gray-700 hover:text-gray-900 hover:underline transition-all inline-flex items-center gap-2 text-left"
                >
                  <span className="text-gray-400">→</span>
                  {link.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
