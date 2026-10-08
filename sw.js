/* CPT MMA service worker.
   Purpose: make the site installable to a phone home screen and keep it usable
   with no signal. Network always wins while online, so a cached page can never
   go stale on a visitor. The cache is only ever read when the network fails. */

const CACHE = 'cpt-v1';

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith('/api/')) return;

  // Only page navigations go through the worker. Images, video and fonts are
  // left to the browser so range requests on the hero video are untouched.
  if (req.mode !== 'navigate') return;

  e.respondWith((async () => {
    try {
      const fresh = await fetch(req);
      const cache = await caches.open(CACHE);
      cache.put(req, fresh.clone());
      return fresh;
    } catch (err) {
      const cached = await caches.match(req);
      if (cached) return cached;
      const home = await caches.match('/');
      if (home) return home;
      throw err;
    }
  })());
});
