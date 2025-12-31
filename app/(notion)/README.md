# Notion embed + proxy (App Router)

This app embeds a **public Notion page** inside an `<iframe>` while keeping the Notion SPA working **on your own origin** by proxying the resources Notion expects to load from `notion.so` (assets, API, statsig, images, realtime msgstore).

The overall goal is:

- The iframe `src` is a **root Notion-style page path** (e.g. `/My-Page-<32hex>`), because Notion’s SPA router uses the current pathname to resolve the page.
- All Notion “absolute” requests (e.g. `/_assets/*`, `/api/v3/*`) are served from **your domain**, via Next.js route handlers, so the Notion app doesn’t break inside an iframe.

---

## Required environment variables

- **`NOTION_PAGE_URL`**: The public Notion page URL you want to embed.
  - Example: `NOTION_PAGE_URL="https://silen.notion.site/Silen-Naihin-2370c99ae49c4e328b66b5e0d90cae3c"`

Optional:

- **`NOTION_PROXY_DEBUG=1`**: Injects a tiny client-side logger into Notion HTML that reports failed `fetch`/XHR calls.
- **`NOTION_PROXY_DISABLE_MSGSTORE=1`**: Disables the injected msgstore rewrite shim.
- **`NOTION_PROXY_DISABLE_ORIGIN_GUARD=1`**: Disables the injected navigation/origin guard.
- **`NOTION_MSGSTORE_ORIGIN`**: Override msgstore shard origin (defaults to `https://msgstore-001.www.notion.so`).

---

## How the request flow works (high level)

1. `/blog` renders an iframe whose `src` is the **pathname** of `NOTION_PAGE_URL` (root-level), not `/notion-proxy`.
2. The root catch-all route `app/[...path]/route.ts` proxies **only** “Notion-looking” public page paths (single segment, ends with a 32-hex id), rewrites the HTML to keep requests on your origin, and injects client-side shims.
3. Once Notion boots, it requests:
   - JS/CSS from `/_assets/*`
   - API from `/api/v3/*`
   - feature flags from `/statsig/*`
   - images from `/image/*`
   - realtime/presence from `msgstore-xxx.../primus-v8` (rewritten to `/primus-v8`)
4. Your Next.js route handlers proxy those endpoints to Notion and rewrite/normalize what’s necessary so Notion doesn’t flip into “restricted/not found” state.

---

## `next.config.ts` rewrites (critical)

File: `next.config.ts`

Notion often loads assets from absolute root paths like `/_assets/...`. The App Router treats folders starting with `_` as private, so we **rewrite** these public URLs to routable proxy endpoints:

- `/_assets/:path*` → `/notion-assets/:path*`
- `/icons/:path*` → `/notion-proxy/icons/:path*`
- `/images/:path*` → `/notion-proxy/images/:path*`
- `/:path(print.*)` → `/notion-proxy/:path` (root `print.*.css` style assets)

---

## Routes and helpers (what each file does)

### Page embed

- **`app/blog/page.tsx`**
  - Renders the blog page with an iframe.
  - Computes the iframe `src` from `process.env.NOTION_PAGE_URL` and uses the **URL pathname** (e.g. `/Silen-Naihin-...`) so Notion’s SPA router sees the expected route.

### Root Notion page proxy (most important)

- **`app/[...path]/route.ts`**
  - Root catch-all proxy for **Notion public page paths** only (it avoids hijacking normal app routes).
  - Fetches the upstream public Notion HTML (from the configured Notion origin).
  - Rewrites HTML so Notion’s absolute URLs (assets, api, statsig, etc.) point at **same-origin** endpoints.
  - Injects small client-side shims:
    - msgstore rewrite (`maybeInjectMsgstoreRewrite`)
    - origin guard (`maybeInjectOriginGuard`)
    - debug logger (`maybeInjectNotionDebug`, only when `NOTION_PROXY_DEBUG=1`)
  - Sets iframe-friendly headers:
    - `X-Frame-Options: SAMEORIGIN`
    - `Content-Security-Policy: frame-ancestors 'self';`

