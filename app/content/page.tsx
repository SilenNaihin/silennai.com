'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { links, projects } from './data';
import BooksSection from '../components/books/BooksSection';
import PodcastsSection from '../components/podcasts/PodcastsSection';
import ProjectsSection from '../components/projects/ProjectsSection';
import LinksSection from '../components/links/LinksSection';

type Section = 'books' | 'podcasts' | 'projects' | 'links';

const VALID_SECTIONS: Section[] = ['books', 'podcasts']; //, 'projects', 'links'];

function getSectionFromParams(searchParams: URLSearchParams): Section {
  // Check for section as a key (e.g., ?books, ?podcasts)
  for (const section of VALID_SECTIONS) {
    if (searchParams.has(section)) {
      return section;
    }
  }
  return 'books'; // default
}

function ContentInner() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [activeSection, setActiveSection] = useState<Section>(() =>
    getSectionFromParams(searchParams)
  );
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
  const [selectedLinkIndex, setSelectedLinkIndex] = useState<number | null>(
    null
  );

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
            {VALID_SECTIONS.includes('projects') && (
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
            )}
            {VALID_SECTIONS.includes('links') && (
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
            )}
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
                  setSelectedBookIndex(null);
                } else {
                  // Click on different book - select
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
                  setSelectedPodcastIndex(null);
                } else {
                  // Click on different podcast - select
                  setSelectedPodcastIndex(index);
                }
              }}
              selectedIndex={selectedPodcastIndex}
            />
          )}
          {activeSection === 'projects' &&
            VALID_SECTIONS.includes('projects') && (
              <ProjectsSection
                projects={projects}
                onSelect={(project, index) => {
                  if (selectedProjectIndex === index) {
                    setSelectedProjectIndex(null);
                  } else {
                    setSelectedProjectIndex(index);
                  }
                }}
                selectedIndex={selectedProjectIndex}
              />
            )}
          {activeSection === 'links' && VALID_SECTIONS.includes('links') && (
            <LinksSection
              links={links}
              selectedIndex={selectedLinkIndex}
              onSelect={(link, index) => {
                if (selectedLinkIndex === index) {
                  setSelectedLinkIndex(null);
                } else {
                  setSelectedLinkIndex(index);
                }
              }}
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default function Content() {
  return (
    <Suspense fallback={<div className="max-w-2xl mx-auto px-4 md:px-8 py-8 min-h-screen" />}>
      <ContentInner />
    </Suspense>
  );
}
