const CACHE_NAME = 'medhub-v15';
const ASSETS = [
    './',
    './index.html',
    './icon-192x192.png',
    './icon-512x512.png',
    './mediletter/index.html',
    './mediletter/prompt.js',
    './medapp/index.html',
    './geriaquest/index.html',
    './medentry/index.html',
    './medentry/uga.html',
    './medentry/vdr.html'
];

// Install
self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(ASSETS))
            .then(() => self.skipWaiting())
    );
});

// Activate
self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
        ).then(() => self.clients.claim())
    );
});

// Fetch
self.addEventListener('fetch', (e) => {
    // Ne pas intercepter les requêtes POST/PUT/DELETE (appels API backend)
    if (e.request.method !== 'GET') return;

    if (e.request.url.includes('api.anthropic.com')) return;

    e.respondWith(
        caches.match(e.request)
            .then(cached => cached || fetch(e.request))
            .catch(() => caches.match('./index.html'))
    );
});
