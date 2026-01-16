import { useRef } from 'react';
import { Podcast } from '@/app/content/data';
import PodcastCover from './PodcastCover';
import DetailsColumn from '@/app/components/DetailsColumn';
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
  const podcastRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 relative">
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

        <DetailsColumn
          items={podcasts}
          selectedIndex={selectedIndex}
          containerRef={containerRef}
          itemRefs={podcastRefs}
          sideOffsetPx={16}
          fillMode="viewport"
          zIndex={30}
          onClose={handleBackgroundClick}
          render={(podcast) => (
            <div className="p-6 pt-8">
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-gray-900">
                    {podcast.title}
                  </h2>
                  <span className="text-gray-600 font-medium">
                    {podcast.rating}
                  </span>
                </div>
                <a
                  href={podcast.url}
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
                    {podcast.summary}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Recommendations
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {podcast.recommendations}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Episodes Listened
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {podcast.episodes}
                  </p>
                </div>
              </div>
            </div>
          )}
        />

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
