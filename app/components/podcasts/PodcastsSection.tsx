import { useState, useEffect, useRef } from 'react';
import { Podcast } from '@/app/content/data';
import PodcastCover from './PodcastCover';
import {
  podcasts,
  guestDependentPodcasts,
  standalonePodcasts,
} from '@/app/content/data';

function PodcastsSection({
  onSelect,
  selectedIndex,
}: {
  onSelect: (item: Podcast, index: number) => void;
  selectedIndex: number | null;
}) {
  const [podcastPositions, setPodcastPositions] = useState<
    { top: number; bottom: number }[]
  >([]);
  const [isExiting, setIsExiting] = useState(false);
  const [displayedIndex, setDisplayedIndex] = useState<number | null>(null);
  const [hasAnimatedIn, setHasAnimatedIn] = useState(false);
  const podcastRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle selection changes with exit animation
  useEffect(() => {
    if (selectedIndex !== null && displayedIndex === null) {
      // First selection - animate in
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDisplayedIndex(selectedIndex);
      setIsExiting(false);
      setHasAnimatedIn(false);
      // Mark as animated after the animation completes
      const timer = setTimeout(() => setHasAnimatedIn(true), 400);
      return () => clearTimeout(timer);
    } else if (selectedIndex !== null && displayedIndex !== null) {
      // Switching between items - just update (will transition)
      setDisplayedIndex(selectedIndex);
    } else if (selectedIndex === null && displayedIndex !== null) {
      // Deselecting - trigger exit animation
      setIsExiting(true);
      const timer = setTimeout(() => {
        setDisplayedIndex(null);
        setIsExiting(false);
        setHasAnimatedIn(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [selectedIndex, displayedIndex]);

  // Update podcast positions when selection changes or on resize
  useEffect(() => {
    const updatePositions = () => {
      if (!containerRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();

      const positions = podcastRefs.current.map((ref) => {
        if (!ref) return { top: 0, bottom: 0 };
        const rect = ref.getBoundingClientRect();
        const relativeTop = rect.top - containerRect.top;
        const relativeBottom = rect.bottom - containerRect.top;
        return { top: relativeTop, bottom: relativeBottom };
      });
      setPodcastPositions(positions);
    };

    updatePositions();
    window.addEventListener('resize', updatePositions);
    return () => window.removeEventListener('resize', updatePositions);
  }, [selectedIndex]);

  const displayedPodcast =
    displayedIndex !== null ? podcasts[displayedIndex] : null;
  const displayedPosition =
    selectedIndex !== null
      ? podcastPositions[selectedIndex]
      : displayedIndex !== null
      ? podcastPositions[displayedIndex]
      : null;

  // Clicking background deselects
  const handleBackgroundClick = () => {
    if (selectedIndex !== null) {
      onSelect(podcasts[selectedIndex], selectedIndex);
    }
  };

  return (
    <div className="space-y-12">
      {/* Main record player podcasts */}
      <div
        ref={containerRef}
        className="relative"
        onClick={handleBackgroundClick}
      >
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 relative">
          {podcasts.map((podcast, index) => (
            <div
              key={index}
              ref={(el) => {
                podcastRefs.current[index] = el;
              }}
              className="relative"
              style={{
                zIndex: selectedIndex === index ? 40 : 'auto',
              }}
            >
              <PodcastCover
                podcast={podcast}
                onClick={() => onSelect(podcast, index)}
                isSelected={selectedIndex === index}
              />
            </div>
          ))}
        </div>

        {/* Rising detail panel */}
        {displayedPodcast && displayedPosition && (
          <div
            className="absolute bg-white z-30"
            style={{
              left: '-48px',
              right: '-48px',
              top: `${displayedPosition.bottom + 16}px`,
              bottom: '-100vh',
              background:
                'linear-gradient(to bottom, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.99) 32px)',
              backdropFilter: 'blur(2px)',
              maskImage:
                'linear-gradient(to bottom, transparent 0%, black 12px, black 100%)',
              WebkitMaskImage:
                'linear-gradient(to bottom, transparent 0%, black 12px, black 100%)',
              animation:
                !hasAnimatedIn && !isExiting
                  ? 'slideUp 0.4s ease-out forwards'
                  : 'none',
              transition: 'top 0.3s ease-out, opacity 0.3s ease-out',
              opacity: isExiting ? 0 : 1,
            }}
          >
            {/* Content */}
            <div className="p-6 pt-8">
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-gray-900">
                    {displayedPodcast.title}
                  </h2>
                  <span className="text-gray-600 font-medium">
                    {displayedPodcast.rating}
                  </span>
                </div>
                <a
                  href={displayedPodcast.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm whitespace-nowrap"
                  onClick={(e) => e.stopPropagation()}
                >
                  Listen →
                </a>
              </div>

              <div className="space-y-3 text-sm">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Summary</h3>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {displayedPodcast.summary}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Recommendations
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {displayedPodcast.recommendations}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Episodes Listened
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {displayedPodcast.episodes}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty state prompt */}
        {selectedIndex === null && (
          <div className="text-center text-gray-400 text-sm mt-8 relative z-10">
            Click a record to view details
          </div>
        )}
      </div>

      {/* Guest/Topic Dependent Podcasts */}
      <div className="border-t border-gray-200 pt-8">
        <h3 className="text-lg font-bold mb-4 text-gray-900">
          Guest/Topic Dependent Podcasts
        </h3>
        <div className="space-y-4">
          {guestDependentPodcasts.map((podcast, index) => (
            <div key={index} className="space-y-1">
              <h4 className="font-semibold text-gray-800">{podcast.name}</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                {podcast.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Standalone Episodes */}
      <div className="border-t border-gray-200 pt-8">
        <h3 className="text-lg font-bold mb-4 text-gray-900">
          Stand Alone Episodes
        </h3>
        <ul className="space-y-2">
          {standalonePodcasts.map((podcast, index) => (
            <li key={index}>
              {podcast.url ? (
                <a
                  href={podcast.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-700 hover:text-gray-900 hover:underline transition-all inline-flex items-center gap-2"
                >
                  <span className="text-gray-400">→</span>
                  {podcast.name}
                </a>
              ) : (
                <div className="inline-flex items-center gap-2">
                  <span className="text-gray-400">→</span>
                  <span className="text-gray-700">{podcast.name}</span>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default PodcastsSection;
