import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const assetPath = path.join('/');
  
  // Construct the Notion asset URL
  const notionUrl = `https://www.notion.so/${assetPath}`;
  
  try {
    const response = await fetch(notionUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Referer': 'https://www.notion.so/',
      },
    });

    if (!response.ok) {
      return new NextResponse('Not Found', { status: 404 });
    }

    // Get content type from Notion response
    const contentType = response.headers.get('content-type') || 'application/octet-stream';
    
    // For JavaScript and CSS files, rewrite URLs to use our proxy
    if (contentType.includes('javascript') || contentType.includes('json') || contentType.includes('css')) {
      let content = await response.text();
      
      // Get the current host from the request
      const host = request.headers.get('host') || 'localhost:3000';
      const protocol = request.headers.get('x-forwarded-proto') || 'http';
      const baseUrl = `${protocol}://${host}`;
      
      // Rewrite all asset references to use RELATIVE URLs only
      // The browser's base tag and our interceptors will handle the rest
      
      // Replace absolute notion.so URLs with relative
      content = content.replace(/https?:\/\/www\.notion\.so\//g, '/');
      content = content.replace(/https?:\/\/[^/]*\.notion\.site\//g, '/');
      
      // Replace any localhost references with relative
      content = content.replace(/https?:\/\/localhost:\d+\//g, '/');
      
      // Keep relative URLs as-is - they'll be handled by base tag
      // Just make sure we don't have any /api/notion-asset already in the content
      content = content.replace(/\/api\/notion-asset\//g, '/');
      
      // Set webpack public path to use relative URLs
      if (contentType.includes('javascript')) {
        // Inject publicPath override at the start using a relative path
        content = `(typeof __webpack_public_path__ !== 'undefined' && (__webpack_public_path__ = '/api/notion-asset/'));` + content;
      }
      
      return new NextResponse(content, {
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=3600', // Cache for 1 hour (shorter for rewritten content)
          'Access-Control-Allow-Origin': '*',
        },
      });
    }
    
    // For binary assets (images, fonts, etc), serve as-is
    const content = await response.arrayBuffer();
    return new NextResponse(content, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Error fetching Notion asset:', notionUrl, error);
    return new NextResponse('Error fetching asset', { status: 500 });
  }
}

