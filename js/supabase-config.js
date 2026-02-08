/**
 * Configuration du client Supabase pour MedHub
 *
 * Ce fichier initialise la connexion à Supabase.
 * Les variables sont chargées depuis la configuration globale.
 *
 * IMPORTANT : Dans un environnement de production, les clés
 * doivent être injectées via le serveur ou un fichier de config.
 * La clé anon est sûre côté client (protégée par RLS).
 */

// Configuration Supabase — À modifier avec vos propres valeurs
const SUPABASE_CONFIG = {
    url: window.MEDHUB_SUPABASE_URL || 'https://otbspumwtokomwcmbyuz.supabase.co',
    anonKey: window.MEDHUB_SUPABASE_ANON_KEY || 'sb_publishable_i2_Grqoz93j4FMTSX0vRZQ_ryw10_vD'
};


// Vérification que la configuration est définie
function verifierConfigSupabase() {
    if (SUPABASE_CONFIG.url.includes('VOTRE_PROJET') || SUPABASE_CONFIG.anonKey.includes('VOTRE_CLE')) {
        console.warn(
            '[MedHub Auth] ⚠️ Supabase n\'est pas configuré.\n' +
            'Veuillez définir MEDHUB_SUPABASE_URL et MEDHUB_SUPABASE_ANON_KEY\n' +
            'dans js/supabase-config.js ou via window.MEDHUB_SUPABASE_URL / window.MEDHUB_SUPABASE_ANON_KEY'
        );
        return false;
    }
    return true;
}

// Initialisation du client Supabase
let supabaseClient = null;

function getSupabase() {
    if (!supabaseClient && verifierConfigSupabase()) {
        // supabase est chargé via le CDN dans le HTML
        supabaseClient = supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey, {
            auth: {
                autoRefreshToken: true,          // Rafraîchissement automatique des tokens
                persistSession: true,             // Persister la session dans localStorage
                detectSessionInUrl: true,         // Détecter le callback OAuth dans l'URL
                flowType: 'pkce'                  // Utiliser PKCE pour plus de sécurité (protection CSRF)
            }
        });
    }
    return supabaseClient;
}

/**
 * Récupère la session utilisateur actuelle
 * @returns {Promise<{session: object|null, error: object|null}>}
 */
async function getSession() {
    const client = getSupabase();
    if (!client) return { session: null, error: { message: 'Supabase non configuré' } };

    const { data, error } = await client.auth.getSession();
    return { session: data?.session || null, error };
}

/**
 * Récupère l'utilisateur connecté
 * @returns {Promise<{user: object|null, error: object|null}>}
 */
async function getUser() {
    const client = getSupabase();
    if (!client) return { user: null, error: { message: 'Supabase non configuré' } };

    const { data, error } = await client.auth.getUser();
    return { user: data?.user || null, error };
}

/**
 * Récupère le profil de l'utilisateur connecté
 * @returns {Promise<{profile: object|null, error: object|null}>}
 */
async function getProfil() {
    const client = getSupabase();
    if (!client) return { profile: null, error: { message: 'Supabase non configuré' } };

    const { data: { user } } = await client.auth.getUser();
    if (!user) return { profile: null, error: { message: 'Non connecté' } };

    const { data, error } = await client
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    return { profile: data, error };
}

/**
 * Connexion avec email et mot de passe
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{data: object|null, error: object|null}>}
 */
async function connexionEmail(email, password) {
    const client = getSupabase();
    if (!client) return { data: null, error: { message: 'Supabase non configuré' } };

    return await client.auth.signInWithPassword({ email, password });
}

/**
 * Inscription avec email et mot de passe
 * @param {string} email
 * @param {string} password
 * @param {object} metadata - Métadonnées utilisateur (first_name, last_name, specialty)
 * @returns {Promise<{data: object|null, error: object|null}>}
 */
