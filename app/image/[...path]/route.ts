import { buildResponseHeadersFromUpstream } from '../../notion-proxy/proxy-headers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const DEFAULT_NOTION_ORIGIN = 'https://www.notion.so';
const NOTION_PAGE_URL = process.env.NOTION_PAGE_URL;

const ALLOWED_IMAGE_REDIRECT_HOSTS = new Set([
  // Notion-hosted public assets commonly show up as this host with the bucket/key in the path.
  's3-us-west-2.amazonaws.com',
  's3.us-west-2.amazonaws.com',
  // Newer Notion file hosts (best-effort allowlist; still constrained to *.amazonaws.com below).
  'prod-files-secure.s3.us-west-2.amazonaws.com',
  'prod-files-secure.s3.amazonaws.com',
]);

function isAllowedDirectImageUrl(u: URL) {
  if (u.protocol !== 'https:') return false;
  if (ALLOWED_IMAGE_REDIRECT_HOSTS.has(u.host)) return true;
  // Allow other amazonaws S3 hosts, but only for known Notion buckets/paths.
  if (u.host.endsWith('.amazonaws.com')) {
    if (u.pathname.startsWith('/secure.notion-static.com/')) return true;
    if (u.pathname.startsWith('/prod-files-secure/')) return true;
  }
  return false;
}

function getConfiguredNotionOrigin() {
  if (!NOTION_PAGE_URL) return null;
  try {
    return new URL(NOTION_PAGE_URL).origin; // e.g. https://silen.notion.site
  } catch {
    return null;
  }
}

function looksLikeDashedUuid(s: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    s
  );
}

function normalizeNotionId(id: string): string {
  return id.replace(/-/g, '');
}

function getNotionPublicOriginForHeaders() {
  if (!NOTION_PAGE_URL) return DEFAULT_NOTION_ORIGIN;
  try {
    return new URL(NOTION_PAGE_URL).origin;
  } catch {
    return DEFAULT_NOTION_ORIGIN;
  }
}

