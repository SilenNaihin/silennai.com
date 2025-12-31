import { NextResponse } from 'next/server';

const NOTION_PAGE_URL = process.env.NOTION_PAGE_URL;

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Notion’s SPA uses the current URL path to resolve the page.
 * If we serve the HTML at `/notion-proxy` (no page slug/id), Notion often shows
 * “This page couldn’t be found”. So `/notion-proxy` redirects to the real
 * page path, proxied under `/notion-proxy/...`.
 */
export async function GET(req: Request) {
  if (!NOTION_PAGE_URL) {
    return new Response(
      'Missing NOTION_PAGE_URL env var. Add it to .env.local, e.g.\n\nNOTION_PAGE_URL="https://www.notion.so/<your-public-page-id>"\n',
      { status: 500, headers: { 'Content-Type': 'text/plain; charset=utf-8' } }
    );
  }

  let target: URL;
  try {
    target = new URL(NOTION_PAGE_URL);
  } catch {
    return new Response('Invalid NOTION_PAGE_URL', {
      status: 500,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }

  // Redirect to the Notion page *at the root path* so Notion’s SPA router sees the
  // exact pathname it expects (many public pages break if mounted under a prefix).
  const dest = `${target.pathname}${target.search}`;

  return NextResponse.redirect(new URL(dest, req.url), 307);
}
