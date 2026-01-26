'use client';

import { useState, useEffect } from 'react';
import PodcastsSection from '../components/podcasts/PodcastsSection';

// Hook to detect if we're on desktop
function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);

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

  // On desktop, use wider container
  const containerClass = isDesktop
    ? 'max-w-5xl mx-auto px-4 md:px-8 py-8 min-h-screen'
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