### Notion HTML proxy under `/notion-proxy/*` (supports assets routed there)

- **`app/notion-proxy/route.ts`**

  - Convenience route that redirects `/notion-proxy` → the configured root Notion page path.

- **`app/notion-proxy/[...path]/route.ts`**
  - Proxies Notion resources under `/notion-proxy/*` and rewrites HTML similarly to the root catch-all.
  - Used by `next.config.ts` rewrites for `/icons/*`, `/images/*`, and `/print.*`.

### Notion static assets

- **`app/notion-assets/[...path]/route.ts`**
  - Proxies `/_assets/*` (rewritten to this handler by `next.config.ts`).
  - Fetches from `https://www.notion.so/_assets/...` and streams back.

### Notion feature flags / config

- **`app/statsig/[...path]/route.ts`**
  - Proxies `/statsig/*` calls used by Notion’s frontend.

### Notion API (domain + payload rewriting)

- **`app/api/v3/[...path]/route.ts`**
  - Proxies `/api/v3/*` to `https://www.notion.so/api/v3/*`.
  - Rewrites request JSON for public page endpoints so Notion resolves the **correct public space** even though we’re hosted on `localhost`/your domain.
  - Optionally rewrites response JSON strings so the Notion client doesn’t see conflicting host/origin values.
  - Neutralizes a small allowlist of auth-only calls that would otherwise return 401 and trigger Notion’s “restricted” UI for anonymous users.

### Notion image proxy

- **`app/image/[...path]/route.ts`**
  - Proxies Notion’s `/image/*` endpoint.
  - Handles Notion’s special `/image/<url-encoded-https-url>` format by using the **raw encoded** path segment from the incoming request URL.
  - Tries direct S3 fetch for truly public objects, but falls back to Notion’s image proxy (which returns signed URLs) and follows redirects server-side so the browser sees **same-origin image bytes** (avoids CORS issues with Notion’s client-side `HEAD` checks).

### Notion `/f/*` endpoints

- **`app/f/[...path]/route.ts`**
  - Proxies `/f/*` requests (Notion uses this for some internal flows like refresh).

### Realtime / presence (“msgstore” / Primus)

- **`app/primus-v8/route.ts`**
  - Proxies Notion’s `msgstore-xxx.../primus-v8` realtime endpoint through your origin.
  - Upstream is `https://msgstore-001.www.notion.so/primus-v8/` by default (override with `NOTION_MSGSTORE_ORIGIN`).
  - Used together with the injected client-side msgstore rewrite shim.

### Shared helpers

- **`app/notion-proxy/proxy-headers.ts`**

  - Central helper to build safe response headers for proxied responses.
  - Avoids forwarding problematic headers like `content-length` when bodies may be rewritten.

- **`app/notion-proxy/inject-msgstore.ts`**

  - Injects a tiny script into Notion HTML to rewrite `https://msgstore-xxx.../primus-v8` → `/primus-v8` (same-origin).

- **`app/notion-proxy/inject-origin-guard.ts`**

  - Injects a tiny script to prevent navigation from escaping to the public Notion domain (which would fail iframe embedding due to Notion CSP).

- **`app/notion-proxy/inject-debug.ts`**
  - Debug-only injection (`NOTION_PROXY_DEBUG=1`) to log failed network calls from inside the Notion iframe.

---

## Quick troubleshooting

- **Page flashes then “This page couldn’t be found”**

  - Usually means a missing/blocked request flips Notion into restricted mode.
  - Enable `NOTION_PROXY_DEBUG=1` and look for failing `/api/v3/*`, `/statsig/*`, `/primus-v8`, `/image/*` calls.

- **Images show “Go online / Permission denied”**
  - Indicates `HEAD` checks or image fetches are failing.
  - Confirm `/image/...` requests return 200/206 from your origin (not 302 to S3).
