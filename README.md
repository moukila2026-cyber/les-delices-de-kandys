# Kandys Pâtisserie — site vitrine

Site vitrine responsive en français, conçu en HTML/CSS/JavaScript sans dépendance externe. `premium.css` apporte les finitions visuelles, animations, ajustements responsive et le fond décoratif du site (`assets/fond-site.jpg`, source PNG disponible). Les images de référence et les 10 nouveaux visuels sont intégrés dans `assets/`. La section « Nos réalisations » les classe par cuisine africaine, cuisine européenne, entrées, pâtisserie, anniversaires et mariages.

## Lancer en local

Depuis ce dossier :

```bash
python3 -m http.server 8080
```

Puis ouvrir `http://localhost:8080`.

## Formulaire de commande

Le formulaire prépare un message avec les champs saisis et l’ouvre dans le WhatsApp du
restaurant (+225 01 02 15 03 03) ; le client confirme l’envoi. En parallèle, la demande est
enregistrée via `POST /api/orders` pour apparaître dans **l’espace équipe** (base Neon).

Depuis la mise en place du click & collect, le client choisit aussi une **date de retrait**
(48 h de préparation minimum, contrôlé côté navigateur et côté API) et un **créneau**
(matin, midi, après-midi, soir), ainsi qu’un **nombre de parts** pour les gâteaux. Un champ
piège invisible bloque les robots spammeurs.

## Référencement local

`index.html` contient les balises Open Graph, la carte `application/ld+json`
(`Restaurant` + `Bakery`, adresse Daloa, téléphone, `acceptsReservations`) et une URL
canonique. `robots.txt` exclut `/admin` et `/api`, `sitemap.xml` déclare la page d’accueil.
Horaires d’ouverture : à renseigner dans la fiche Google Business Profile et dans le
JSON-LD (`openingHours`) dès qu’ils sont confirmés — non inventés sur le site.

## Espace équipe (dashboard)

Adresse : `/admin/` (lien discret « Espace équipe » dans le pied de page du site).

| Rôle | Droits |
| --- | --- |
| **Administrateur** (1 seul compte) | tout : commandes (statuts, notes, suppression), réalisations (ajout, modification, suppression, masquage), création/désactivation/suppression des **3 agents** maximum, journal d’activité et statistiques |
| **Agent** (3 comptes maximum) | consultation des commandes, changement de statut et notes internes, lecture des réalisations, modification de son propre mot de passe |

- Authentification e-mail + mot de passe, mots de passe hachés (scrypt) et session
  signée en cookie `HttpOnly` (8 h), limitation des tentatives de connexion.
- Chaque action est tracée dans le journal (qui, quoi, quand), consultable par
  l’administrateur même à distance.
- Diagnostic : `GET /api/health` renvoie le mode de stockage et la présence effective des
  colonnes de suivi et de la table `order_events` (aucune donnée personnelle).
- **Traçabilité des commandes** : lorsqu’un agent ou l’administrateur change le statut,
  l’API enregistre `handled_by` (e-mail), `handled_by_name`, `handled_by_role` et
  `handled_at` (horodatage), et ajoute une ligne dans `order_events`. Le dashboard affiche
  « Traitée par … le JJ/MM/AAAA à HH:MM », un historique dépliable, et un filtre
  « À traiter ». La liste se rafraîchit chaque minute et le titre de l’onglet affiche le
  nombre de commandes sans traitement.

### Configuration

Variables d’environnement (Vercel → Settings → Environment Variables) :

| Nom | Rôle |
| --- | --- |
| `ADMIN_EMAIL` | e-mail du compte administrateur |
| `ADMIN_PASSWORD_HASH` | empreinte scrypt du mot de passe administrateur (ou `ADMIN_PASSWORD` en clair pour un test) |
| `SESSION_SECRET` | clé de signature des sessions (chaîne aléatoire longue) |
| `DATABASE_URL` | chaîne de connexion **Neon** (voir [`NEON_SETUP.md`](NEON_SETUP.md)) |

Sans base connectée, les données sont écrites dans un fichier temporaire : pratique en local,
non durable en production. Le dashboard affiche alors un avertissement.
Le schéma (`users`, `orders`, `order_events`, `realisations`, `logs`) est créé
automatiquement au premier appel, et les 14 réalisations existantes sont insérées si la
table est vide. Les colonnes de suivi ajoutées après coup (`pickup_date`, `pickup_slot`,
`parts`, `handled_*`) sont migrées automatiquement sur une base existante.

### Développement local

```bash
ADMIN_EMAIL=admin@kandys.ci ADMIN_PASSWORD='MotDePasseTest!' \
SESSION_SECRET=secret-local node tools/dev-server.js 8080
```

Pour travailler sur le code PostgreSQL **sans** instance Neon, le serveur peut utiliser une
base en mémoire (pg-mem, installé séparément) :

```bash
npm install --no-save pg-mem
KANDYS_FORCE_PG=1 KANDYS_TEST_PG_MEM="$(pwd)/node_modules/pg-mem" \
ADMIN_EMAIL=admin@kandys.ci ADMIN_PASSWORD='MotDePasseTest!' \
SESSION_SECRET=secret-local node tools/dev-server.js 8080
```

Le serveur sert le site, `/admin/` et les fonctions `/api/`. Pour régénérer une empreinte :

```bash
node -e "const c=require('crypto');const s=c.randomBytes(16).toString('hex');console.log('scrypt$'+s+'$'+c.scryptSync('VOTRE_MOT_DE_PASSE',s,64).toString('hex'))"
```

## Déploiement GitHub → Vercel

Depuis la racine du projet, après avoir créé un dépôt GitHub vide :

```bash
git init
git add .
git commit -m "Site vitrine Kandys Pâtisserie"
git branch -M main
git remote add origin https://github.com/VOTRE-COMPTE/VOTRE-DEPOT.git
git push -u origin main
```

Remplacez l’URL par celle de votre dépôt. Puis, dans Vercel, importez ce dépôt et choisissez le préréglage **Other** ; laissez les commandes de build et d’installation vides et définissez le dossier de sortie sur `.` (racine du dépôt). Déployez : le site statique ne demande aucune configuration ; l’espace équipe a besoin de `DATABASE_URL` (voir [`NEON_SETUP.md`](NEON_SETUP.md)).

## Coordonnées affichées

- Téléphone : +225 01 02 15 04 03
- Téléphone : +225 05 84 16 20 72
- WhatsApp : +225 01 02 15 03 03
- Daloa, Côte d’Ivoire

## Dossier de présentation (PDF)

`dossier/kandys-patisserie-dossier.pdf` est le dossier remis au propriétaire : présentation
de l'établissement, prestations, réalisations, présentation du site et **code QR** qui ouvre
directement le site.

Pour le régénérer après une modification du site (textes, photos, coordonnées, URL) :

```bash
pip install reportlab qrcode pillow
python3 tools/generate_dossier.py
```

Le site est publié sur **https://kandys-patisserie.vercel.app**.
L'URL encodée dans le QR code est la constante `SITE_URL` en tête de `tools/generate_dossier.py`.
Les polices utilisées (Playfair Display et Lato) sont sous licence SIL Open Font License, dans
`tools/fonts/`.

## Crédit & contact

Pied de page : « Conçu par Shopin30 » avec un lien WhatsApp cliquable
(+225 05 01 30 33 43) pour les personnes qui souhaitent commander un site internet.
