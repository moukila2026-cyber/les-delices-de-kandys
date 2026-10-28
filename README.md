# Kandys Pâtisserie — site vitrine

Site vitrine responsive en français, conçu en HTML/CSS/JavaScript sans dépendance externe. `premium.css` apporte les finitions visuelles, animations, ajustements responsive et le fond décoratif du site (`assets/fond-site.jpg`, source PNG disponible). Les images de référence et les 10 nouveaux visuels sont intégrés dans `assets/`. La section « Nos réalisations » les classe par cuisine africaine, cuisine européenne, entrées, pâtisserie, anniversaires et mariages.

## Lancer en local

Depuis ce dossier :

```bash
python3 -m http.server 8080
```

Puis ouvrir `http://localhost:8080`.

## Formulaire de commande

Le formulaire est 100 % côté navigateur : il prépare un message avec les champs saisis et l’ouvre dans le WhatsApp du restaurant (+225 01 02 15 03 03). Le client confirme l’envoi dans WhatsApp. Aucune commande n’est stockée sur le site et aucun backend/Supabase n’est nécessaire.

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

Remplacez l’URL par celle de votre dépôt. Puis, dans Vercel, importez ce dépôt et choisissez le préréglage **Other** ; laissez les commandes de build et d’installation vides et définissez le dossier de sortie sur `.` (racine du dépôt). Déployez : aucune variable d’environnement ni configuration Supabase n’est nécessaire.

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
