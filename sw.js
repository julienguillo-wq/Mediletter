const CACHE_NAME = 'medhub-v28';
const ASSETS = [
    './',
    './index.html',
    './icon-192x192.png',
    './icon-512x512.png',
    './mediletter/index.html',
    './mediletter/prompt.js',
    './medapp/index.html',
    './medapp/data/articles_frequent_ed.js',
    './recherche/index.html',
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

    // Ne pas intercepter les appels API admin (GET JSON, pas des assets statiques)
    if (e.request.url.includes('/admin/')) return;

    if (e.request.url.includes('api.anthropic.com')) return;

    // Pages HTML (navigations) → network-first : on tente le réseau pour avoir
    // toujours la dernière version, on retombe sur le cache seulement hors-ligne.
    const accepteHTML = e.request.headers.get('accept') || '';
    const estNavigation = e.request.mode === 'navigate' || accepteHTML.includes('text/html');

    if (estNavigation) {
        e.respondWith(
            fetch(e.request)
                .then(reponse => {
                    // Mettre à jour le cache avec la version fraîche
                    const copie = reponse.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put(e.request, copie));
                    return reponse;
                })
                .catch(() => caches.match(e.request).then(cached => cached || caches.match('./index.html')))
        );
        return;
    }

    // Assets (icônes, JS, images…) → cache-first pour la vitesse.
    e.respondWith(
        caches.match(e.request)
            .then(cached => cached || fetch(e.request))
            .catch(() => caches.match('./index.html'))
    );
});
