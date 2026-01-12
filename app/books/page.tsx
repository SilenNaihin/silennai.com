'use client';

import { useState } from 'react';
import BooksSection from '../components/books/BooksSection';

export default function BooksPage() {
  const [selectedBookIndex, setSelectedBookIndex] = useState<number | null>(0);

  return (
    <main className="max-w-2xl mx-auto px-4 md:px-8 py-8 min-h-screen">
      <BooksSection
        onSelect={(book, index) => {
          if (selectedBookIndex === index) {
            setSelectedBookIndex(null);
          } else {
            setSelectedBookIndex(index);
          }
        }}
        selectedIndex={selectedBookIndex}
      />
    </main>
  );
}
