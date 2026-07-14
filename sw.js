// =====================================================================
// Service worker UNIQUE (scope racine "/"). Contrôle le hub et TOUS les modules.
//
// Stratégies :
//   - Navigations (HTML) + données .json  -> network-first (toujours frais),
//     repli sur le cache uniquement hors-ligne.
//   - Assets statiques (js/css/images/fonts) -> stale-while-revalidate
//     (rapide, mis à jour en tâche de fond).
//
// Conséquence : un déploiement est vu SANS bump manuel du cache. Bumper
// CACHE_NAME reste possible pour purger de force, mais ce n'est plus nécessaire
// à chaque mise en ligne (c'était la cause des « rien n'apparaît »).
// =====================================================================
const CACHE_NAME = 'medhub-v31';

const CORE = [
    './', './index.html', './manifest.json',
    './icon-192x192.png', './icon-512x512.png',
    './js/supabase-config.js', './js/auth-guard.js', './js/auth-fetch.js', './js/sw-register.js',
    './medapp/index.html', './medapp/data/articles_frequent_ed.js',
    './mediletter/index.html', './mediletter/prompt.js',
    './medentry/index.html', './medentry/uga.html', './medentry/vdr.html',
    './recherche/index.html',
];

const ASSET_RE = /\.(?:js|css|png|jpe?g|svg|webp|ico|woff2?|ttf|webmanifest)$/i;

self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME)
            // best-effort : un asset manquant ne fait pas échouer l'install
            .then((cache) => Promise.allSettled(CORE.map((u) => cache.add(u))))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys()
            .then((keys) => Promise.all(
                keys.filter((k) => k.startsWith('medhub-') && k !== CACHE_NAME).map((k) => caches.delete(k))
            ))
            .then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (e) => {
    const req = e.request;
    if (req.method !== 'GET') return;                    // POST / SSE / mutations API -> réseau
    const url = new URL(req.url);
    if (url.origin !== self.location.origin) return;     // CDN / tiers -> navigateur
    if (url.pathname.startsWith('/admin/')) return;      // API admin -> réseau

    const accept = req.headers.get('accept') || '';
    const isNav = req.mode === 'navigate' || accept.includes('text/html');

    // HTML + JSON -> network-first
    if (isNav || url.pathname.endsWith('.json')) {
        e.respondWith(
            fetch(req)
                .then((resp) => {
                    const copy = resp.clone();
                    caches.open(CACHE_NAME).then((c) => c.put(req, copy)).catch(() => {});
                    return resp;
                })
                .catch(() => caches.match(req).then((c) => c || (isNav ? caches.match('./index.html') : undefined)))
        );
        return;
    }

    // Assets statiques -> stale-while-revalidate
    if (ASSET_RE.test(url.pathname)) {
        e.respondWith(
            caches.match(req).then((cached) => {
                const network = fetch(req)
                    .then((resp) => {
                        const copy = resp.clone();
                        caches.open(CACHE_NAME).then((c) => c.put(req, copy)).catch(() => {});
                        return resp;
                    })
                    .catch(() => cached);
                return cached || network;
            })
        );
        return;
    }

    // Autres GET same-origin (endpoints API GET) -> réseau direct, pas de cache
});
