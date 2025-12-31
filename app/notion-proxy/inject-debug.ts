const NOTION_PROXY_DEBUG = process.env.NOTION_PROXY_DEBUG === '1';

function debugScript() {
  // Keep this script tiny + dependency-free. We inject it into Notion's HTML
  // so we can see which network call triggers "restricted" behavior.
  return `
<script>
(() => {
  const TAG = '[notion-proxy:client]';
  const MSGSTORE_RE = /^https:\/\/msgstore-\d+\.www\.notion\.so\/primus-v8\/?/i;
  const rewriteMsgstore = (u) => {
    try {
      if (typeof u !== 'string') return u;
      // Keep no trailing slash to avoid Next.js 308 redirects.
      if (MSGSTORE_RE.test(u)) return u.replace(MSGSTORE_RE, '/primus-v8');
      return u;
    } catch {
      return u;
    }
  };
  try {
    const origFetch = window.fetch;
    if (typeof origFetch === 'function') {
      window.fetch = async (...args) => {
        const first = args && args[0];
        const url =
          (first &&
            (typeof first === 'string'
              ? first
              : first && typeof first.url === 'string'
                ? first.url
                : '')) ||
          '';

        // Rewrite msgstore polling to our same-origin proxy.
        if (typeof first === 'string') {
          args[0] = rewriteMsgstore(first);
        } else if (first && typeof first.url === 'string' && MSGSTORE_RE.test(first.url)) {
          // Clone Request with rewritten URL so we don't lose method/headers.
          args[0] = new Request(rewriteMsgstore(first.url), first);
        }
        try {
          const res = await origFetch(...args);
          if (!res.ok) {
            console.warn(TAG, 'fetch non-2xx', res.status, res.statusText, url);
          }
          return res;
        } catch (e) {
          console.warn(TAG, 'fetch threw', url, e && (e.message || String(e)));
          throw e;
        }
      };
    }
  } catch {}

  try {
    const XHR = window.XMLHttpRequest;
    if (XHR && XHR.prototype) {
      const origOpen = XHR.prototype.open;
      const origSend = XHR.prototype.send;
      XHR.prototype.open = function(method, url, ...rest) {
        const nextUrl = rewriteMsgstore(url);
        this.__np_method = method;
        this.__np_url = nextUrl;
        return origOpen.call(this, method, nextUrl, ...rest);
      };
      XHR.prototype.send = function(...args) {
        this.addEventListener('load', () => {
          try {
            if (this.status >= 400) {
              console.warn(TAG, 'xhr non-2xx', this.status, this.__np_method, this.__np_url);
            }
          } catch {}
        });
        this.addEventListener('error', () => {
          try {
            console.warn(TAG, 'xhr error', this.__np_method, this.__np_url);
          } catch {}
        });
        this.addEventListener('abort', () => {
          try {
            console.warn(TAG, 'xhr abort', this.__np_method, this.__np_url);
          } catch {}
        });
        return origSend.call(this, ...args);
      };
    }
  } catch {}
})();
</script>
`.trim();
}

export function maybeInjectNotionDebug(html: string) {
  if (!NOTION_PROXY_DEBUG) return html;
  const snippet = debugScript();

  // Inject as early as possible (right after the opening <head ...> tag)
  // so we can intercept XHR/fetch before Notion boot code runs.
  const headOpenMatch = html.match(/<head[^>]*>/i);
  if (headOpenMatch?.[0]) {
    return html.replace(headOpenMatch[0], `${headOpenMatch[0]}${snippet}`);
  }

  // Fallback: inject before </head> if possible, otherwise before </body>.
  if (html.includes('</head>')) return html.replace('</head>', `${snippet}</head>`);
  if (html.includes('</body>')) return html.replace('</body>', `${snippet}</body>`);
  return `${html}\n${snippet}`;
}


