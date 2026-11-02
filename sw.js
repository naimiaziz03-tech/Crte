/* CRTE Service Worker — v22 */
const CACHE_NAME = 'crte-v22';
const CORE_FILES = ['./', './index.html'];
const OPTIONAL_FILES = [
  './crte-app.webmanifest',
  './icon-crte-192.png',
  './icon-crte-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    // Les fichiers essentiels doivent être mis en cache.
    await cache.addAll(CORE_FILES);
    // Les fichiers facultatifs ne doivent pas faire échouer l'installation
    // s'ils sont absents ou si leur chemin diffère.
    await Promise.all(OPTIONAL_FILES.map(async (file) => {
      try { await cache.add(file); } catch (_) {}
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;

  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request, { ignoreSearch: true });
    try {
      const response = await fetch(request);
      if (response && (response.ok || response.type === 'opaque')) {
        cache.put(request, response.clone()).catch(() => {});
      }
      return response;
    } catch (error) {
      if (cached) return cached;
      throw error;
    }
  })());
});
