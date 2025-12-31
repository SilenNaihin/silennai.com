export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { buildResponseHeadersFromUpstream } from '../../../notion-proxy/proxy-headers';

const DEFAULT_NOTION_ORIGIN = 'https://www.notion.so';
const NOTION_PAGE_URL = process.env.NOTION_PAGE_URL;
const NOTION_PROXY_DEBUG = process.env.NOTION_PROXY_DEBUG === '1';

type ErrorSignal = { path: string; value: string };

function normalizeNotionId(id: string): string {
  // Notion commonly uses 32-hex ids (no dashes) internally.
  return id.replace(/-/g, '');
}

function looksLikeDashedUuid(s: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    s
  );
}

function normalizeDashedUuidsDeep(value: unknown): unknown {
  if (typeof value === 'string') {
    return looksLikeDashedUuid(value) ? normalizeNotionId(value) : value;
  }
  if (Array.isArray(value)) return value.map(normalizeDashedUuidsDeep);
  if (value && typeof value === 'object') {
    const obj = value as Record<string, unknown>;
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(obj))
      out[k] = normalizeDashedUuidsDeep(v);
    return out;
  }
  return value;
}

function getConfiguredNotionHost() {
  if (!NOTION_PAGE_URL) return null;
  try {
    return new URL(NOTION_PAGE_URL).host; // e.g. silen.notion.site or www.notion.so
  } catch {
    return null;
  }
}

function getConfiguredNotionOrigin() {
  if (!NOTION_PAGE_URL) return null;
  try {
    return new URL(NOTION_PAGE_URL).origin; // e.g. https://silen.notion.site
  } catch {
    return null;
  }
}

function getNotionPublicOriginForHeaders() {
  // The *page* may be hosted on a custom Notion domain (*.notion.site / custom domain).
  // We want Origin/Referer to match that public site.
  return getConfiguredNotionOrigin() ?? DEFAULT_NOTION_ORIGIN;
}

function getUpstreamApiOrigin() {
  // Notion's /api/v3 endpoints are served by www.notion.so.
  // Hitting /api/v3 on custom domains can return 200 but wrong/empty payloads.
  return DEFAULT_NOTION_ORIGIN;
}

function collectErrorSignals(
  value: unknown,
  opts?: { maxDepth?: number; maxSignals?: number }
): ErrorSignal[] {
  const maxDepth = opts?.maxDepth ?? 8;
  const maxSignals = opts?.maxSignals ?? 6;
  const out: ErrorSignal[] = [];

  function walk(v: unknown, depth: number, path: string) {
    if (out.length >= maxSignals) return;
    if (depth > maxDepth) return;

    if (typeof v === 'string') {
      const s = v.toLowerCase();
      if (
        s.includes('not found') ||
        s.includes('not_found') ||
        s.includes('unauthorized') ||
        s.includes('no access') ||
        s.includes('does not exist')
      ) {
        out.push({ path, value: v });
      }
      return;
    }

    if (Array.isArray(v)) {
      for (let i = 0; i < v.length; i++) walk(v[i], depth + 1, `${path}[${i}]`);
      return;
    }

    if (v && typeof v === 'object') {
      const obj = v as Record<string, unknown>;

      // Prefer logging Notion-style structured error objects.
      const errorId = obj.errorId;
      const name = obj.name;
      const message = obj.message;
      if (typeof errorId === 'string')
        out.push({
          path: path ? `${path}.errorId` : 'errorId',
          value: errorId,
        });
      if (typeof name === 'string' && /error$/i.test(name))
        out.push({ path: path ? `${path}.name` : 'name', value: name });
      if (typeof message === 'string' && out.length < maxSignals)
        out.push({
          path: path ? `${path}.message` : 'message',
          value: message,
        });
      if (out.length >= maxSignals) return;

      for (const [k, child] of Object.entries(obj)) {
        walk(child, depth + 1, path ? `${path}.${k}` : k);
        if (out.length >= maxSignals) return;
      }
    }
  }

  walk(value, 0, '');
  return out.slice(0, maxSignals);
}

function rewriteStringsDeep(
  value: unknown,
  rewrite: (s: string) => string
): unknown {
  if (typeof value === 'string') return rewrite(value);
  if (Array.isArray(value))
    return value.map((v) => rewriteStringsDeep(v, rewrite));
  if (value && typeof value === 'object') {
    const obj = value as Record<string, unknown>;
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(obj))
      out[k] = rewriteStringsDeep(v, rewrite);
    return out;
  }
  return value;
}

