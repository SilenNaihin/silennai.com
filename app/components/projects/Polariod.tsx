import { useState } from 'react';
import { Project } from '@/app/content/data';

/**
 * Polaroid Component
 *
 * A realistic polaroid photo with:
 * - White frame (thicker at bottom for caption)
 * - Slight shadow and depth
 * - Pushpin attachment
 * - Hover/select animations
 */
function Polaroid({
  project,
  rotation,
  onClick,
  isSelected,
}: {
  project: Project;
  rotation: number;
  onClick: () => void;
  isSelected: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative cursor-pointer"
      style={{
        perspective: '1000px',
        zIndex: isSelected ? 50 : isHovered ? 40 : 1,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Pushpin */}
      <div
        className="absolute -top-2 left-1/2 -translate-x-1/2 z-20"
        style={{
          width: '16px',
          height: '16px',
          borderRadius: '50%',
          background:
            'radial-gradient(circle at 30% 30%, #ff6b6b 0%, #c92a2a 60%, #8b0000 100%)',
          boxShadow:
            '0 2px 4px rgba(0,0,0,0.4), inset 0 -2px 4px rgba(0,0,0,0.3), 0 4px 8px rgba(0,0,0,0.2)',
        }}
      />

      {/* Polaroid frame */}
      <div
        className="relative transition-all duration-500 ease-out"
        style={{
          width: '180px',
          transformStyle: 'preserve-3d',
          transform: isSelected
            ? `rotate(0deg) scale(1.1) translateY(-10px) translateZ(50px)`
            : isHovered
            ? `rotate(${
                rotation * 0.3
              }deg) scale(1.05) translateY(-5px) translateZ(20px)`
            : `rotate(${rotation}deg) translateZ(0px)`,
          filter: isSelected
            ? 'drop-shadow(0 20px 40px rgba(0,0,0,0.4))'
            : isHovered
            ? 'drop-shadow(0 15px 30px rgba(0,0,0,0.3))'
            : 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
        }}
      >
        {/* White polaroid background */}
        <div
          className="relative bg-white p-3 pb-12"
          style={{
            boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.1)',
            background: `
                linear-gradient(135deg, #fefefe 0%, #f5f5f5 100%),
                url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paper'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.04' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23paper)' opacity='0.03'/%3E%3C/svg%3E")
              `,
          }}
        >
          {/* Photo area */}
          <div
            className="relative overflow-hidden bg-gray-200"
            style={{
              width: '154px',
              height: '154px',
              boxShadow: 'inset 0 0 10px rgba(0,0,0,0.1)',
            }}
          >
            {project.image ? (
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover"
                style={{
                  filter: 'saturate(1.1) contrast(1.05)',
                }}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                <span className="text-gray-500 text-sm">{project.title}</span>
              </div>
            )}

            {/* Vintage photo overlay */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `
                    linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(0,0,0,0.05) 100%),
                    radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.15) 100%)
                  `,
              }}
            />
          </div>

          {/* Caption area */}
          <div
            className="absolute bottom-3 left-3 right-3 text-center"
            style={{
              fontFamily:
                '"Permanent Marker", "Marker Felt", cursive, sans-serif',
            }}
          >
            <p
              className="text-gray-700 text-sm truncate"
              style={{
                textShadow: '0 0 1px rgba(0,0,0,0.1)',
              }}
            >
              {project.title}
            </p>
          </div>
        </div>

        {/* Selection glow */}
        {isSelected && (
          <div
            className="absolute inset-0 pointer-events-none rounded-sm"
            style={{
              boxShadow:
                '0 0 30px rgba(59, 130, 246, 0.5), 0 0 60px rgba(59, 130, 246, 0.3)',
              animation: 'pulse 2s ease-in-out infinite',
            }}
          />
        )}
      </div>
    </div>
  );
}

export default Polaroid;
