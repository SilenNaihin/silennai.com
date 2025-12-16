'use client';

import { useState } from 'react';
import Image from 'next/image';
import { books, podcasts, links, Book, Podcast, Link } from './data';

type Section = 'books' | 'podcasts' | 'links';
type SelectedItem = Book | Podcast | Link | null;

export default function Content() {
  const [activeSection, setActiveSection] = useState<Section>('books');
  const [selectedItem, setSelectedItem] = useState<SelectedItem>(null);
  const [selectedBookIndex, setSelectedBookIndex] = useState<number | null>(
    null
  );
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
                setSelectedItem(book);
                setSelectedBookIndex(index);
              }}
              selectedIndex={selectedBookIndex}
            />
          )}
          {activeSection === 'podcasts' && (
            <PodcastsSection
              onSelect={(podcast, index) => {
                setSelectedItem(podcast);
                setSelectedPodcastIndex(index);
              }}
              selectedIndex={selectedPodcastIndex}
            />
          )}
          {activeSection === 'links' && (
            <LinksSection onSelect={setSelectedItem} />
          )}
        </div>
      </main>

      {/* Detail Popup - fades in at bottom with gradient edges */}
      {selectedItem && (
        <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pointer-events-none">
          <div
            className="w-full max-w-2xl pointer-events-auto"
            style={{
              animation: 'fadeSlideUp 0.3s ease-out forwards',
            }}
          >
            {/* Gradient fade at top */}
            <div
              className="h-16"
              style={{
                background:
                  'linear-gradient(to bottom, transparent 0%, white 100%)',
              }}
            />

            {/* Content */}
            <div className="bg-white px-8 pb-8">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-baseline gap-3 mb-1">
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
                    <p className="text-gray-600 text-sm mb-2">
                      {selectedItem.author}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => {
                    setSelectedItem(null);
                    setSelectedBookIndex(null);
                    setSelectedPodcastIndex(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 text-xl ml-4"
                >
                  ×
                </button>
              </div>

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
          </div>
        </div>
      )}
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
  const booksPerRow = 5;
  const rows = 4;

  return (
    <div className="relative w-full">
      <div className="relative w-full">
        {/* Bookshelf Background */}
        <div className="relative">
          <Image
            src="/bookshelf.avif"
            alt="Bookshelf"
            width={1200}
            height={800}
            className="w-full h-auto"
            priority
          />

          {/* Books Grid Overlay */}
          <div className="absolute inset-0 grid grid-rows-4 gap-y-2 p-8">
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <div
                key={rowIndex}
                className="flex justify-start gap-4 items-end px-6"
              >
                {books
                  .slice(rowIndex * booksPerRow, (rowIndex + 1) * booksPerRow)
                  .map((book, bookIndex) => {
                    const globalIndex = rowIndex * booksPerRow + bookIndex;
                    const isSelected = selectedIndex === globalIndex;
                    const isInSameRow =
                      selectedIndex !== null &&
                      Math.floor(selectedIndex / booksPerRow) === rowIndex;
                    const selectedPositionInRow =
                      selectedIndex !== null ? selectedIndex % booksPerRow : -1;

                    // Calculate offset for books in the same row
                    let offset = 0;
                    if (isInSameRow && !isSelected) {
                      if (bookIndex < selectedPositionInRow) {
                        offset = -30; // Move left
                      } else if (bookIndex > selectedPositionInRow) {
                        offset = 30; // Move right
                      }
                    }

                    return (
                      <Book3D
                        key={`${rowIndex}-${bookIndex}`}
                        book={book}
                        onClick={() => onSelect(book, globalIndex)}
                        isSelected={isSelected}
                        offset={offset}
                      />
                    );
                  })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Book3D({
  book,
  onClick,
  isSelected,
  offset,
}: {
  book: (typeof books)[0];
  onClick: () => void;
  isSelected: boolean;
  offset: number;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative group cursor-pointer transition-all duration-500"
      style={{
        perspective: '2000px',
        width: '50px',
        height: '180px',
        transform: `translateX(${offset}px)`,
      }}
      onMouseEnter={() => !isSelected && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div
        className="relative transition-all duration-500 ease-out"
        style={{
          transformStyle: 'preserve-3d',
          width: '50px',
          height: '180px',
          transformOrigin: 'left center',
          transform:
            isHovered || isSelected
              ? 'rotateY(-35deg) translateZ(20px)'
              : 'rotateY(0deg)',
        }}
      >
        {/* Book Spine (front face) */}
        <div
          className="absolute top-0 left-0 flex items-center justify-center text-white text-xs font-semibold"
          style={{
            width: '50px',
            height: '180px',
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
            className="whitespace-nowrap text-[10px] tracking-tight font-bold"
            style={{
              writingMode: 'vertical-rl',
              transform: 'rotate(180deg)',
              maxHeight: '170px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
            }}
          >
            {book.title}
          </div>
        </div>

        {/* Book Cover (right face) */}
        <div
          className="absolute top-0 left-0 overflow-hidden"
          style={{
            width: '160px',
            height: '180px',
            transform: 'rotateY(90deg) translateZ(25px)',
            transformOrigin: 'left center',
            transformStyle: 'preserve-3d',
            opacity: isHovered || isSelected ? 1 : 0,
            transition: 'opacity 0.3s ease-out',
            boxShadow: '0 15px 40px rgba(0,0,0,0.6)',
            borderRadius: '0 2px 2px 0',
          }}
        >
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
        </div>

        {/* Book Top Edge */}
        <div
          className="absolute top-0 left-0"
          style={{
            width: '50px',
            height: '30px',
            background: `linear-gradient(to bottom, ${book.spineColor}dd, ${book.spineColor}88)`,
            transform: 'rotateX(90deg) translateZ(0px)',
            transformOrigin: 'top center',
            transformStyle: 'preserve-3d',
          }}
        />

        {/* Book Bottom Edge */}
        <div
          className="absolute bottom-0 left-0"
          style={{
            width: '50px',
            height: '30px',
            background: `linear-gradient(to top, ${book.spineColor}cc, ${book.spineColor}66)`,
            transform: 'rotateX(-90deg) translateZ(0px)',
            transformOrigin: 'bottom center',
            transformStyle: 'preserve-3d',
          }}
        />
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
        {/* Podcast Cover Art */}
        <div
          className="w-full h-full bg-linear-to-br from-gray-300 to-gray-500 flex items-center justify-center p-6"
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
          }}
        >
          <div className="text-center relative z-10">
            <p className="text-lg font-bold text-gray-800 drop-shadow-sm">
              {podcast.title}
            </p>
          </div>
        </div>

        {/* Vinyl texture overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3) 0%, transparent 50%)
            `,
            mixBlendMode: 'overlay',
          }}
        />

        {/* Shine effect on hover */}
        {isHovered && (
          <div
            className="absolute inset-0 bg-linear-to-br from-white/30 to-transparent pointer-events-none"
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
