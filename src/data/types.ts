export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  description: string;
  shortDescription: string;
  category: string;
  subcategory?: string;
  images: string[];
  rating: number;
  reviewCount: number;
  inStock: boolean;
  featured: boolean;
  badge?: string;
  specifications?: Record<string, string>;
  colors?: string[];
}

export interface Review {
  id: string;
  productId: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  avatar: string;
  verified: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  productCount: number;
  description: string;
}

export type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest';
