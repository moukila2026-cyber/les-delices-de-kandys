'use client';

import { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { SlidersHorizontal, Grid3X3, LayoutList, ChevronDown } from 'lucide-react';
import { getProductsByCategory, formatPrice } from '@/data/products';
import { categories } from '@/data/categories';
import { SortOption } from '@/data/types';
import ProductCard from '@/components/ProductCard';

export default function CollectionPage() {
  const params = useParams();
  const categorySlug = params.category as string;
  const category = categories.find(c => c.slug === categorySlug);
  const categoryProducts = getProductsByCategory(categorySlug);

  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  const filteredProducts = useMemo(() => {
    let filtered = [...categoryProducts];

    // Price filter
    filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Stock filter
    if (inStockOnly) {
      filtered = filtered.filter(p => p.inStock);
    }

    // Sort
    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.reverse();
        break;
      default:
        // Featured - keep original order
        break;
    }

    return filtered;
  }, [categoryProducts, sortBy, priceRange, inStockOnly]);

  if (!category) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">Catégorie non trouvée</h1>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero */}
      <div className="relative bg-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{category.name}</h1>
            <p className="text-gray-500 mt-2">{category.description}</p>
            <p className="text-sm text-gray-400 mt-2">{filteredProducts.length} produits</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl hover:border-amber-300 transition-colors text-sm font-medium"
            >
              <SlidersHorizontal size={16} />
              Filtres
            </button>
            <div className="hidden sm:flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-amber-100 text-amber-700' : 'text-gray-400'}`}
              >
                <Grid3X3 size={16} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-amber-100 text-amber-700' : 'text-gray-400'}`}
              >
                <LayoutList size={16} />
              </button>
            </div>
          </div>

          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="appearance-none px-4 py-2.5 pr-10 bg-white border border-gray-200 rounded-xl text-sm font-medium cursor-pointer hover:border-amber-300 transition-colors"
            >
              <option value="featured">En vedette</option>
              <option value="price-asc">Prix croissant</option>
              <option value="price-desc">Prix décroissant</option>
              <option value="rating">Meilleures notes</option>
              <option value="newest">Plus récents</option>
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Filters panel */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-white rounded-2xl p-6 mb-6 border"
          >
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Fourchette de prix</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                      placeholder="Min"
                    />
                    <span className="text-gray-400">-</span>
                    <input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                      placeholder="Max"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {[[0, 10000], [10000, 50000], [50000, 100000], [100000, 500000], [500000, 1000000]].map(([min, max]) => (
                      <button
                        key={`${min}-${max}`}
                        onClick={() => setPriceRange([min, max])}
                        className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                          priceRange[0] === min && priceRange[1] === max
                            ? 'bg-amber-100 border-amber-300 text-amber-700'
                            : 'border-gray-200 hover:border-amber-300'
                        }`}
                      >
                        {min === 0 ? '< ' : formatPrice(min)} - {max === 1000000 ? '+' : formatPrice(max)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Disponibilité</h3>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                  />
                  <span className="text-sm text-gray-700">En stock uniquement</span>
                </label>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Résumé</h3>
                <p className="text-sm text-gray-500">
                  {filteredProducts.length} produit(s) trouvé(s)
                </p>
                <button
                  onClick={() => { setPriceRange([0, 1000000]); setInStockOnly(false); setSortBy('featured'); }}
                  className="mt-2 text-sm text-amber-600 hover:underline"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Products grid */}
        {filteredProducts.length > 0 ? (
          <div className={`grid gap-4 md:gap-6 ${
            viewMode === 'grid'
              ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
              : 'grid-cols-1 md:grid-cols-2'
          }`}>
            {filteredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">Aucun produit ne correspond à vos filtres.</p>
            <button
              onClick={() => { setPriceRange([0, 1000000]); setInStockOnly(false); }}
              className="mt-4 text-amber-600 font-medium hover:underline"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
