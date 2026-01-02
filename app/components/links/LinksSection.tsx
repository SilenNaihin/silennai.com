'use client';

import { useMemo, useRef } from 'react';
import type { Link } from '@/app/content/data';
import DetailsColumn from '@/app/components/DetailsColumn';

export default function LinksSection({
  links,
  selectedIndex,
  onSelect,
}: {
  links: Link[];
  selectedIndex: number | null;
  onSelect: (item: Link, index: number) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const groupedLinks = useMemo(() => {
    return links.reduce((acc, link) => {
      if (!acc[link.category]) acc[link.category] = [];
      acc[link.category].push(link);
      return acc;
    }, {} as Record<string, Link[]>);
  }, [links]);

  const flatLinks = useMemo(() => {
    const out: Link[] = [];
    for (const [, categoryLinks] of Object.entries(groupedLinks)) {
      out.push(...categoryLinks);
    }
    return out;
  }, [groupedLinks]);

  const handleBackgroundClick = () => {
    if (selectedIndex !== null) {
      onSelect(flatLinks[selectedIndex], selectedIndex);
    }
  };

  let globalIndex = -1;

  return (
    <div
      ref={containerRef}
      className="relative"
      onClick={handleBackgroundClick}
    >
      {Object.entries(groupedLinks).map(([category, categoryLinks]) => (
        <div key={category} className="mb-8">
          <h3 className="font-bold mb-4 text-lg">{category}</h3>
          <ul className="space-y-2">
            {categoryLinks.map((link) => {
              globalIndex += 1;
              const idx = globalIndex;

              return (
                <li key={`${category}-${idx}`}>
                  <div
                    ref={(el) => {
                      itemRefs.current[idx] = el;
                    }}
                    className="inline-block"
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelect(link, idx);
                      }}
                      className="text-gray-700 hover:text-gray-900 hover:underline transition-all inline-flex items-center gap-2 text-left"
                    >
                      <span className="text-gray-400">→</span>
                      {link.name}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      ))}

      <DetailsColumn
        items={flatLinks}
        selectedIndex={selectedIndex}
        containerRef={containerRef}
        itemRefs={itemRefs}
        sideOffsetPx={0}
        fillMode="viewport"
        zIndex={30}
        render={(link) => (
          <div className="p-6 pt-6">
            <div className="flex items-baseline gap-3 mb-2">
              <h2 className="text-xl font-bold text-gray-900">{link.name}</h2>
              <span className="text-gray-500 text-sm">{link.category}</span>
            </div>

            {link.reflections ? (
              <p className="text-gray-700 leading-relaxed text-sm">
                {link.reflections}
              </p>
            ) : (
              <p className="text-gray-400 text-sm">No notes yet.</p>
            )}

            <div className="mt-4">
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline text-sm"
                onClick={(e) => e.stopPropagation()}
              >
                Visit link →
              </a>
            </div>
          </div>
        )}
      />

      {selectedIndex === null && (
        <div className="text-center text-gray-400 text-sm mt-6 relative z-10">
          Click a link to view details
        </div>
      )}
    </div>
  );
}
