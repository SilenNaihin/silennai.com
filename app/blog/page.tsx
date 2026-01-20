'use client';

import { useState } from 'react';

const articles = [
  {
    icon: '🤖',
    title: "I'm a 0.01% Cursor user. Why I switched to Claude Code.",
    description: 'A guide after 5 years of AI coding.',
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
    title: 'How Did We Make Stardust Think?',
    description: 'From neurons to neural networks',
    slug: 'stardust',
  },
];

export default function Blog() {
  const [isLoading, setIsLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);
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
      <section className="mb-4">
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
        <div className={`w-full h-[80vh] rounded-lg overflow-hidden relative ${isLoading ? 'border border-gray-200' : ''}`}>
          {isLoading && !loadFailed && (
            <div className="absolute inset-0 flex flex-col items-start pt-8 px-4 bg-white">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                <p className="text-gray-500 text-sm">Loading Notion (this may take a sec)</p>
              </div>
              <p className="text-gray-400 text-xs mb-2 ml-8">Most of my blogs are here</p>
              <a
                href="https://silen.notion.site/Silen-Naihin-2370c99ae49c4e328b66b5e0d90cae3c"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:text-blue-800 underline underline-offset-2 ml-8"
              >
                Open in Notion
              </a>
            </div>
          )}
          {loadFailed && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white border border-gray-200 rounded-lg">
              <p className="text-gray-500 text-sm mb-2">Failed to load Notion page</p>
              <a
                href="https://silen.notion.site/Silen-Naihin-2370c99ae49c4e328b66b5e0d90cae3c"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-800 underline underline-offset-2"
              >
                Open in Notion
              </a>
            </div>
          )}
          <iframe
            title="Silen's Blog (Notion)"
            src={iframeSrc}
            className={`w-full h-full ${loadFailed ? 'hidden' : ''}`}
            style={{ border: 'none' }}
            loading="lazy"
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setIsLoading(false);
              setLoadFailed(true);
            }}
          />
        </div>
      </section>
    </main>
  );
}
