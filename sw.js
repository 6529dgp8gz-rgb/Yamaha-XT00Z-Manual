const CACHE = 'xt600z-v30';

// Use relative paths so it works on any host (Netlify, GitHub Pages, Vercel etc.)
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/apple-touch-icon.png',
  './icons/icon-512.png',
  './fig02.jpg',
  './fig03.jpg',
  './fig04.jpg',
  './fig06.jpg',
  './fig07.jpg',
  './fig08.jpg',
  './fig12.jpg',
  './fig13.jpg',
  './fig14.jpg',
  './fig15.jpg',
  './fig16.jpg',
  './fig17.jpg',
  './fig37.jpg',
  './fig38.jpg',
  './fig39.jpg',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  // Only handle GET requests
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(res => {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return res;
      });
    }).catch(() => caches.match('./index.html'))
  );
});
