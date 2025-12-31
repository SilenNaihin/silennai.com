const NOTION_PAGE_URL = process.env.NOTION_PAGE_URL;

import { buildResponseHeadersFromUpstream } from '../notion-proxy/proxy-headers';
import { maybeInjectNotionDebug } from '../notion-proxy/inject-debug';
import { maybeInjectMsgstoreRewrite } from '../notion-proxy/inject-msgstore';
import { maybeInjectOriginGuard } from '../notion-proxy/inject-origin-guard';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function getNotionOrigin() {
  if (!NOTION_PAGE_URL) return null;
  try {
    return new URL(NOTION_PAGE_URL).origin; // e.g. https://silen.notion.site
  } catch {
    return null;
  }
}

function getNotionHost() {
  if (!NOTION_PAGE_URL) return null;
  try {
    return new URL(NOTION_PAGE_URL).host; // e.g. silen.notion.site
  } catch {
    return null;
  }
}

function looksLikeNotionPublicPagePath(pathname: string) {
  // We only want to proxy Notion-ish public page paths, not arbitrary unknown routes.
  // Examples:
  // - /Silen-Naihin-2370c99ae49c4e328b66b5e0d90cae3c
  // - /2370c99ae49c4e328b66b5e0d90cae3c
  const trimmed = pathname.replace(/^\/+|\/+$/g, '');
  if (!trimmed) return false;

  // single segment only (avoid hijacking /foo/bar routes unless they also match)
  // Notion public pages are typically a single segment.
  const segments = trimmed.split('/');
  if (segments.length !== 1) return false;

  const seg = segments[0];

  if (/^[0-9a-f]{32}$/i.test(seg)) return true;
  if (/-[0-9a-f]{32}$/i.test(seg)) return true;

  return false;
}

function rewriteNotionHtmlToLocalProxy(html: string) {
  // Keep Notion’s absolute paths (/_assets, /api/v3, /statsig, /icons, /images, /print...)
  // because we proxy/rewrite those at the top-level already.
  html = html
    .replaceAll('https://www.notion.so/_assets/', '/_assets/')
    .replaceAll('https://notion.so/_assets/', '/_assets/')
    .replaceAll('https://www.notion.so/api/v3/', '/api/v3/')
    .replaceAll('https://notion.so/api/v3/', '/api/v3/')
    .replaceAll('https://www.notion.so/statsig/', '/statsig/')
    .replaceAll('https://notion.so/statsig/', '/statsig/')
    .replaceAll('https://www.notion.so/icons/', '/icons/')
    .replaceAll('https://notion.so/icons/', '/icons/')
    .replaceAll('https://www.notion.so/images/', '/images/')
    .replaceAll('https://notion.so/images/', '/images/');

  // Critical: ensure client-side navigations don't escape to the public Notion domain
  // (which forbids being framed via CSP frame-ancestors). Rewrite the configured
  // public origin to same-origin URLs.
  const configuredOrigin = getNotionOrigin();
  if (configuredOrigin) {
    html = html
      .replaceAll(`${configuredOrigin}/`, '/')
      .replaceAll(configuredOrigin, '');
  }

  return html;
}

export async function GET(
  req: Request,
  ctx: { params: Promise<{ path: string[] }> }
) {
  const origin = getNotionOrigin();
  if (!origin) {
    return new Response(
      'Missing/invalid NOTION_PAGE_URL env var. Add it to .env.local.',
      { status: 500, headers: { 'Content-Type': 'text/plain; charset=utf-8' } }
    );
  }

  const { path } = await ctx.params;
  const incomingUrl = new URL(req.url);
  const pathname = `/${path.join('/')}`;

  if (!looksLikeNotionPublicPagePath(pathname)) {
    return new Response('Not Found', { status: 404 });
  }

  const upstreamUrl = new URL(`${origin}${pathname}`);
  upstreamUrl.search = incomingUrl.search;

  const upstream = await fetch(upstreamUrl, {
    headers: {
      'User-Agent':
        req.headers.get('user-agent') ??
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      Accept: req.headers.get('accept') ?? 'text/html,*/*',
      'Accept-Language': req.headers.get('accept-language') ?? 'en-US,en;q=0.9',
      Referer: origin,
      Origin: origin,
    },
    cache: 'no-store',
  });

  const contentType = upstream.headers.get('content-type') ?? '';
  if (contentType.includes('text/html')) {
    const raw = await upstream.text();
    const html = maybeInjectNotionDebug(
      maybeInjectOriginGuard(
        maybeInjectMsgstoreRewrite(rewriteNotionHtmlToLocalProxy(raw)),
        { configuredHost: getNotionHost() }
      )
    );
    const headers = buildResponseHeadersFromUpstream(upstream.headers, {
      includeSetCookie: true,
      cacheControl: 'public, max-age=60, stale-while-revalidate=300',
      override: {
        'Content-Type':
          upstream.headers.get('content-type') ?? 'text/html; charset=utf-8',
        'X-Frame-Options': 'SAMEORIGIN',
        'Content-Security-Policy': "frame-ancestors 'self';",
      },
    });
    return new Response(html, { status: upstream.status, headers });
  }

  const headers = buildResponseHeadersFromUpstream(upstream.headers, {
    includeSetCookie: true,
    cacheControl: 'public, max-age=60, stale-while-revalidate=300',
  });
  return new Response(upstream.body, { status: upstream.status, headers });
}
