/* CRTE PWA service worker — network-first updates, cached offline fallback */
const CACHE_NAME = 'crte-web-v1';
const CORE = ['./', './index.html', './crte-app.webmanifest', './icon-crte-192.png', './icon-crte-512.png'];
self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await Promise.all(CORE.map(async path => { try { await cache.add(path); } catch (_) {} }));
    await self.skipWaiting();
  })());
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key.startsWith('crte-web-') && key !== CACHE_NAME).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (req.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const fresh = await fetch(req);
        if (fresh && fresh.ok) (await caches.open(CACHE_NAME)).put('./index.html', fresh.clone());
        return fresh;
      } catch (_) {
        return (await caches.match('./index.html')) || (await caches.match('./'));
      }
    })());
    return;
  }
  event.respondWith((async () => {
    const cached = await caches.match(req);
    try {
      const fresh = await fetch(req);
      if (fresh && fresh.ok) (await caches.open(CACHE_NAME)).put(req, fresh.clone());
      return fresh;
    } catch (_) { if (cached) return cached; throw _; }
  })());
});
