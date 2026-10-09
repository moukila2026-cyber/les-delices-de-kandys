'use client';

import Link from 'next/link';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { Product } from '@/data/types';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addToCart } = useCart();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:border-amber-200 transition-all duration-300"
    >
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {product.badge && (
            <span className={`absolute top-3 left-3 px-2.5 py-1 text-xs font-semibold rounded-full ${
              product.badge === 'Promo' ? 'bg-red-500 text-white' :
              product.badge === 'Nouveau' ? 'bg-blue-500 text-white' :
              product.badge === 'Best-seller' ? 'bg-amber-500 text-white' :
              product.badge === 'Populaire' ? 'bg-purple-500 text-white' :
              'bg-green-500 text-white'
            }`}>
              {product.badge}
            </span>
          )}
          <button
            className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white hover:text-red-500"
            onClick={(e) => { e.preventDefault(); }}
          >
            <Heart size={16} />
          </button>
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/products/${product.slug}`}>
          <p className="text-xs text-amber-600 font-medium uppercase tracking-wide mb-1">{product.category === 'electronics' ? 'Électronique' : product.category === 'mode' ? 'Mode' : product.category === 'maison' ? 'Maison' : product.category === 'beaute' ? 'Beauté' : product.category === 'alimentation' ? 'Alimentation' : 'Sport'}</p>
          <h3 className="font-semibold text-gray-900 group-hover:text-amber-600 transition-colors line-clamp-2 text-sm leading-snug">{product.name}</h3>
        </Link>

        <div className="flex items-center gap-1 mt-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={12}
                className={i < Math.floor(product.rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500">({product.reviewCount})</span>
        </div>

        <div className="flex items-center justify-between mt-3">
          <div>
            <span className="text-lg font-bold text-gray-900">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="ml-2 text-sm text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
            )}
          </div>
        </div>

        <button
          onClick={() => addToCart(product)}
          className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-900 hover:bg-amber-600 text-white text-sm font-medium rounded-xl transition-colors duration-300"
        >
          <ShoppingCart size={15} />
          Ajouter au panier
        </button>
      </div>
    </motion.div>
  );
}
