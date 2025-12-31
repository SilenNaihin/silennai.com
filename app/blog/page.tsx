export default function Blog() {
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
    <main className="max-w-5xl mx-auto px-4 md:px-8 py-8">
      <div className="flex items-baseline justify-between gap-4 flex-wrap mb-4">
        <h1 className="text-2xl font-semibold">Blog</h1>
        <a
          href="https://silen.notion.site/Silen-Naihin-2370c99ae49c4e328b66b5e0d90cae3c"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 hover:text-blue-800 underline underline-offset-4"
        >
          Open in Notion
        </a>
      </div>

      <div className="w-full h-[80vh] md:h-[85vh] rounded-lg overflow-hidden border border-gray-200">
        <iframe
          title="Silen's Blog (Notion)"
          src={iframeSrc}
          className="w-full h-full"
          style={{ border: 'none' }}
          loading="lazy"
        />
      </div>
    </main>
  );
}
