/**
 * Prevent Notion's SPA from navigating the iframe to the public Notion domain
 * (e.g. https://silen.notion.site/...), which will be blocked by Notion's CSP
 * `frame-ancestors` when embedded on our domain.
 *
 * We inject a tiny client-side shim that rewrites navigation targets that point
 * at the configured public Notion host back to same-origin paths.
 *
 * This is intentionally NOT tied to NOTION_PROXY_DEBUG; it's required for reliability.
 */
const DISABLE = process.env.NOTION_PROXY_DISABLE_ORIGIN_GUARD === '1';

function originGuardScript(configuredHost: string) {
  // Keep this minimal and dependency-free.
  const safeHost = JSON.stringify(configuredHost);
  return `
<script>
(() => {
  const HOST = ${safeHost};
  const prefix = location.pathname.startsWith('/notion-proxy') ? '/notion-proxy' : '';

  const rewrite = (u) => {
    try {
      if (!u || typeof u !== 'string') return u;
      const url = new URL(u, location.href);
      if (url.host !== HOST) return u;
      return prefix + url.pathname + url.search + url.hash;
    } catch {
      return u;
    }
  };

  // Intercept anchor clicks (capture phase).
  try {
    document.addEventListener(
      'click',
      (e) => {
        try {
          const t = e.target;
          if (!t) return;
          const a = t.closest ? t.closest('a[href]') : null;
          if (!a) return;
          const href = a.getAttribute('href') || '';
          const next = rewrite(href);
          if (next && next !== href) a.setAttribute('href', next);
        } catch {}
      },
      true
    );
  } catch {}

  // Patch location navigation helpers.
  try {
    const origAssign = window.location.assign.bind(window.location);
    window.location.assign = (u) => origAssign(rewrite(String(u)));
  } catch {}
  try {
    const origReplace = window.location.replace.bind(window.location);
    window.location.replace = (u) => origReplace(rewrite(String(u)));
  } catch {}

  // Patch window.open
  try {
    const origOpen = window.open;
    window.open = function(u, ...rest) {
      return origOpen.call(this, rewrite(typeof u === 'string' ? u : String(u)), ...rest);
    };
  } catch {}

  // Patch history methods (some SPA navigations use these).
  try {
    const origPush = history.pushState.bind(history);
    history.pushState = function(state, title, url) {
      return origPush(state, title, typeof url === 'string' ? rewrite(url) : url);
    };
  } catch {}
  try {
    const origRep = history.replaceState.bind(history);
    history.replaceState = function(state, title, url) {
      return origRep(state, title, typeof url === 'string' ? rewrite(url) : url);
    };
  } catch {}
})();
</script>
`.trim();
}

export function maybeInjectOriginGuard(
  html: string,
  opts: { configuredHost: string | null }
) {
  if (DISABLE) return html;
  const host = opts.configuredHost;
  if (!host) return html;
  const snippet = originGuardScript(host);

  // Inject as early as possible (right after <head ...>).
  const headOpenMatch = html.match(/<head[^>]*>/i);
  if (headOpenMatch?.[0]) {
    return html.replace(headOpenMatch[0], `${headOpenMatch[0]}${snippet}`);
  }
  if (html.includes('</head>')) return html.replace('</head>', `${snippet}</head>`);
  if (html.includes('</body>')) return html.replace('</body>', `${snippet}</body>`);
  return `${html}\n${snippet}`;
}


