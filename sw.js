/* CRTE Service Worker — network-first + automatic updates */
const CACHE_NAME = "crte-shell-v23";
const CORE_FILES = [
  "./",
  "./index.html",
  "./crte-app.webmanifest",
  "./icon-crte-192.png",
  "./icon-crte-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    // Cache the app shell for offline fallback; missing optional files won't block install.
    await Promise.all(CORE_FILES.map(async (file) => {
      try {
        const response = await fetch(file, {cache: "no-store"});
        if (response && response.ok) await cache.put(file, response);
      } catch (_) {}
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys
      .filter((key) => key.startsWith("crte-shell-") && key !== CACHE_NAME)
      .map((key) => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== self.location.origin) return;

  // Always try the latest HTML from the server first; use cache only if offline.
  if (request.mode === "navigate") {
    event.respondWith((async () => {
      try {
        const response = await fetch(request, {cache: "no-store"});
        if (response && response.ok) {
          const cache = await caches.open(CACHE_NAME);
          cache.put("./index.html", response.clone()).catch(() => {});
        }
        return response;
      } catch (_) {
        const cache = await caches.open(CACHE_NAME);
        return (await cache.match(request)) ||
               (await cache.match("./index.html")) ||
               Response.error();
      }
    })());
    return;
  }

  // For local app assets, prefer the network so changed files become available immediately.
  event.respondWith((async () => {
    try {
      const response = await fetch(request, {cache: "no-store"});
      if (response && response.ok) {
        const cache = await caches.open(CACHE_NAME);
        cache.put(request, response.clone()).catch(() => {});
      }
      return response;
    } catch (_) {
      const cache = await caches.open(CACHE_NAME);
      return (await cache.match(request)) || Response.error();
    }
  })());
});
