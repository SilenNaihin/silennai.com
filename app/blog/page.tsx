'use client';

import { useState } from 'react';

const articles = [
  {
    title: "I was a top 0.01% Cursor user. Here's why I switched to Claude Code 2.0.",
    description:
      "You have 6-7 articles bookmarked about Claude Code. You've seen the wave. You want to be a part of it. Here's a comprehensive guide from someone who's been using coding AI since 2021 and read all those Claude Code guides so you don't have to.",
    slug: 'claude-code',
  },
  {
    title: 'I spent 2 weeks playing god using genetic algorithms. Here are my learnings.',
    description:
      'A 2-week journey building an evolution simulator with NEAT, PyTorch, and Claude Code. Bugs, breakthroughs, and counterintuitive findings.',
    slug: 'genetic-algorithm',
  },
  {
    title: 'Positional encoding: how transformers know word order',
    description:
      'Words have meaning, but so does their order. How do transformers, which process all tokens at once, understand that "dog bites man" differs from "man bites dog"? A first principles walkthrough from sinusoidal encodings to RoPE.',
    slug: 'positional-encoding',
  },
  {
    title: 'The pragmatic tradeoff of tied embeddings',
    description:
      'In deep learning, we commonly trade compute for accuracy. Quantization sacrifices precision for speed. Distillation trades model size for latency. Weight sharing reduces parameters at the cost of expressivity. Tied embeddings are one such tradeoff.',
    slug: 'tied-embeddings',
  },
  {
    title: 'How did we make stardust think?',
    description:
      'From carbon atoms forged in dying stars to neurons firing in your skull to silicon learning to see. The improbable chain that led to artificial intelligence. A first principles and historical journey through neural foundations, backpropagation, and recurrence.',
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
        <div className="flex flex-col gap-1">
          {articles.map((article) => (
            <a
              key={article.slug}
              href={`https://blog.silennai.com/${article.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block py-2 px-3 -mx-3 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <span className="font-medium text-gray-900 group-hover:text-gray-700">
                {article.title}
              </span>
              <p className="text-gray-500 text-sm leading-relaxed mt-0.5">
                {article.description}
              </p>
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
