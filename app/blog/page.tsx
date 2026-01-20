'use client';

import { useState } from 'react';

const articles = [
  {
    icon: '🤖',
    title: 'Claude Code Guide',
    description: 'Why I switched from Cursor to Claude Code',
    slug: 'claude-code',
  },
  {
    icon: '〰️',
    title: 'Positional Encoding',
    description: 'First principles: sine waves to RoPE',
    slug: 'positional-encoding',
  },
  {
    icon: '🔗',
    title: 'Tied Embeddings',
    description: 'Weight sharing in neural networks',
    slug: 'tied-embeddings',
  },
  {
    icon: '✨',
    title: 'How Do We Make Stardust Think?',
    description: 'From neurons to neural networks',
    slug: 'stardust',
  },
];

export default function Blog() {
  const [isLoading, setIsLoading] = useState(true);
  const notionPageUrl = process.env.NOTION_PAGE_URL;
  let iframeSrc = '/notion-proxy';
  try {
    if (notionPageUrl) {
      const u = new URL(notionPageUrl);
      iframeSrc = `${u.pathname}${u.search}`;
    }
  } catch {
    // fall back to /notion-proxy
  }

  return (
    <main className="max-w-5xl mx-auto px-4 md:px-8 pb-8">
      <section className="mb-6">
        <h2 className="text-sm text-gray-500 uppercase tracking-wide mb-2">
          Interactive
        </h2>
        <div className="flex flex-col">
          {articles.map((article) => (
            <a
              key={article.slug}
              href={`https://blog.silennai.com/${article.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 py-2 px-2 -mx-2 rounded hover:bg-gray-50 transition-colors group"
            >
              <span className="text-lg">{article.icon}</span>
              <span className="font-medium">{article.title}</span>
              <span className="text-gray-400 text-sm hidden sm:inline">
                {article.description}
              </span>
            </a>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-baseline justify-between gap-4 flex-wrap mb-3">
          <a
            href="https://silen.notion.site/Silen-Naihin-2370c99ae49c4e328b66b5e0d90cae3c"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:text-blue-800 underline underline-offset-4"
          >
            Open in Notion
          </a>
        </div>
        <div className="w-full h-[80vh] rounded-lg overflow-hidden border border-gray-200 relative">
          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white">
              <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin mb-3" />
              <p className="text-gray-500 text-sm">Loading Notion (this may take a sec)</p>
              <p className="text-gray-400 text-xs mt-1">Most of my blogs are here</p>
            </div>
          )}
          <iframe
            title="Silen's Blog (Notion)"
            src={iframeSrc}
            className="w-full h-full"
            style={{ border: 'none' }}
            loading="lazy"
            onLoad={() => setIsLoading(false)}
          />
        </div>
      </section>
    </main>
  );
}