async function proxy(req: Request) {
  const incomingUrl = new URL(req.url);
  // Important: use the raw, percent-encoded path segment after `/image/`.
  // `ctx.params.path` is decoded by Next.js, which breaks Notion's `/image/<encoded-url>` format.
  const rawEncodedPathAfterImage = incomingUrl.pathname.replace(
    /^\/image\//,
    ''
  );

  const publicOrigin = getNotionPublicOriginForHeaders();
  const cookie = req.headers.get('cookie');

  const requestHeaders: HeadersInit = {
    'User-Agent':
      req.headers.get('user-agent') ??
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    Accept:
      req.headers.get('accept') ??
      'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
    'Accept-Language': req.headers.get('accept-language') ?? 'en-US,en;q=0.9',
    Referer: publicOrigin,
    Origin: publicOrigin,
    ...(cookie ? { cookie } : {}),
  };

  // Fast path: Notion's /image route often embeds the real asset URL as the path segment:
  //   /image/<url-encoded-https-url>?table=block&id=...&spaceId=...
  // If we redirect the browser to S3, Notion's client does HEAD/fetch checks and will
  // get blocked by CORS. So we instead proxy the bytes on our own origin.
  try {
    const decoded = decodeURIComponent(rawEncodedPathAfterImage);
    const direct = new URL(decoded);
    if (isAllowedDirectImageUrl(direct)) {
      const method = req.method.toUpperCase();

      // For HEAD, prefer HEAD upstream, but fall back to a tiny GET (Range) if needed.
      const tryHead = async () =>
        fetch(direct, {
          method: 'HEAD',
          headers: requestHeaders,
          cache: 'no-store',
          redirect: 'follow',
        });

      const tryTinyGet = async () =>
        fetch(direct, {
          method: 'GET',
          headers: { ...requestHeaders, Range: 'bytes=0-0' },
          cache: 'no-store',
          redirect: 'follow',
        });

      let upstream: Response;
      if (method === 'HEAD') {
        upstream = await tryHead();
        if (!upstream.ok) upstream = await tryTinyGet();
      } else {
        upstream = await fetch(direct, {
          method,
          headers: requestHeaders,
          cache: 'no-store',
          redirect: 'follow',
        });
      }

      // If S3 denies access (common for Notion "secure" objects), fall back to Notion's
      // signed image proxy below.
      if (upstream.status < 200 || upstream.status >= 400) {
        // fall through
      } else {
        const headers = buildResponseHeadersFromUpstream(upstream.headers, {
          includeSetCookie: false,
          cacheControl: 'public, max-age=300, stale-while-revalidate=86400',
          override: {
            // Ensure we look like an image response on our origin.
            'Content-Type':
              upstream.headers.get('content-type') ??
              'application/octet-stream',
          },
        });

        // For HEAD, never include a body.
        const body = method === 'HEAD' ? null : upstream.body;
        return new Response(body, { status: upstream.status, headers });
      }
    }
  } catch {
    // fall through to Notion proxy attempts
  }

  const buildUrl = (origin: string, opts?: { normalizeIds?: boolean }) => {
    const u = new URL(`${origin}/image/${rawEncodedPathAfterImage}`);
    u.search = incomingUrl.search;
    if (opts?.normalizeIds) {
      // Fallback-only: some environments appear to require 32-hex IDs.
      for (const key of ['id', 'spaceId', 'userId']) {
        const v = u.searchParams.get(key);
        if (v && looksLikeDashedUuid(v))
          u.searchParams.set(key, normalizeNotionId(v));
      }
    }
    return u;
  };

  const fetchWithTimeout = async (url: URL, timeoutMs: number) => {
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), timeoutMs);
    try {
      return await fetch(url, {
        method: req.method,
        headers: requestHeaders,
        cache: 'no-store',
        // Follow Notion's 302 to the signed CDN/S3 URL server-side, then return bytes same-origin.
        redirect: 'follow',
        signal: controller.signal,
      });
    } finally {
      clearTimeout(t);
    }
  };

  // Attempt order:
  // 1) www.notion.so (canonical image proxy) with original query params
  // 2) www.notion.so with normalized IDs (fallback)
  // 3) configured public origin (e.g. *.notion.site) with original params (rare)
  const candidates: Array<{ url: URL; timeoutMs: number }> = [
    { url: buildUrl(DEFAULT_NOTION_ORIGIN), timeoutMs: 6000 },
    {
      url: buildUrl(DEFAULT_NOTION_ORIGIN, { normalizeIds: true }),
      timeoutMs: 6000,
    },
  ];
  const configuredOrigin = getConfiguredNotionOrigin();
  if (configuredOrigin) {
    candidates.push({ url: buildUrl(configuredOrigin), timeoutMs: 6000 });
  }

  let upstream: Response | null = null;
  for (const c of candidates) {
    try {
      // Notion's client uses HEAD checks; some image hosts reject HEAD, so we fall back
      // to a tiny ranged GET to prove availability.
      if (req.method.toUpperCase() === 'HEAD') {
        upstream = await fetchWithTimeout(c.url, c.timeoutMs);
        if (!upstream.ok) {
          const controller = new AbortController();
          const t = setTimeout(() => controller.abort(), c.timeoutMs);
          try {
            upstream = await fetch(c.url, {
              method: 'GET',
              headers: { ...requestHeaders, Range: 'bytes=0-0' },
              cache: 'no-store',
              redirect: 'follow',
              signal: controller.signal,
            });
          } finally {
            clearTimeout(t);
          }
        }
      } else {
        upstream = await fetchWithTimeout(c.url, c.timeoutMs);
      }
      // If we got something other than 404, return it immediately.
      if (upstream.status !== 404) break;
    } catch {
      // try next candidate (timeouts/network failures)
      upstream = null;
    }
  }

  if (!upstream) {
    return new Response('Upstream fetch failed', { status: 502 });
  }

  const headers = buildResponseHeadersFromUpstream(upstream.headers, {
    includeSetCookie: true,
    cacheControl: 'public, max-age=300, stale-while-revalidate=86400',
  });

  return new Response(upstream.body, { status: upstream.status, headers });
}

export async function GET(
  req: Request,
  ctx: { params: Promise<{ path: string[] }> }
) {
  // Still await params so Next treats this as a valid catch-all route handler.
  await ctx.params;
  return proxy(req);
}

export async function HEAD(
  req: Request,
  ctx: { params: Promise<{ path: string[] }> }
) {
  await ctx.params;
  return proxy(req);
}
