import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      // Notion loads many assets from absolute paths like "/_assets/...".
      // App Router treats folders starting with "_" as private, so we rewrite
      // that public URL to a routable proxy endpoint.
      {
        source: '/_assets/:path*',
        destination: '/notion-assets/:path*',
      },
      // Notion also requests some root-level assets while rendering public pages.
      // Route them through the proxy so they resolve from the Notion origin.
      {
        source: '/icons/:path*',
        destination: '/notion-proxy/icons/:path*',
      },
      {
        source: '/images/:path*',
        destination: '/notion-proxy/images/:path*',
      },
      {
        // Matches root files like "/print.e2ba4c31.css"
        source: '/:path(print.*)',
        destination: '/notion-proxy/:path',
      },
    ];
  },
};

export default nextConfig;