async function proxy(
  req: Request,
  upstreamUrl: URL,
  opts?: { overrideDomainForPublicPageData?: boolean; endpoint?: string }
) {
  const headers = new Headers();
  const contentType = req.headers.get('content-type');
  if (contentType) headers.set('content-type', contentType);

  // Notion endpoints are picky about headers; pass a minimal useful set.
  const publicOrigin = getNotionPublicOriginForHeaders();
  const configuredHost = getConfiguredNotionHost();
  headers.set(
    'user-agent',
    req.headers.get('user-agent') ??
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  );
  headers.set('accept', req.headers.get('accept') ?? '*/*');
  headers.set(
    'accept-language',
    req.headers.get('accept-language') ?? 'en-US,en;q=0.9'
  );
  // Make requests look like they came from the configured Notion public domain.
  headers.set('origin', publicOrigin);
  headers.set('referer', publicOrigin);
  headers.set('x-forwarded-host', configuredHost ?? new URL(publicOrigin).host);
  headers.set('x-forwarded-proto', 'https');
  const cookie = req.headers.get('cookie');
  if (cookie) headers.set('cookie', cookie);

  const method = req.method.toUpperCase();
  const hasBody = method !== 'GET' && method !== 'HEAD';

  const endpoint = opts?.endpoint ?? '(unknown)';
  let parsedRequestJson: unknown | null = null;
  let requestedPageId: string | null = null;
  let requestedPageIdNoDashes: string | null = null;

  // Only normalize dashed UUIDs → 32-hex for endpoints that are known to use
  // Notion's internal 32-hex identifiers. Some public endpoints (notably
  // getPublicSpaceData) appear to validate and can 400 when we over-normalize.
  const shouldNormalizeRequestIds =
    endpoint === 'getPublicPageDataForDomain' ||
    endpoint === 'getPublicPageData' ||
    endpoint === 'loadCachedPageChunkV2' ||
    endpoint === 'loadCachedPageChunks' ||
    endpoint === 'loadCachedPageChunksV2' ||
    endpoint.startsWith('syncRecordValues') ||
    endpoint.startsWith('syncRecordValuesV2');

  let body: ArrayBuffer | undefined;
  if (hasBody) {
    const raw = await req.arrayBuffer();
    body = raw;

    if ((contentType ?? '').includes('application/json')) {
      try {
        parsedRequestJson = JSON.parse(
          new TextDecoder().decode(raw)
        ) as unknown;
        const obj = parsedRequestJson as Record<string, unknown> | null;
        requestedPageId =
          (typeof obj?.pageId === 'string' && (obj.pageId as string)) ||
          (typeof obj?.blockId === 'string' && (obj.blockId as string)) ||
          (typeof obj?.rootBlockId === 'string' &&
            (obj.rootBlockId as string)) ||
          null;
        requestedPageIdNoDashes = requestedPageId
          ? normalizeNotionId(requestedPageId)
          : null;
      } catch {
        parsedRequestJson = null;
      }
    }

    // Notion public pages can be domain-resolved. When we iframe on localhost,
    // their client often sends `{ domain: "localhost:3001" }`, which makes the
    // API resolve the wrong public space and show "page couldn't be found".
    // If we know the original Notion host, rewrite the payload.
    if (
      opts?.overrideDomainForPublicPageData &&
      (contentType ?? '').includes('application/json')
    ) {
      const configuredHost = getConfiguredNotionHost();
      const configuredOrigin = getConfiguredNotionOrigin();

      try {
        const json =
          parsedRequestJson ??
          (JSON.parse(new TextDecoder().decode(raw)) as unknown);

        // First (sometimes): normalize dashed UUIDs → 32-hex ids for upstream Notion internals.
        let outgoingReqJson: unknown = shouldNormalizeRequestIds
          ? normalizeDashedUuidsDeep(json)
          : json;

        // Then: rewrite domain/origin hints so Notion resolves the correct public space.
        if (configuredHost && configuredOrigin) {
          const incoming = new URL(req.url);
          const incomingHost = incoming.host; // e.g. localhost:3001 (dev) or silennai.com (prod)
          const incomingOrigin = incoming.origin; // http://localhost:3001

          outgoingReqJson = rewriteStringsDeep(outgoingReqJson, (s) => {
            let out = s;
            out = out.replaceAll(incomingOrigin, configuredOrigin);
            out = out.replaceAll(incomingHost, configuredHost);
            return out;
          });
        }

        const next = new TextEncoder().encode(JSON.stringify(outgoingReqJson));
        body = next.buffer;
      } catch {
        // If parsing fails, fall back to raw body.
      }
    }
  }

  const upstream = await fetch(upstreamUrl, {
    method,
    headers,
    body,
    cache: 'no-store',
  });

  const respHeaders = buildResponseHeadersFromUpstream(upstream.headers, {
    includeSetCookie: true,
    cacheControl: 'public, max-age=60, stale-while-revalidate=300',
  });
  const upstreamContentType = upstream.headers.get('content-type') ?? '';

  // Notion's frontend sometimes calls authenticated-only endpoints even on public pages.
  // In our proxied iframe context, these 401s can incorrectly trigger the "restricted"
  // UX and flip the page to "This page couldn’t be found".
  // We intentionally neutralize a small allowlist of these calls.
  if (upstream.status === 401) {
    if (endpoint === 'recordPageExit') {
      // Treat as fire-and-forget telemetry.
      const headers401 = new Headers(respHeaders);
      headers401.set('Content-Type', 'application/json; charset=utf-8');
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: headers401,
      });
    }

    if (endpoint === 'getBillingData') {
      const headers401 = new Headers(respHeaders);
      headers401.set('Content-Type', 'application/json; charset=utf-8');
      // Default to "no billing data" for anonymous public viewers.
      return new Response(JSON.stringify({ results: [] }), {
        status: 200,
        headers: headers401,
      });
    }
  }

  const isJson = upstreamContentType.includes('application/json');
  const shouldRewriteResponse =
    isJson &&
    !!opts?.endpoint &&
    (opts.endpoint.startsWith('getPublic') ||
      opts.endpoint === 'loadCachedPageChunkV2' ||
      opts.endpoint === 'loadCachedPageChunks' ||
      opts.endpoint === 'loadCachedPageChunksV2');

  // Debug mode: parse ALL JSON responses so we can catch the "200 + restricted/not_found"
  // payload that triggers Notion’s page error UI.
  if (isJson && (NOTION_PROXY_DEBUG || shouldRewriteResponse)) {
    try {
      const text = await upstream.text();
      const json = JSON.parse(text) as unknown;

      let outgoingJson: unknown = json;

      if (shouldRewriteResponse) {
        const configuredHost = getConfiguredNotionHost();
        const configuredOrigin = getConfiguredNotionOrigin();
        if (configuredHost && configuredOrigin) {
          const incoming = new URL(req.url);
          const incomingHost = incoming.host;
          const incomingOrigin = incoming.origin;

          outgoingJson = rewriteStringsDeep(json, (s) => {
            let out = s;
            out = out.replaceAll(configuredOrigin, incomingOrigin);
            out = out.replaceAll(configuredHost, incomingHost);
            return out;
          });
        }
      }

      if (NOTION_PROXY_DEBUG) {
        const signals = collectErrorSignals(outgoingJson);
        if (signals.length) {
          console.log(
            `[notion-proxy] /api/v3/${endpoint} errorSignals=${signals
              .map((s) => `${s.path}=${JSON.stringify(s.value)}`)
              .join(' | ')}`
          );
        }

        // High-signal debugging for the "page couldn't be found" flip:
        // Notion often shows this when the returned recordMap doesn't contain
        // the root page block it expects for the current route.
        if (
          (endpoint === 'getPublicPageData' ||
            endpoint === 'loadCachedPageChunkV2' ||
            endpoint === 'loadCachedPageChunks' ||
            endpoint === 'loadCachedPageChunksV2') &&
          requestedPageId
        ) {
          try {
            const anyJson = outgoingJson as Record<string, unknown>;
            const recordMap = anyJson?.recordMap as unknown;
            const blockMap =
              recordMap && typeof recordMap === 'object'
                ? ((recordMap as Record<string, unknown>).block as unknown)
                : undefined;
            const blockObj =
              blockMap && typeof blockMap === 'object'
                ? (blockMap as Record<string, unknown>)
                : null;
            const keysCount = blockObj ? Object.keys(blockObj).length : 0;
            const wantA = requestedPageId;
            const wantB =
              requestedPageIdNoDashes ?? normalizeNotionId(requestedPageId);
            const hasBlock =
              !!blockObj && (wantA in blockObj || wantB in blockObj);
            if (!hasBlock) {
              const blockKeys = blockObj
                ? Object.keys(blockObj).slice(0, 8)
                : [];
              console.log(
                `[notion-proxy] /api/v3/${endpoint} missingRecordMapBlock requestedPageId=${wantA} requestedPageIdNoDashes=${wantB} recordMapBlockKeysCount=${keysCount} blockKeysSample=${JSON.stringify(
                  blockKeys
                )}`
              );
            }
          } catch {
            // ignore
          }
        }
      }

      return new Response(JSON.stringify(outgoingJson), {
        status: upstream.status,
        headers: respHeaders,
      });
    } catch {
      // fall through to streaming response
    }
  }

  return new Response(upstream.body, {
    status: upstream.status,
    headers: respHeaders,
  });
}

export async function GET(
  req: Request,
  ctx: { params: Promise<{ path: string[] }> }
) {
  const { path } = await ctx.params;
  const incomingUrl = new URL(req.url);
  const upstreamUrl = new URL(
    `${getUpstreamApiOrigin()}/api/v3/${path.join('/')}`
  );
  upstreamUrl.search = incomingUrl.search;
  return proxy(req, upstreamUrl);
}

export async function POST(
  req: Request,
  ctx: { params: Promise<{ path: string[] }> }
) {
  const { path } = await ctx.params;
  const incomingUrl = new URL(req.url);
  const upstreamUrl = new URL(
    `${getUpstreamApiOrigin()}/api/v3/${path.join('/')}`
  );
  upstreamUrl.search = incomingUrl.search;

  const endpoint = path[0] ?? '';
  const overrideDomainForPublicPageData =
    endpoint === 'getPublicPageDataForDomain' ||
    endpoint.startsWith('getPublic');

  return proxy(req, upstreamUrl, { overrideDomainForPublicPageData, endpoint });
}
