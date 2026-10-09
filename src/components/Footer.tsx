import Link from 'next/link';
import { MapPin, Phone, Mail, Globe, Camera, MessageSquare } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">G</span>
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">Global Shop</h3>
                <p className="text-xs text-amber-400">Daloa</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Votre boutique de confiance à Daloa et Bouaké. Produits de qualité, prix compétitifs et service client exceptionnel.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 bg-gray-800 hover:bg-amber-600 rounded-full flex items-center justify-center transition-colors">
                <Globe size={16} />
              </a>
              <a href="#" className="w-9 h-9 bg-gray-800 hover:bg-amber-600 rounded-full flex items-center justify-center transition-colors">
                <Camera size={16} />
              </a>
              <a href="#" className="w-9 h-9 bg-gray-800 hover:bg-amber-600 rounded-full flex items-center justify-center transition-colors">
                <MessageSquare size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Liens rapides</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/collections/electronics" className="hover:text-amber-400 transition-colors">Électronique</Link></li>
              <li><Link href="/collections/mode" className="hover:text-amber-400 transition-colors">Mode & Vêtements</Link></li>
              <li><Link href="/collections/maison" className="hover:text-amber-400 transition-colors">Maison & Déco</Link></li>
              <li><Link href="/collections/beaute" className="hover:text-amber-400 transition-colors">Beauté & Soins</Link></li>
              <li><Link href="/collections/alimentation" className="hover:text-amber-400 transition-colors">Alimentation</Link></li>
              <li><Link href="/collections/sport" className="hover:text-amber-400 transition-colors">Sport & Loisirs</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-white font-semibold mb-4">Service client</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-amber-400 transition-colors">Livraison & Retours</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">Modes de paiement</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">Politique de confidentialité</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">Conditions générales</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin size={16} className="text-amber-400 shrink-0 mt-0.5" />
                <span>Quartier Commerce, Daloa<br/>& Bouaké, Côte d'Ivoire</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} className="text-amber-400 shrink-0" />
                <span>+225 07 08 09 10 11</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-amber-400 shrink-0" />
                <span>contact@globalshopdaloa.ci</span>
              </li>
            </ul>
            <div className="mt-4 p-3 bg-gray-800 rounded-lg">
              <p className="text-xs text-gray-400">Horaires d'ouverture</p>
              <p className="text-sm text-white mt-1">Lun - Sam : 8h - 20h</p>
              <p className="text-sm text-gray-400">Dim : 9h - 14h</p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            © 2024 Global Shop Daloa. Tous droits réservés.
          </p>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>Paiement sécurisé</span>
            <div className="flex gap-2">
              <span className="px-2 py-1 bg-gray-800 rounded text-xs">Orange Money</span>
              <span className="px-2 py-1 bg-gray-800 rounded text-xs">MTN MoMo</span>
              <span className="px-2 py-1 bg-gray-800 rounded text-xs">Wave</span>
              <span className="px-2 py-1 bg-gray-800 rounded text-xs">Cash</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
