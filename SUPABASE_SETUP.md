# Activer l’espace équipe en production (5 minutes)

Le dashboard fonctionne immédiatement **en local**. En ligne, Vercel n’offre pas de
disque persistant : il faut brancher une base gratuite (Supabase) pour que les
commandes, comptes agents et réalisations soient conservés.

Sans cette étape, le dashboard s’affiche mais rappelle en haut de page :
« Stockage temporaire : les données ne sont pas conservées durablement. »

## 1. Créer la base (gratuit)

1. Aller sur <https://supabase.com> → **Start your project** → se connecter avec GitHub.
2. **New project** : nom `kandys-patisserie`, mot de passe de base au choix, région `eu-west-3` (Paris).
3. Attendre ~2 minutes que le projet soit prêt.

## 2. Créer les tables

1. Dans le projet Supabase : **SQL Editor** → **New query**.
2. Copier tout le contenu de [`supabase/schema.sql`](supabase/schema.sql) puis **Run**.
3. Vérifier que les 4 tables apparaissent dans **Table Editor** : `users`, `orders`,
   `realisations`, `logs`.

## 3. Récupérer les deux clés

Dans Supabase : **Project Settings → API** :

- **Project URL** → `https://xxxxx.supabase.co`
- **service_role** (section `Project API keys`, clé secrète) → longue chaîne `eyJ…`

⚠️ La clé `service_role` donne tous les droits : elle reste **uniquement côté serveur**,
dans les variables d’environnement Vercel. Ne la mettez jamais dans le code du site.

## 4. Ajouter les variables sur Vercel

Vercel → projet **kandys-patisserie** → **Settings → Environment Variables** :

| Nom | Valeur |
| --- | --- |
| `SUPABASE_URL` | l’URL du projet (`https://xxxxx.supabase.co`) |
| `SUPABASE_SERVICE_ROLE_KEY` | la clé `service_role` |

Cocher **Production**, **Preview** et **Development**, puis **Save**.

## 5. Redéployer

**Deployments → ⋯ → Redeploy** (ou un simple `git push` sur `main`).

Ouvrir ensuite `https://kandys-patisserie.vercel.app/admin/` : le bandeau d’avertissement
doit disparaître, et les commandes envoyées depuis le site s’accumulent.

## Bon à savoir

- **12 tables inutiles ?** Non : les 4 tables suffisent, aucun bucket de stockage n’est
  nécessaire — les photos ajoutées depuis le dashboard sont compressées dans le navigateur
  avant l’envoi.
- **Sauvegarde** : Supabase propose des exports quotidiens sur le plan gratuit.
- **Coût** : 0 € pour ce volume (500 Mo de base, projet mis en pause après 7 jours
  d’inactivité totale — un simple passage sur le dashboard le réactive).
