import { Product } from './types';

export const products: Product[] = [
  // ÉLECTRONIQUE
  {
    id: 'prod-001',
    name: 'iPhone 15 Pro Max 256GB',
    slug: 'iphone-15-pro-max',
    price: 850000,
    originalPrice: 950000,
    description: 'Le nouveau iPhone 15 Pro Max avec sa puce A17 Pro, son système de caméra professionnel et son design en titane. Écran Super Retina XDR de 6,7 pouces, autonomie exceptionnelle et performances inégalées. Disponible à Daloa chez Global Shop.',
    shortDescription: 'Puce A17 Pro, caméra 48MP, écran 6,7"',
    category: 'electronics',
    images: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&h=800&fit=crop'
    ],
    rating: 4.8,
    reviewCount: 124,
    inStock: true,
    featured: true,
    badge: 'Nouveau',
    specifications: { 'Stockage': '256 GB', 'Écran': '6,7 pouces', 'Processeur': 'A17 Pro', 'Caméra': '48 MP' },
    colors: ['Titane Naturel', 'Titane Bleu', 'Titane Noir']
  },
  {
    id: 'prod-002',
    name: 'Samsung Galaxy S24 Ultra',
    slug: 'samsung-galaxy-s24-ultra',
    price: 780000,
    originalPrice: 850000,
    description: 'Samsung Galaxy S24 Ultra avec Galaxy AI intégré, S Pen inclus, caméra 200MP et écran Dynamic AMOLED 2X de 6,8 pouces. Le smartphone ultime pour la productivité et la créativité.',
    shortDescription: 'Galaxy AI, S Pen, caméra 200MP',
    category: 'electronics',
    images: [
      'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=800&h=800&fit=crop'
    ],
    rating: 4.7,
    reviewCount: 98,
    inStock: true,
    featured: true,
    badge: 'Promo',
    specifications: { 'Stockage': '256 GB', 'Écran': '6,8 pouces', 'Processeur': 'Snapdragon 8 Gen 3', 'Caméra': '200 MP' },
    colors: ['Violet Titanium', 'Noir', 'Gris']
  },
  {
    id: 'prod-003',
    name: 'AirPods Pro 2ème génération',
    slug: 'airpods-pro-2',
    price: 165000,
    originalPrice: 195000,
    description: 'AirPods Pro 2ème génération avec réduction active du bruit, audio adaptatif et boîtier de charge USB-C. Son immersif et confort optimal pour une écoute prolongée.',
    shortDescription: 'Réduction de bruit, audio spatial, USB-C',
    category: 'electronics',
    images: [
      'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1600294037681-c88b3bba2800?w=800&h=800&fit=crop'
    ],
    rating: 4.6,
    reviewCount: 215,
    inStock: true,
    featured: true,
    badge: 'Best-seller',
    specifications: { 'Autonomie': '6h (30h avec boîtier)', 'Connectivité': 'Bluetooth 5.3', 'Réduction de bruit': 'Active' }
  },
  {
    id: 'prod-004',
    name: 'Laptop HP Pavilion 15 - Intel i7',
    slug: 'hp-pavilion-15-i7',
    price: 520000,
    description: 'HP Pavilion 15 avec processeur Intel Core i7 13ème génération, 16 Go RAM, SSD 512 Go et écran Full HD 15,6". Parfait pour le travail et les études.',
    shortDescription: 'Intel i7, 16GB RAM, SSD 512GB',
    category: 'electronics',
    images: [
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&h=800&fit=crop'
    ],
    rating: 4.4,
    reviewCount: 67,
    inStock: true,
    featured: false,
    specifications: { 'Processeur': 'Intel i7-1355U', 'RAM': '16 Go DDR4', 'Stockage': 'SSD 512 Go', 'Écran': '15,6" FHD' }
  },
  {
    id: 'prod-005',
    name: 'Smart TV Samsung 55" 4K UHD',
    slug: 'samsung-tv-55-4k',
    price: 385000,
    originalPrice: 450000,
    description: 'Smart TV Samsung 55 pouces avec résolution 4K UHD, processeur Crystal 4K, Smart Hub intégré et compatible avec Alexa et Google Assistant.',
    shortDescription: '55 pouces, 4K UHD, Smart TV',
    category: 'electronics',
    images: [
      'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1461151304267-38535e780c79?w=800&h=800&fit=crop'
    ],
    rating: 4.5,
    reviewCount: 89,
    inStock: true,
    featured: true,
    badge: 'Promo',
    specifications: { 'Taille': '55 pouces', 'Résolution': '4K UHD (3840x2160)', 'Smart TV': 'Tizen OS', 'HDMI': '3 ports' }
  },
  {
    id: 'prod-006',
    name: 'Enceinte JBL Charge 5',
    slug: 'jbl-charge-5',
    price: 95000,
    description: 'Enceinte Bluetooth portable JBL Charge 5 avec son puissant, 20h d\'autonomie, étanche IP67 et fonction powerbank pour charger vos appareils.',
    shortDescription: 'Bluetooth, 20h autonomie, IP67',
    category: 'electronics',
    images: [
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1589003077984-894e133dabab?w=800&h=800&fit=crop'
    ],
    rating: 4.5,
    reviewCount: 156,
    inStock: true,
    featured: false,
    specifications: { 'Autonomie': '20 heures', 'Étanchéité': 'IP67', 'Bluetooth': '5.1', 'Puissance': '40W' }
  },
  {
    id: 'prod-007',
    name: 'Montre connectée Samsung Galaxy Watch 6',
    slug: 'samsung-galaxy-watch-6',
    price: 185000,
    description: 'Samsung Galaxy Watch 6 avec écran Super AMOLED, suivi santé avancé (sommeil, fréquence cardiaque, SpO2), GPS intégré et résistance à l\'eau 5ATM.',
    shortDescription: 'AMOLED, suivi santé, GPS, 5ATM',
    category: 'electronics',
    images: [
      'https://images.unsplash.com/photo-1546868871-af0de0ae72be?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&h=800&fit=crop'
    ],
    rating: 4.3,
    reviewCount: 72,
    inStock: true,
    featured: false,
    specifications: { 'Écran': 'Super AMOLED', 'Autonomie': '40h', 'Étanchéité': '5ATM', 'GPS': 'Intégré' }
  },
  {
    id: 'prod-008',
    name: 'Chargeur solaire portable 20000mAh',
    slug: 'chargeur-solaire-20000',
    price: 35000,
    originalPrice: 45000,
    description: 'Batterie externe solaire 20000mAh avec double port USB, lampe LED et panneaux solaires intégrés. Idéal pour les déplacements et les zones à accès limité à l\'électricité.',
    shortDescription: '20000mAh, solaire, double USB',
    category: 'electronics',
    images: [
      'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=800&h=800&fit=crop'
    ],
    rating: 4.2,
    reviewCount: 198,
    inStock: true,
    featured: false,
    badge: 'Populaire',
    specifications: { 'Capacité': '20000 mAh', 'Ports': '2x USB-A', 'Recharge': 'Solaire + secteur', 'LED': 'Lampe intégrée' }
  },

  // MODE & VÊTEMENTS
  {
    id: 'prod-101',
    name: 'Robe en wax Ankara - Coupe moderne',
    slug: 'robe-wax-ankara',
    price: 25000,
    originalPrice: 35000,
    description: 'Magnifique robe en tissu wax Ankara avec une coupe moderne et élégante. Tissu 100% coton de haute qualité, couleurs vives et motifs africains authentiques. Parfaite pour les occasions spéciales ou le quotidien.',
    shortDescription: 'Wax 100% coton, coupe moderne, motifs authentiques',
    category: 'mode',
    images: [
      'https://images.unsplash.com/photo-1590735213920-68192a487bc2?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1596944924616-74b1226fe8a7?w=800&h=800&fit=crop'
    ],
    rating: 4.9,
    reviewCount: 87,
    inStock: true,
    featured: true,
    badge: 'Best-seller',
    colors: ['Jaune/Orange', 'Bleu/Vert', 'Rouge/Noir'],
    specifications: { 'Matière': '100% Coton wax', 'Tailles': 'S, M, L, XL, XXL', 'Entretien': 'Lavage machine 30°C', 'Origine': 'Côte d\'Ivoire' }
  },
  {
    id: 'prod-102',
    name: 'Costume homme 3 pièces - Slim fit',
    slug: 'costume-homme-3-pieces',
    price: 85000,
    originalPrice: 120000,
    description: 'Costume homme 3 pièces (veste, pantalon, gilet) coupe slim fit en tissu premium. Idéal pour les cérémonies, mariages et occasions professionnelles. Disponible en noir, bleu marine et gris.',
    shortDescription: '3 pièces, slim fit, tissu premium',
    category: 'mode',
    images: [
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&h=800&fit=crop'
    ],
    rating: 4.6,
    reviewCount: 45,
    inStock: true,
    featured: true,
    badge: 'Promo',
    colors: ['Noir', 'Bleu marine', 'Gris'],
    specifications: { 'Matière': 'Polyester premium', 'Coupe': 'Slim fit', 'Tailles': '46, 48, 50, 52, 54', 'Composition': 'Veste + Pantalon + Gilet' }
  },
  {
    id: 'prod-103',
    name: 'Sneakers Nike Air Max 90',
    slug: 'nike-air-max-90',
    price: 75000,
    description: 'Nike Air Max 90 classiques avec amorti Air visible, design iconique et confort ultime. Un indispensable du style urbain, disponible en plusieurs coloris.',
    shortDescription: 'Air Max, amorti visible, style iconique',
    category: 'mode',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&h=800&fit=crop'
    ],
    rating: 4.7,
    reviewCount: 234,
    inStock: true,
    featured: true,
    badge: 'Populaire',
    colors: ['Blanc/Rouge', 'Noir/Blanc', 'Gris'],
    specifications: { 'Semelle': 'Air Max', 'Matière': 'Cuir et mesh', 'Tailles': '39-46', 'Usage': 'Lifestyle' }
  },
  {
    id: 'prod-104',
    name: 'Sac à main en cuir - Collection ivoirienne',
    slug: 'sac-cuir-collection-ivoirienne',
    price: 45000,
    description: 'Sac à main en cuir véritable fabriqué artisanalement en Côte d\'Ivoire. Design élégant avec finitions soignées, parfait pour compléter votre look au quotidien.',
    shortDescription: 'Cuir véritable, artisanal, design élégant',
    category: 'mode',
    images: [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800&h=800&fit=crop'
    ],
    rating: 4.8,
    reviewCount: 56,
    inStock: true,
    featured: true,
    colors: ['Marron', 'Noir', 'Camel'],
    specifications: { 'Matière': 'Cuir véritable', 'Dimensions': '30x25x12 cm', 'Origine': 'Artisanal CI', 'Fermeture': 'Zip + fermoir' }
  },
  {
    id: 'prod-105',
    name: 'Chemise en pagne - Homme',
    slug: 'chemise-pagne-homme',
    price: 18000,
    description: 'Chemise homme en tissu pagne africain avec coupe moderne. Confortable et branchée, parfaite pour les sorties et événements culturels.',
    shortDescription: 'Pagne africain, coupe moderne, confortable',
    category: 'mode',
    images: [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=800&h=800&fit=crop'
    ],
    rating: 4.5,
    reviewCount: 92,
    inStock: true,
    featured: false,
    colors: ['Multicolore 1', 'Multicolore 2'],
    specifications: { 'Matière': 'Pagne 100% coton', 'Tailles': 'S, M, L, XL, XXL', 'Style': 'Casual chic', 'Entretien': 'Lavage machine 30°C' }
  },
  {
    id: 'prod-106',
    name: 'Lunettes de soleil Ray-Ban Aviator',
    slug: 'rayban-aviator',
    price: 65000,
    description: 'Ray-Ban Aviator Classic avec monture en métal doré et verres en verre minéral G-15. Protection UV 400 et style intemporel.',
    shortDescription: 'Verres G-15, monture métal, UV400',
    category: 'mode',
    images: [
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&h=800&fit=crop'
    ],
    rating: 4.6,
    reviewCount: 178,
    inStock: true,
    featured: false,
    specifications: { 'Monture': 'Métal', 'Verres': 'Verre minéral G-15', 'Protection': 'UV 400', 'Style': 'Aviator' }
  },
  {
    id: 'prod-107',
    name: 'Ensemble bébé wax - 3 pièces',
    slug: 'ensemble-bebe-wax',
    price: 12000,
    originalPrice: 15000,
    description: 'Adorable ensemble bébé 3 pièces en tissu wax (body, bloomer, bavoir). Doux et confortable pour la peau de bébé, avec des motifs colorés et joyeux.',
    shortDescription: '3 pièces, wax doux, motifs joyeux',
    category: 'mode',
    images: [
      'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=800&h=800&fit=crop'
    ],
    rating: 4.9,
    reviewCount: 64,
    inStock: true,
    featured: false,
    badge: 'Nouveau',
    specifications: { 'Matière': '100% Coton wax', 'Âge': '3-18 mois', 'Pièces': 'Body + Bloomer + Bavoir', 'Entretien': 'Machine 30°C' }
  },
  {
    id: 'prod-108',
    name: 'Montre bracelet en perles - Artisanal',
    slug: 'montre-bracelet-perles',
    price: 15000,
    description: 'Montre-bracelet unique avec bracelet en perles fabriquées à la main en Côte d\'Ivoire. Mécanisme quartz japonais, design original et coloré.',
    shortDescription: 'Perles artisanales, quartz japonais',
    category: 'mode',
    images: [
      'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=800&h=800&fit=crop'
    ],
    rating: 4.4,
    reviewCount: 38,
    inStock: true,
    featured: false,
    specifications: { 'Mouvement': 'Quartz japonais', 'Bracelet': 'Perles artisanales', 'Boîtier': 'Acier inoxydable', 'Étanchéité': '3 ATM' }
  },

  // MAISON & DÉCO
  {
    id: 'prod-201',
    name: 'Climatiseur Split 12000 BTU',
    slug: 'climatiseur-split-12000',
    price: 275000,
    originalPrice: 320000,
    description: 'Climatiseur split mural 12000 BTU avec fonction chaud/froid, télécommande et filtre anti-bactérien. Parfait pour les pièces de 15-25m². Installation disponible à Daloa et Bouaké.',
    shortDescription: '12000 BTU, chaud/froid, télécommande',
    category: 'maison',
    images: [
      'https://images.unsplash.com/photo-1631545308456-38e183e8eca1?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1585771724684-3826ed6306a0?w=800&h=800&fit=crop'
    ],
    rating: 4.5,
    reviewCount: 112,
    inStock: true,
    featured: true,
    badge: 'Promo',
    specifications: { 'Puissance': '12000 BTU', 'Surface': '15-25 m²', 'Fonction': 'Chaud/Froid', 'Niveau sonore': '32 dB' }
  },
  {
    id: 'prod-202',
    name: 'Réfrigérateur Double porte 350L',
    slug: 'refrigerateur-double-350l',
    price: 320000,
    description: 'Réfrigérateur double porte 350 litres avec congélateur en bas, clayettes en verre trempé et éclairage LED. Classe énergétique A+. Livraison gratuite à Daloa.',
    shortDescription: '350L, double porte, classe A+',
    category: 'maison',
    images: [
      'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=800&h=800&fit=crop'
    ],
    rating: 4.3,
    reviewCount: 78,
    inStock: true,
    featured: true,
    specifications: { 'Capacité': '350 Litres', 'Type': 'Double porte', 'Classe': 'A+', 'Dimensions': '170x60x65 cm' }
  },
  {
    id: 'prod-203',
    name: 'Ventilateur sur pied - 5 vitesses',
    slug: 'ventilateur-sur-pied-5vit',
    price: 28000,
    description: 'Ventilateur sur pied avec 5 vitesses, oscillation automatique et hauteur réglable. Moteur silencieux et pale de 40cm. Idéal pour la saison sèche.',
    shortDescription: '5 vitesses, oscillation, silencieux',
    category: 'maison',
    images: [
      'https://images.unsplash.com/photo-1565347840309-40c029498ba1?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1614003543874-1c8b09a74f93?w=800&h=800&fit=crop'
    ],
    rating: 4.1,
    reviewCount: 145,
    inStock: true,
    featured: false,
    badge: 'Populaire',
    specifications: { 'Vitesses': '5', 'Diamètre': '40 cm', 'Oscillation': 'Automatique', 'Puissance': '55W' }
  },
  {
    id: 'prod-204',
    name: 'Machine à laver 8kg - automatique',
    slug: 'machine-laver-8kg',
    price: 195000,
    originalPrice: 240000,
    description: 'Machine à laver automatique 8kg avec 15 programmes de lavage, essorage 1200 tr/min et départ différé. Économique en eau et en électricité.',
    shortDescription: '8kg, 15 programmes, essorage 1200tr/min',
    category: 'maison',
    images: [
      'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=800&h=800&fit=crop'
    ],
    rating: 4.4,
    reviewCount: 67,
    inStock: true,
    featured: false,
    specifications: { 'Capacité': '8 kg', 'Programmes': '15', 'Essorage': '1200 tr/min', 'Classe': 'A++' }
  },
  {
    id: 'prod-205',
    name: 'Tableau décoratif en bois sculpté',
    slug: 'tableau-bois-sculpte',
    price: 35000,
    description: 'Tableau décoratif en bois sculpté à la main par des artisans de Côte d\'Ivoire. Motifs traditionnels africains, pièce unique apportant chaleur et authenticité à votre intérieur.',
    shortDescription: 'Bois sculpté, artisanal, pièce unique',
    category: 'maison',
    images: [
      'https://images.unsplash.com/photo-1582582429416-20aed0477f36?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=800&h=800&fit=crop'
    ],
    rating: 4.8,
    reviewCount: 34,
    inStock: true,
    featured: false,
    specifications: { 'Matière': 'Bois d\'ébène', 'Dimensions': '60x40 cm', 'Origine': 'Artisanat CI', 'Poids': '2.5 kg' }
  },
  {
    id: 'prod-206',
    name: 'Onduleur 1500VA - protection électrique',
    slug: 'onduleur-1500va',
    price: 65000,
    description: 'Onduleur 1500VA avec technologie line-interactive, autonomie 20 minutes à pleine charge et régulateur de tension intégré. Protégez vos appareils des coupures.',
    shortDescription: '1500VA, line-interactive, régulateur',
    category: 'maison',
    images: [
      'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&h=800&fit=crop'
    ],
    rating: 4.3,
    reviewCount: 89,
    inStock: true,
    featured: false,
    badge: 'Essentiel',
    specifications: { 'Puissance': '1500 VA / 900W', 'Technologie': 'Line-interactive', 'Prises': '4 prises protégées', 'Autonomie': '20 min (pleine charge)' }
  },

  // BEAUTÉ & SOINS
  {
    id: 'prod-301',
    name: 'Beurre de karité pur - 500ml',
    slug: 'beurre-karite-pur-500ml',
    price: 8000,
    description: 'Beurre de karité 100% naturel et non raffiné, récolté dans le nord de la Côte d\'Ivoire. Hydrate et nourrit la peau et les cheveux en profondeur. Produit par des coopératives de femmes.',
    shortDescription: '100% naturel, non raffiné, nord CI',
    category: 'beaute',
    images: [
      'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&h=800&fit=crop'
    ],
    rating: 4.9,
    reviewCount: 267,
    inStock: true,
    featured: true,
    badge: 'Bio',
    specifications: { 'Volume': '500 ml', 'Type': 'Non raffiné', 'Origine': 'Nord Côte d\'Ivoire', 'Certification': '100% naturel' }
  },
  {
    id: 'prod-302',
    name: 'Huile de coco vierge - 1L',
    slug: 'huile-coco-vierge-1l',
    price: 6500,
    description: 'Huile de coco vierge extraite à froid, parfaite pour les cheveux, la peau et la cuisine. Riche en acides gras essentiels et en vitamines.',
    shortDescription: 'Extraite à froid, multi-usage, 1L',
    category: 'beaute',
    images: [
      'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1550411294-875baee86319?w=800&h=800&fit=crop'
    ],
    rating: 4.7,
    reviewCount: 189,
    inStock: true,
    featured: false,
    badge: 'Naturel',
    specifications: { 'Volume': '1 Litre', 'Extraction': 'À froid', 'Usage': 'Peau, cheveux, cuisine', 'Conservation': '12 mois' }
  },
  {
    id: 'prod-303',
    name: 'Coffret soins visage - 5 produits',
    slug: 'coffret-soins-visage-5-produits',
    price: 32000,
    originalPrice: 42000,
    description: 'Coffret complet de soins visage avec nettoyant, tonique, sérum, crème de jour et masque. Formule adaptée aux peaux africaines, résultats visibles en 2 semaines.',
    shortDescription: '5 produits, peaux africaines, résultats 2 sem.',
    category: 'beaute',
    images: [
      'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&h=800&fit=crop'
    ],
    rating: 4.6,
    reviewCount: 93,
    inStock: true,
    featured: true,
    badge: 'Coffret',
    specifications: { 'Contenu': '5 produits', 'Type peau': 'Tous types', 'Ingrédients': 'Naturels', 'Durée traitement': '1 mois' }
  },
  {
    id: 'prod-304',
    name: 'Savon noir africain - Lot de 6',
    slug: 'savon-noir-africain-lot6',
    price: 5000,
    description: 'Savon noir africain traditionnel fabriqué avec des cendres de plantain. Nettoie en douceur, aide à traiter l\'acné et les imperfections. Lot de 6 savons.',
    shortDescription: 'Traditionnel, anti-acné, lot de 6',
    category: 'beaute',
    images: [
      'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1607006344380-b6775a0824a7?w=800&h=800&fit=crop'
    ],
    rating: 4.8,
    reviewCount: 312,
    inStock: true,
    featured: false,
    badge: 'Populaire',
    specifications: { 'Quantité': '6 savons', 'Poids': '150g chacun', 'Ingrédients': 'Cendres de plantain, karité', 'Usage': 'Visage et corps' }
  },
  {
    id: 'prod-305',
    name: 'Parfum Oud Royal - 100ml',
    slug: 'parfum-oud-royal-100ml',
    price: 28000,
    description: 'Parfum oriental à base d\'oud et de musc, notes boisées et épicées. Longue tenue (8-12h) et sillage élégant. Flacon de luxe 100ml.',
    shortDescription: 'Oud & musc, tenue 8-12h, 100ml',
    category: 'beaute',
    images: [
      'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&h=800&fit=crop'
    ],
    rating: 4.5,
    reviewCount: 76,
    inStock: true,
    featured: false,
    specifications: { 'Volume': '100 ml', 'Famille': 'Orientale boisée', 'Tenue': '8-12 heures', 'Genre': 'Mixte' }
  },
  {
    id: 'prod-306',
    name: 'Kit tresses africaines - complet',
    slug: 'kit-tresses-africaines',
    price: 18000,
    originalPrice: 22000,
    description: 'Kit complet pour tresses africaines : mèches synthétiques (4 couleurs), gel coiffant, peigne et accessoires. Tout le nécessaire pour réaliser de belles tresses chez soi.',
    shortDescription: 'Mèches 4 couleurs, gel, peigne, accessoires',
    category: 'beaute',
    images: [
      'https://images.unsplash.com/photo-1595959183082-7b570b7e18fa?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a315?w=800&h=800&fit=crop'
    ],
    rating: 4.4,
    reviewCount: 58,
    inStock: true,
    featured: false,
    badge: 'Nouveau',
    specifications: { 'Mèches': '4 couleurs incluses', 'Accessoires': 'Gel + peigne + élastiques', 'Longueur': '50 cm', 'Matière': 'Fibre synthétique' }
  },

  // ALIMENTATION
  {
    id: 'prod-401',
    name: 'Cacao en poudre pur - 500g',
    slug: 'cacao-poudre-pur-500g',
    price: 4500,
    description: 'Cacao en poudre 100% pur, issu des meilleures plantations de Côte d\'Ivoire, premier producteur mondial. Riche en antioxydants, sans sucre ajouté.',
    shortDescription: '100% pur, CI premier producteur, sans sucre',
    category: 'alimentation',
    images: [
      'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1587132137056-bfbf0166836e?w=800&h=800&fit=crop'
    ],
    rating: 4.8,
    reviewCount: 203,
    inStock: true,
    featured: true,
    badge: 'Local',
    specifications: { 'Poids': '500g', 'Pureté': '100%', 'Origine': 'Côte d\'Ivoire', 'Sucre': 'Sans sucre ajouté' }
  },
  {
    id: 'prod-402',
    name: 'Attiéké frais premium - 5kg',
    slug: 'attiéké-frais-premium-5kg',
    price: 3500,
    description: 'Attiéké frais de qualité premium, préparé selon la recette traditionnelle. Semoule de manioc fine et légère, parfaite pour accompagner poissons et viandes grillés.',
    shortDescription: 'Frais, recette traditionnelle, 5kg',
    category: 'alimentation',
    images: [
      'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2f6?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=800&fit=crop'
    ],
    rating: 4.6,
    reviewCount: 178,
    inStock: true,
    featured: true,
    badge: 'Frais',
    specifications: { 'Poids': '5 kg', 'Type': 'Frais', 'Conservation': '3 jours (frais)', 'Origine': 'Côte d\'Ivoire' }
  },
  {
    id: 'prod-403',
    name: 'Huile de palme rouge - 5L',
    slug: 'huile-palme-rouge-5l',
    price: 7500,
    description: 'Huile de palme rouge vierge, extraite traditionnellement. Riche en vitamines A et E, essentielle pour la cuisine africaine. Bidon de 5 litres.',
    shortDescription: 'Vierge, riche en vitamines A&E, 5L',
    category: 'alimentation',
    images: [
      'https://images.unsplash.com/photo-1474979266404-7f28db8c36de?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&h=800&fit=crop'
    ],
    rating: 4.5,
    reviewCount: 134,
    inStock: true,
    featured: false,
    specifications: { 'Volume': '5 Litres', 'Type': 'Vierge', 'Extraction': 'Traditionnelle', 'Vitamines': 'A et E' }
  },
  {
    id: 'prod-404',
    name: 'Épices ivoiriennes - Coffret découverte',
    slug: 'epices-ivoiriennes-coffret',
    price: 12000,
    description: 'Coffret de 8 épices et condiments traditionnels ivoiriens : Soumbala, Néré, Poivre de penja, Piment, etc. Idéal pour découvrir les saveurs de Côte d\'Ivoire.',
    shortDescription: '8 épices traditionnelles, coffret cadeau',
    category: 'alimentation',
    images: [
      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1532336414038-cf19250c5757?w=800&h=800&fit=crop'
    ],
    rating: 4.7,
    reviewCount: 95,
    inStock: true,
    featured: true,
    badge: 'Coffret',
    specifications: { 'Contenu': '8 épices', 'Poids total': '800g', 'Conservation': '12 mois', 'Origine': 'Côte d\'Ivoire' }
  },
  {
    id: 'prod-405',
    name: 'Riz parfumé importé - Sac 25kg',
    slug: 'riz-parfume-25kg',
    price: 18000,
    description: 'Riz parfumé de qualité importé, grain long et fin. Cuisson rapide et résultat moelleux. Sac familial de 25 kg.',
    shortDescription: 'Grain long, cuisson rapide, 25kg',
    category: 'alimentation',
    images: [
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2f6?w=800&h=800&fit=crop'
    ],
    rating: 4.4,
    reviewCount: 223,
    inStock: true,
    featured: false,
    specifications: { 'Poids': '25 kg', 'Type': 'Grain long parfumé', 'Cuisson': '12-15 min', 'Qualité': 'Premium' }
  },
  {
    id: 'prod-406',
    name: 'Jus de bissap naturel - Pack 6 bouteilles',
    slug: 'jus-bissap-naturel-pack6',
    price: 6000,
    description: 'Jus de bissap (hibiscus) 100% naturel, préparé artisanalement sans conservateurs. Rafraîchissant et riche en vitamine C. Pack de 6 bouteilles de 1L.',
    shortDescription: 'Naturel, sans conservateurs, pack de 6x1L',
    category: 'alimentation',
    images: [
      'https://images.unsplash.com/photo-1534353473418-4cfa6c36a342?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=800&h=800&fit=crop'
    ],
    rating: 4.8,
    reviewCount: 156,
    inStock: true,
    featured: false,
    badge: 'Artisanal',
    specifications: { 'Contenu': '6 x 1 Litre', 'Ingrédients': 'Hibiscus, sucre, eau', 'Conservation': '5 jours (frais)', 'Sucre': 'Faible' }
  },

  // SPORT & LOISIRS
  {
    id: 'prod-501',
    name: 'Ballon de football officiel - Taille 5',
    slug: 'ballon-football-officiel-t5',
    price: 15000,
    description: 'Ballon de football taille 5 officiel, cousu main avec panneaux thermocollés. Surface texturée pour un meilleur contrôle. Adapté au jeu sur tous terrains.',
    shortDescription: 'Taille 5, officiel, tous terrains',
    category: 'sport',
    images: [
      'https://images.unsplash.com/photo-1614632537197-38a17061c2bd?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1575361204480-aade8298357f?w=800&h=800&fit=crop'
    ],
    rating: 4.5,
    reviewCount: 187,
    inStock: true,
    featured: true,
    badge: 'Officiel',
    specifications: { 'Taille': '5', 'Matière': 'PU + caoutchouc', 'Couture': 'Main + thermocollé', 'Terrain': 'Tous' }
  },
  {
    id: 'prod-502',
    name: 'Tapis de yoga antidérapant',
    slug: 'tapis-yoga-antiderapant',
    price: 12000,
    description: 'Tapis de yoga antidérapant 6mm d\'épaisseur, matériau TPE écologique, léger et facile à transporter. Idéal pour yoga, pilates et stretching.',
    shortDescription: '6mm, antidérapant, TPE écologique',
    category: 'sport',
    images: [
      'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=800&fit=crop'
    ],
    rating: 4.6,
    reviewCount: 98,
    inStock: true,
    featured: false,
    specifications: { 'Épaisseur': '6 mm', 'Matière': 'TPE écologique', 'Dimensions': '183x61 cm', 'Poids': '800g' }
  },
  {
    id: 'prod-503',
    name: 'Haltères ajustables 2x20kg',
    slug: 'halteres-ajustables-2x20kg',
    price: 55000,
    description: 'Paire d\'haltères ajustables de 2 à 20 kg chacune. Système de réglage rapide, poignée ergonomique et base de rangement incluse. Parfait pour la musculation à domicile.',
    shortDescription: '2-20kg chacune, réglage rapide, base incluse',
    category: 'sport',
    images: [
      'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=800&fit=crop'
    ],
    rating: 4.7,
    reviewCount: 67,
    inStock: true,
    featured: false,
    specifications: { 'Poids': '2 à 20 kg x 2', 'Réglage': 'Rapide', 'Poignée': 'Ergonomique', 'Base': 'Incluse' }
  },
  {
    id: 'prod-504',
    name: 'Maillot de football Côte d\'Ivoire 2024',
    slug: 'maillot-ci-2024',
    price: 22000,
    originalPrice: 28000,
    description: 'Maillot officiel de l\'équipe nationale de Côte d\'Ivoire saison 2024. Technologie Dri-FIT, coupe athlétique et couleurs orange-blanc-vert. Livraison avec flocage gratuit.',
    shortDescription: 'Officiel 2024, Dri-FIT, flocage gratuit',
    category: 'sport',
    images: [
      'https://images.unsplash.com/photo-1580087256394-dc596e1c2a34?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=800&h=800&fit=crop'
    ],
    rating: 4.9,
    reviewCount: 312,
    inStock: true,
    featured: true,
    badge: 'Officiel',
    specifications: { 'Technologie': 'Dri-FIT', 'Tailles': 'S à XXL', 'Saison': '2024', 'Flocage': 'Gratuit' }
  },
  {
    id: 'prod-505',
    name: 'Raquette de badminton - Pack duo',
    slug: 'raquette-badminton-duo',
    price: 18000,
    description: 'Pack de 2 raquettes de badminton en carbone avec grip ergonomique, 6 volants et 1 housse de transport. Idéal pour les parties en famille ou entre amis.',
    shortDescription: '2 raquettes carbone, 6 volants, housse',
    category: 'sport',
    images: [
      'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1554290704-3561a1a7ac1b?w=800&h=800&fit=crop'
    ],
    rating: 4.3,
    reviewCount: 45,
    inStock: true,
    featured: false,
    specifications: { 'Raquettes': '2 en carbone', 'Volants': '6 inclus', 'Housse': 'Incluse', 'Niveau': 'Loisirs à intermédiaire' }
  },
  {
    id: 'prod-506',
    name: 'Corde à sauter speed - professionnelle',
    slug: 'corde-sauter-speed-pro',
    price: 5000,
    description: 'Corde à sauter speed avec roulements à billes, câbles acier gainés et poignées aluminium. Compteur digital de sauts intégré. Pour entraînement intensif.',
    shortDescription: 'Roulements à billes, compteur digital, câble acier',
    category: 'sport',
    images: [
      'https://images.unsplash.com/photo-1517963879433-6ad2b056d712?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1434596922112-19c563067271?w=800&h=800&fit=crop'
    ],
    rating: 4.4,
    reviewCount: 112,
    inStock: true,
    featured: false,
    specifications: { 'Matériau': 'Câble acier gainé', 'Poignées': 'Aluminium', 'Compteur': 'Digital', 'Longueur': 'Ajustable 3m' }
  }
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find(p => p.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return products.find(p => p.id === id);
}

export function getProductsByCategory(categorySlug: string): Product[] {
  return products.filter(p => p.category === categorySlug);
}

export function getFeaturedProducts(): Product[] {
  return products.filter(p => p.featured);
}

export function searchProducts(query: string): Product[] {
  const q = query.toLowerCase();
  return products.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.shortDescription.toLowerCase().includes(q) ||
    p.category.toLowerCase().includes(q)
  );
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
}
