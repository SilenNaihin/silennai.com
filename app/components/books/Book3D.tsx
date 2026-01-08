import { Book } from '@/app/content/data';
import { forwardRef } from 'react';

// Helper to determine if spine text should be dark based on background color luminance
function shouldUseDarkText(hexColor: string): boolean {
  // Remove # if present
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  // Calculate relative luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.7; // Light backgrounds need dark text
}

/**
 * Book3D Component - Renders a 3D book with spine and cover
 *
 * Animation System:
 * - Hover: Book pulls forward slightly (translateZ) and rotates to show cover
 * - Click: Book opens fully (more translateZ, more rotation, scale up)
 * - Books to the right shift right to make space for opened/hovered books
 * - Each book has its own perspective to ensure consistent rotation across the shelf
 */
const Book3D = forwardRef<
  HTMLDivElement,
  {
    book: Book;
    onClick: () => void;
    isSelected: boolean;
    globalIndex: number;
    hoveredIndex: number | null;
    selectedIndex: number | null;
    shelfStartIndex: number;
    shelfEndIndex: number;
    onHoverChange: (index: number | null) => void;
  }
>(function Book3D(
  {
    book,
    onClick,
    isSelected,
    globalIndex,
    hoveredIndex,
    selectedIndex,
    shelfStartIndex,
    shelfEndIndex,
    onHoverChange,
  },
  ref
) {
  // This book is hovered only if it's the hovered book AND not already selected
  const isHovered = hoveredIndex === globalIndex && !isSelected;

  // shouldShiftRightHover: Books to the right of a hovered book shift 15px
  // This includes the selected book if it's to the right of the hover
  const shouldShiftRightHover =
    hoveredIndex !== null &&
    hoveredIndex >= shelfStartIndex &&
    hoveredIndex <= shelfEndIndex &&
    globalIndex > hoveredIndex;

  // shouldShiftRightSelected: Books to the right of a selected book shift 90px
  const shouldShiftRightSelected =
    selectedIndex !== null &&
    selectedIndex >= shelfStartIndex &&
    selectedIndex <= shelfEndIndex &&
    globalIndex > selectedIndex;

  const handleClick = (e: React.MouseEvent) => {
    // Prevent click from bubbling to background (which would deselect)
    e.stopPropagation();
    // Clear hover state when clicking to prevent double-shifting
    onHoverChange(null);
    onClick();
  };

  const handleMouseEnter = () => {
    // Allow hover on any book except the selected one
    if (!isSelected) {
      onHoverChange(globalIndex);
    }
  };

  const handleMouseLeave = () => {
    // Clear hover state when mouse leaves
    onHoverChange(null);
  };

  return (
    <div
      ref={ref}
      className={`relative cursor-pointer transition-all duration-500 ${
        isSelected || isHovered ? 'z-50' : 'z-0'
      }`}
      style={{
        width: '50px',
        height: '240px',
        perspective: '2000px', // Each book has its own perspective for consistent rotation
        transformStyle: 'preserve-3d',
        // Transform logic (evaluated in order):
        // 1. Selected book + another book is hovered to its left: Shift +15px (from -10 to +5)
        // 2. Selected book (no hover interference): Come forward, rotate -45deg, scale 1.15
        // 3. Hovered book + already shifted right due to selection: Come forward at shifted position (90-5=85px)
        // 4. Hovered book (normal): Come forward, rotate -10deg, scale 1.03
        // 5. Book to right of BOTH selected AND hovered: Shift 105px (90+15)
        // 6. Book to right of selected only: Shift 90px
        // 7. Book to right of hovered only: Shift 15px
        // 8. Default: No transform
        transform:
          isSelected && shouldShiftRightHover
            ? 'translateZ(150px) translateX(5px) rotateY(-45deg) scale(1.15)'
            : isSelected
            ? 'translateZ(150px) translateX(-10px) rotateY(-45deg) scale(1.15)'
            : isHovered && shouldShiftRightSelected
            ? 'translateZ(50px) translateX(85px) rotateY(-10deg) scale(1.03)'
            : isHovered
            ? 'translateZ(50px) translateX(-5px) rotateY(-10deg) scale(1.03)'
            : shouldShiftRightSelected && shouldShiftRightHover
            ? 'translateX(105px)'
            : shouldShiftRightSelected
            ? 'translateX(90px)'
            : shouldShiftRightHover
            ? 'translateX(15px)'
            : 'translateZ(0px) scale(1)',
        transformOrigin: 'center center',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {/* Book Spine (front face) - 50px wide x 240px tall */}
      <div
        className={`absolute top-0 left-0 flex items-center justify-center text-xs font-semibold ${shouldUseDarkText(book.spineColor) ? 'text-gray-900' : 'text-white'}`}
        style={{
          width: '50px',
          height: '240px',
          background: book.spineColor,
          backgroundImage: `
                url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='grain'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.3' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23grain)' opacity='0.4'/%3E%3C/svg%3E")
              `,
          backgroundBlendMode: 'hard-light',
          borderRadius: '2px 0 0 2px',
          transformStyle: 'preserve-3d',
          border: shouldUseDarkText(book.spineColor) ? '1px solid rgba(0,0,0,0.15)' : 'none',
          boxShadow: shouldUseDarkText(book.spineColor) ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
        }}
      >
        <div
          className="whitespace-nowrap text-[14px] tracking-tight font-bold"
          style={{
            writingMode: 'vertical-rl',
            transform: 'rotate(180deg)',
            maxHeight: '230px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            textShadow: shouldUseDarkText(book.spineColor)
              ? '1px 1px 2px rgba(255,255,255,0.5)'
              : '1px 1px 2px rgba(0,0,0,0.5)',
          }}
        >
          {book.title}
        </div>
      </div>

      {/* Book Cover (right face) - 160px wide x 240px tall (2:3 aspect ratio)
            Positioned at left: 50px to align flush with the right edge of spine
            Recommended cover image resolution: 800x1200px or 1600x2400px for retina */}
      <div
        className="absolute top-0 overflow-hidden"
        style={{
          left: '50px',
          width: '160px',
          height: '240px',
          transform: 'rotateY(90deg)',
          transformOrigin: 'left bottom',
          transformStyle: 'preserve-3d',
          opacity: isHovered || isSelected ? 1 : 0,
          transition: 'opacity 0.3s ease-out',
          borderRadius: '0 2px 2px 0',
        }}
      >
        {book.cover ? (
          <img
            src={book.cover}
            alt={`${book.title} cover`}
            className="w-full h-full object-cover"
            style={{
              boxShadow: 'inset 0 0 30px rgba(0,0,0,0.2)',
            }}
          />
        ) : (
          <div
            className="w-full h-full bg-linear-to-br from-gray-300 to-gray-400 flex items-center justify-center p-4"
            style={{
              backgroundImage: `
                    linear-gradient(to bottom right, #d1d5db, #9ca3af),
                    url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='3' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.25'/%3E%3C/svg%3E")
                  `,
              boxShadow: 'inset 0 0 30px rgba(0,0,0,0.2)',
            }}
          >
            <div className="text-center">
              <p className="text-sm font-bold mb-2 text-gray-800">
                {book.title}
              </p>
              <p className="text-xs text-gray-600">{book.author}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

export default Book3D;
