/**
 * AuthGuard — Protection des routes MedHub
 *
 * Ce script vérifie que l'utilisateur est connecté.
 * S'il ne l'est pas, il est redirigé vers la page de connexion.
 *
 * Pages exclues de la protection :
 * - /login.html
 * - /signup.html
 * - /forgot-password.html
 * - /auth/callback.html
 *
 * Utilisation : Ajouter <script src="/js/auth-guard.js"></script>
 * dans toutes les pages protégées, APRÈS supabase-config.js
 */

(async function authGuard() {
    'use strict';

    // Pages qui ne nécessitent PAS d'authentification
    const pagesPubliques = [
        '/login.html',
        '/signup.html',
        '/forgot-password.html',
        '/auth/callback.html'
    ];

    // Vérifier si la page actuelle est publique
    const cheminActuel = window.location.pathname;
    const estPagePublique = pagesPubliques.some(page =>
        cheminActuel.endsWith(page)
    );

    // Ne pas protéger les pages publiques
    if (estPagePublique) return;

    // Masquer le contenu pendant la vérification (éviter le flash)
    document.documentElement.style.opacity = '0';
    document.documentElement.style.transition = 'opacity 0.3s ease';

    try {
        // Attendre que Supabase soit disponible
        if (typeof getSession !== 'function') {
            console.error('[AuthGuard] supabase-config.js doit être chargé avant auth-guard.js');
            document.documentElement.style.opacity = '1';
            return;
        }

        const { session, error } = await getSession();

        if (!session) {
            // Sauvegarder l'URL de destination pour rediriger après connexion
            const destination = window.location.href;
            sessionStorage.setItem('medhub_redirect_after_login', destination);

            // Calculer le chemin relatif vers login.html
            const basePath = cheminActuel.substring(0, cheminActuel.lastIndexOf('/') + 1);
            // Remonter au dossier racine si on est dans un sous-dossier
            const profondeur = (basePath.match(/\//g) || []).length - 1;
            const prefixe = profondeur > 0 ? '../'.repeat(profondeur) : './';

            window.location.replace(prefixe + 'login.html');
            return;
        }

        // Utilisateur connecté — afficher le contenu
        document.documentElement.style.opacity = '1';

    } catch (err) {
        console.error('[AuthGuard] Erreur lors de la vérification :', err);
        // En cas d'erreur, afficher la page quand même (mode dégradé)
        document.documentElement.style.opacity = '1';
    }
})();
