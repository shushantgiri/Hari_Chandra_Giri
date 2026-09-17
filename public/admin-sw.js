// Service worker for the /admin admin PWA only — it's registered
// with scope: "/admin", so it never touches the public site.
//
// Strategy: network-first for navigations (admins want fresh data, not a
// stale dashboard), falling back to a cached shell or the offline page when
// there's no connection. Cache-first for the static assets that make up the
// app shell, since those rarely change between deploys.

const CACHE_VERSION = "admin-v1";
const APP_SHELL = [
  "/admin",
  "/admin/offline",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/admin-manifest.webmanifest",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_VERSION)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((key) => key !== CACHE_VERSION).map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Only handle GET requests within our own scope — everything else
  // (Supabase API calls, uploads, POSTs) passes straight through untouched.
  if (request.method !== "GET" || !request.url.startsWith(self.location.origin)) {
    return;
  }

  const isNavigation = request.mode === "navigate";

  if (isNavigation) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_VERSION).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(
          async () =>
            (await caches.match(request)) ||
            (await caches.match("/admin/offline")),
        ),
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(
      (cached) =>
        cached ||
        fetch(request).then((response) => {
          const copy = response.clone();
          caches.open(CACHE_VERSION).then((cache) => cache.put(request, copy));
          return response;
        }),
    ),
  );
});
