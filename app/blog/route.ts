import { NextResponse } from 'next/server';

const NOTION_URL =
  'https://silen.notion.site/Silen-Naihin-2370c99ae49c4e328b66b5e0d90cae3c';

export async function GET() {
  try {
    const response = await fetch(NOTION_URL, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      },
    });

    if (!response.ok) {
      return new NextResponse('Failed to fetch Notion page', { status: 500 });
    }

    let html = await response.text();

    // Inject service worker registration at the start of the page
    const swScript = `
      <script>
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.register('/notion-sw.js').then(function(registration) {
            console.log('Service Worker registered:', registration);
            // Reload the page once to let SW intercept requests
            if (!sessionStorage.getItem('sw-reload')) {
              sessionStorage.setItem('sw-reload', '1');
              window.location.reload();
            }
          });
        }
      </script>
    `;

    html = html.replace('<head>', '<head>' + swScript);

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html',
        'Cache-Control': 'public, max-age=300',
      },
    });
  } catch (error) {
    console.error('Error fetching Notion page:', error);
    return new NextResponse('Error loading blog', { status: 500 });
  }
}
