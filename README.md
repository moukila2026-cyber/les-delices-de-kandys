# Les Délices de Kandys — site vitrine

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
git commit -m "Site vitrine Les Delices de Kandys"
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
