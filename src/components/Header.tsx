'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ShoppingCart, Search, Menu, X, MapPin, Phone, User } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const { totalItems, setIsCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navLinks = [
    { href: '/', label: 'Accueil' },
    { href: '/collections/electronics', label: 'Électronique' },
    { href: '/collections/mode', label: 'Mode' },
    { href: '/collections/maison', label: 'Maison' },
    { href: '/collections/beaute', label: 'Beauté' },
    { href: '/collections/alimentation', label: 'Alimentation' },
    { href: '/collections/sport', label: 'Sport' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-amber-100">
      {/* Top bar */}
      <div className="bg-amber-600 text-white text-sm py-1.5">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <MapPin size={12} />
              Daloa & Bouaké, Côte d'Ivoire
            </span>
            <span className="hidden sm:flex items-center gap-1">
              <Phone size={12} />
              +225 07 08 09 10 11
            </span>
          </div>
          <span className="hidden md:block">🚚 Livraison gratuite à Daloa dès 50 000 FCFA</span>
        </div>
      </div>

      {/* Main header */}
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">G</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 leading-tight">Global Shop</h1>
              <p className="text-xs text-amber-600 font-medium -mt-0.5">Daloa</p>
            </div>
          </Link>

          {/* Search bar - desktop */}
          <div className="hidden md:flex flex-1 max-w-xl">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Rechercher un produit..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-gray-50"
              />
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Search size={20} className="text-gray-700" />
            </button>
            <button className="hidden sm:flex p-2 hover:bg-gray-100 rounded-full transition-colors">
              <User size={20} className="text-gray-700" />
            </button>
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 hover:bg-amber-50 rounded-full transition-colors"
            >
              <ShoppingCart size={22} className="text-gray-700" />
              {totalItems > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-amber-600 text-white text-xs font-bold rounded-full flex items-center justify-center"
                >
                  {totalItems}
                </motion.span>
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile search */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-2"
            >
              <div className="relative">
                <input
                  type="text"
                  placeholder="Rechercher un produit..."
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  autoFocus
                />
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation - desktop */}
      <nav className="hidden md:block border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-1 py-2">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-100 bg-white"
          >
            <div className="px-4 py-3 space-y-1">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
