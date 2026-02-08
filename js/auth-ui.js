/**
 * Auth UI — Composants d'interface utilisateur pour l'authentification MedHub
 *
 * Ce script injecte dynamiquement :
 * - Le nom de l'utilisateur connecté dans la top-bar
 * - Un menu utilisateur avec déconnexion et lien vers les paramètres
 * - Les initiales dans l'avatar
 *
 * Utilisation : Ajouter <script src="/js/auth-ui.js"></script>
 * dans les pages protégées, APRÈS supabase-config.js
 */

(function () {
    'use strict';

    // Styles CSS du menu utilisateur (injectés une seule fois)
    const styles = `
        .medhub-user-menu-wrapper {
            position: relative;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            cursor: pointer;
            margin-left: auto;
        }

        .medhub-user-menu-trigger {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 0.375rem 0.5rem;
            border-radius: 12px;
            transition: background 0.2s ease;
            cursor: pointer;
            border: none;
            background: transparent;
            font-family: inherit;
        }

        .medhub-user-menu-trigger:hover {
            background: rgba(0, 0, 0, 0.04);
        }

        .medhub-chevron {
            width: 16px;
            height: 16px;
            color: var(--text-muted, #94A3B8);
            transition: transform 0.2s ease;
        }

        .medhub-user-menu-wrapper.open .medhub-chevron {
            transform: rotate(180deg);
        }

        .medhub-dropdown {
            position: absolute;
            top: calc(100% + 8px);
            right: 0;
            min-width: 220px;
            background: white;
            border-radius: 16px;
            box-shadow: 0 12px 40px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.06);
            border: 1px solid rgba(0,0,0,0.06);
            padding: 0.5rem;
            opacity: 0;
            visibility: hidden;
            transform: translateY(-8px) scale(0.97);
            transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
            z-index: 9999;
        }

        .medhub-user-menu-wrapper.open .medhub-dropdown {
            opacity: 1;
            visibility: visible;
            transform: translateY(0) scale(1);
        }

        .medhub-dropdown-header {
            padding: 0.75rem;
            border-bottom: 1px solid rgba(0,0,0,0.06);
            margin-bottom: 0.25rem;
        }

        .medhub-dropdown-name {
            font-size: 0.875rem;
            font-weight: 600;
            color: #0F172A;
        }

        .medhub-dropdown-email {
            font-size: 0.75rem;
            color: #94A3B8;
            margin-top: 0.125rem;
            word-break: break-all;
        }

        .medhub-dropdown-item {
            display: flex;
            align-items: center;
            gap: 0.625rem;
            width: 100%;
            padding: 0.625rem 0.75rem;
            border: none;
            background: transparent;
            border-radius: 10px;
            font-size: 0.85rem;
            font-weight: 500;
            color: #475569;
            cursor: pointer;
            transition: all 0.15s ease;
            font-family: inherit;
            text-decoration: none;
        }

        .medhub-dropdown-item:hover {
            background: #F1F5F9;
            color: #0F172A;
        }

        .medhub-dropdown-item svg {
            width: 18px;
            height: 18px;
            color: #94A3B8;
        }

        .medhub-dropdown-separator {
            height: 1px;
            background: rgba(0,0,0,0.06);
            margin: 0.25rem 0;
        }

        .medhub-dropdown-item.danger {
            color: #E11D48;
        }

        .medhub-dropdown-item.danger:hover {
            background: #FFF1F2;
            color: #BE123C;
        }

        .medhub-dropdown-item.danger svg {
            color: #E11D48;
        }
    `;

    // Injecter les styles
    const styleEl = document.createElement('style');
    styleEl.textContent = styles;
    document.head.appendChild(styleEl);

    /**
     * Initialise l'interface utilisateur d'authentification
     * Met à jour la top-bar avec les infos de l'utilisateur connecté
     */
    async function initialiserAuthUI() {
        // Vérifier que supabase-config.js est chargé
        if (typeof getProfil !== 'function' || typeof getUser !== 'function') {
            console.warn('[AuthUI] supabase-config.js doit être chargé avant auth-ui.js');
            return;
        }

        try {
            // Récupérer l'utilisateur et son profil
            const { user } = await getUser();
            if (!user) return; // Non connecté

            const { profile } = await getProfil();

            // Données utilisateur (avec fallbacks)
            const prenom = profile?.first_name || user.user_metadata?.first_name || '';
            const nom = profile?.last_name || user.user_metadata?.last_name || '';
            const email = user.email || '';
            const specialite = profile?.specialty || '';
            const hopital = profile?.hospital || '';

            // Calculer les initiales
            const initiales = ((prenom[0] || '') + (nom[0] || '')).toUpperCase() || email[0]?.toUpperCase() || '?';

            // Nom complet pour l'affichage
            const nomComplet = (prenom && nom)
                ? `Dr. ${prenom} ${nom}`
                : email.split('@')[0];

            // Rôle affiché (spécialité + hôpital)
            const role = [specialite, hopital].filter(Boolean).join(' · ') || 'Professionnel de santé';

            // Mettre à jour la top-bar existante
            mettreAJourTopBar(initiales, nomComplet, role, email);

        } catch (err) {
            console.error('[AuthUI] Erreur lors de l\'initialisation :', err);
        }
    }

    /**
     * Met à jour la top-bar avec les informations utilisateur et ajoute le menu
     */
    function mettreAJourTopBar(initiales, nomComplet, role, email) {
        const topBar = document.querySelector('.top-bar');
        if (!topBar) return;

        // Remplacer le contenu de la top-bar
        topBar.innerHTML = '';
        topBar.style.justifyContent = 'space-between';

        // Zone gauche (vide ou logo si nécessaire)
        const zoneGauche = document.createElement('div');
        topBar.appendChild(zoneGauche);

        // Zone droite : menu utilisateur
        const menuWrapper = document.createElement('div');
        menuWrapper.className = 'medhub-user-menu-wrapper';

        menuWrapper.innerHTML = `
            <button class="medhub-user-menu-trigger" aria-label="Menu utilisateur" aria-expanded="false">
                <div class="user-avatar">${initiales}</div>
                <div class="user-info">
                    <span class="user-name">${echapper(nomComplet)}</span>
                    <span class="user-role">${echapper(role)}</span>
                </div>
                <svg class="medhub-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
            </button>

            <div class="medhub-dropdown" role="menu">
                <div class="medhub-dropdown-header">
                    <div class="medhub-dropdown-name">${echapper(nomComplet)}</div>
                    <div class="medhub-dropdown-email">${echapper(email)}</div>
                </div>

                <a href="./profil.html" class="medhub-dropdown-item" role="menuitem">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    Mon profil
                </a>

                <div class="medhub-dropdown-separator"></div>

                <button class="medhub-dropdown-item danger" role="menuitem" id="medhub-btn-deconnexion">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                    Se déconnecter
                </button>
            </div>
        `;

        topBar.appendChild(menuWrapper);

        // Gestion de l'ouverture/fermeture du menu
        const trigger = menuWrapper.querySelector('.medhub-user-menu-trigger');
        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = menuWrapper.classList.toggle('open');
            trigger.setAttribute('aria-expanded', isOpen);
        });

        // Fermer le menu en cliquant à l'extérieur
        document.addEventListener('click', (e) => {
            if (!menuWrapper.contains(e.target)) {
                menuWrapper.classList.remove('open');
                trigger.setAttribute('aria-expanded', 'false');
            }
        });

        // Fermer avec Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                menuWrapper.classList.remove('open');
                trigger.setAttribute('aria-expanded', 'false');
            }
        });

        // Bouton de déconnexion
        const btnDeconnexion = document.getElementById('medhub-btn-deconnexion');
        btnDeconnexion.addEventListener('click', async () => {
            btnDeconnexion.disabled = true;
            btnDeconnexion.textContent = 'Déconnexion...';

            await deconnexion();

            // Rediriger vers la page de connexion
            const basePath = window.location.pathname;
            const profondeur = (basePath.match(/\//g) || []).length - 1;
            const prefixe = profondeur > 0 ? '../'.repeat(profondeur) : './';
            window.location.replace(prefixe + 'login.html');
        });
    }

    /**
     * Échappe le HTML pour éviter les injections XSS
     */
    function echapper(texte) {
        const div = document.createElement('div');
        div.textContent = texte;
        return div.innerHTML;
    }

    // Lancer l'initialisation quand le DOM est prêt
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialiserAuthUI);
    } else {
        initialiserAuthUI();
    }
})();
