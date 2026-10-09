import { Category } from './types';

export const categories: Category[] = [
  {
    id: 'electronics',
    name: 'Électronique',
    slug: 'electronics',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&h=400&fit=crop',
    productCount: 8,
    description: 'Smartphones, accessoires et gadgets de dernière génération'
  },
  {
    id: 'mode',
    name: 'Mode & Vêtements',
    slug: 'mode',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&h=400&fit=crop',
    productCount: 8,
    description: 'Tendances africaines et internationales pour tous les styles'
  },
  {
    id: 'maison',
    name: 'Maison & Déco',
    slug: 'maison',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop',
    productCount: 6,
    description: 'Électroménager et décoration pour votre intérieur'
  },
  {
    id: 'beaute',
    name: 'Beauté & Soins',
    slug: 'beaute',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=400&fit=crop',
    productCount: 6,
    description: 'Produits de beauté et soins naturels de qualité'
  },
  {
    id: 'alimentation',
    name: 'Alimentation',
    slug: 'alimentation',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&h=400&fit=crop',
    productCount: 6,
    description: 'Produits locaux et importés, épicerie fine'
  },
  {
    id: 'sport',
    name: 'Sport & Loisirs',
    slug: 'sport',
    image: 'https://images.unsplash.com/photo-1461896836934-bd45ba8fcfbb?w=600&h=400&fit=crop',
    productCount: 6,
    description: 'Équipements sportifs et articles de loisirs'
  }
];
