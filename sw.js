/* Precache everything on install so the guide works with no signal at all.
 *
 * Strategy is network-first with a short timeout, falling back to cache:
 *  - On Wi-Fi the app always picks up the latest deploy, so a fix cannot be
 *    trapped behind a stale cache.
 *  - With no signal each request gives up quickly and is served from cache.
 *    This only affects a cold start; once the page is open it makes no further
 *    requests, because all the route data lives in the loaded page.
 */
const CACHE = 'audioguide-v2';
const NET_TIMEOUT = 2500;
const ASSETS = [
  './',
  'index.html',
  'js/route.js',
  'js/app.js',
  'manifest.webmanifest',
  'icons/icon-192.png',
  'icons/icon-512.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE)
      // cache: 'reload' so precaching cannot be satisfied by a stale HTTP cache
      .then(c => c.addAll(ASSETS.map(u => new Request(u, { cache: 'reload' }))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

function fromNetwork(request, ms) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('timeout')), ms);
    fetch(request).then(
      (res) => { clearTimeout(timer); resolve(res); },
      (err) => { clearTimeout(timer); reject(err); }
    );
  });
}

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  if (new URL(e.request.url).origin !== self.location.origin) return;

  e.respondWith(
    fromNetwork(e.request, NET_TIMEOUT)
      .then((res) => {
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, copy));
        }
        return res;
      })
      .catch(() =>
        caches.match(e.request, { ignoreSearch: true })
          .then(hit => hit || caches.match('index.html'))
      )
  );
});
