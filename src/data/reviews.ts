import { Review } from './types';

export const reviews: Review[] = [
  // iPhone 15 Pro Max
  { id: 'r1', productId: 'prod-001', author: 'Kouamé K.', rating: 5, date: '2024-09-15', comment: 'Excellent téléphone ! La caméra est incroyable et la batterie tient toute la journée. Livraison rapide à Daloa.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face', verified: true },
  { id: 'r2', productId: 'prod-001', author: 'Aïcha D.', rating: 5, date: '2024-09-10', comment: 'Je suis ravie de mon achat. Le design en titane est magnifique. Global Shop offre un service impeccable.', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face', verified: true },
  { id: 'r3', productId: 'prod-001', author: 'Yao M.', rating: 4, date: '2024-08-28', comment: 'Très bon téléphone, performances au top. Seul bémol : le prix un peu élevé mais la qualité est là.', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face', verified: true },

  // Samsung Galaxy S24
  { id: 'r4', productId: 'prod-002', author: 'Traoré S.', rating: 5, date: '2024-09-12', comment: 'Galaxy AI est bluffant ! Le S Pen est très pratique pour prendre des notes. Meilleur que l\'iPhone à mon goût.', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face', verified: true },
  { id: 'r5', productId: 'prod-002', author: 'Fatou B.', rating: 4, date: '2024-09-01', comment: 'Belle caméra, écran superbe. La fonctionnalité Galaxy AI est impressionnante. Je recommande !', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face', verified: true },

  // AirPods Pro
  { id: 'r6', productId: 'prod-003', author: 'Ibrahim K.', rating: 5, date: '2024-09-18', comment: 'La réduction de bruit est exceptionnelle ! Parfait pour se concentrer ou écouter de la musique dans le bus.', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face', verified: true },
  { id: 'r7', productId: 'prod-003', author: 'Marie-Claire A.', rating: 5, date: '2024-09-05', comment: 'Qualité sonore incroyable. L\'audio spatial est une révolution. Merci Global Shop pour la livraison rapide !', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face', verified: true },

  // Robe wax
  { id: 'r8', productId: 'prod-101', author: 'Aminata T.', rating: 5, date: '2024-09-20', comment: 'Magnifique robe ! Les motifs sont superbes et la coupe est très flatteuse. J\'ai reçu beaucoup de compliments.', avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&h=100&fit=crop&crop=face', verified: true },
  { id: 'r9', productId: 'prod-101', author: 'Christelle N.', rating: 5, date: '2024-09-14', comment: 'Le tissu est de très bonne qualité, les couleurs sont fidèles aux photos. Taille parfaitement. Je recommande vivement !', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face', verified: true },
  { id: 'r10', productId: 'prod-101', author: 'Bintou D.', rating: 4, date: '2024-08-30', comment: 'Belle robe, bon rapport qualité-prix. La livraison à Bouaké a pris 2 jours. Très satisfaite.', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face', verified: true },

  // Nike Air Max
  { id: 'r11', productId: 'prod-103', author: 'Koffi A.', rating: 5, date: '2024-09-17', comment: 'Sneakers authentiques, très confortables. Le confort Air Max est incomparable. Livraison à Daloa en 24h !', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face', verified: true },
  { id: 'r12', productId: 'prod-103', author: 'DJ Maliki', rating: 4, date: '2024-09-08', comment: 'Super baskets, style impeccable. Attention à prendre une demi-pointure au-dessus.', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face', verified: true },

  // Climatiseur
  { id: 'r13', productId: 'prod-201', author: 'Ouattara M.', rating: 5, date: '2024-09-16', comment: 'Installation impeccable par l\'équipe de Global Shop. Le climatiseur est silencieux et refroidit très bien ma chambre. Indispensable à Daloa !', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face', verified: true },
  { id: 'r14', productId: 'prod-201', author: 'Koné F.', rating: 4, date: '2024-09-02', comment: 'Bon produit, fonctionne bien. L\'installation était incluse dans le prix. Très satisfait du service.', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face', verified: true },

  // Beurre de karité
  { id: 'r15', productId: 'prod-301', author: 'Adjoua P.', rating: 5, date: '2024-09-19', comment: 'Meilleur beurre de karité que j\'ai utilisé ! Texture onctueuse, odeur naturelle. Mes cheveux n\'ont jamais été aussi doux.', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face', verified: true },
  { id: 'r16', productId: 'prod-301', author: 'Sylvie K.', rating: 5, date: '2024-09-11', comment: 'Produit de qualité exceptionnelle. On sent que c\'est du vrai karité pur. Je commande encore !', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face', verified: true },
  { id: 'r17', productId: 'prod-301', author: 'N\'Guessan E.', rating: 5, date: '2024-08-25', comment: 'Excellent pour la peau et les cheveux. Ma femme l\'adore. Produit 100% naturel, on le sent.', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face', verified: true },

  // Cacao
  { id: 'r18', productId: 'prod-401', author: 'Bamba I.', rating: 5, date: '2024-09-18', comment: 'Le meilleur cacao ! On sent la différence avec les marques industrielles. Fiers de notre cacao ivoirien !', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face', verified: true },
  { id: 'r19', productId: 'prod-401', author: 'Touré A.', rating: 4, date: '2024-09-06', comment: 'Cacao de très bonne qualité, riche en goût. Parfait pour le chocolat chaud et les gâteaux.', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face', verified: true },

  // Maillot CI
  { id: 'r20', productId: 'prod-504', author: 'Yao K.', rating: 5, date: '2024-09-21', comment: 'Magnifique maillot ! Qualité au rendez-vous et le flocage est parfait. Les Éléphants sont les plus forts !', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face', verified: true },
  { id: 'r21', productId: 'prod-504', author: 'Konan J.', rating: 5, date: '2024-09-13', comment: 'Maillot officiel de très bonne qualité. Tissu respirant, coupe parfaite. Fier de porter les couleurs de la CI !', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face', verified: true },

  // Ballon
  { id: 'r22', productId: 'prod-501', author: 'Sékou D.', rating: 5, date: '2024-09-15', comment: 'Ballon de très bonne qualité pour nos matchs de quartier à Daloa. Résistant et bonne tenue en l\'air.', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face', verified: true },

  // TV Samsung
  { id: 'r23', productId: 'prod-005', author: 'Coulibaly M.', rating: 5, date: '2024-09-17', comment: 'Image magnifique ! Les couleurs sont éclatantes et le son est bon. Le Smart TV est facile à utiliser. Livraison à Bouaké rapide.', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face', verified: true },

  // Sac cuir
  { id: 'r24', productId: 'prod-104', author: 'Akissi R.', rating: 5, date: '2024-09-19', comment: 'Sac magnifique, cuir de très bonne qualité. Les finitions sont parfaites. C\'est un produit artisanal d\'excellence.', avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&h=100&fit=crop&crop=face', verified: true },

  // Jus de bissap
  { id: 'r25', productId: 'prod-406', author: 'Diabaté F.', rating: 5, date: '2024-09-20', comment: 'Délicieux ! Le goût est authentique, comme chez ma grand-mère. Frais et naturel. Je recommande à tous !', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face', verified: true },
];

export function getReviewsByProductId(productId: string): Review[] {
  return reviews.filter(r => r.productId === productId);
}
