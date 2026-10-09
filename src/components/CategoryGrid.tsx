'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { categories } from '@/data/categories';

export default function CategoryGrid() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Nos Collections</h2>
          <p className="text-gray-500 mt-3 max-w-2xl mx-auto">
            Explorez nos différentes catégories de produits soigneusement sélectionnés pour vous
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
            >
              <Link
                href={`/collections/${category.slug}`}
                className="group block relative aspect-square rounded-2xl overflow-hidden"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white font-bold text-sm">{category.name}</h3>
                  <p className="text-white/70 text-xs mt-0.5">{category.productCount} produits</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
