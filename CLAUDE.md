# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server (localhost:3000)
npm run build    # Production build
npm run lint     # Run ESLint
npm run start    # Start production server
```

## Architecture

This is a Next.js 16 personal website with App Router, React 19, and Tailwind CSS 4.

### Pages

- `/` - Home page with bio sections
- `/content` - Interactive content page with books, podcasts, projects, links (query param selects tab)
- `/blog` - Embeds a public Notion page via iframe

### Notion Proxy System

The `/blog` page embeds a public Notion page inside an iframe. Since Notion blocks iframe embedding via CSP, we proxy all Notion resources through Next.js route handlers.

**Environment Variables:**
- `NOTION_PAGE_URL` - Required. The public Notion page URL to embed
- `NOTION_PROXY_DEBUG=1` - Optional. Injects client-side logger for debugging

**Request Flow:**
1. iframe `src` uses the Notion page pathname (e.g. `/My-Page-<32hex>`)
2. `app/[...path]/route.ts` catches Notion-looking paths, proxies HTML, injects shims
3. Notion SPA boots and requests are proxied:
   - `/_assets/*` → `app/notion-assets/[...path]/route.ts`
   - `/api/v3/*` → `app/api/v3/[...path]/route.ts`
   - `/statsig/*` → `app/statsig/[...path]/route.ts`
   - `/image/*` → `app/image/[...path]/route.ts`
   - `/primus-v8` → `app/primus-v8/route.ts` (realtime/presence)

**Key files:**
- `next.config.ts` - Rewrites `/_assets/*` to `/notion-assets/*` (App Router treats `_` folders as private)
- `app/notion-proxy/proxy-headers.ts` - Builds safe response headers
- `app/notion-proxy/inject-*.ts` - Client-side shims injected into Notion HTML

### Content System

Content is stored in `app/content/data.ts` with TypeScript interfaces:
- `Book` - title, author, cover, spineColor, rating, reflections, dateRead
- `Podcast` - title, cover, url, summary, recommendations, episodes, rating
- `Project` - title, description, image, url, tags, reflections
- `Link` - name, url, category, reflections

### Reusable Components

- `DetailsColumn` - Generic positioning component for showing details panels relative to selected items (used by books, podcasts)
- `Book3D` / `PodcastCover` - Visual item representations with selection states

### Path Alias

`@/*` maps to project root (e.g., `@/app/components/...`)
