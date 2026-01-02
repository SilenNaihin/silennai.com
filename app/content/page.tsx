'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { books, links, projects, Book, Podcast, Link, Project } from './data';
import BooksSection from '../components/books/BooksSection';
import PodcastsSection from '../components/podcasts/PodcastsSection';
import ProjectsSection from '../components/projects/ProjectsSection';

type Section = 'books' | 'podcasts' | 'projects' | 'links';
type SelectedItem = Book | Podcast | Link | Project | null;

const VALID_SECTIONS: Section[] = ['books', 'podcasts', 'projects', 'links'];

function getSectionFromParams(searchParams: URLSearchParams): Section {
  // Check for section as a key (e.g., ?books, ?podcasts)
  for (const section of VALID_SECTIONS) {
    if (searchParams.has(section)) {
      return section;
    }
  }
  return 'books'; // default
}

export default function Content() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [activeSection, setActiveSection] = useState<Section>(() =>
    getSectionFromParams(searchParams)
  );
  const [selectedItem, setSelectedItem] = useState<SelectedItem>(() => {
    const section = getSectionFromParams(searchParams);
    return section === 'books' ? books[0] : null;
  });
  const [selectedBookIndex, setSelectedBookIndex] = useState<number | null>(
    () => {
      const section = getSectionFromParams(searchParams);
      return section === 'books' ? 0 : null;
    }
  );
  const [selectedPodcastIndex, setSelectedPodcastIndex] = useState<
    number | null
  >(null);
  const [selectedProjectIndex, setSelectedProjectIndex] = useState<
    number | null
  >(null);

  // Update URL when section changes
  const handleSectionChange = (section: Section) => {
    setActiveSection(section);
    router.push(`?${section}`, { scroll: false });
  };

  return (
    <div className="relative">
      {/* Content Area - matches home page width */}
      <main className="max-w-2xl mx-auto px-4 md:px-8 py-8 min-h-screen relative">
        {/* Side Navigation - positioned to the left of main content */}
        <nav className="hidden md:block absolute right-full mr-4 top-0 w-24">
          <ul className="space-y-2 sticky top-32">
            <li>
              <button
                onClick={() => handleSectionChange('books')}
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
                onClick={() => handleSectionChange('podcasts')}
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
                onClick={() => handleSectionChange('projects')}
                className={`text-left w-full py-2 px-3 rounded transition-all ${
                  activeSection === 'projects'
                    ? 'font-bold bg-gray-100'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Projects
              </button>
            </li>
            <li>
              <button
                onClick={() => handleSectionChange('links')}
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
          {activeSection === 'projects' && (
            <ProjectsSection
              projects={projects}
              onSelect={(project, index) => {
                if (selectedProjectIndex === index) {
                  setSelectedItem(null);
                  setSelectedProjectIndex(null);
                } else {
                  setSelectedItem(project);
                  setSelectedProjectIndex(index);
                }
              }}
              selectedIndex={selectedProjectIndex}
            />
          )}
          {activeSection === 'links' && (
            <LinksSection onSelect={setSelectedItem} />
          )}
        </div>

        {/* Detail Section - only shown for books and links */}
        {activeSection !== 'projects' && activeSection !== 'podcasts' && (
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
        )}
      </main>
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
