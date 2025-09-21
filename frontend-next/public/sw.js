/* Minimal SW for prefetch and stale-while-revalidate */
const CACHE_NAME = 'cu-cache-v1';
const PREFETCH = [
  '/api/cards/search?page=1&pageSize=50',
  '/api/cards/search?faction=solaris&page=1&pageSize=50',
  '/api/cards/search?faction=umbral&page=1&pageSize=50',
  '/api/cards/search?faction=aeonic&page=1&pageSize=50',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PREFETCH)).catch(() => undefined)
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);
  // Only handle GET requests to same-origin APIs or images
  if (req.method !== 'GET' || url.origin !== location.origin) return;
  if (!url.pathname.startsWith('/api/cards') && !url.pathname.match(/\.(png|jpg|jpeg|webp|avif|svg)$/)) return;

  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cached = await cache.match(req);
      const fetchPromise = fetch(req)
        .then((networkResp) => {
          if (networkResp && networkResp.status === 200) {
            cache.put(req, networkResp.clone());
          }
          return networkResp;
        })
        .catch(() => cached);
      return cached || fetchPromise;
    })
  );
});


