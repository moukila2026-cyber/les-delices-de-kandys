'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Star, ShoppingCart, Heart, Truck, Shield, RotateCcw, Minus, Plus, ChevronLeft, Check } from 'lucide-react';
import { products, formatPrice, getProductBySlug } from '@/data/products';
import { getReviewsByProductId } from '@/data/reviews';
import { useCart } from '@/context/CartContext';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';

export default function ProductPage() {
  const params = useParams();
  const slug = params.id as string;
  const product = getProductBySlug(slug) || products[0];
  const reviews = getReviewsByProductId(product.id);
  const { addToCart } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || '');

  // Get related products
  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Produit non trouvé</h1>
        <Link href="/" className="text-amber-600 hover:underline mt-4 inline-block">Retour à l'accueil</Link>
      </div>
    );
  }

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  return (
    <div className="bg-white">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <nav className="flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-amber-600">Accueil</Link>
          <span>/</span>
          <Link href={`/collections/${product.category}`} className="hover:text-amber-600 capitalize">{product.category}</Link>
          <span>/</span>
          <span className="text-gray-900 truncate">{product.name}</span>
        </nav>
      </div>

      {/* Product Section */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="grid lg:grid-cols-2 gap-10">
          {/* Images */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 mb-4">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.badge && (
                <span className="absolute top-4 left-4 px-3 py-1.5 bg-amber-600 text-white text-sm font-semibold rounded-full">
                  {product.badge}
                </span>
              )}
              {discount > 0 && (
                <span className="absolute top-4 right-4 px-3 py-1.5 bg-red-500 text-white text-sm font-semibold rounded-full">
                  -{discount}%
                </span>
              )}
            </div>
            <div className="grid grid-cols-4 gap-3">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`aspect-square rounded-xl overflow-hidden border-2 transition-colors ${
                    selectedImage === idx ? 'border-amber-500' : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <p className="text-amber-600 font-medium text-sm uppercase tracking-wide">{product.category === 'electronics' ? 'Électronique' : product.category === 'mode' ? 'Mode' : product.category === 'maison' ? 'Maison' : product.category === 'beaute' ? 'Beauté' : product.category === 'alimentation' ? 'Alimentation' : 'Sport'}</p>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mt-2">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mt-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className={i < Math.floor(product.rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200'} />
                ))}
              </div>
              <span className="text-sm text-gray-600">{product.rating}/5</span>
              <span className="text-sm text-gray-400">|</span>
              <span className="text-sm text-gray-500">{product.reviewCount} avis</span>
            </div>

            {/* Price */}
            <div className="mt-6">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-gray-900">{formatPrice(product.price)}</span>
                {product.originalPrice && (
                  <span className="text-lg text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
                )}
              </div>
              {discount > 0 && (
                <p className="text-green-600 text-sm font-medium mt-1">Vous économisez {formatPrice(product.originalPrice! - product.price)}</p>
              )}
            </div>

            {/* Description */}
            <p className="mt-6 text-gray-600 leading-relaxed">{product.description}</p>

            {/* Colors */}
            {product.colors && product.colors.length > 0 && (
              <div className="mt-6">
                <p className="text-sm font-semibold text-gray-900 mb-2">Couleur: {selectedColor}</p>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 border-2 rounded-lg text-sm transition-colors ${
                        selectedColor === color
                          ? 'border-amber-500 bg-amber-50 text-amber-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity & Add to cart */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <div className="flex items-center border border-gray-300 rounded-xl">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:bg-gray-50 transition-colors"
                >
                  <Minus size={16} />
                </button>
                <span className="px-4 font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3 hover:bg-gray-50 transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
              <button
                onClick={() => addToCart(product, quantity)}
                className="flex-1 flex items-center justify-center gap-2 px-8 py-3.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-amber-200"
              >
                <ShoppingCart size={18} />
                Ajouter au panier
              </button>
              <button className="p-3.5 border border-gray-300 rounded-xl hover:bg-red-50 hover:text-red-500 hover:border-red-300 transition-colors">
                <Heart size={20} />
              </button>
            </div>

            {/* Features */}
            <div className="mt-8 grid grid-cols-3 gap-4">
              {[
                { icon: Truck, label: 'Livraison', desc: 'Daloa & Bouaké' },
                { icon: Shield, label: 'Garantie', desc: 'Produit certifié' },
                { icon: RotateCcw, label: 'Retour', desc: 'Sous 7 jours' },
              ].map((feature, i) => (
                <div key={i} className="text-center p-3 bg-gray-50 rounded-xl">
                  <feature.icon className="mx-auto text-amber-600 mb-1" size={20} />
                  <p className="text-xs font-semibold text-gray-900">{feature.label}</p>
                  <p className="text-xs text-gray-500">{feature.desc}</p>
                </div>
              ))}
            </div>

            {/* Specifications */}
            {product.specifications && (
              <div className="mt-8">
                <h3 className="font-bold text-gray-900 mb-3">Spécifications</h3>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                      <Check size={14} className="text-green-500 shrink-0" />
                      <span className="text-sm"><span className="font-medium">{key}:</span> {value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Reviews */}
        {reviews.length > 0 && (
          <div className="mt-16 border-t pt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Avis Clients ({reviews.length})</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.map((review, index) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-50 rounded-xl p-5 border"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <img src={review.avatar} alt={review.author} className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <p className="font-semibold text-sm text-gray-900">{review.author}</p>
                      <p className="text-xs text-gray-500">{review.date}</p>
                    </div>
                    {review.verified && (
                      <span className="ml-auto text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">✓ Vérifié</span>
                    )}
                  </div>
                  <div className="flex items-center gap-0.5 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={12} className={i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'} />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600">{review.comment}</p>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 border-t pt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Produits Similaires</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((p, index) => (
                <ProductCard key={p.id} product={p} index={index} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
