import { buildResponseHeadersFromUpstream } from '../proxy-headers';
import { maybeInjectNotionDebug } from '../inject-debug';
import { maybeInjectMsgstoreRewrite } from '../inject-msgstore';

const NOTION_PAGE_URL = process.env.NOTION_PAGE_URL;

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function rewriteNotionHtmlToLocalProxy(html: string) {
  // Prefer keeping Notion’s usual absolute paths (/_assets, /api/v3, /statsig) intact,
  // since we proxy those at the top-level already.

  // Rewrite absolute upstream origins to same-origin URLs.
  html = html
    .replaceAll('https://www.notion.so/_assets/', '/_assets/')
    .replaceAll('https://notion.so/_assets/', '/_assets/')
    .replaceAll('https://www.notion.so/api/v3/', '/api/v3/')
    .replaceAll('https://notion.so/api/v3/', '/api/v3/')
    .replaceAll('https://www.notion.so/statsig/', '/statsig/')
    .replaceAll('https://notion.so/statsig/', '/statsig/');

  // Rewrite navigations to other Notion pages to stay within our proxy.
  // This is best-effort; Notion changes markup often.
  html = html
    .replaceAll('https://www.notion.so/', '/notion-proxy/')
    .replaceAll('https://notion.so/', '/notion-proxy/');

  return html;
}

function getNotionOrigin() {
  if (!NOTION_PAGE_URL) return null;
  try {
    return new URL(NOTION_PAGE_URL).origin; // usually https://www.notion.so
  } catch {
    return null;
  }
}

export async function GET(
  req: Request,
  ctx: { params: Promise<{ path: string[] }> }
) {
  const origin = getNotionOrigin();
  if (!origin) {
    return new Response(
      'Missing/invalid NOTION_PAGE_URL env var. Add it to .env.local, e.g.\n\nNOTION_PAGE_URL="https://www.notion.so/<your-public-page-id>"\n',
      { status: 500, headers: { 'Content-Type': 'text/plain; charset=utf-8' } }
    );
  }

  const { path } = await ctx.params;
  const incomingUrl = new URL(req.url);
  const upstreamUrl = new URL(`${origin}/${path.join('/')}`);
  upstreamUrl.search = incomingUrl.search; // preserve query params

  const upstream = await fetch(upstreamUrl, {
    headers: {
      // Forward a couple headers that help Notion serve the right content.
      'User-Agent':
        req.headers.get('user-agent') ??
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      Accept: req.headers.get('accept') ?? '*/*',
      'Accept-Language': req.headers.get('accept-language') ?? 'en-US,en;q=0.9',
    },
    cache: 'no-store',
  });

  const contentType = upstream.headers.get('content-type') ?? '';

  // For HTML, rewrite a couple absolute origins so the SPA continues working on our origin.
  if (contentType.includes('text/html')) {
    const raw = await upstream.text();
    const html = maybeInjectNotionDebug(
      maybeInjectMsgstoreRewrite(rewriteNotionHtmlToLocalProxy(raw))
    );

    const headers = buildResponseHeadersFromUpstream(upstream.headers, {
      includeSetCookie: true,
      cacheControl: 'public, max-age=60, stale-while-revalidate=300',
      override: {
        'Content-Type':
          upstream.headers.get('content-type') ?? 'text/html; charset=utf-8',
        // Allow this document to be framed by our own site.
        'X-Frame-Options': 'SAMEORIGIN',
        'Content-Security-Policy': "frame-ancestors 'self';",
      },
    });

    return new Response(html, { status: upstream.status, headers });
  }

  // For everything else, stream through.
  const headers = buildResponseHeadersFromUpstream(upstream.headers, {
    includeSetCookie: true,
    cacheControl: 'public, max-age=60, stale-while-revalidate=300',
  });
  return new Response(upstream.body, { status: upstream.status, headers });
}
