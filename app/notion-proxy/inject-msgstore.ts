/**
 * Inject a tiny client-side shim that rewrites Notion's realtime msgstore polling
 * requests (primus-v8) to our own origin (`/primus-v8/...`), which we proxy server-side.
 *
 * This is intentionally NOT tied to NOTION_PROXY_DEBUG; it's required for reliability.
 */
const DISABLE = process.env.NOTION_PROXY_DISABLE_MSGSTORE === '1';

function msgstoreRewriteScript() {
  // Keep this minimal and dependency-free.
  return `
<script>
(() => {
  const MSGSTORE_RE = /^https:\\/\\/msgstore-\\d+\\.www\\.notion\\.so\\/primus-v8\\/?/i;
  const rewrite = (u) => {
    try {
      if (typeof u !== 'string') return u;
      // Important: rewrite to /primus-v8 (no trailing slash) to avoid Next.js 308 redirects.
      if (MSGSTORE_RE.test(u)) return u.replace(MSGSTORE_RE, '/primus-v8');
      return u;
    } catch {
      return u;
    }
  };

  // Patch fetch()
  try {
    const origFetch = window.fetch;
    if (typeof origFetch === 'function') {
      window.fetch = function(...args) {
        const first = args && args[0];
        if (typeof first === 'string') {
          args[0] = rewrite(first);
        } else if (first && typeof first.url === 'string' && MSGSTORE_RE.test(first.url)) {
          args[0] = new Request(rewrite(first.url), first);
        }
        return origFetch.apply(this, args);
      };
    }
  } catch {}

  // Patch XMLHttpRequest.open()
  try {
    const XHR = window.XMLHttpRequest;
    if (XHR && XHR.prototype) {
      const origOpen = XHR.prototype.open;
      XHR.prototype.open = function(method, url, ...rest) {
        return origOpen.call(this, method, rewrite(url), ...rest);
      };
    }
  } catch {}
})();
</script>
`.trim();
}

export function maybeInjectMsgstoreRewrite(html: string) {
  if (DISABLE) return html;
  const snippet = msgstoreRewriteScript();

  // Inject as early as possible (right after <head ...>).
  const headOpenMatch = html.match(/<head[^>]*>/i);
  if (headOpenMatch?.[0]) {
    return html.replace(headOpenMatch[0], `${headOpenMatch[0]}${snippet}`);
  }
  if (html.includes('</head>')) return html.replace('</head>', `${snippet}</head>`);
  if (html.includes('</body>')) return html.replace('</body>', `${snippet}</body>`);
  return `${html}\n${snippet}`;
}


