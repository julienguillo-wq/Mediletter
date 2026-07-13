/**
 * auth-fetch.js — attache automatiquement le JWT Supabase (Authorization: Bearer)
 * aux appels fetch vers les endpoints de génération protégés côté backend.
 *
 * À inclure APRÈS supabase-config.js (utilise getSession()). L'email de
 * l'utilisateur est déduit du token côté serveur ; le body n'a plus à le porter.
 */
(function () {
  if (window.__authFetchInstalled) return;
  window.__authFetchInstalled = true;
  const _fetch = window.fetch.bind(window);

  // Endpoints exigeant un JWT (fin de chemin, suivie de fin de chaîne ou '?')
  const PROTECTED = /\/(analyser(-entree)?|generer-section(-stream)?|regenerer-section|assembler(-stream)?|generer-entree|medentry-uga\/generer|api\/recherche-probleme|log-corrections-v2)(?=$|\?)/;

  window.fetch = async function (url, opts) {
    opts = opts || {};
    const u = typeof url === 'string' ? url : (url && url.url) || '';
    if (PROTECTED.test(u)) {
      try {
        if (typeof getSession === 'function') {
          const { session } = await getSession();
          const token = session && session.access_token;
          if (token) {
            opts.headers = Object.assign({}, opts.headers || {}, { Authorization: 'Bearer ' + token });
          }
        }
      } catch (e) { /* pas de session -> le backend renverra 401 */ }
    }
    return _fetch(url, opts);
  };
})();
