// Enregistrement UNIQUE du service worker racine (scope "/"), partagé par le hub
// et tous les modules. Remplace les anciens kill-switch / SW inline / SW blob.
// Pas de suppression de cache à chaque chargement : les stratégies du SW
// (network-first HTML/JSON) garantissent déjà le contenu frais.
(function () {
    if (!('serviceWorker' in navigator)) return;
    var hadController = !!navigator.serviceWorker.controller;

    window.addEventListener('load', function () {
        navigator.serviceWorker.register('/sw.js').catch(function () {});

        // Nettoyage ciblé des anciens SW de sous-scope (ex : /mediletter/sw.js).
        // On NE touche PAS au SW racine (pathname "/").
        navigator.serviceWorker.getRegistrations().then(function (regs) {
            regs.forEach(function (r) {
                try {
                    if (r.scope && new URL(r.scope).pathname !== '/') r.unregister();
                } catch (e) {}
            });
        }).catch(function () {});
    });

    // Après un déploiement, le nouveau SW prend le contrôle : un seul reload pour
    // garantir du frais. Pas de reload à la toute première installation.
    var reloaded = false;
    navigator.serviceWorker.addEventListener('controllerchange', function () {
        if (!hadController || reloaded) return;
        reloaded = true;
        window.location.reload();
    });
})();
