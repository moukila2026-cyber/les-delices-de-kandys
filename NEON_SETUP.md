# Connecter l’espace équipe à Neon (5 minutes)

Le dashboard fonctionne dès maintenant, mais **Vercel n’offre pas de disque persistant** : sans
base de données, les commandes et les comptes agents sont perdus à chaque redéploiement.
Ce guide branche **Neon** (PostgreSQL serverless, plan gratuit) pour rendre les données durables.

Sans cette étape, le dashboard affiche en haut : « Base Neon non connectée… ».

---

## Option A — via Vercel (le plus simple, 2 minutes)

1. Ouvrir le projet **kandys-patisserie** sur Vercel.
2. Onglet **Storage** → **Create Database** → **Neon**.
3. Region : **Paris (eu-west-3)** → **Create**.
4. Vercel ajoute automatiquement les variables `DATABASE_URL`, `PGHOST`, `PGUSER`… au projet.
5. **Deployments → ⋯ → Redeploy** (ou un simple `git push` sur `main`).

Les tables sont créées **automatiquement** au premier appel de l’API (aucun SQL à lancer).

## Option B — via le tableau de bord Neon

1. <https://console.neon.tech> → **New Project** → région **AWS eu-west-3 (Paris)**.
2. Dans **Connection Details**, copier la chaîne complète :
   `postgresql://user:motdepasse@ep-xxxx.eu-west-3.aws.neon.tech/neondb?sslmode=require`
3. Sur Vercel → projet **kandys-patisserie** → **Settings → Environment Variables** :

   | Nom | Valeur | Environnements |
   | --- | --- | --- |
   | `DATABASE_URL` | la chaîne copiée | Production, Preview, Development |

   (Les noms `POSTGRES_URL` et `NEON_DATABASE_URL` sont aussi acceptés.)
4. **Deployments → ⋯ → Redeploy**.

> ⚠️ Cette chaîne contient le mot de passe de la base : elle se met **uniquement** dans les
> variables d’environnement, jamais dans le code du site.

---

## Vérifier que c’est branché

Ouvrir <https://kandys-patisserie.vercel.app/api/auth/me> :

```json
{ "user": null, "storage": { "mode": "neon", "durable": true } }
```

- `"mode": "neon"` → la base est connectée, le bandeau d’avertissement disparaît du dashboard.
- `"mode": "local"` → la variable `DATABASE_URL` n’est pas lue : vérifier qu’elle est bien
  cochée pour **Production**, puis redéployer.

Dans le dashboard, l’onglet **Journal & activité** affiche aussi « Base de données : Neon (durable) ».

---

## Structure créée automatiquement

| Table | Rôle |
| --- | --- |
| `users` | agents (3 max) et mot de passe administrateur modifié depuis le dashboard |
| `orders` | commandes envoyées depuis le formulaire du site |
| `realisations` | photos affichées dans « Nos réalisations » |
| `logs` | journal d’activité (qui, quoi, quand) |

Le schéma complet est disponible dans [`db/schema.sql`](db/schema.sql) si vous préférez le
créer à la main (`psql "$DATABASE_URL" -f db/schema.sql`).

Les 14 réalisations actuelles sont insérées automatiquement au premier démarrage.

## Bon à savoir

- **Plan gratuit Neon** : 0,5 Go de stockage, largement suffisant (les photos ajoutées depuis le
  dashboard sont compressées dans le navigateur).
- **Mise en veille** : la base se suspend après quelques minutes d’inactivité, puis se réveille
  en ~300 ms au premier appel — sans perte de données.
- **Sauvegardes** : Neon conserve un historique de restauration (branches / point-in-time)
  inclus dans le plan gratuit.
- **Coût** : 0 € pour ce volume d’utilisation.

## Mise à jour du schéma (suivi des commandes)

Au premier appel de l’API, `api/_lib/db.js` crée les tables manquantes puis applique les
migrations `ALTER TABLE ... ADD COLUMN IF NOT EXISTS` (colonnes `pickup_date`,
`pickup_slot`, `parts`, `handled_by`, `handled_by_name`, `handled_by_role`, `handled_at`).
La table `order_events` conserve l’historique : ancien statut, nouveau statut, agent
(e-mail, nom, rôle), note et horodatage. Aucune intervention manuelle n’est nécessaire sur
une base existante.
