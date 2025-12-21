// Service Worker to intercept and proxy Notion asset requests
const NOTION_ORIGIN = 'https://www.notion.so';

self.addEventListener('install', (event) => {
  console.log('Notion Service Worker installing...');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Notion Service Worker activated');
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Intercept requests for Notion assets
  if (url.pathname.startsWith('/_assets') || 
      url.pathname.startsWith('/_next') || 
      url.pathname.startsWith('/statsig') ||
      url.pathname.startsWith('/_static')) {
    
    // Proxy to Notion
    const notionUrl = NOTION_ORIGIN + url.pathname + url.search;
    
    event.respondWith(
      fetch(notionUrl, {
        method: event.request.method,
        headers: event.request.headers,
        credentials: 'omit',
      })
    );
    return;
  }
  
  // Let other requests pass through
  event.respondWith(fetch(event.request));
});

