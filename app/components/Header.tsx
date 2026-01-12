'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="pt-8 md:pt-16 pb-8">
      <div className="max-w-2xl mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link href="/" className="font-medium text-xl">
              Silen Naihin
            </Link>
            <div className="flex gap-4 text-sm text-gray-600">
              <a
                href="https://x.com/silennai"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-900"
              >
                x
              </a>
              <a
                href="https://www.linkedin.com/in/silen-naihin/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-900"
              >
                li
              </a>
              <a
                href="mailto:silen.naihin@gmail.com"
                className="hover:text-gray-900"
              >
                email
              </a>
            </div>
          </div>
          <nav className="flex gap-6">
            <Link
              href="/"
              className={`text-sm hover:text-gray-600 ${
                pathname === '/' ? 'font-bold' : ''
              }`}
            >
              Home
            </Link>
            <Link
              href="/blog"
              className={`text-sm hover:text-gray-600 ${
                pathname === '/blog' ? 'font-bold' : ''
              }`}
            >
              Blog
            </Link>
            <Link
              href="/books"
              className={`text-sm hover:text-gray-600 ${
                pathname === '/books' ? 'font-bold' : ''
              }`}
            >
              Books
            </Link>
            <Link
              href="/podcasts"
              className={`text-sm hover:text-gray-600 ${
                pathname === '/podcasts' ? 'font-bold' : ''
              }`}
            >
              Podcasts
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
