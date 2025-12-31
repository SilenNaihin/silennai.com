export function buildResponseHeadersFromUpstream(
  upstream: Headers,
  opts?: {
    cacheControl?: string;
    // If true, includes Set-Cookie headers (important for some Notion flows)
    includeSetCookie?: boolean;
    // Override/add these headers after copying.
    override?: Record<string, string>;
  }
) {
  const headers = new Headers();

  // Copy a conservative allowlist of headers that are safe/useful.
  const allow = new Set([
    'content-type',
    'cache-control',
    'etag',
    'last-modified',
    'vary',
    'accept-ranges',
    'content-range',
    // NOTE: we intentionally do NOT forward content-length/content-encoding,
    // because many of our routes rewrite the body (HTML/JSON), which would make
    // those upstream headers incorrect.
  ]);

  upstream.forEach((value, key) => {
    const k = key.toLowerCase();
    if (allow.has(k)) headers.set(key, value);
  });

  if (opts?.cacheControl) headers.set('Cache-Control', opts.cacheControl);

  if (opts?.includeSetCookie) {
    // Undici supports getSetCookie() for multiple Set-Cookie values.
    const anyUpstream = upstream as unknown as {
      getSetCookie?: () => string[];
    };
    const setCookies: string[] | undefined =
      typeof anyUpstream.getSetCookie === 'function'
        ? anyUpstream.getSetCookie()
        : undefined;
    if (setCookies?.length) {
      for (const c of setCookies) headers.append('Set-Cookie', c);
    } else {
      const single = upstream.get('set-cookie');
      if (single) headers.set('Set-Cookie', single);
    }
  }

  if (opts?.override) {
    for (const [k, v] of Object.entries(opts.override)) headers.set(k, v);
  }

  return headers;
}
