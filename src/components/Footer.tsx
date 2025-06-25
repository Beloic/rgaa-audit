'use client';

import { Shield } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12" role="contentinfo">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Shield className="w-6 h-6" aria-hidden="true" />
              <span className="text-lg font-bold">RGAA Audit</span>
            </div>
            <p className="text-gray-400">
              Outil d'audit d'accessibilité propulsé par l'intelligence artificielle pour un web plus inclusif.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Ressources</h3>
            <ul className="space-y-3">
              <li><a href="https://www.numerique.gouv.fr/publications/rgaa-accessibilite/" target="_blank" rel="noopener noreferrer" className="hover:text-white focus:text-white transition-colors focus:outline-none focus:underline">RGAA 4.1</a></li>
              <li><a href="https://design.numerique.gouv.fr/" target="_blank" rel="noopener noreferrer" className="hover:text-white focus:text-white transition-colors focus:outline-none focus:underline">Design System FR</a></li>
              <li><a href="https://accessibilite.public.lu/" target="_blank" rel="noopener noreferrer" className="hover:text-white focus:text-white transition-colors focus:outline-none focus:underline">AccessiLux</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Légal</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/rgpd" className="hover:text-white focus:text-white transition-colors focus:outline-none focus:underline">RGPD</a></li>
              <li><a href="/politique-confidentialite" className="hover:text-white focus:text-white transition-colors focus:outline-none focus:underline">Politique de confidentialité</a></li>
              <li><a href="/mentions-legales" className="hover:text-white focus:text-white transition-colors focus:outline-none focus:underline">Mentions légales</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 RGAA Audit. Développé pour améliorer l'accessibilité numérique.</p>
        </div>
      </div>
    </footer>
  );
} 