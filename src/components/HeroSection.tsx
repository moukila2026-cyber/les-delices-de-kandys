'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Truck, Shield, Clock, Headphones } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Main Hero */}
      <div className="relative bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&h=800&fit=crop')] bg-cover bg-center opacity-5" />
        
        <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-100 text-amber-700 rounded-full text-sm font-medium mb-6">
                🛍️ Bienvenue chez Global Shop Daloa
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Votre shop
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600"> préféré </span>
                à Daloa & Bouaké
              </h1>
              <p className="mt-6 text-lg text-gray-600 max-w-lg">
                Découvrez une large sélection de produits de qualité : électronique, mode, beauté, alimentation et plus encore. Livraison rapide dans toute la région.
              </p>
              <div className="flex flex-wrap gap-4 mt-8">
                <Link
                  href="/collections/electronics"
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-amber-200"
                >
                  Découvrir nos produits
                  <ArrowRight size={18} />
                </Link>
                <Link
                  href="/collections/mode"
                  className="inline-flex items-center gap-2 px-8 py-3.5 border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white font-semibold rounded-xl transition-colors"
                >
                  Collection Mode
                </Link>
              </div>
            </motion.div>

            {/* Right - Featured images */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="relative w-full aspect-square max-w-lg mx-auto">
                <div className="absolute top-0 right-0 w-72 h-72 bg-amber-200/50 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-60 h-60 bg-orange-200/50 rounded-full blur-3xl" />
                
                <motion.div
                  animate={{ y: [-5, 5, -5] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="relative z-10"
                >
                  <img
                    src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=600&fit=crop"
                    alt="Shopping"
                    className="w-full h-full object-cover rounded-3xl shadow-2xl"
                  />
                </motion.div>

                {/* Floating badge */}
                <motion.div
                  animate={{ y: [-3, 3, -3] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl p-4 z-20"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Truck className="text-green-600" size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">Livraison rapide</p>
                      <p className="text-xs text-gray-500">Daloa & Bouaké</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [3, -3, 3] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl p-4 z-20"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                      <Shield className="text-amber-600" size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">100% Authentic</p>
                      <p className="text-xs text-gray-500">Produits certifiés</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Features bar */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Truck, title: 'Livraison rapide', desc: 'Daloa & Bouaké' },
              { icon: Shield, title: 'Paiement sécurisé', desc: 'Mobile Money & Cash' },
              { icon: Clock, title: 'Service 7j/7', desc: '8h - 20h' },
              { icon: Headphones, title: 'Support client', desc: 'WhatsApp & Appel' },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center shrink-0">
                  <feature.icon className="text-amber-600" size={20} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{feature.title}</p>
                  <p className="text-xs text-gray-500">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
