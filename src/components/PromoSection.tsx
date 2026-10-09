'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function PromoSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Promo 1 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden h-64 md:h-80"
          >
            <img
              src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&h=500&fit=crop"
              alt="Promo Électronique"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-amber-900/80 to-transparent" />
            <div className="absolute bottom-0 left-0 p-8">
              <span className="px-3 py-1 bg-amber-500 text-white text-xs font-bold rounded-full">PROMO</span>
              <h3 className="text-2xl font-bold text-white mt-3">Électronique</h3>
              <p className="text-white/80 text-sm mt-1">Jusqu'à -20% sur les smartphones</p>
              <Link href="/collections/electronics" className="inline-flex items-center gap-1 mt-3 text-white font-medium text-sm hover:underline">
                Découvrir <ArrowRight size={14} />
              </Link>
            </div>
          </motion.div>

          {/* Promo 2 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden h-64 md:h-80"
          >
            <img
              src="https://images.unsplash.com/photo-1590735213920-68192a487bc2?w=800&h=500&fit=crop"
              alt="Collection Mode"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 to-transparent" />
            <div className="absolute bottom-0 left-0 p-8">
              <span className="px-3 py-1 bg-purple-500 text-white text-xs font-bold rounded-full">NOUVEAU</span>
              <h3 className="text-2xl font-bold text-white mt-3">Mode Africaine</h3>
              <p className="text-white/80 text-sm mt-1">Nouvelle collection wax & pagne</p>
              <Link href="/collections/mode" className="inline-flex items-center gap-1 mt-3 text-white font-medium text-sm hover:underline">
                Découvrir <ArrowRight size={14} />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
