# Protection serveur des modules — nginx `auth_request` (préparé, NON activé)

Objectif : passer d'un guard **JS cosmétique** (contournable) à une barrière
**serveur** sur le contenu statique des modules (`/medapp/`, `/mediletter/`,
`/medentry/`, `/recherche/`). Les endpoints backend de génération sont déjà
protégés par JWT applicatif (`require_user`) — ceci ne concerne que le statique.

⚠️ **À activer ensemble, en fenêtre calme.** Une erreur verrouille les médecins.

## Défi technique
Les navigations navigateur ne portent **pas** d'en-tête `Authorization`, et
Supabase stocke la session en **localStorage** (pas en cookie). `auth_request`
ne peut donc lire le token que via un **cookie**. Il faut :
1. côté frontend : recopier le token de session dans un cookie ;
2. côté backend : un endpoint `/auth/verify` qui lit ce cookie et valide le JWT ;
3. côté nginx : `auth_request` sur les locations des modules (fichier
   `lettres.auth_request.conf`).

## 1) Frontend — poser le cookie (à ajouter après supabase-config.js)
```js
// js/auth-cookie.js — synchronise le token de session dans un cookie (lisible JS,
// c'est le même token que localStorage ; Secure + SameSite=Lax).
(async function () {
  try {
    if (typeof getSession === 'function') {
      const { session } = await getSession();
      const t = session && session.access_token;
      if (t) document.cookie = 'sb-access=' + t + '; Path=/; Secure; SameSite=Lax; Max-Age=3600';
      if (typeof ecouterChangementsAuth === 'function') {
        ecouterChangementsAuth((_e, s) => {
          if (s && s.access_token)
            document.cookie = 'sb-access=' + s.access_token + '; Path=/; Secure; SameSite=Lax; Max-Age=3600';
          else document.cookie = 'sb-access=; Path=/; Max-Age=0';
        });
      }
    }
  } catch (e) {}
})();
```

## 2) Backend — endpoint de vérification (à ajouter dans backend/main.py)
```python
from fastapi import Request
from fastapi.responses import Response

@app.get("/auth/verify")
async def auth_verify(request: Request):
    # Lit le cookie sb-access, valide le JWT Supabase. 200 si OK, 401 sinon.
    token = request.cookies.get("sb-access")
    email = _verify_supabase_email(token) if token else None
    if not email:
        return Response(status_code=401)
    return Response(status_code=200)
```
(Réutilise `_verify_supabase_email`, déjà corrigé pour la clé service_role.)

## 3) nginx
Fusionner `lettres.auth_request.conf` dans le `server{}` de
`/etc/nginx/sites-available/lettres.vannesexpress.com`.

## Procédure de test (fenêtre calme)
1. Sauvegarde : `sudo cp <conf> /tmp/lettres.pre-authrequest.bak`
2. Déployer le frontend (auth-cookie.js) + le backend (/auth/verify) + `sudo systemctl restart mediletter`.
3. Vérifier le backend seul : `curl -i https://lettres.vannesexpress.com/auth/verify` → **401** (pas de cookie), puis avec `-H "Cookie: sb-access=<token valide>"` → **200**.
4. Ajouter les blocs nginx, `sudo nginx -t`, puis `sudo systemctl reload nginx`.
5. Tests bout en bout **connecté** (session réelle) : ouvrir `/medapp/`, `/mediletter/` → **doivent s'afficher**. **Déconnecté** (navigation privée) : `/medapp/` → **302 vers /login.html**.
6. Vérifier qu'aucun asset partagé n'est bloqué (fonts, `js/`, `sw.js`, `manifest.json`).

## Rollback (immédiat)
- nginx : `sudo cp /tmp/lettres.pre-authrequest.bak <conf> && sudo nginx -t && sudo systemctl reload nginx`.
- Le guard JS reste en place entre-temps ; aucun autre changement requis.

## Points de vigilance
- **Refresh du token** : le cookie a `Max-Age=3600` ; l'écouteur `onAuthStateChange` le renouvelle. Prévoir le cas d'expiration en cours de session (l'utilisateur sera redirigé au login → acceptable).
- **Boucle de redirection** : `login.html`, `signup.html`, `/auth/`, `js/`, fonts, `sw.js` NE doivent PAS être derrière `auth_request`.
- **PWA / service worker** : `sw.js` et le cache doivent rester accessibles.
- Ne PAS gater le **hub racine** ici si on garde son guard JS actuel (sinon double logique).
