export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { buildResponseHeadersFromUpstream } from '../../notion-proxy/proxy-headers';

const NOTION_ORIGIN = 'https://www.notion.so';

export async function GET(
  req: Request,
  ctx: { params: Promise<{ path: string[] }> }
) {
  const { path } = await ctx.params;
  const incomingUrl = new URL(req.url);

  const upstreamUrl = new URL(`${NOTION_ORIGIN}/f/${path.join('/')}`);
  upstreamUrl.search = incomingUrl.search;

  const upstream = await fetch(upstreamUrl, {
    headers: {
      'User-Agent':
        req.headers.get('user-agent') ??
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      Accept: req.headers.get('accept') ?? '*/*',
      'Accept-Language': req.headers.get('accept-language') ?? 'en-US,en;q=0.9',
      Referer: NOTION_ORIGIN,
    },
    cache: 'no-store',
  });

  const headers = buildResponseHeadersFromUpstream(upstream.headers, {
    includeSetCookie: true,
    cacheControl: 'public, max-age=60, stale-while-revalidate=300',
  });

  return new Response(upstream.body, { status: upstream.status, headers });
}
