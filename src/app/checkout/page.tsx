'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Phone, Banknote, CheckCircle, ArrowLeft, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';

type PaymentMethod = 'orange-money' | 'mtn-momo' | 'wave' | 'cash';

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const [step, setStep] = useState<'info' | 'payment' | 'success'>('info');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    city: 'Daloa',
    address: '',
    notes: ''
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('orange-money');
  const [orderNumber, setOrderNumber] = useState('');

  const deliveryFee = totalPrice >= 50000 ? 0 : 2000;
  const orderTotal = totalPrice + deliveryFee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 'info') {
      setStep('payment');
    } else if (step === 'payment') {
      const num = 'GSD-' + Date.now().toString().slice(-8);
      setOrderNumber(num);
      setStep('success');
      clearCart();
    }
  };

  if (items.length === 0 && step !== 'success') {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <ShoppingBag size={64} className="mx-auto text-gray-200 mb-4" />
        <h1 className="text-2xl font-bold text-gray-900">Votre panier est vide</h1>
        <p className="text-gray-500 mt-2">Ajoutez des produits avant de passer commande</p>
        <Link href="/" className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-amber-600 text-white rounded-xl font-medium hover:bg-amber-700 transition-colors">
          Continuer mes achats
        </Link>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 15 }}
        >
          <CheckCircle size={80} className="mx-auto text-green-500 mb-6" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-3xl font-bold text-gray-900">Commande confirmée !</h1>
          <p className="text-gray-500 mt-3 text-lg">Merci pour votre commande</p>
          <div className="mt-6 bg-gray-50 rounded-2xl p-6 inline-block">
            <p className="text-sm text-gray-500">Numéro de commande</p>
            <p className="text-xl font-bold text-amber-600">{orderNumber}</p>
          </div>
          <p className="text-sm text-gray-500 mt-4 max-w-md mx-auto">
            Vous recevrez un SMS de confirmation au {formData.phone}. Notre équipe vous contactera sous peu pour confirmer la livraison.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 mt-8 px-8 py-3.5 bg-amber-600 text-white rounded-xl font-semibold hover:bg-amber-700 transition-colors"
          >
            Retour à la boutique
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back button */}
        <Link href="/" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-amber-600 mb-6">
          <ArrowLeft size={16} /> Retour à la boutique
        </Link>

        {/* Progress */}
        <div className="flex items-center gap-4 mb-8">
          <div className={`flex items-center gap-2 ${step === 'info' ? 'text-amber-600' : 'text-green-600'}`}>
            <span className="w-8 h-8 rounded-full bg-current/10 flex items-center justify-center text-sm font-bold">1</span>
            <span className="font-medium text-sm">Informations</span>
          </div>
          <div className="flex-1 h-px bg-gray-200" />
          <div className={`flex items-center gap-2 ${step === 'payment' ? 'text-amber-600' : 'text-gray-400'}`}>
            <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step === 'payment' ? 'bg-amber-600/10 text-amber-600' : 'bg-gray-100'}`}>2</span>
            <span className="font-medium text-sm">Paiement</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit}>
              {step === 'info' && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-2xl p-6 border"
                >
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Informations de livraison</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Prénom *</label>
                      <input
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        placeholder="Ex: Aminata"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
                      <input
                        type="text"
                        required
                        value={formData.lastName}
                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        placeholder="Ex: Traoré"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone *</label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        placeholder="+225 07 00 00 00 00"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Ville *</label>
                      <select
                        value={formData.city}
                        onChange={(e) => setFormData({...formData, city: e.target.value})}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      >
                        <option value="Daloa">Daloa</option>
                        <option value="Bouaké">Bouaké</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Adresse de livraison *</label>
                      <input
                        type="text"
                        required
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        placeholder="Quartier, rue, repère..."
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optionnel)</label>
                      <textarea
                        value={formData.notes}
                        onChange={(e) => setFormData({...formData, notes: e.target.value})}
                        rows={3}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        placeholder="Instructions spéciales pour la livraison..."
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full mt-6 px-6 py-3.5 bg-amber-600 text-white font-semibold rounded-xl hover:bg-amber-700 transition-colors"
                  >
                    Continuer vers le paiement
                  </button>
                </motion.div>
              )}

              {step === 'payment' && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-2xl p-6 border"
                >
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Mode de paiement</h2>
                  <div className="space-y-3">
                    {[
                      { id: 'orange-money' as PaymentMethod, name: 'Orange Money', icon: Phone, desc: 'Paiement via Orange Money' },
                      { id: 'mtn-momo' as PaymentMethod, name: 'MTN Mobile Money', icon: Phone, desc: 'Paiement via MTN MoMo' },
                      { id: 'wave' as PaymentMethod, name: 'Wave', icon: Phone, desc: 'Paiement via Wave' },
                      { id: 'cash' as PaymentMethod, name: 'Paiement à la livraison', icon: Banknote, desc: 'Payez en espèces à la livraison' },
                    ].map(method => (
                      <label
                        key={method.id}
                        className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-colors ${
                          paymentMethod === method.id
                            ? 'border-amber-500 bg-amber-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="payment"
                          value={method.id}
                          checked={paymentMethod === method.id}
                          onChange={() => setPaymentMethod(method.id)}
                          className="sr-only"
                        />
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          paymentMethod === method.id ? 'bg-amber-100' : 'bg-gray-100'
                        }`}>
                          <method.icon size={20} className={paymentMethod === method.id ? 'text-amber-600' : 'text-gray-500'} />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">{method.name}</p>
                          <p className="text-sm text-gray-500">{method.desc}</p>
                        </div>
                        {paymentMethod === method.id && (
                          <CheckCircle size={20} className="text-amber-600" />
                        )}
                      </label>
                    ))}
                  </div>

                  {/* Summary */}
                  <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Livraison à</span>
                      <span>{formData.address}, {formData.city}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Téléphone</span>
                      <span>{formData.phone}</span>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button
                      type="button"
                      onClick={() => setStep('info')}
                      className="px-6 py-3.5 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      Retour
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-6 py-3.5 bg-amber-600 text-white font-semibold rounded-xl hover:bg-amber-700 transition-colors"
                    >
                      Confirmer la commande - {formatPrice(orderTotal)}
                    </button>
                  </div>
                </motion.div>
              )}
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 border sticky top-32">
              <h3 className="font-bold text-gray-900 mb-4">Résumé de la commande</h3>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {items.map(item => (
                  <div key={item.product.id} className="flex gap-3">
                    <img src={item.product.images[0]} alt={item.product.name} className="w-14 h-14 object-cover rounded-lg" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{item.product.name}</p>
                      <p className="text-xs text-gray-500">Qté: {item.quantity}</p>
                      <p className="text-sm font-semibold text-amber-600">{formatPrice(item.product.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t mt-4 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Sous-total</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Livraison</span>
                  <span className={deliveryFee === 0 ? 'text-green-600' : ''}>{deliveryFee === 0 ? 'Gratuite' : formatPrice(deliveryFee)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>Total</span>
                  <span className="text-amber-600">{formatPrice(orderTotal)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
