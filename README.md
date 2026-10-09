# 🛍️ Global Shop Daloa

**Votre boutique de confiance en Côte d'Ivoire**

Site vitrine e-commerce pour **Global Shop Daloa**, une boutique multi-catégories basée à Daloa et Bouaké, proposant des produits dans les domaines de l'électronique, la mode, la maison, la beauté, l'alimentation et le sport.

## ✨ Fonctionnalités

- 🏠 **Page d'accueil percutante** avec hero animé, collections vedettes et témoignages clients
- 🛒 **Panier coulissant** persistant (sauvegardé en localStorage)
- 📦 **40+ produits** réalistes avec descriptions, prix en FCFA et images
- 🔍 **Filtres et tri** par prix, disponibilité et popularité
- 📄 **Fiches produits détaillées** avec galeries d'images, avis clients et produits similaires
- 💳 **Processus de paiement** simplifié en 2 étapes avec Mobile Money (Orange, MTN, Wave)
- 💬 **Avis clients** réalistes et vérifiés
- 📱 **100% responsive** - mobile, tablette et desktop
- ✨ **Animations subtiles** avec Framer Motion

## 🛠️ Stack Technique

- **Framework** : [Next.js 16](https://nextjs.org/) (App Router)
- **Styling** : [Tailwind CSS](https://tailwindcss.com/)
- **Animations** : [Framer Motion](https://www.framer.com/motion/)
- **Icônes** : [Lucide React](https://lucide.dev/)
- **Langage** : TypeScript
- **Pas de base de données** - Données en mémoire, panier en localStorage

## 🚀 Installation

```bash
# Cloner le dépôt
git clone https://github.com/VOTRE_USERNAME/global-shop-daloa.git
cd global-shop-daloa

# Installer les dépendances
npm install

# Lancer en développement
npm run dev

# Build pour la production
npm run build
npm start
```

## 📁 Structure du Projet

```
src/
├── app/                    # Pages Next.js (App Router)
│   ├── page.tsx           # Page d'accueil
│   ├── layout.tsx         # Layout principal
│   ├── globals.css        # Styles globaux
│   ├── products/[id]/     # Page détail produit
│   ├── collections/[category]/ # Page collection
│   └── checkout/          # Page de paiement
├── components/            # Composants React
│   ├── Header.tsx         # En-tête avec navigation
│   ├── Footer.tsx         # Pied de page
│   ├── CartDrawer.tsx     # Panier coulissant
│   ├── ProductCard.tsx    # Carte produit
│   ├── HeroSection.tsx    # Section héro
│   ├── CategoryGrid.tsx   # Grille catégories
│   ├── FeaturedProducts.tsx # Produits vedettes
│   ├── PromoSection.tsx   # Bannières promo
│   ├── TestimonialsSection.tsx # Témoignages
│   └── LocationSection.tsx # Nos boutiques
├── context/               # Context React
│   └── CartContext.tsx    # Gestion du panier
├── data/                  # Données mock
│   ├── products.ts        # Catalogue produits (40+)
│   ├── categories.ts      # Catégories
│   ├── reviews.ts         # Avis clients
│   └── types.ts           # Types TypeScript
└── lib/                   # Utilitaires
    └── utils.ts           # Fonctions helpers
```

## 💰 Modes de Paiement

- 📱 Orange Money
- 📱 MTN Mobile Money
- 📱 Wave
- 💵 Paiement à la livraison (Cash)

## 📍 Localisation

- **Daloa** : Quartier Commerce, face à la Cathédrale
- **Bouaké** : Grand Marché, Rue du Commerce

## 📄 Licence

Ce projet est propriété de Global Shop Daloa.

---

Développé avec ❤️ pour Global Shop Daloa
