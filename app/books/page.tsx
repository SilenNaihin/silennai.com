'use client';

import { useState, useEffect } from 'react';
import BooksSection from '../components/books/BooksSection';

// Hook to detect if we're on desktop (returns null until mounted)
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

export default function BooksPage() {
  const [selectedBookIndex, setSelectedBookIndex] = useState<number | null>(0);
  const isDesktop = useIsDesktop();

  // Don't render until we know the screen size to avoid flicker
  if (isDesktop === null) {
    return <main className="min-h-screen" />;
  }

  // On desktop, use wider container that can expand with screen
  const containerClass = isDesktop
    ? 'max-w-7xl mx-auto px-8 lg:px-16 py-8 min-h-screen'
    : 'max-w-2xl mx-auto px-4 md:px-8 py-8 min-h-screen';

  return (
    <main className={containerClass}>
      <BooksSection
        onSelect={(book, index) => {
          if (selectedBookIndex === index) {
            setSelectedBookIndex(null);
          } else {
            setSelectedBookIndex(index);
          }
        }}
        selectedIndex={selectedBookIndex}
      />
    </main>
  );
}
