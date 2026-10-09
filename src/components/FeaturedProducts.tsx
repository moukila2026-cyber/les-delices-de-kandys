'use client';

import { motion } from 'framer-motion';
import { products } from '@/data/products';
import ProductCard from './ProductCard';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function FeaturedProducts() {
  const featured = products.filter(p => p.featured).slice(0, 8);

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-end justify-between mb-10"
        >
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Produits Vedettes</h2>
            <p className="text-gray-500 mt-3">Nos meilleurs produits sélectionnés pour vous</p>
          </div>
          <Link
            href="/collections/electronics"
            className="hidden md:flex items-center gap-1 text-amber-600 hover:text-amber-700 font-medium text-sm"
          >
            Voir tout <ArrowRight size={16} />
          </Link>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {featured.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
