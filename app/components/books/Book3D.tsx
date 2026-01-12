import { Book } from '@/app/content/data';
import { forwardRef, useEffect, useState } from 'react';

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

// Hook to detect touch device
function useIsTouchDevice() {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  return isTouch;
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
    bookWidth: number;
    bookHeight: number;
    scale: number;
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
    bookWidth,
    bookHeight,
    scale,
  },
  ref
) {
  const isTouchDevice = useIsTouchDevice();

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
    // Skip hover effect on touch devices - they should go straight to selection on tap
    if (isTouchDevice) return;
    // Allow hover on any book except the selected one
    if (!isSelected) {
      onHoverChange(globalIndex);
    }
  };

  const handleMouseLeave = () => {
    // Skip hover effect on touch devices
    if (isTouchDevice) return;
    // Clear hover state when mouse leaves
    onHoverChange(null);
  };

  // Calculate scaled transform values
  const translateZ = {
    selected: Math.round(150 * scale),
    hovered: Math.round(50 * scale),
  };
  const translateX = {
    selectedHovered: Math.round(5 * scale),
    selected: Math.round(-10 * scale),
    hoveredShifted: Math.round(85 * scale),
    hovered: Math.round(-5 * scale),
    shiftBoth: Math.round(105 * scale),
    shiftSelected: Math.round(90 * scale),
    shiftHover: Math.round(15 * scale),
  };

  // Cover width is proportional to book dimensions (roughly 3.2x spine width for 2:3 aspect)
  const coverWidth = Math.round(bookWidth * 3.2);

  return (
    <div
      ref={ref}
      className={`relative cursor-pointer transition-all duration-500 ${
        isSelected || isHovered ? 'z-50' : 'z-0'
      }`}
      style={{
        width: `${bookWidth}px`,
        height: `${bookHeight}px`,
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
            ? `translateZ(${translateZ.selected}px) translateX(${translateX.selectedHovered}px) rotateY(-45deg) scale(1.15)`
            : isSelected
            ? `translateZ(${translateZ.selected}px) translateX(${translateX.selected}px) rotateY(-45deg) scale(1.15)`
            : isHovered && shouldShiftRightSelected
            ? `translateZ(${translateZ.hovered}px) translateX(${translateX.hoveredShifted}px) rotateY(-10deg) scale(1.03)`
            : isHovered
            ? `translateZ(${translateZ.hovered}px) translateX(${translateX.hovered}px) rotateY(-10deg) scale(1.03)`
            : shouldShiftRightSelected && shouldShiftRightHover
            ? `translateX(${translateX.shiftBoth}px)`
            : shouldShiftRightSelected
            ? `translateX(${translateX.shiftSelected}px)`
            : shouldShiftRightHover
            ? `translateX(${translateX.shiftHover}px)`
            : 'translateZ(0px) scale(1)',
        transformOrigin: 'center center',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {/* Book Spine (front face) */}
      <div
        className={`absolute top-0 left-0 flex items-center justify-center text-xs font-semibold ${shouldUseDarkText(book.spineColor) ? 'text-gray-900' : 'text-white'}`}
        style={{
          width: `${bookWidth}px`,
          height: `${bookHeight}px`,
          backgroundColor: book.spineColor,
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
          className="whitespace-nowrap tracking-tight font-bold"
          style={{
            writingMode: 'vertical-rl',
            transform: 'rotate(180deg)',
            maxHeight: `${bookHeight - 10}px`,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            fontSize: `${Math.round(14 * scale)}px`,
            textShadow: shouldUseDarkText(book.spineColor)
              ? '1px 1px 2px rgba(255,255,255,0.5)'
              : '1px 1px 2px rgba(0,0,0,0.5)',
          }}
        >
          {book.title}
        </div>
      </div>

      {/* Book Cover (right face) - 2:3 aspect ratio
            Positioned at left edge of spine to align flush with the right edge
            Recommended cover image resolution: 800x1200px or 1600x2400px for retina */}
      <div
        className="absolute top-0 overflow-hidden"
        style={{
          left: `${bookWidth}px`,
          width: `${coverWidth}px`,
          height: `${bookHeight}px`,
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
