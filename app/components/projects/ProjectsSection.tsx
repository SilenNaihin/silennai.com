import { useState, useEffect, useRef } from 'react';
import { Project } from '@/app/content/data';
import Polaroid from './Polariod';

/**
 * Projects Section - Polaroid Photo Wall
 *
 * Each project appears as a polaroid photo pinned to a corkboard.
 * - True random rotations on each page load
 * - Hover lifts the photo and straightens it
 * - Click selects and brings it forward with a glow
 * - Detail panel rises from bottom to below selected Polaroid
 */
function ProjectsSection({
  onSelect,
  selectedIndex,
  projects,
}: {
  onSelect: (item: Project, index: number) => void;
  selectedIndex: number | null;
  projects: Project[];
}) {
  // Generate truly random rotations on mount (client-side only)
  const [rotations, setRotations] = useState<number[]>([]);
  const [polaroidPositions, setPolaroidPositions] = useState<
    { top: number; bottom: number }[]
  >([]);
  const [isExiting, setIsExiting] = useState(false);
  const [displayedIndex, setDisplayedIndex] = useState<number | null>(null);
  const [hasAnimatedIn, setHasAnimatedIn] = useState(false);
  const polaroidRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Generate random rotations for each project on mount
    const newRotations = projects.map(() => {
      return Math.random() * 30 - 15; // Range: -15 to +15 degrees
    });
    setRotations(newRotations);
  }, []);

  // Handle selection changes with exit animation
  useEffect(() => {
    if (selectedIndex !== null && displayedIndex === null) {
      // First selection - animate in
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

  // Update polaroid positions when selection changes or on resize
  useEffect(() => {
    const updatePositions = () => {
      if (!containerRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();

      const positions = polaroidRefs.current.map((ref) => {
        if (!ref) return { top: 0, bottom: 0 };
        const rect = ref.getBoundingClientRect();
        // Calculate position relative to container
        const relativeTop = rect.top - containerRect.top;
        const relativeBottom = rect.bottom - containerRect.top;
        return { top: relativeTop, bottom: relativeBottom };
      });
      setPolaroidPositions(positions);
    };

    updatePositions();
    window.addEventListener('resize', updatePositions);
    return () => window.removeEventListener('resize', updatePositions);
  }, [selectedIndex, rotations]);

  const displayedProject =
    displayedIndex !== null ? projects[displayedIndex] : null;
  // Use selectedIndex for position so transitions work between selections
  // Fall back to displayedIndex position during exit animation
  const displayedPosition =
    selectedIndex !== null
      ? polaroidPositions[selectedIndex]
      : displayedIndex !== null
      ? polaroidPositions[displayedIndex]
      : null;

  return (
    <div
      ref={containerRef}
      className="relative py-8 px-4 -mx-4"
      style={{
        // Corkboard texture background
        backgroundColor: '#c4956a',
        backgroundImage: `
            url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.4'/%3E%3C/svg%3E"),
            radial-gradient(ellipse at 20% 30%, rgba(255,255,255,0.1) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 70%, rgba(0,0,0,0.1) 0%, transparent 50%)
          `,
        boxShadow:
          'inset 0 2px 10px rgba(0,0,0,0.3), inset 0 -2px 10px rgba(0,0,0,0.2)',
        borderRadius: '4px',
        paddingBottom: '32px',
        overflow: 'visible', // Allow panel to extend beyond container
      }}
    >
      {/* Wood frame effect */}
      <div
        className="absolute inset-0 pointer-events-none rounded"
        style={{
          border: '8px solid #654321',
          borderImage:
            'linear-gradient(135deg, #8B4513 0%, #654321 50%, #3d2914 100%) 1',
          boxShadow: 'inset 0 0 20px rgba(0,0,0,0.3)',
          zIndex: 0,
        }}
      />

      {/* Polaroid grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-8 relative justify-items-center">
        {projects.map((project, index) => (
          <div
            key={index}
            ref={(el) => {
              polaroidRefs.current[index] = el;
            }}
            className="relative"
            style={{
              zIndex: selectedIndex === index ? 40 : 'auto',
            }}
          >
            <Polaroid
              project={project}
              rotation={rotations[index] ?? 0}
              onClick={() => onSelect(project, index)}
              isSelected={selectedIndex === index}
            />
          </div>
        ))}
      </div>

      {/* Rising detail panel - covers everything below the selected Polaroid */}
      {displayedProject && displayedPosition && (
        <div
          className="absolute bg-white z-30"
          style={{
            left: '-16px',
            right: '-16px',
            top: `${displayedPosition.bottom + 16}px`, // 16px gap below the Polaroid
            minHeight: `calc(100% - ${displayedPosition.bottom + 16}px)`, // At least cover to container bottom
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
          <div className="p-6 pt-4">
            <div className="flex items-baseline gap-3 mb-2">
              <h2 className="text-xl font-bold text-gray-900">
                {displayedProject.title}
              </h2>
            </div>

            <p className="text-gray-600 text-sm mb-3">
              {displayedProject.description}
            </p>

            {displayedProject.tags && (
              <div className="flex flex-wrap gap-2 mb-3">
                {displayedProject.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {displayedProject.reflections && (
              <p className="text-gray-700 leading-relaxed text-sm mb-3">
                {displayedProject.reflections}
              </p>
            )}

            {displayedProject.url && (
              <a
                href={displayedProject.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline text-sm inline-flex items-center gap-1"
              >
                View project →
              </a>
            )}
          </div>
        </div>
      )}

      {/* Empty state prompt */}
      {selectedIndex === null && (
        <div className="text-center text-white/70 font-bold mt-8 relative z-10">
          Click a photo to view project details
        </div>
      )}
    </div>
  );
}

export default ProjectsSection;
