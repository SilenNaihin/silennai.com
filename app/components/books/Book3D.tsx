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

// SVG filter for paper texture - rendered once and referenced by ID
export function PaperTextureFilter() {
  return (
    <svg style={{ position: 'absolute', width: 0, height: 0, visibility: 'hidden' as const }}>
      <defs>
        <filter id="paper-texture" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves="8"
            result="noise"
          />
          <feDiffuseLighting
            in="noise"
            lightingColor="white"
            surfaceScale="1"
            result="diffLight"
          >
            <feDistantLight azimuth="45" elevation="35" />
          </feDiffuseLighting>
        </filter>
      </defs>
    </svg>
  );
}

/**
 * Book3D Component - Renders a 3D book with spine and cover
 *
 * Animation System (Adam Maj style):
 * - Spine and cover rotate INDEPENDENTLY around a shared binding axis
 * - Spine rotates backward (away from viewer) around its RIGHT edge
 * - Cover rotates forward around its LEFT edge
 * - This creates a realistic "book opening" effect
 * - Books to the right shift to make space
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

  // Books to the RIGHT of selected/hovered shift right
  const shouldShiftRightHover =
    hoveredIndex !== null &&
    hoveredIndex >= shelfStartIndex &&
    hoveredIndex <= shelfEndIndex &&
    globalIndex > hoveredIndex;

  const shouldShiftRightSelected =
    selectedIndex !== null &&
    selectedIndex >= shelfStartIndex &&
    selectedIndex <= shelfEndIndex &&
    globalIndex > selectedIndex;

  // Books to the LEFT of selected shift left (for left-side padding)
  const shouldShiftLeftSelected =
    selectedIndex !== null &&
    selectedIndex >= shelfStartIndex &&
    selectedIndex <= shelfEndIndex &&
    globalIndex < selectedIndex;

  const shouldShiftLeftHover =
    hoveredIndex !== null &&
    hoveredIndex >= shelfStartIndex &&
    hoveredIndex <= shelfEndIndex &&
    globalIndex < hoveredIndex;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onHoverChange(null);
    onClick();
  };

  const handleMouseEnter = () => {
    if (isTouchDevice) return;
    if (!isSelected) {
      onHoverChange(globalIndex);
    }
  };

  const handleMouseLeave = () => {
    if (isTouchDevice) return;
    onHoverChange(null);
  };

  // Cover width is proportional to book dimensions (roughly 3.2x spine width for 2:3 aspect)
  const coverWidth = Math.round(bookWidth * 3.2);

  // Independent padding for left and right sides of opened book
  // Negative values move left-neighbor CLOSER to the selected book
  const leftPaddingSelected = -6; // Move left neighbor closer to reduce gap
  const leftPaddingHover = 0;
  // Right shift needs to account for cover projection + scale + padding
  const rightShiftSelected = Math.round(coverWidth * 0.7); // Cover projection + padding
  const rightShiftHover = Math.round(coverWidth * 0.22);

  // Calculate transform for this book
  let translateX = 0;
  let translateZ = 0;
  let bookScale = 1;

  // Step 1: Apply shifts based on position relative to SELECTED book (not for selected itself)
  if (!isSelected) {
    if (shouldShiftRightSelected) translateX += rightShiftSelected;
    // Don't apply left padding to hovered book - let it hover in place
    if (shouldShiftLeftSelected && !isHovered) translateX -= leftPaddingSelected;
  }

  // Step 2: Apply pull-out effects for selected/hovered
  const isDirectlyRightOfSelected =
    selectedIndex !== null && globalIndex === selectedIndex + 1;

  if (isSelected) {
    translateZ = 80;
    bookScale = 1.15;
  } else if (isHovered) {
    translateZ = 15;
    bookScale = 1.03;
    // Hovered book shifts left to create gap on its right
    translateX -= rightShiftHover;
    // Add padding on left when hovered book is directly right of selected
    if (isDirectlyRightOfSelected) {
      translateX += 12; // Extra gap between selected and this hovered book
    }
  }

  // Rotation angles for spine and cover
  // Spine: rotates backward (negative Y) around right edge
  // Cover: starts at 90deg (flat against spine), rotates to show face
  const spineRotation = isSelected ? -38 : isHovered ? -15 : 0;
  const coverRotation = isSelected ? 48 : isHovered ? 75 : 90;

  return (
    <div
      ref={ref}
      className={`relative cursor-pointer ${
        isSelected || isHovered ? 'z-50' : 'z-0'
      }`}
      style={{
        width: `${bookWidth}px`,
        height: `${bookHeight}px`,
        perspective: '1000px',
        transform: `translateX(${translateX}px) translateZ(${translateZ}px) scale(${bookScale})`,
        transition: 'transform 500ms ease',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {/* Book container - holds spine and cover together */}
      <div
        style={{
          position: 'relative',
          width: `${bookWidth}px`,
          height: `${bookHeight}px`,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Book Spine - rotates around RIGHT edge */}
        <div
          className={`absolute top-0 left-0 flex items-center justify-center ${shouldUseDarkText(book.spineColor) ? 'text-gray-900' : 'text-white'}`}
          style={{
            width: `${bookWidth}px`,
            height: `${bookHeight}px`,
            backgroundColor: book.spineColor,
            borderRadius: '2px 0 0 2px',
            transformStyle: 'preserve-3d',
            transformOrigin: 'right center',
            transform: `rotateY(${spineRotation}deg)`,
            transition: 'transform 500ms ease',
            filter: 'brightness(0.85) contrast(1.1)',
          }}
        >
          {/* Paper texture overlay */}
          <span
            style={{
              position: 'absolute',
              inset: 0,
              opacity: 0.3,
              filter: 'url(#paper-texture)',
              pointerEvents: 'none',
              borderRadius: '2px 0 0 2px',
            }}
          />
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

        {/* Book Cover - rotates around LEFT edge (where it meets spine) */}
        <div
          className="absolute top-0 overflow-hidden"
          style={{
            left: `${bookWidth}px`,
            width: `${coverWidth}px`,
            height: `${bookHeight}px`,
            transformStyle: 'preserve-3d',
            transformOrigin: 'left center',
            transform: `rotateY(${coverRotation}deg)`,
            transition: 'transform 500ms ease',
            borderRadius: '0 2px 2px 0',
            filter: 'brightness(0.9) contrast(1.05)',
          }}
        >
          {/* Page edge lighting effect */}
          <span
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 10,
              pointerEvents: 'none',
              background: `linear-gradient(to right,
                rgba(255,255,255,0) 2px,
                rgba(255,255,255,0.5) 3px,
                rgba(255,255,255,0.25) 4px,
                rgba(255,255,255,0.25) 6px,
                transparent 7px,
                transparent 9px,
                rgba(255,255,255,0.25) 9px,
                transparent 12px)`,
            }}
          />
          {/* Paper texture overlay */}
          <span
            style={{
              position: 'absolute',
              inset: 0,
              opacity: 0.25,
              filter: 'url(#paper-texture)',
              pointerEvents: 'none',
              zIndex: 5,
            }}
          />
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
              className="w-full h-full flex items-center justify-center p-4"
              style={{
                background: `linear-gradient(to bottom right, ${book.spineColor}, ${book.spineColor}dd)`,
                boxShadow: 'inset 0 0 30px rgba(0,0,0,0.2)',
              }}
            >
              <div className="text-center">
                <p
                  className={`text-sm font-bold mb-2 ${shouldUseDarkText(book.spineColor) ? 'text-gray-800' : 'text-white'}`}
                >
                  {book.title}
                </p>
                <p
                  className={`text-xs ${shouldUseDarkText(book.spineColor) ? 'text-gray-600' : 'text-white/80'}`}
                >
                  {book.author}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

export default Book3D;
