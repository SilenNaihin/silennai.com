'use client';

import { useState } from 'react';
import Image from 'next/image';
import { books, podcasts, links, Book, Podcast, Link } from './data';

type Section = 'books' | 'podcasts' | 'links';
type SelectedItem = Book | Podcast | Link | null;

export default function Content() {
  const [activeSection, setActiveSection] = useState<Section>('books');
  const [selectedItem, setSelectedItem] = useState<SelectedItem>(null);

  return (
    <div className="flex max-w-7xl mx-auto px-4 md:px-8 py-8">
      {/* Side Navigation */}
      <nav className="w-32 shrink-0 mr-12">
        <ul className="sticky top-8 space-y-2">
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

      {/* Content Area */}
      <main className="flex-1 min-h-screen">
        {activeSection === 'books' && (
          <BooksSection onSelect={setSelectedItem} />
        )}
        {activeSection === 'podcasts' && (
          <PodcastsSection onSelect={setSelectedItem} />
        )}
        {activeSection === 'links' && (
          <LinksSection onSelect={setSelectedItem} />
        )}
      </main>

      {/* Detail Popup */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
          <div className="bg-white w-full max-w-4xl rounded-t-2xl shadow-2xl animate-slide-up">
            <div className="p-8 max-h-[70vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">
                    {'title' in selectedItem
                      ? selectedItem.title
                      : selectedItem.name}
                  </h2>
                  {'author' in selectedItem && (
                    <p className="text-gray-600 mb-2">{selectedItem.author}</p>
                  )}
                  {'rating' in selectedItem && selectedItem.rating && (
                    <div className="flex items-center gap-2">
                      <span className="text-yellow-500 text-xl">
                        {'★'.repeat(selectedItem.rating)}
                        {'☆'.repeat(5 - selectedItem.rating)}
                      </span>
                      <span className="text-gray-600">
                        {selectedItem.rating}/5
                      </span>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              {'reflections' in selectedItem && selectedItem.reflections && (
                <div>
                  <h3 className="font-bold mb-3">Reflections & Notes</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {selectedItem.reflections}
                  </p>
                </div>
              )}

              {'url' in selectedItem && (
                <div className="mt-4">
                  <a
                    href={selectedItem.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
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

function BooksSection({ onSelect }: { onSelect: (item: Book) => void }) {
  const booksPerRow = 5;
  const rows = 4;

  return (
    <div className="relative flex justify-center items-center">
      <div className="relative max-w-4xl max-h-[600px]">
        {/* Bookshelf Background */}
        <div className="relative">
          <Image
            src="/bookshelf.avif"
            alt="Bookshelf"
            width={1200}
            height={800}
            className="w-full h-full object-contain"
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
                  .map((book, bookIndex) => (
                    <Book3D
                      key={`${rowIndex}-${bookIndex}`}
                      book={book}
                      onClick={() => onSelect(book)}
                    />
                  ))}
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
}: {
  book: (typeof books)[0];
  onClick: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative group cursor-pointer"
      style={{ perspective: '1000px', width: '50px', height: '180px' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div
        className="relative w-full h-full transition-all duration-500 ease-out"
        style={{
          transformStyle: 'preserve-3d',
          transform: isHovered
            ? 'translateZ(30px) translateX(80px) rotateY(-70deg)'
            : 'rotateY(0deg)',
        }}
      >
        {/* Book Spine (visible by default) */}
        <div
          className="absolute top-0 left-0 flex items-center justify-center text-white text-xs font-semibold shadow-lg"
          style={{
            width: '50px',
            height: '180px',
            background: `linear-gradient(to right, ${book.spineColor}, ${book.spineColor}dd, ${book.spineColor})`,
            backgroundImage: `
              linear-gradient(to right, ${book.spineColor}, ${book.spineColor}dd, ${book.spineColor}),
              repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)
            `,
            borderRadius: '2px',
            boxShadow:
              'inset 2px 0 4px rgba(0,0,0,0.3), inset -2px 0 4px rgba(0,0,0,0.2)',
          }}
        >
          <div
            className="whitespace-nowrap text-[10px] tracking-tight"
            style={{
              writingMode: 'vertical-rl',
              transform: 'rotate(180deg)',
              maxHeight: '170px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {book.title}
          </div>
        </div>

        {/* Book Cover (visible on hover) */}
        <div
          className="absolute top-0 bg-gray-200 shadow-2xl overflow-hidden"
          style={{
            left: '50px',
            width: '160px',
            height: '180px',
            opacity: isHovered ? 1 : 0,
            transition: 'opacity 0.3s ease-out',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          }}
        >
          <div className="w-full h-full bg-linear-to-br from-gray-300 to-gray-400 flex items-center justify-center p-4">
            <div className="text-center">
              <p className="text-sm font-bold mb-2">{book.title}</p>
              <p className="text-xs text-gray-600">{book.author}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PodcastsSection({ onSelect }: { onSelect: (item: Podcast) => void }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12 p-8">
      {podcasts.map((podcast, index) => (
        <PodcastCover
          key={index}
          podcast={podcast}
          onClick={() => onSelect(podcast)}
        />
      ))}
    </div>
  );
}

function PodcastCover({
  podcast,
  onClick,
}: {
  podcast: (typeof podcasts)[0];
  onClick: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative cursor-pointer"
      style={{ perspective: '1000px' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div
        className="relative w-48 h-48 mx-auto transition-all duration-500 ease-out rounded-lg overflow-hidden shadow-xl"
        style={{
          transformStyle: 'preserve-3d',
          transform: isHovered
            ? 'rotateY(10deg) rotateX(5deg) translateZ(20px) scale(1.05)'
            : 'rotateY(0deg) rotateX(0deg) scale(1)',
          boxShadow: isHovered
            ? '0 25px 50px rgba(0,0,0,0.5)'
            : '0 10px 30px rgba(0,0,0,0.3)',
        }}
      >
        {/* Podcast Cover Art */}
        <div className="w-full h-full bg-linear-to-br from-gray-300 to-gray-500 flex items-center justify-center p-6">
          <div className="text-center">
            <p className="text-lg font-bold text-gray-800">{podcast.title}</p>
          </div>
        </div>

        {/* Shine effect on hover */}
        {isHovered && (
          <div
            className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent pointer-events-none"
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
    <div className="max-w-3xl p-8">
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