async function inscriptionEmail(email, password, metadata = {}) {
    const client = getSupabase();
    if (!client) return { data: null, error: { message: 'Supabase non configuré' } };

    return await client.auth.signUp({
        email,
        password,
        options: {
            data: metadata   // Sera utilisé par le trigger pour créer le profil
        }
    });
}

/**
 * Connexion avec Google OAuth
 * @returns {Promise<{data: object|null, error: object|null}>}
 */
async function connexionGoogle() {
    const client = getSupabase();
    if (!client) return { data: null, error: { message: 'Supabase non configuré' } };

    // Déterminer l'URL de callback (relatif à l'origine actuelle)
    const redirectTo = window.location.origin +
        window.location.pathname.replace(/[^/]*$/, '') + 'auth/callback.html';

    return await client.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: redirectTo
        }
    });
}

/**
 * Réinitialisation du mot de passe
 * @param {string} email
 * @returns {Promise<{data: object|null, error: object|null}>}
 */
async function reinitialiserMotDePasse(email) {
    const client = getSupabase();
    if (!client) return { data: null, error: { message: 'Supabase non configuré' } };

    // L'URL de redirection après avoir cliqué le lien dans l'email
    const redirectTo = window.location.origin +
        window.location.pathname.replace(/[^/]*$/, '') + 'auth/callback.html';

    return await client.auth.resetPasswordForEmail(email, {
        redirectTo: redirectTo
    });
}

/**
 * Déconnexion
 * @returns {Promise<{error: object|null}>}
 */
async function deconnexion() {
    const client = getSupabase();
    if (!client) return { error: { message: 'Supabase non configuré' } };

    return await client.auth.signOut();
}

/**
 * Mise à jour du profil utilisateur
 * @param {object} updates - Champs à mettre à jour
 * @returns {Promise<{data: object|null, error: object|null}>}
 */
async function mettreAJourProfil(updates) {
    const client = getSupabase();
    if (!client) return { data: null, error: { message: 'Supabase non configuré' } };

    const { data: { user } } = await client.auth.getUser();
    if (!user) return { data: null, error: { message: 'Non connecté' } };

    const { data, error } = await client
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

    return { data, error };
}

/**
 * Écouter les changements d'état d'authentification
 * @param {function} callback - Fonction appelée à chaque changement
 * @returns {object} subscription - Pour se désabonner
 */
function ecouterChangementsAuth(callback) {
    const client = getSupabase();
    if (!client) return { data: { subscription: { unsubscribe: () => {} } } };

    return client.auth.onAuthStateChange((event, session) => {
        callback(event, session);
    });
}

// Traduire les messages d'erreur Supabase en français
function traduireErreur(error) {
    if (!error || !error.message) return 'Une erreur inconnue est survenue.';

    const traductions = {
        'Invalid login credentials': 'Email ou mot de passe incorrect.',
        'Email not confirmed': 'Veuillez confirmer votre email avant de vous connecter.',
        'User already registered': 'Un compte existe déjà avec cet email.',
        'Password should be at least 6 characters': 'Le mot de passe doit contenir au moins 6 caractères.',
        'Signup requires a valid password': 'Veuillez entrer un mot de passe valide.',
        'Unable to validate email address: invalid format': 'Format d\'email invalide.',
        'Email rate limit exceeded': 'Trop de tentatives. Veuillez réessayer dans quelques minutes.',
        'For security purposes, you can only request this after': 'Pour des raisons de sécurité, veuillez patienter avant de réessayer.',
        'New password should be different from the old password': 'Le nouveau mot de passe doit être différent de l\'ancien.',
        'Auth session missing!': 'Session expirée. Veuillez vous reconnecter.',
        'Token has expired or is invalid': 'Lien expiré ou invalide. Veuillez réessayer.',
    };

    // Chercher une traduction partielle (le message peut contenir plus de texte)
    for (const [en, fr] of Object.entries(traductions)) {
        if (error.message.includes(en)) return fr;
    }

    return error.message;
}
