'use client';

import { useState } from 'react';
import PodcastsSection from '../components/podcasts/PodcastsSection';

export default function PodcastsPage() {
  const [selectedPodcastIndex, setSelectedPodcastIndex] = useState<number | null>(null);

  return (
    <main className="max-w-2xl mx-auto px-4 md:px-8 py-8 min-h-screen">
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
