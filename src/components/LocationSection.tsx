'use client';

import { motion } from 'framer-motion';
import { MapPin, Phone, Clock } from 'lucide-react';

export default function LocationSection() {
  return (
    <section className="py-16 bg-gradient-to-br from-amber-600 to-orange-600">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white">Retrouvez-nous</h2>
          <p className="text-white/80 mt-3">Deux boutiques pour mieux vous servir</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {[
            {
              city: 'Daloa',
              address: 'Quartier Commerce, face à la Cathédrale',
              phone: '+225 07 08 09 10 11',
              hours: 'Lun-Sam: 8h-20h | Dim: 9h-14h',
              main: true
            },
            {
              city: 'Bouaké',
              address: 'Grand Marché, Rue du Commerce',
              phone: '+225 05 06 07 08 09',
              hours: 'Lun-Sam: 8h-20h | Dim: 9h-14h',
              main: false
            }
          ].map((shop, index) => (
            <motion.div
              key={shop.city}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
            >
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <MapPin className="text-amber-200" size={20} />
                {shop.city}
                {shop.main && <span className="text-xs bg-amber-400 text-amber-900 px-2 py-0.5 rounded-full font-medium">Siège</span>}
              </h3>
              <div className="mt-4 space-y-3">
                <p className="text-white/90 text-sm flex items-start gap-2">
                  <MapPin size={14} className="shrink-0 mt-0.5" />
                  {shop.address}
                </p>
                <p className="text-white/90 text-sm flex items-center gap-2">
                  <Phone size={14} className="shrink-0" />
                  {shop.phone}
                </p>
                <p className="text-white/90 text-sm flex items-center gap-2">
                  <Clock size={14} className="shrink-0" />
                  {shop.hours}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
