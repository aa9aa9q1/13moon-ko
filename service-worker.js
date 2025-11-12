const CACHE = '13moon-cache-v2';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './dreamspell_icon_512.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await cache.addAll(ASSETS);
  })());
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map(k => k !== CACHE ? caches.delete(k) : null));
  })());
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (url.origin === location.origin) {
    e.respondWith((async () => {
      const cache = await caches.open(CACHE);
      const cached = await cache.match(e.request);
      if (cached) return cached;
      try {
        const fresh = await fetch(e.request);
        if (e.request.method === 'GET' && fresh.status === 200) cache.put(e.request, fresh.clone());
        return fresh;
      } catch {
        return cached || Response.error();
      }
    })());
  }
});