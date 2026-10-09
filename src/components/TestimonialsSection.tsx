'use client';

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { reviews } from '@/data/reviews';

export default function TestimonialsSection() {
  const topReviews = reviews.filter(r => r.rating === 5).slice(0, 6);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Ce que disent nos clients</h2>
          <p className="text-gray-500 mt-3">La satisfaction de nos clients est notre priorité</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topReviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-50 rounded-2xl p-6 border border-gray-100"
            >
              <Quote className="text-amber-200 mb-3" size={24} />
              <p className="text-gray-700 text-sm leading-relaxed">{review.comment}</p>
              <div className="flex items-center gap-1 mt-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={12} className={i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'} />
                ))}
              </div>
              <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-200">
                <img src={review.avatar} alt={review.author} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <p className="text-sm font-semibold text-gray-900">{review.author}</p>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    {review.verified && <span className="text-green-500">✓</span>} Client vérifié
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
