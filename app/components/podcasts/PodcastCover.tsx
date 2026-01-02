import { useState } from 'react';
import { Podcast } from '@/app/content/data';

function PodcastCover({
  podcast,
  onClick,
  isSelected,
}: {
  podcast: Podcast;
  onClick: () => void;
  isSelected: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);

  const handleCoverClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick();
  };

  return (
    <div
      className="relative cursor-pointer"
      style={{ perspective: '1500px', height: '200px' }}
      onMouseEnter={() => !isSelected && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCoverClick}
    >
      <div
        className="relative w-48 h-48 mx-auto transition-all duration-700 ease-out"
        style={{
          transformStyle: 'preserve-3d',
        }}
      >
        {/* CD/Vinyl holder - always present underneath */}
        <div
          className="absolute left-0 top-0 w-48 h-48 bg-gray-900 rounded-lg flex items-center justify-center"
          style={{
            boxShadow: 'inset 0 0 30px rgba(0,0,0,0.5)',
            zIndex: 1,
          }}
        >
          {/* CD/Disc with donut cover */}
          <div
            className="relative w-36 h-36 rounded-full cursor-pointer"
            style={{
              background:
                'radial-gradient(circle at 40% 40%, #4a4a4a 0%, #3d3d3d 20%, #2d2d2d 50%, #1d1d1d 80%, #151515 100%)',
              boxShadow:
                '0 8px 20px rgba(0,0,0,0.5), inset 0 1px 3px rgba(255,255,255,0.15), inset 0 -1px 3px rgba(0,0,0,0.3)',
            }}
            onClick={(e) => {
              e.stopPropagation();
              window.open(podcast.url, '_blank', 'noopener noreferrer');
            }}
          >
            {/* Vinyl Grooves (behind the donut) */}
            <div className="absolute inset-0 rounded-full opacity-30">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-full border border-gray-600"
                  style={{
                    top: `${12 + i * 6}%`,
                    left: `${12 + i * 6}%`,
                    right: `${12 + i * 6}%`,
                    bottom: `${12 + i * 6}%`,
                  }}
                />
              ))}
            </div>

            {/* Donut-shaped cover image overlay */}
            {podcast.cover && (
              <div
                className="absolute inset-0 rounded-full overflow-hidden"
                style={{
                  maskImage:
                    'radial-gradient(circle at center, transparent 0%, transparent 22%, black 22%, black 100%)',
                  WebkitMaskImage:
                    'radial-gradient(circle at center, transparent 0%, transparent 22%, black 22%, black 100%)',
                }}
              >
                <img
                  src={podcast.cover}
                  alt={`${podcast.title} cover`}
                  className="w-full h-full object-cover"
                  style={{
                    filter: 'brightness(0.95) contrast(1.1)',
                  }}
                />
                {/* Shine overlay on donut */}
                <div
                  className="absolute inset-0 rounded-full pointer-events-none"
                  style={{
                    background:
                      'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 50%, rgba(255,255,255,0.1) 100%)',
                    mixBlendMode: 'overlay',
                  }}
                />
              </div>
            )}

            {/* Center label */}
            <div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full flex items-center justify-center pointer-events-none"
              style={{
                background:
                  'radial-gradient(circle at 30% 30%, #3a3a3a 0%, #2a2a2a 50%, #1a1a1a 100%)',
                boxShadow:
                  'inset 0 2px 8px rgba(0,0,0,0.6), 0 2px 4px rgba(0,0,0,0.4)',
              }}
            >
              {/* Center hole */}
              <div
                className="w-3 h-3 rounded-full"
                style={{
                  background: '#000',
                  boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.9)',
                }}
              />
            </div>

            {/* Vinyl shine effect */}
            <div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                background:
                  'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 50%, rgba(255,255,255,0.08) 100%)',
                mixBlendMode: 'overlay',
              }}
            />
          </div>
        </div>

        {/* Left Cover (opens like a book) */}
        <div
          className="absolute left-0 top-0 w-48 h-48 rounded-lg overflow-hidden shadow-xl"
          style={{
            transformStyle: 'preserve-3d',
            transformOrigin: 'left center',
            transform: isSelected
              ? 'rotateY(-140deg) scale(1.02)'
              : isHovered
              ? 'rotateY(-25deg) scale(1.01)'
              : 'rotateY(0deg) scale(1)',
            transition: 'transform 0.7s ease-out',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
            zIndex: isSelected ? 2 : isHovered ? 2 : 3,
          }}
        >
          {/* Front of left cover - Show podcast cover image */}
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              backfaceVisibility: 'hidden',
            }}
          >
            {podcast.cover ? (
              <img
                src={podcast.cover}
                alt={`${podcast.title} cover`}
                className="w-full h-full object-cover rounded-lg"
                style={{
                  boxShadow: 'inset 0 0 40px rgba(0,0,0,0.15)',
                }}
              />
            ) : (
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
            )}
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

        {/* Shine effect on hover - slower transition */}
        <div
          className="absolute inset-0 pointer-events-none rounded-lg"
          style={{
            zIndex: 4,
            opacity: isHovered && !isSelected ? 1 : 0,
            transition: 'opacity 1.2s ease-out',
            background:
              'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.15) 30%, transparent 60%)',
          }}
        />
      </div>
    </div>
  );
}

export default PodcastCover;
