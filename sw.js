var CACHE = "crte-v2";
var FILES = ["./", "./index.html", "./crte-app.webmanifest", "./icon-crte-192.png", "./icon-crte-512.png"];

self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (c) { return c.addAll(FILES); })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE; })
        .map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

// يعرض النسخة المحفوظة فورا (تعمل بدون إنترنت) ويحدّثها في الخلفية
self.addEventListener("fetch", function (e) {
  var r = e.request;
  if (r.method !== "GET") return;
  e.respondWith(
    caches.open(CACHE).then(function (c) {
      return c.match(r, { ignoreSearch: true }).then(function (hit) {
        var net = fetch(r).then(function (res) {
          if (res && (res.status === 200 || res.type === "opaque")) c.put(r, res.clone());
          return res;
        }).catch(function () { return hit; });
        return hit || net;
      });
    })
  );
});
