import { NextRequest, NextResponse } from 'next/server';

const NOTION_URL =
  'https://silen.notion.site/Silen-Naihin-2370c99ae49c4e328b66b5e0d90cae3c';

export async function GET(_request: NextRequest) {
  try {
    // Fetch the Notion page
    const response = await fetch(NOTION_URL, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch Notion page' },
        { status: response.status }
      );
    }

    let html = await response.text();

    // Comprehensive URL rewriting - proxy ALL assets through our API
    const assetProxy = '/api/notion-asset';

    // Handle various URL patterns in attributes
    html = html.replace(/src="\/(?!\/)/g, `src="${assetProxy}/`);
    html = html.replace(/href="\/(?!\/)/g, `href="${assetProxy}/`);
    html = html.replace(/srcset="\/(?!\/)/g, `srcset="${assetProxy}/`);
    html = html.replace(/data-src="\/(?!\/)/g, `data-src="${assetProxy}/`);

    // Handle CSS url() patterns
    html = html.replace(/url\(["']?\/(?!\/)/g, `url("${assetProxy}/`);

    // Handle __NEXT_DATA__ and other inline scripts with relative URLs
    html = html.replace(
      /"\/_(next|assets|static|chunk)\//g,
      `"${assetProxy}/_$1/`
    );

    // Handle webpack chunks and other runtime paths
    html = html.replace(/"\/_next\//g, `"${assetProxy}/_next/`);
    html = html.replace(/"\/_assets\//g, `"${assetProxy}/_assets/`);

    // Inject interceptor BEFORE anything else loads
    html = html.replace(
      '<head>',
      `<head>
      <meta name="referrer" content="no-referrer-when-downgrade">
      <script>
        // CRITICAL: This must run BEFORE any other scripts
        (function() {
          const ASSET_PROXY = '/api/notion-asset';
          
          // Override webpack public path IMMEDIATELY
          window.__webpack_public_path__ = ASSET_PROXY + '/';
          
          // Intercept ALL script loading before it happens
          const originalCreateElement = document.createElement;
          document.createElement = function(tagName) {
            const element = originalCreateElement.call(document, tagName);
            if (tagName.toLowerCase() === 'script') {
              const srcDescriptor = Object.getOwnPropertyDescriptor(HTMLScriptElement.prototype, 'src');
              Object.defineProperty(element, 'src', {
                set: function(value) {
                  if (typeof value === 'string') {
                    // Strip localhost
                    if (value.includes('localhost:')) {
                      value = value.replace(/https?:\\/\\/localhost:\\d+/, '');
                    }
                    // Add proxy if relative and not already proxied
                    if (value.startsWith('/') && !value.startsWith('//') && !value.startsWith(ASSET_PROXY)) {
                      value = ASSET_PROXY + value;
                    }
                  }
                  srcDescriptor.set.call(this, value);
                },
                get: srcDescriptor.get
              });
            }
            return element;
          };
          
          // Also intercept setAttribute for scripts
          const originalSetAttribute = Element.prototype.setAttribute;
          Element.prototype.setAttribute = function(name, value) {
            if (this.tagName === 'SCRIPT' && name === 'src' && typeof value === 'string') {
              if (value.includes('localhost:')) {
                value = value.replace(/https?:\\/\\/localhost:\\d+/, '');
              }
              if (value.startsWith('/') && !value.startsWith('//') && !value.startsWith(ASSET_PROXY)) {
                value = ASSET_PROXY + value;
              }
            }
            return originalSetAttribute.call(this, name, value);
          };
        })();
      </script>`
    );

    // Add styles and runtime interceptors
    html = html.replace(
      '</head>',
      `<base href="${assetProxy}/" target="_blank">
      <style>
        html, body { 
          margin: 0 !important; 
          padding: 0 !important;
          overflow-x: hidden !important;
          width: 100% !important;
          height: 100% !important;
        }
        .notion-frame, .notion-page-content { 
          max-width: 100% !important; 
          margin: 0 auto !important;
        }
        /* Hide Notion's own header/sidebar if present */
        .notion-topbar, .notion-sidebar {
          display: none !important;
        }
      </style>
      <script>
        // Runtime interceptors for fetch and dynamic imports
        (function() {
          const ASSET_PROXY = '/api/notion-asset';
          
          // Intercept fetch
          const originalFetch = window.fetch;
          window.fetch = function(url, options) {
            if (typeof url === 'string') {
              if (url.includes('localhost:')) {
                url = url.replace(/https?:\/\/localhost:\d+/, '');
              }
              if (url.startsWith('/') && !url.startsWith('//') && !url.startsWith('/api/')) {
                url = ASSET_PROXY + url;
              }
            }
            return originalFetch(url, options);
          };
          
          // Keep trying to set webpack public path
          function setWebpackPath() {
            if (window.__webpack_require__) {
              window.__webpack_require__.p = ASSET_PROXY + '/';
            }
            setTimeout(setWebpackPath, 100);
          }
          setWebpackPath();
        })();
      </script>
      </head>`
    );

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html',
        'Cache-Control': 'public, max-age=300', // Cache for 5 minutes
      },
    });
  } catch (error) {
    console.error('Error fetching Notion page:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Notion page' },
      { status: 500 }
    );
  }
}
