'use client';

import { useState, useEffect } from 'react';
import PodcastsSection from '../components/podcasts/PodcastsSection';

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

export default function PodcastsPage() {
  const [selectedPodcastIndex, setSelectedPodcastIndex] = useState<number | null>(0);
  const isDesktop = useIsDesktop();

  // Don't render until we know the screen size to avoid flicker
  if (isDesktop === null) {
    return <main className="min-h-screen" />;
  }

  // On desktop, use wider container that can expand with screen
  const containerClass = isDesktop
    ? 'max-w-7xl mx-auto px-8 lg:px-16 py-8 min-h-screen'
    : 'max-w-3xl mx-auto px-4 md:px-8 py-8 min-h-screen';

  return (
    <main className={containerClass}>
      <PodcastsSection
        onSelect={(podcast, index) => {
          if (selectedPodcastIndex === index) {
            setSelectedPodcastIndex(null);
          } else {
            setSelectedPodcastIndex(index);
          }
        }}
        selectedIndex={selectedPodcastIndex}
      />
    </main>
  );
}
