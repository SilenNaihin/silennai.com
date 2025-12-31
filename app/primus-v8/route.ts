import { buildResponseHeadersFromUpstream } from '../notion-proxy/proxy-headers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Notion uses msgstore-00x.www.notion.so for realtime/presence ("primus-v8").
// In our proxied iframe, those requests can fail (400) and trigger Notion's
// restricted error UI. We proxy them through our origin so upstream sees a
// Notion-like Origin/Referer.
const DEFAULT_MSGSTORE_ORIGIN = 'https://msgstore-001.www.notion.so';
const NOTION_PAGE_URL = process.env.NOTION_PAGE_URL;

function getNotionOriginForHeaders() {
  if (!NOTION_PAGE_URL) return 'https://www.notion.so';
  try {
    return new URL(NOTION_PAGE_URL).origin;
  } catch {
    return 'https://www.notion.so';
  }
}

function getMsgstoreOrigin() {
  // Optional override if Notion changes the shard.
  const env = process.env.NOTION_MSGSTORE_ORIGIN;
  if (!env) return DEFAULT_MSGSTORE_ORIGIN;
  try {
    return new URL(env).origin;
  } catch {
    return DEFAULT_MSGSTORE_ORIGIN;
  }
}

async function proxy(req: Request) {
  const incoming = new URL(req.url);
  const upstreamUrl = new URL(`${getMsgstoreOrigin()}/primus-v8/`);
  upstreamUrl.search = incoming.search;

  const cookie = req.headers.get('cookie');

  const upstream = await fetch(upstreamUrl, {
    method: req.method,
    headers: {
      'User-Agent':
        req.headers.get('user-agent') ??
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      Accept: req.headers.get('accept') ?? '*/*',
      'Accept-Language': req.headers.get('accept-language') ?? 'en-US,en;q=0.9',
      // Important: msgstore seems picky. Make it look like a Notion page.
      Origin: getNotionOriginForHeaders(),
      Referer: getNotionOriginForHeaders(),
      ...(cookie ? { Cookie: cookie } : {}),
      ...(req.headers.get('content-type')
        ? { 'Content-Type': req.headers.get('content-type')! }
        : {}),
    },
    body:
      req.method === 'GET' || req.method === 'HEAD' ? undefined : await req.arrayBuffer(),
    cache: 'no-store',
  });

  const headers = buildResponseHeadersFromUpstream(upstream.headers, {
    includeSetCookie: true,
    cacheControl: 'no-store',
  });

  return new Response(upstream.body, { status: upstream.status, headers });
}

export async function GET(req: Request) {
  return proxy(req);
}

export async function POST(req: Request) {
  return proxy(req);
}


